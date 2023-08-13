alembic init migrations

alembic revision --autogenerate  
alembic upgrade head  
  
uvicorn main:app --reload
