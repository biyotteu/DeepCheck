from pydantic import BaseModel, validator, EmailStr


class UserCreate(BaseModel):
    # username: str
    email: EmailStr
    password1: str
    password2: str

    @validator('email','password1', 'password2')
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
    token_type: str
    email: str


class UserUpdate(BaseModel):
    password1: str
    password2: str

    @validator('password2')
    def passwords_match(cls, v, values):
        if 'password1' in values and v != values['password1']:
            raise ValueError('비밀번호가 일치하지 않습니다')
        return v
