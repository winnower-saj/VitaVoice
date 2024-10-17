import os
from typing import IO
import subprocess
from io import BytesIO
import shutil
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from pydub import AudioSegment
from pydub.playback import play
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def is_installed(program: str) -> bool:
    return shutil.which(program) is not None

def play_audio(audio_stream: IO[bytes], use_ffmpeg=True): # funtion to play audio in real-time without saving to a file
    player = "ffplay"
    
    if not is_installed(player):
        raise ValueError(f"{player} not found, necessary to stream audio.")
    
    # ffplay command to play audio from stdin, without displaying video output
    player_command = [player, "-autoexit", "-", "-nodisp"]

    # Launch ffplay as a subprocess and pass the audio stream to stdin
    player_process = subprocess.Popen(
        player_command,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL, 
    )

    # Write the audio stream to ffplay
    player_process.stdin.write(audio_stream.read())
    player_process.stdin.close() 

    player_process.wait()


def text_to_speech_stream(text: str):
    response = client.text_to_speech.convert(
        voice_id="pNInz6obpgDQGcFmaJgB", 
        output_format="mp3_22050_32",
        text=text,
        model_id="eleven_multilingual_v2",
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
        ),
    )

    audio_stream = BytesIO()

    # Write each chunk of audio data to the stream
    for chunk in response:
        if chunk:
            audio_stream.write(chunk)

    # Reset stream position to the beginning before playing
    audio_stream.seek(0)

    # Play the audio
    play_audio(audio_stream)
