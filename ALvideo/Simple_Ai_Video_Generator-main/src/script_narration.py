from eleven_labs_voice_generation import ElevenLabsVoiceGeneration


class ScriptNarration:
    # init
    def __init__(self):
        pass

    # api methods
    def narrate(
        self,
        voice_name: str,
        full_script: str,
        mp3_file_destination_with_extension: str
    ):
        voice_generator = ElevenLabsVoiceGeneration("96fb5a363db9d125b0227070b2895aaf")
        voice_generator.generate_audio_and_save(voice_name, full_script,mp3_file_destination_with_extension)
          
