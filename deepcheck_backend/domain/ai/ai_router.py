import uuid
import os
from typing import Dict, Any

from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from starlette import status
from starlette.exceptions import HTTPException

from database import getDB
from domain.ai import ai_schema, ai_crud
from domain.user.user_router import getCurrentUser
from models import User

from lib.fake_audio_detection.audio_fake_detector import AudioFakeDetector
from lib.deepfake_detection.deepfake_detection import DeepFakeDetector
from lib.icpr2020dfdc.deepfake_detection import DeepFakeDetector as DeepFakeDetector2

from middleware.jwt import verifyJWT

# models 
audioDetector = AudioFakeDetector()
deepfakeDetector = DeepFakeDetector()
deepfakeDetector2 = DeepFakeDetector2()

router = APIRouter(
    prefix="/api/ai",
)

@router.post("/audio")
async def audio(file: UploadFile, current_user: User = Depends(getCurrentUser)):
    UPLOAD_DIR = "./tmp/audio"
    content = await file.read()
    filename = f"{str(uuid.uuid4())}." + file.filename.split(".")[-1]
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content) 

    result = audioDetector.detect(os.path.join(UPLOAD_DIR, filename))
    os.remove(os.path.join(UPLOAD_DIR, filename))
    return result

# cross_efficientnet_vit
@router.post("/image")
async def audio(file: UploadFile, current_user: User = Depends(getCurrentUser)):
    folder_id = str(uuid.uuid1())
    UPLOAD_DIR = "./tmp/image/"+folder_id
    os.mkdir(UPLOAD_DIR)
    content = await file.read()
    filename = os.path.join(UPLOAD_DIR,"origin."+file.filename.split(".")[-1])

    with open(filename, "wb") as fp:
        fp.write(content) 

    return deepfakeDetector.detect_image(folder_id,filename)

# icpr2020dfdc
@router.post("/image2")
async def audio(file: UploadFile, current_user: User = Depends(getCurrentUser)):
    UPLOAD_DIR = "./tmp/image"
    content = await file.read()
    filename = f"{str(uuid.uuid4())}." + file.filename.split(".")[-1]

    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content) 

    result = deepfakeDetector2.detect_image(os.path.join(UPLOAD_DIR, filename))
    os.remove(os.path.join(UPLOAD_DIR, filename))
    return result

@router.post("/imagesFromUrls")
async def images_from_urls(data:Dict[Any, Any], current_user: User = Depends(getCurrentUser)):
    urls = data["urls"]
    return deepfakeDetector.detect_urls(urls)


# # recommend
# @router.get("/depends", response_model=ai_schema.Example)
# def example_detail(db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
#     example = example_crud.getExample(db)
#     return example
