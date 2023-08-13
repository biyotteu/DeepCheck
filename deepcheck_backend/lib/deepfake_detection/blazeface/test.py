from PIL import Image, ImageDraw
import torch
from blazeface import FaceExtractor, BlazeFace
import numpy as np

device = torch.device('cuda:0') if torch.cuda.is_available() else torch.device('cpu')
facedet = BlazeFace().to(device)
facedet.load_weights("./blazeface.pth")
facedet.load_anchors("./anchors.npy")
face_extractor = FaceExtractor(facedet=facedet)

# image = Image.open('/home/workspace/deepfakeDetection/cross-efficient-vit/preprocessing/20150518000826_0.jpeg')
image = Image.open('test123.jpeg')
result = face_extractor.process_image(img=image)
draw = ImageDraw.Draw(image)
# print(result)
for i in range(len(result['detections'])):
    ymin, xmin, ymax, xmax = result['detections'][i, :4].astype(np.int)
    draw.rectangle((xmin,ymin,xmax,ymax), outline=(0,255,0), width = 3)
image.save('test.jpg')
# print(image['detections'])
# Image.fromarray(image['faces'][0]).save('test.jpg')