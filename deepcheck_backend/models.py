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
