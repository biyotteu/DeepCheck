from fastapi  import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from fastapi.staticfiles import StaticFiles
from typing import Dict, Any

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from fake_audio_detection.audio_fake_detector import AudioFakeDetector
from deepfake_detection.deepfake_detection import DeepFakeDetector
from icpr2020dfdc.deepfake_detection import DeepFakeDetector as DeepFakeDetector2

import uuid
import os
import requests
from PIL import Image
from io import BytesIO

app = FastAPI()
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/tmp", StaticFiles(directory="./tmp"), name="tmp")

audioDetector = AudioFakeDetector()
deepfakeDetector = DeepFakeDetector()
deepfakeDetector2 = DeepFakeDetector2()

@app.post("/audio/")
async def audio(file: UploadFile):
    UPLOAD_DIR = "./tmp/audio"
    content = await file.read()
    filename = f"{str(uuid.uuid4())}." + file.filename.split(".")[-1]
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content) 

    result = audioDetector.detect(os.path.join(UPLOAD_DIR, filename))
    os.remove(os.path.join(UPLOAD_DIR, filename))
    return result

# cross_efficientnet_vit
@app.post("/image/")
async def audio(file: UploadFile):
    folder_id = str(uuid.uuid1())
    UPLOAD_DIR = "./tmp/image/"+folder_id
    os.mkdir(UPLOAD_DIR)
    content = await file.read()
    filename = os.path.join(UPLOAD_DIR,"origin."+file.filename.split(".")[-1])

    with open(filename, "wb") as fp:
        fp.write(content) 

    return deepfakeDetector.detect_image(folder_id,filename)
    # result = deepfakeDetector.detect_image(os.path.join(UPLOAD_DIR, filename))
    # os.remove(os.path.join(UPLOAD_DIR, filename))
    # return result

# icpr2020dfdc
@app.post("/image2/")
async def audio(file: UploadFile):
    UPLOAD_DIR = "./tmp/image"
    content = await file.read()
    filename = f"{str(uuid.uuid4())}." + file.filename.split(".")[-1]

    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content) 

    result = deepfakeDetector2.detect_image(os.path.join(UPLOAD_DIR, filename))
    os.remove(os.path.join(UPLOAD_DIR, filename))
    return result

@app.post("/imagesFromUrls/")
async def images_from_urls(data:Dict[Any, Any]):
    urls = data["urls"]
    return deepfakeDetector.detect_urls(urls)

@app.get("/test/")
async def test():
    print("success")
    return "hello world"
