from elevenlabs import get_api_key, generate, voices, save,set_api_key
import os

class ElevenLabsVoiceGeneration:
    class MissingAPIKey(Exception):
        pass

    def __init__(self,apikey):
        set_api_key(apikey)
        if get_api_key() is None:
            raise self.MissingAPIKey()
        voices()  # load all available voice from remote, incliding private generated onces

    def generate_audio(self, voice_name: str, text: str) -> bytes:
        return generate(
            text = text,
            voice = voice_name,
            model = "eleven_monolingual_v1"
        )

    def generate_audio_and_save(self, voice_name: str, text: str, mp3_file_destination_with_extension: str):
        for index,line in enumerate(text.split('\n')):
            if len(line.strip())>3:
                audio = self.generate_audio(voice_name, line)
                save(audio, os.path.join(mp3_file_destination_with_extension,f"{index:04}.mp3"))
