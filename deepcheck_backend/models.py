from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import PickleType

from database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    # username = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    permission = Column(Boolean, nullable=True)


class Survey(Base):
    __tablename__ = "survey"

    userid = Column(Integer, primary_key=True, unique=True)
    username = Column(String, nullable=False, unique=True)
    
    gender = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    rate = Column(Integer, nullable=False)

    deepfake_detect = Column(Integer, nullable=False, default=0)
    deepfake_protect = Column(Integer, nullable=False, default=0)
    fakeaudio_detect = Column(Integer, nullable=False, default=0)
    
    service_sec_1 = Column(Integer, nullable=False, default=0)
    design_1 = Column(Integer, nullable=False, default=0)
    service_function_1 = Column(Integer, nullable=False, default=0)
    information_1 = Column(Integer, nullable=False, default=0)

    service_sec_2 = Column(Integer, nullable=False, default=0)
    design_2 = Column(Integer, nullable=False, default=0)
    service_function_2 = Column(Integer, nullable=False, default=0)
    information_2 = Column(Integer, nullable=False, default=0)



class Log(Base):
    __tablename__ = "log"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    uuid = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)
    path = Column(String, nullable=False)
    filelist = Column(MutableList.as_mutable(PickleType), default=[])
    score = Column(Float, nullable=True)
    user = relationship("User", backref="user_backref")
