import openai
import urllib.request
import os
import replicate
import requests
from dotenv import load_dotenv
load_dotenv()

# output = replicate.run(
#     "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
#     input={"prompt": "An astronaut riding a rainbow unicorn"}
# )
# print(output)


class GenerateImages:

    def generate_captions(
        self,
        img_size,
        captions_string: str,
        destination_dir: str,
        is_crop_to_ratio_16_9: bool = False
    ) -> list[str]:
        # returns a list of paths to the generated images
        list_of_created_image_files: list[str] = []
        captions_list = self._convert_string_into_list(captions_string)

        for index, caption in enumerate(captions_list):
            image_file_path = os.path.join(
                destination_dir, f"caption_{index}.jpg")
            try:
                output = replicate.run(
                    "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
                    input={"prompt": caption,"width":img_size[0],"height":img_size[1]}
                )
                if len(output)>0:
                  self.save_image_from_url(output[0],destination_dir,image_file_path,list_of_created_image_files)    

            except Exception as error:
                print(f"skiping {image_file_path} - {error}")
        return list_of_created_image_files

    # private methods
    def _convert_string_into_list(self, captions_string: str) -> list[str]:
        captions_list = [caption.strip() for caption in captions_string.strip().split(
            '\n') if caption.strip()]
        return [caption.strip() for caption in captions_list]


    def save_image_from_url(self,image_url, destination_dir,image_file_path,list_of_created_image_files):
        # Create the output folder if it doesn't exist
        if not os.path.exists(destination_dir):
            os.makedirs(destination_dir)

    
        # Download the image and save it
        response = requests.get(image_url)
        if response.status_code == 200:
            with open(image_file_path, 'wb') as file:
                file.write(response.content)
            print(f"Image saved to {image_file_path}")
            list_of_created_image_files.append(image_file_path)
        else:
            print(f"Failed to download the image. Status code: {response.status_code}")

# Load environment variables
