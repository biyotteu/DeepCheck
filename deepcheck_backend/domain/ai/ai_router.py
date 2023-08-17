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
from domain.log.log_crud import createLog
from models import User

from lib.fake_audio_detection.audio_fake_detector import AudioFakeDetector
from lib.deepfake_detection.deepfake_detection import DeepFakeDetector
from lib.icpr2020dfdc.deepfake_detection import DeepFakeDetector as DeepFakeDetector2
from lib.watermark.watermark import Watermark

from middleware.jwt import verifyJWT

# models 
audioDetector = AudioFakeDetector()
deepfakeDetector = DeepFakeDetector()
deepfakeDetector2 = DeepFakeDetector2()
watermark = Watermark()

router = APIRouter(
    prefix="/api/ai",
)

@router.post("/audio/")
async def audio(file: UploadFile, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    UPLOAD_DIR = "../tmp/audio"
    content = await file.read()
    filename = f"{str(uuid.uuid4())}." + file.filename.split(".")[-1]
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content) 
    try:
        result = audioDetector.detect(os.path.join(UPLOAD_DIR, filename))
        os.remove(os.path.join(UPLOAD_DIR, filename))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="잘못된 접근입니다")

    log_create = {
        "user_id": current_user.id,
        "uuid": filename,
        "endpoint": "/api/ai/image/",
        "path": "https://deepcheck.site/tmp/audio/",
        "filelist": str([filename]),
        "score": result["score"]
    }
    createLog(db=db, log_create=log_create)

    return result

# cross_efficientnet_vit
@router.post("/image/")
async def image(file: UploadFile, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    folder_id = str(uuid.uuid1())
    UPLOAD_DIR = "../tmp/image/"+folder_id
    os.mkdir(UPLOAD_DIR)
    content = await file.read()
    filename = os.path.join(UPLOAD_DIR,"origin."+file.filename.split(".")[-1])

    with open(filename, "wb") as fp:
        fp.write(content)
    
    try:
        result = deepfakeDetector.detect_image(folder_id,filename)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="잘못된 접근입니다")

    filelist = os.listdir(UPLOAD_DIR)
    filelist.remove('faces')
    filelist += os.listdir(UPLOAD_DIR + "/faces")
    log_create = {
        "user_id": current_user.id,
        "uuid": folder_id,
        "endpoint": "/api/ai/image/",
        "path": "https://deepcheck.site/tmp/image/"+folder_id,
        "filelist": str(filelist),
        "score": result["score"]
    }
    createLog(db=db, log_create=log_create)

    return result

# icpr2020dfdc
@router.post("/image2/")
async def image2(file: UploadFile, current_user: User = Depends(getCurrentUser)):
    UPLOAD_DIR = "../tmp/image"
    content = await file.read()
    filename = f"{str(uuid.uuid4())}." + file.filename.split(".")[-1]

    with open(os.path.join(UPLOAD_DIR, filename), "wb") as fp:
        fp.write(content) 

    try:
        result = deepfakeDetector2.detect_image(os.path.join(UPLOAD_DIR, filename))
        os.remove(os.path.join(UPLOAD_DIR, filename))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="잘못된 접근입니다")
    
    return result

@router.post("/imagesFromUrls/")
async def images_from_urls(data:Dict[Any, Any], current_user: User = Depends(getCurrentUser)):
    urls = data["urls"]
    return deepfakeDetector.detect_urls(urls)

# watermark
@router.post("/watermark/")
async def watermark(file: UploadFile, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    folder_id = str(uuid.uuid1())
    UPLOAD_DIR = "../tmp/image/"+folder_id
    os.mkdir(UPLOAD_DIR)
    content = await file.read()
    filename = os.path.join(UPLOAD_DIR,"origin."+file.filename.split(".")[-1])

    with open(filename, "wb") as fp:
        fp.write(content)

    filelist = os.listdir(UPLOAD_DIR)
    log_create = {
        "user_id": current_user.id,
        "uuid": folder_id,
        "endpoint": "/api/ai/watermark/",
        "path": "https://deepcheck.site/tmp/image/"+folder_id,
        "filelist": str(filelist),
        "score": None
    }
    createLog(db=db, log_create=log_create)

    return watermark.process(filename, folder_id)

# # recommend
# @router.get("/depends", response_model=ai_schema.Example)
# def example_detail(db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
#     example = example_crud.getExample(db)
#     return example
