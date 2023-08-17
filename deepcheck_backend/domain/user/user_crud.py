from passlib.context import CryptContext
from sqlalchemy.orm import Session
from domain.user.user_schema import UserCreate, UserUpdate, SurveyCreate
from models import User, Survey
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
    db_user = User(username=user_create.username,
                   password=pwd_context.hash(user_create.password1),
                   permission=False)
    db.add(db_user)
    db.commit()


def getExistingUser(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.username == user_create.username)
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


def createSurvey(db: Session, survey_create: SurveyCreate, username: str):
    survey_info = Survey(username=username, 
                         gender=survey_create.gender, 
                         age=survey_create.age, 
                         rate=survey_create.rate, 
                         deepfake_detect=survey_create.deepfake_detect,
                         deepfake_protect=survey_create.deepfake_protect,
                         fakeaudio_detect=survey_create.fakeaudio_detect,
                         service_sec_1=survey_create.service_sec_1,
                         design_1=survey_create.design_1,
                         service_function_1=survey_create.service_function_1,
                         information_1=survey_create.information_1,
                         service_sec_2=survey_create.service_sec_2,
                         design_2=survey_create.design_2,
                         service_function_2=survey_create.service_function_2,
                         information_2=survey_create.information_2)                         
    db.add(survey_info)
    db.commit()



def getSurveyInfo(db: Session, username: str):
    return db.query(Survey).filter(Survey.username == username).first()

