from passlib.context import CryptContext
from sqlalchemy.orm import Session
from domain.user.user_schema import UserCreate, UserUpdate
from models import User
import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def validatePassword(password : str) -> bool:
    if len(password) < 10:
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def createUser(db: Session, user_create: UserCreate):
    db_user = User(email=user_create.email,
                   password=pwd_context.hash(user_create.password1))
    db.add(db_user)
    db.commit()


def getExistingUser(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.email == user_create.email)
    ).first()


def getUser(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def updateUser(db: Session, db_user: User, user_update: UserUpdate):
    db_user.password = pwd_context.hash(user_update.password1)
    db.add(db_user)
    db.commit()


def deleteUser(db: Session, db_user: User):
    db.delete(db_user)
    db.commit()


