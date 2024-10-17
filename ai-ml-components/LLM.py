import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import LLMChain

load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

class VoiceAssistantLLM:
    def __init__(self):
        self.llm = ChatGroq(temperature=0, model_name="mixtral-8x7b-32768", groq_api_key=GROQ_API_KEY)
        self.memory = ConversationBufferMemory(memory_key="conversation_history", return_messages=True)

        # Define the system prompt for the assistant
        assistant_prompt = 'You are a voice assistant. Have good conversations with the user and provide companionship. Keep your answers short and concise.'
        
        # prompt template 
        self.prompt_template = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(assistant_prompt),
            MessagesPlaceholder(variable_name="conversation_history"),
            HumanMessagePromptTemplate.from_template("{input_text}")
        ])

        # Set up the conversation chain
        self.conversation_chain = LLMChain(
            llm=self.llm,
            prompt=self.prompt_template,
            memory=self.memory
        )

    def generate_response(self, user_input):
        self.memory.chat_memory.add_user_message(user_input) 

        response = self.conversation_chain.invoke({"input_text": user_input})

        self.memory.chat_memory.add_ai_message(response['text']) 

        print(f"LLM response: {response['text']}")
        return response['text']
