from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from database import getDB
from domain.log import log_crud, log_schema
from domain.user.user_router import getCurrentUser
from models import Log, User

router = APIRouter(
    prefix="/api/log",
)

headers = {
    "Set-Cookie": "path=/; HttpOnly; secure"
}


def logCreate(log_create: dict, db: Session = Depends(getDB)):
    try:
        log_crud.createLog(db=db, log_create=log_create)
        return JSONResponse(status_code=200, content={
            "msg": "Success"
        })
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터 포맷이 올바르지 않습니다")
    

@router.post("/get/", status_code=status.HTTP_204_NO_CONTENT)
def logGet(log_get: log_schema.LogGet, db: Session = Depends(getDB)):
    db_log = log_crud.getLog(db=db, id=log_get.id)
    return JSONResponse(status_code=200, headers=headers, content={
        "msg": "Success",
        "log": db_log
    })


@router.post("/loglist/", status_code=status.HTTP_204_NO_CONTENT)
def logGet(log_list: log_schema.LogGetListRequest, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    nodata_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="No Data",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if current_user.permission:
            loglist = db.query(Log).all()[log_list.start:log_list.end]
        return JSONResponse(status_code=200, headers=headers, content={
            "msg": "Success",
            "loglist": jsonable_encoder(loglist)
        })
    except:
        raise nodata_exception


#recommend
@router.delete("/delete/", status_code=status.HTTP_204_NO_CONTENT)
def logDelete(log_get: log_schema.LogGet, db: Session = Depends(getDB), current_user: User = Depends(getCurrentUser)):
    db_log = log_crud.getLog(db=db, id=log_get.id)
    if not db_log:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을수 없습니다.")
    if not current_user.permission:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="삭제 권한이 없습니다.")
    log_crud.deleteLog(db=db, db_log=db_log)
    return JSONResponse(status_code=200, headers=headers, content={
        'msg': 'Success'
    })


# @router.put("/update", status_code=status.HTTP_204_NO_CONTENT)
# @verifyJWT
# def userUpdate(db: Session, current_user: User, user_update: user_schema.UserUpdate):
#     db_user = user_crud.getUser(db, username=current_user.username)
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="데이터를 찾을수 없습니다.")
#     if current_user.id != db_user.id:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="수정 권한이 없습니다.")
#     user_crud.updateUser(db=db, db_user=db_user, user_update=user_update)


# @router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
# @verifyJWT
# def userDelete(db: Session, current_user: User, user_delete: user_schema.UserDelete):
#     db_user = user_crud.getUser(db, username=current_user.username)
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="데이터를 찾을수 없습니다.")
#     if current_user.id != db_user.id:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="삭제 권한이 없습니다.")
#     user_crud.deleteUser(db=db, db_user=db_user)
