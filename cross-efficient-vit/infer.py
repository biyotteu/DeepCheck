import os
import cv2
import numpy as np
import torch

from cross_efficient_vit import CrossEfficientViT

from albumentations import Compose, PadIfNeeded
from transforms.albu import IsotropicResize
import yaml

from PIL import Image
from blazeface import FaceExtractor, BlazeFace

class FakeDetector:
    def __init__(self):
        self.threshold = 0.5
        self.batch_size = 16

        MODEL_PATH = "./models/efficient_vit.pth"
        with open('./configs/architecture.yaml', 'r') as ymlfile:
            config = yaml.safe_load(ymlfile)

        self.transform = Compose([
            IsotropicResize(max_side=224, interpolation_down=cv2.INTER_AREA, interpolation_up=cv2.INTER_CUBIC),
            PadIfNeeded(min_height=224, min_width=224, border_mode=cv2.BORDER_CONSTANT),
        ])

        if os.path.exists(MODEL_PATH):
            self.model = CrossEfficientViT(config=config)
            self.model.load_state_dict(torch.load(MODEL_PATH))
            self.model.eval()
            self.model = self.model.cuda()
        else:
            print("No model found.")
            exit()
        
        ## face detector
        device = torch.device('cuda:0') if torch.cuda.is_available() else torch.device('cpu')
        facedet = BlazeFace().to(device)
        facedet.load_weights("./blazeface/blazeface.pth")
        facedet.load_anchors("./blazeface/anchors.npy")
        self.face_extractor = FaceExtractor(facedet=facedet)

    
    def detect_image(self, image):
        if isinstance(image, str):
            image = Image.open(image)
        
        faces = self.face_extractor.process_image(img=image)['faces']

        if len(faces) > 0:
            for i in range(len(faces)):
                faces[i] = self.transform(image=faces[i])['image']

            for i in range(0, len(faces), self.batch_size):
                face_batch = faces[i:i+self.batch_size]
                face_batch = torch.tensor(np.asarray(face_batch))
                if face_batch.shape[0] == 0:
                    continue
                face_batch = np.transpose(face_batch, (0, 3, 1, 2))
                face_batch = face_batch.cuda().float()
                
                pred = self.model(face_batch)

                for p in pred:
                    is_fake = torch.sigmoid(p) > self.threshold
                    if is_fake:
                        return {
                            "is_fake": True,
                        }
            
            return {
                "is_fake": False,
            }

    def detect_video(self, video):
        pass



    

# Main body
if __name__ == "__main__":
    fakedetector =  FakeDetector()
    print(fakedetector.detect_image("./test123.jpeg"))

