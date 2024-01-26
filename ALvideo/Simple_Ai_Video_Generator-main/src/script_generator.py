#
#  script_generator.py
#
#  Created by Eldar Eliav on 2023/05/11.
#

from chat_gpt_session import ChatGPTSession
from log import log

# TODO - write the output strings to files, destination will be provided from the outside for each file

class ScriptGenerator:
    # init
    def __init__(self):
        self._session = self._prepare_session()

    # api methods
    def generate(
        self,
        topic: str,
        is_verbose_print: bool = False
    ) -> (str, str, str):
        script = self._make_script(topic)
        if len(script.split('\n'))<2:
                script=self.write_seperately(script)
        # captions = self._make_captions()
        if is_verbose_print:
            log.info(f"SCRIPT:\n{script}")
        return (script)

    # private methods
    def _prepare_session(self):
        return ChatGPTSession(
            """
You are a professional script writer. You know what people like to hear.
            """
        )

    def _make_script(self, topic: str) -> str:
        return self._session.ask(
            f"""
Write a pointwise script according to the following specifications you must complete all specification:
    - write 2 sentences each sentence in new line(most important), that will  describe the  topic : {topic}
    - Must less than 20 all the script word count do not use line numbering.
    - make it simple.
    - Each sentence will be used to generate an image using Text To Image
      so give me sentences seperately so do not write other than that.

            """
        )
    
    def write_seperately(self, topic):
         return self._session.ask(
            f"""
you must write above script each sentence in new line,do not use line numbering
 """
        )
