from fastapi import HTTPException
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from starlette import status

from database import getDB
from domain.user import user_crud
from lib.jsonparser import getJsonValue

SECRET_KEY = getJsonValue("SECRET")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

def verifyJWT(func):
    def wrapper(token: str = Depends(oauth2_scheme), db: Session = Depends(getDB)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("username")
            if username is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        else:
            user = user_crud.getUser(db, username=username)
            if user is None:
                raise credentials_exception
            return func(db, user)
    return wrapper