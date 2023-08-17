from sqlalchemy.orm import Session
from models import Log


def createLog(db: Session, log_create: dict):
    db_log = Log(user_id=log_create["user_id"],
                   uuid=log_create["uuid"],
                   endpoint=log_create["endpoint"],
                   path=log_create["path"],
                   filelist=log_create["filelist"],
                   score=log_create["score"])
    db.add(db_log)
    db.commit()


def getLog(db: Session, id: int):
    return db.query(Log).filter(Log.id == id).first()


def deleteLog(db: Session, db_log: Log):
    db.delete(db_log)
    db.commit()
