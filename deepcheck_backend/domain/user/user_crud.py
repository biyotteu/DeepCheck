from passlib.context import CryptContext
from sqlalchemy.orm import Session
from domain.user.user_schema import UserCreate, UserUpdate
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def createUser(db: Session, user_create: UserCreate):
    db_user = User(username=user_create.username,
                   password=pwd_context.hash(user_create.password1),
                   email=user_create.email)
    db.add(db_user)
    db.commit()


def getExistingUser(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.username == user_create.username) | (User.email == user_create.email)
    ).first()


def getUser(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def updateUser(db: Session, db_user: User, user_update: UserUpdate):
    db_user.password = pwd_context.hash(user_update.password1)
    db.add(db_user)
    db.commit()


def deleteUser(db: Session, db_user: User):
    db.delete(db_user)
    db.commit()

