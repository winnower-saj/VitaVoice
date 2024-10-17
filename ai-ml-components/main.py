import os
import asyncio
from dotenv import load_dotenv

from SpeechToText import speech_recognition, pause_microphone, resume_microphone
from LLM import VoiceAssistantLLM 
from TextToSpeech import text_to_speech_stream  

load_dotenv()

voice_assistant = VoiceAssistantLLM()

async def process_and_convert_to_speech(user_input: str):

    pause_microphone()

    llm_response = voice_assistant.generate_response(user_input)

    await asyncio.to_thread(text_to_speech_stream, llm_response) 

    resume_microphone()

async def listen_for_speech_and_process(stop_event):
   
    def callback(transcription: str):
        asyncio.create_task(process_and_convert_to_speech(transcription))

    while not stop_event.is_set():
        try:
            print("Listening for speech...")
            await speech_recognition(callback)
        except asyncio.CancelledError:
            print("Task was cancelled, cleaning up resources...")
            break 
        except Exception as e:
            print(f"Error during processing: {e}")
            break

async def wait_for_enter():
    await asyncio.get_event_loop().run_in_executor(None, input)  # Wait for user to press Enter

async def run_system():
    while True:
        input("\nPress Enter to start the system...")

        stop_event = asyncio.Event()

        system_task = asyncio.create_task(listen_for_speech_and_process(stop_event))

        print("\nSystem running... Press Enter to stop the system.")
        await wait_for_enter()

        stop_event.set()

        try:
            await system_task
        except asyncio.CancelledError:
            print("\nSystem stopped gracefully.")

if __name__ == "__main__":
    try:
        asyncio.run(run_system())
    except KeyboardInterrupt:
        print("\nProcess interrupted by user, shutting down gracefully.")
