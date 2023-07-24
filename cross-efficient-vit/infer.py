import os
import cv2
import numpy as np
import torch

from cross_efficient_vit import CrossEfficientViT

from albumentations import Compose, PadIfNeeded
from transforms.albu import IsotropicResize
import yaml

def create_base_transform(size):
    return Compose([
        IsotropicResize(max_side=size, interpolation_down=cv2.INTER_AREA, interpolation_up=cv2.INTER_CUBIC),
        PadIfNeeded(min_height=size, min_width=size, border_mode=cv2.BORDER_CONSTANT),
    ])

# Main body
if __name__ == "__main__":
    MODEL_PATH = "./models/efficient_vit.pth"
    image_path = ""

    with open('./configs/architecture.yaml', 'r') as ymlfile:
        config = yaml.safe_load(ymlfile)
 
    if os.path.exists(MODEL_PATH):
        model = CrossEfficientViT(config=config)
        model.load_state_dict(torch.load(MODEL_PATH))
        model.eval()
        model = model.cuda()
    else:
        print("No model found.")
        exit()

    transform = create_base_transform(config['model']['image-size'])
    image = transform(image=cv2.imread(image_path))['image']
    image = np.expand_dims(image, 0)
    image = np.transpose(image, (0, 3, 1, 2))
    image = torch.tensor(np.asarray(image))
    image = image.cuda().float()

    pred = model(image)
    print(pred)
    print(torch.sigmoid(pred[0]))
    print(pred.shape)

