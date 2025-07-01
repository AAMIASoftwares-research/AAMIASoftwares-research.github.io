import os

import numpy
import json

import matplotlib.pyplot as plt

import HearticDatasetManager

DATA_DIR = '/scratch/mleccardi/Data/'

CAT08_DIR = os.path.join(DATA_DIR, 'CAT08')

ASOCA_DIR = os.path.join(DATA_DIR, 'ASOCA')

SAVE_DIR_IMG = './EMBC2025/images/'

SAVE_DIR_POSITIONS = './EMBC2025/positions/'




# CAT08

folders = sorted(
    [os.path.join(CAT08_DIR,f) for f in os.listdir(CAT08_DIR) if 'dataset' in f]
)

for folder in folders:
    id = 'cat08-' + os.path.split(folder)[1]
    image = HearticDatasetManager.cat08.Cat08ImageCT(folder)
    ostia_json_filepath = os.path.join(
        folder, 
        f'ostia{folder[-2:]}.json'
    )
    with open(ostia_json_filepath, 'r') as f:
        ostia_json = json.load(f)
    # save positions and image dimensions
    image_width_mm = image.spacing[0] * image.data.shape[0]
    image_heigth_mm = image.spacing[1] * image.data.shape[1]

    data = {
        'image_width_mm': round(float(image_width_mm), 3),
        'image_height_mm': round(float(image_heigth_mm), 3),
        'left (percentLeft, percentTop)': [
            round(n, 3)
            for n in (100*numpy.array(ostia_json['ijk']['left'][:2]) / numpy.array(image.data.shape[:2])).tolist()[::-1]
        ],
        'right (percentLeft, percentTop)': [
            round(n, 3)
            for n in (100*numpy.array(ostia_json['ijk']['right'][:2]) / numpy.array(image.data.shape[:2])).tolist()[::-1]
        ]
    }
    os.makedirs(SAVE_DIR_POSITIONS, exist_ok=True)
    with open(os.path.join(SAVE_DIR_POSITIONS, f"{id}.json"), "w") as json_file:
        json.dump(data, json_file)
    # save image slice
    image_left = image.data[:,:,ostia_json['ijk']['left'][2]]
    image_right = image.data[:,:,ostia_json['ijk']['right'][2]]
    # Normalize and clip images, then scale to [0, 255] for uint8 PNG
    def process_and_save(image_slice, save_path):
        img = numpy.clip(image_slice, -1000, 1500)
        img = ((img + 1000) / 2500) * 255
        img = img.astype(numpy.uint8)
        plt.imsave(save_path, img, cmap='gray', vmin=0, vmax=255)

    os.makedirs(SAVE_DIR_IMG, exist_ok=True)
    process_and_save(image_left, os.path.join(SAVE_DIR_IMG, f"{id}-left.png"))
    process_and_save(image_right, os.path.join(SAVE_DIR_IMG, f"{id}-right.png"))
    print(f"'{id}',")


# ASOCA

asoca_images_files = [
    os.path.join(ASOCA_DIR, f)
    for f in HearticDatasetManager.asoca.DATASET_ASOCA_TRAINING
]

asoca_ostia_files = [
    f.replace('CTCA/', 'Ostia/').replace('.nrrd', '.json')
    for f in asoca_images_files
]

for im_file, json_file in zip(asoca_images_files, asoca_ostia_files):
    id = 'asoca-' + os.path.basename(json_file).split('.')[0].replace('_', '-').lower()
    image = HearticDatasetManager.asoca.AsocaImageCT(im_file)
    with open(json_file, 'r') as f:
        ostia_json = json.load(f)
    # save positions and image dimensions
    image_width_mm = image.spacing[0] * image.data.shape[0]
    image_heigth_mm = image.spacing[1] * image.data.shape[1]

    data = {
        'image_width_mm': round(float(image_width_mm), 3),
        'image_height_mm': round(float(image_heigth_mm), 3),
        'left (percentLeft, percentTop)': [
            round(n, 3)
            for n in (100*numpy.array(ostia_json['ijk']['left'][:2]) / numpy.array(image.data.shape[:2])).tolist()[::-1]
        ],
        'right (percentLeft, percentTop)': [
            round(n, 3)
            for n in (100*numpy.array(ostia_json['ijk']['right'][:2]) / numpy.array(image.data.shape[:2])).tolist()[::-1]
        ]
    }
    os.makedirs(SAVE_DIR_POSITIONS, exist_ok=True)
    with open(os.path.join(SAVE_DIR_POSITIONS, f"{id}.json"), "w") as out_json_file:
        json.dump(data, out_json_file)
    # save image slice
    image_left = image.data[:,:,ostia_json['ijk']['left'][2]]
    image_right = image.data[:,:,ostia_json['ijk']['right'][2]]
    def process_and_save(image_slice, save_path):
        img = numpy.clip(image_slice, -1000, 1500)
        img = ((img + 1000) / 2500) * 255
        img = img.astype(numpy.uint8)
        plt.imsave(save_path, img, cmap='gray', vmin=0, vmax=255)

    os.makedirs(SAVE_DIR_IMG, exist_ok=True)
    process_and_save(image_left, os.path.join(SAVE_DIR_IMG, f"{id}-left.png"))
    process_and_save(image_right, os.path.join(SAVE_DIR_IMG, f"{id}-right.png"))
    print(f"'{id}',")


    


    

