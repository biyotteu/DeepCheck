from pydantic import BaseModel, validator, EmailStr
from jose import jwt, JWTError


class UserCreate(BaseModel):
    # username: str
    username: EmailStr
    password1: str
    password2: str

    @validator('username','password1', 'password2')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v

    @validator('password2')
    def passwords_match(cls, v, values):
        if 'password1' in values and v != values['password1']:
            raise ValueError('비밀번호가 일치하지 않습니다')
        return v


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    username: str


class UserUpdate(BaseModel):
    password1: str
    password2: str

    @validator('password2')
    def passwords_match(cls, v, values):
        if 'password1' in values and v != values['password1']:
            raise ValueError('비밀번호가 일치하지 않습니다')
        return v


class Auth(BaseModel):
    username: EmailStr
    password: str


class SurveyCreate(BaseModel):
    gender: str
    age: int
    rate: int
    
    deepfake_detect: int
    deepfake_protect: int
    fakeaudio_detect: int

    service_sec_1: int
    design_1: int
    service_function_1: int
    information_1: int

    service_sec_2: int
    design_2: int
    service_function_2: int
    information_2: int



class UserGetListRequest(BaseModel):
    start: int
    end: int

