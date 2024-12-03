import os
# import logging
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import LLMChain
from langchain.schema import HumanMessage, AIMessage
from langchain_groq import ChatGroq
from app.config.db_connection import mongo_instance

load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

class Message(BaseModel):
    assistantText: str = Field(..., alias="assistantText")
    userText: str = Field(..., alias="userText")
    emotion: str = Field(..., alias="emotion")


class Conversation(BaseModel):
    userId: ObjectId = Field(..., alias="userId")
    messages: List[Message] = Field(default=[])
    createdAt: Optional[datetime] = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.now)

    model_config = ConfigDict(arbitrary_types_allowed=True)


class VoiceAssistantLLM:
    def __init__(self):
        self.conversations = mongo_instance.conversations

        self.llm = ChatGroq(temperature=0, model_name="mixtral-8x7b-32768", groq_api_key=GROQ_API_KEY)

    async def fetch_user_conversation(self, user_id: str):
        conversation = await self.conversations.find_one({"userId": ObjectId(user_id)})
        messages = []
        if conversation:
            for msg in conversation.get("messages", []):
                messages.append(HumanMessage(content=msg["userText"]))
                messages.append(AIMessage(content=msg["assistantText"]))
        return messages

    async def save_conversation(self, user_id: str, user_text: str, assistant_text: str, emotion: str):
        message = {
            "userText": user_text,
            "assistantText": assistant_text,
            "emotion": emotion,
        }
        await self.conversations.update_one(
            {"userId": ObjectId(user_id)},
            {
                "$push": {"messages": message},
                "$set": {"updatedAt": datetime.now()},
                "$setOnInsert": {"createdAt": datetime.now()},
            },
            upsert=True,
        )

    async def generate_response(self, user_id: str, user_input: str) -> str:
        conversation_history = await self.fetch_user_conversation(user_id)

        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(
                'You are a voice assistant. Have good conversations with the user and provide companionship. Keep your answers short and concise.'
            ),
            MessagesPlaceholder(variable_name="conversation_history"),
            HumanMessagePromptTemplate.from_template("{input_text}")
        ])

        conversation_chain = LLMChain(
            llm=self.llm,
            prompt=prompt_template
        )

        try:
            response = await conversation_chain.acall({
                "conversation_history": conversation_history,
                "input_text": user_input
            })
            assistant_response = response.get('text', '').strip()

            if not assistant_response:
                raise ValueError("LLM returned an empty response.")

            await self.save_conversation(user_id, user_input, assistant_response, emotion="neutral")  # Default neutral emotion as of now
            return assistant_response

        except Exception as e:
            raise e


