#!/usr/bin/env python3

#
#  main.py
#
#  Created by Eldar Eliav on 2023/05/11.
#

from os import path, makedirs
from log import log
from script_generator import ScriptGenerator
from script_narration import ScriptNarration
from image_generaion_new import GenerateImages
from video_maker import VideoMaker

def main(img_size,channel_name: str, topic: str, voice_name: str, destination_dir: str):
    if not path.exists(destination_dir):
        makedirs(destination_dir)
        log.info(f"new destination directory created: {destination_dir}")

    # log.info("STEP 1 - script")
    # script= ScriptGenerator().generate(
    #     topic,
    #     is_verbose_print = True
    # )

    script =""""Mahinda Rajapaksa, the former President of Sri Lanka, is a respected political leader who played a significant role in the country's history.\n    
He is known for successfully ending the decades-long civil war in Sri Lanka and restoring peace and stability to the nation."""


    # log.info("STEP 2 - narration")
    # mp3_file_destination_with_extension = path.join(destination_dir)
    # ScriptNarration().narrate(
    #     voice_name,
    #     script,
    #     mp3_file_destination_with_extension
    # )

    # log.info("STEP 3 - captions")
    # generated_images_path_list = GenerateImages().generate_captions(
    #     captions_string = script,
    #     destination_dir = destination_dir,
    #     is_crop_to_ratio_16_9 = True,
    #     img_size=img_size
    # )

    generated_images_path_list =['./test/caption_0.jpg', './test/caption_1.jpg']
    mp3_file_destination_with_extension='./test'
    log.info("STEP 4 - video")
    VideoMaker().create_video(
        images_list = generated_images_path_list,
        mp3_audio_file_path = mp3_file_destination_with_extension,
        mp4_file_destination_with_extension = path.join(destination_dir, "video.mp4"),
        is_duplicate_images_count_to_improve_smoothness = True
    )

if __name__ == "__main__":
    main(
        (1280,720),
        channel_name = "THE AWESOME YOUTUBE CHANNEL",
        topic = "mahinda rajapaksha",
        voice_name = "Adam",
        destination_dir = "./test/"
        
    )
