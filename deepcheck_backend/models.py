from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    # username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


class Survey(Base):
    __tablename__ = "survey"

    userid = Column(Integer, primary_key=True, unique=True)
    email = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    rate = Column(Integer, nullable=False)
    satisfied = Column(String, nullable=False)
    unsatisfied = Column(String, nullable=False)
    unsatisfiedReason = Column(String, nullable=True)


