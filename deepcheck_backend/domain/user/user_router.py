from datetime import timedelta, datetime
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.encoders import jsonable_encoder
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from database import getDB
from domain.user import user_crud, user_schema
from domain.user.user_crud import pwd_context
from models import User

from lib.jsonparser import getJsonValue
# from middleware.jwt import verifyJWT

# test for expired (after 1 minute jwt expired)
# ACCESS_TOKEN_EXPIRE_MINUTES = 1
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
REFRESH_TOKEN_EXPIRE_DAYS = 7 
SECRET_KEY = getJsonValue("SECRET")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

router = APIRouter(
    prefix="/api/user",
)

headers = {
    "Set-Cookie": "path=/; HttpOnly; secure"
}


def getCurrentUser(token: str = Depends(oauth2_scheme), db: Session = Depends(getDB)):
    invalid_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Expired Token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        expired: bool = datetime.utcnow() > datetime.utcfromtimestamp(int(payload.get("exp")))
        if username is None:
            raise invalid_exception
        if expired:
            raise expired_exception
    except JWTError:
        raise invalid_exception
    else:
        user = user_crud.getUser(db, username=username)
        if user is None:
            raise invalid_exception
        return user


@router.post("/create/", status_code=status.HTTP_204_NO_CONTENT)
def userCreate(user_create: user_schema.UserCreate, db: Session = Depends(getDB)):
    user = user_crud.getExistingUser(db, user_create=user_create)
    isValidatePassword = user_crud.validatePassword(user_create.password1)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="이미 존재하는 사용자입니다.")
    if not isValidatePassword:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="비밀번호는 숫자, 대문자, 소문자, 특수문자를 모두 포함하고 10자 이상이어야 합니다.")
    
    user_crud.createUser(db=db, user_create=user_create)
    return JSONResponse(status_code=200, content={
        "msg": "Success"
    })


@router.post("/login/", response_model=user_schema.Token)
def loginForAccessToken(data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(getDB)):
    # check user and password
    user = user_crud.getUser(db, data.username)
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # make access token
    access_data = {
        "username": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    refresh_data = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }

    access_token = jwt.encode(access_data, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode(refresh_data, SECRET_KEY, algorithm=ALGORITHM)

    return JSONResponse(status_code=200, headers=headers, content={
        "msg": "Success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": user.username
    })


#recommend
@router.put("/update/", status_code=status.HTTP_204_NO_CONTENT)
def userUpdate(user_update: user_schema.UserUpdate, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    db_user = user_crud.getUser(db, username=current_user.username)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을수 없습니다.")
    if current_user.id != db_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="수정 권한이 없습니다.")
    user_crud.updateUser(db=db, db_user=db_user, user_update=user_update)
    return JSONResponse(status_code=200, headers=headers, content={
        'msg': 'Success'
    })


#recommend
@router.delete("/delete/", status_code=status.HTTP_204_NO_CONTENT)
def userDelete(db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    db_user = user_crud.getUser(db, username=current_user.username)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을수 없습니다.")
    if current_user.id != db_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="삭제 권한이 없습니다.")
    user_crud.deleteUser(db=db, db_user=db_user)
    return JSONResponse(status_code=200, headers=headers, content={
        'msg': 'Success'
    })

@router.post("/survey/", status_code=status.HTTP_204_NO_CONTENT)
def doSurvey(survey_create: user_schema.SurveyCreate, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    testemail="testemail123@naver.com"
    try:
        user_crud.createSurvey(db=db, survey_create=survey_create, email=testemail)
        return JSONResponse(status_code=200, headers=headers, content={
            'msg': 'Success'
        })
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을수 없습니다.")


@router.get("/surveyStatus/{email}", status_code=status.HTTP_204_NO_CONTENT)
def getSurveyStatus(email, db: Session = Depends(getDB)):
    SurveyInfo = user_crud.getSurveyInfo(db=db, email=email)
    resMsg = False
    if(SurveyInfo):
        resMsg = True
    return JSONResponse(status_code=200, headers=headers, content={
        'msg': resMsg
    })

  
@router.get("/SurveyInfo/{email}", status_code=status.HTTP_204_NO_CONTENT)
def getSurveyInfo(email, db: Session = Depends(getDB)):
    
    try:
        SurveyInfo = user_crud.getSurveyInfo(db=db, email=email)
        return JSONResponse(status_code=200, headers=headers, content={
            'email': SurveyInfo.email,
            'gender': SurveyInfo.gender,
            'age' : SurveyInfo.age,
            'rate' : SurveyInfo.rate,
            'satisfied' : SurveyInfo.satisfied,
            'unsatisfied' : SurveyInfo.unsatisfied,
            'unsatisfiedReson' : SurveyInfo.unsatisfiedReson
        })
    except:
        return JSONResponse(status_code=200, headers=headers, content={
            'msg' : 'no Data'
        })

    
@router.post('/userlist/', status_code=status.HTTP_204_NO_CONTENT)
def getUserList(user_list: user_schema.UserGetListRequest, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    nodata_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="No Data",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if current_user.permission:
            userlist = db.query(User).all()[user_list.start:user_list.end]
        return JSONResponse(status_code=200, headers=headers, content={
            "msg": "Success",
            "userlist": jsonable_encoder(userlist)
        })
    except:
        raise nodata_exception
