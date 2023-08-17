from pydantic import BaseModel

class LogGet(BaseModel):
    id: int

class LogGetListRequest(BaseModel):
    user_id: int
    start: int
    end: int

class EmailSearch(BaseModel):
    email: str

class LogCount(BaseModel):
    user_id: int