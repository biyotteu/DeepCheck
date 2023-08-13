from facenet_pytorch.models.mtcnn import MTCNN
import torch
import cv2
import math
from PIL import Image,ImageDraw
import numpy as np

class FaceDetector:
    def __init__(self):
        self.device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
        self.detector = MTCNN(margin=0, thresholds=[0.85, 0.95, 0.95],device=self.device)
    
    def detect_image(self, image):
        np.expand_dims(image, 0)
        batch_boxes, *_ = self.detector.detect(image, landmarks=False)
        return [b.tolist() if b is not None else None for b in batch_boxes]

detector = FaceDetector()
image = cv2.imread("./20150518000826_0.jpeg")
image = Image.fromarray(image)
# image = Image.open("./maxresdefault.jpeg")
boxes = detector.detect_image(image)
print(image.size)
print(boxes)
draw = ImageDraw.Draw(image)
for box in boxes:
    x, y, w, h = list(map(int, box))
    draw.rectangle((x,y,x+w,y+h), outline=(0,255,0), width = 3)
    # image = cv2.rectangle(image,(y,x),(y+h,x+w),(255,0,0),2)

image.save("test.jpg")
# cv2.imwrite("test.jpg", image)