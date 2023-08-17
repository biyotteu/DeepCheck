from pydantic import BaseModel, validator, EmailStr


class LogGet(BaseModel):
    id: int


class LogGetListRequest(BaseModel):
    user_id: int
    start: int
    end: int
