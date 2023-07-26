import os
import cv2
import numpy as np
import torch
import matplotlib.pyplot as plt
import uuid
from io import BytesIO
import requests

from .cross_efficient_vit import CrossEfficientViT
from .transforms.albu import IsotropicResize
from .blazeface import FaceExtractor, BlazeFace

from albumentations import Compose, PadIfNeeded
import yaml

from PIL import Image

class DeepFakeDetector:
    def __init__(self):
        self.threshold = 0.5
        self.batch_size = 16
        PWD = os.path.abspath(__file__).replace("deepfake_detection.py","")
        MODEL_PATH = PWD+"cross_efficient_vit.pth"
        # print(MODEL_PATH,os.path.abspath(__file__))
        with open(PWD+'configs/architecture.yaml', 'r') as ymlfile:
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
        facedet.load_weights(PWD+"blazeface/blazeface.pth")
        facedet.load_anchors(PWD+"blazeface/anchors.npy")
        self.face_extractor = FaceExtractor(facedet=facedet)

    
    def detect_image(self, image):
        if isinstance(image, str):
            image = Image.open(image)
        
        faces = self.face_extractor.process_image(img=image)['faces']
        print(faces[0].shape)

        face_count = len(faces)
        if face_count > 0:
            sum = 0.0
            TMP = os.path.abspath(__file__).replace("deepfake_detection/deepfake_detection.py","tmp/image/")
            filename= f"{str(uuid.uuid4())}.jpg"
            fileUrl = "https://218.149.220.237:3001/tmp/image/faces/"+filename
            face_filepath = TMP+'faces/'+filename
            fig,ax = plt.subplots(face_count//4 + 1, 4,figsize=(8,(face_count//4 + 1)*2)) if face_count > 4 else plt.subplots(1, face_count,figsize=(face_count*2,2))
            fig.subplots_adjust(left=0, bottom=0, right=1, top=1,wspace=0, hspace=0)
            
            if face_count > 1:
                for i in range(face_count):
                    ax[i].imshow(faces[i])
                    ax[i].set_axis_off()
                    ax[i].axis('tight')
            else:
                ax.imshow(faces[0])

            plt.axis('tight')
            plt.axis('off')
            plt.savefig(face_filepath, bbox_inches='tight')
            
            for i in range(face_count):
                faces[i] = self.transform(image=faces[i])['image']

            for i in range(0, face_count, self.batch_size):
                face_batch = faces[i:i+self.batch_size]
                face_batch = torch.tensor(np.asarray(face_batch))
                if face_batch.shape[0] == 0:
                    continue
                face_batch = np.transpose(face_batch, (0, 3, 2, 1))
                face_batch = face_batch.cuda().float()
                
                pred = self.model(face_batch)

                for p in pred:
                    proba = torch.sigmoid(p).cpu().detach().numpy()
                    sum += proba.item()
                    if proba > self.threshold:
                        return {
                            "file":fileUrl,
                            "proba" : proba.item(),
                            "is_fake" : True,
                        }
            
            return {
                "file":fileUrl,
                "proba": sum / len(faces),
                "is_fake": False,
            }

    def detect_video(self, video):
        pass


    def detect_urls(self, urls):
        images = []
        result = dict()
        image_origins = []

        for url in urls:
            result[url] = False

        for url in urls:
            try:
                response = requests.get(url)
                image = Image.open(BytesIO(response.content))
                image = self.transform(image=image)['image']
                images.append(image)
                image_origins.append(url)
            except:
                pass
            

        for i in range(0, len(images), self.batch_size):
            face_batch = images[i:i+self.batch_size]
            face_batch = torch.tensor(np.asarray(face_batch))
            if face_batch.shape[0] == 0:
                continue
            face_batch = np.transpose(face_batch, (0, 3, 2, 1))
            face_batch = face_batch.cuda().float()
            
            pred = self.model(face_batch)
            
            for j in range(len(pred)):
                result[image_origins[j+i]] = pred[j].item() >= 0.5
        
        return result

    

# Main body
if __name__ == "__main__":
    fakedetector =  DeepFakeDetector()
    print(fakedetector.detect_image("./test123.jpeg"))

