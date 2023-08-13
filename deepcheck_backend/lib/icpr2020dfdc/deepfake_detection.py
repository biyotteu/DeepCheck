import torch
from torch.utils.model_zoo import load_url
from PIL import Image
import matplotlib.pyplot as plt
import os
# import sys
# sys.path.append('..')
import uuid

from .blazeface import FaceExtractor, BlazeFace
from .architectures import fornet,weights
from .isplutils import utils

class DeepFakeDetector:
    def __init__(self):
        self.device = torch.device('cuda:0') if torch.cuda.is_available() else torch.device('cpu')
        face_policy = 'scale'
        face_size = 224

        model_url = weights.weight_url['{:s}_{:s}'.format('EfficientNetAutoAttB4','DFDC')]
        self.net = getattr(fornet,'EfficientNetAutoAttB4')().eval().to(self.device)
        self.net.load_state_dict(load_url(model_url,map_location=self.device,check_hash=True))

        self.transf = utils.get_transformer(face_policy, face_size, self.net.get_normalizer(), train=False)
       
        self.threshold = 0.5
        self.batch_size = 16
        PWD = os.path.abspath(__file__).replace("deepfake_detection.py","")
       
        ## face detector
        facedet = BlazeFace().to(self.device)
        facedet.load_weights(PWD+"blazeface/blazeface.pth")
        facedet.load_anchors(PWD+"blazeface/anchors.npy")
        self.face_extractor = FaceExtractor(facedet=facedet)

    
    def detect_image(self, image):
        if isinstance(image, str):
            image = Image.open(image)
        
        faces = self.face_extractor.process_image(img=image)['faces']

        face_count = len(faces)
        if face_count > 0:
            sum = 0.0
            TMP = os.path.abspath(__file__).replace("icpr2020dfdc/deepfake_detection.py","tmp/image/")
            face_filepath = TMP+'faces/'+f"{str(uuid.uuid4())}.jpg"
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

            for i in range(0, face_count, self.batch_size):
                face_batch = faces[i:i+self.batch_size]
                faces_t = torch.stack( [ self.transf(image=im)['image'] for im in face_batch ] )

                with torch.no_grad():
                    faces_pred = torch.sigmoid(self.net(faces_t.to(self.device))).cpu().numpy().flatten()
                
                for proba in faces_pred:
                    sum += proba.item()
                    if proba > self.threshold:
                        return {
                            "file":face_filepath,
                            "proba" : proba.item(),
                            "is_fake" : True,
                        }
            
            return {
                "file":face_filepath,
                "proba": sum / len(faces),
                "is_fake": False,
            }

    def detect_video(self, video):
        pass

                    
            

    

# Main body
if __name__ == "__main__":
    fakedetector =  DeepFakeDetector()
    print(fakedetector.detect_image("./test123.jpeg"))

