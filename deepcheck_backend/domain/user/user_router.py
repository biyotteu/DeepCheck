from datetime import timedelta, datetime
from typing_extensions import Annotated

from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
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
SECRET_KEY = getJsonValue("SECRET")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

router = APIRouter(
    prefix="/api/user",
)


def authForm(email: str = "user@example.com", password: str = "string"):
    return {
        "email": email, 
        "password": password
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
        email: str = payload.get("email")
        expired: bool = datetime.utcnow() > datetime.utcfromtimestamp(int(payload.get("exp")))
        if email is None:
            raise invalid_exception
        if expired:
            raise expired_exception
    except JWTError:
        raise invalid_exception
    else:
        user = user_crud.getUser(db, email=email)
        if user is None:
            raise invalid_exception
        return user


@router.post("/create/", status_code=status.HTTP_204_NO_CONTENT)
def userCreate(user_create: user_schema.UserCreate, db: Session = Depends(getDB)):
    user = user_crud.getExistingUser(db, user_create=user_create)
    isValidatePassword = user_crud.validatePassword(user_create.password1)
    
    if user_create.password1 != user_create.password2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="입력한 비밀번호가 서로 틀립니다.")
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
def loginForAccessToken(data: dict = Depends(authForm), db: Session = Depends(getDB)):
    # check user and password
    user = user_crud.getUser(db, data['email'])
    if not user or not pwd_context.verify(data['password'], user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # make access token
    data = {
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return JSONResponse(status_code=200, content={
        "msg": "Success",
        "access_token": access_token,
        "token_type": "bearer",
        "email": user.email
    })


#recommend
@router.put("/update/", status_code=status.HTTP_204_NO_CONTENT)
def userUpdate(user_update: user_schema.UserUpdate, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    db_user = user_crud.getUser(db, email=current_user.email)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을수 없습니다.")
    if current_user.id != db_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="수정 권한이 없습니다.")
    user_crud.updateUser(db=db, db_user=db_user, user_update=user_update)
    return JSONResponse(status_code=200, content={
        'msg': 'Success'
    })


#recommend
@router.delete("/delete/", status_code=status.HTTP_204_NO_CONTENT)
def userDelete(db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    db_user = user_crud.getUser(db, email=current_user.email)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을수 없습니다.")
    if current_user.id != db_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="삭제 권한이 없습니다.")
    user_crud.deleteUser(db=db, db_user=db_user)
    return JSONResponse(status_code=200, content={
        'msg': 'Success'
    })


# @router.put("/update", status_code=status.HTTP_204_NO_CONTENT)
# @verifyJWT
# def userUpdate(db: Session, current_user: User, user_update: user_schema.UserUpdate):
#     db_user = user_crud.getUser(db, username=current_user.username)
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="데이터를 찾을수 없습니다.")
#     if current_user.id != db_user.id:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="수정 권한이 없습니다.")
#     user_crud.updateUser(db=db, db_user=db_user, user_update=user_update)


# @router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
# @verifyJWT
# def userDelete(db: Session, current_user: User, user_delete: user_schema.UserDelete):
#     db_user = user_crud.getUser(db, username=current_user.username)
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="데이터를 찾을수 없습니다.")
#     if current_user.id != db_user.id:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="삭제 권한이 없습니다.")
#     user_crud.deleteUser(db=db, db_user=db_user)
