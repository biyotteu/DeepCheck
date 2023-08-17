from fastapi  import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from lib.static import SPAStaticFiles

from domain.user import user_router
from domain.log import log_router
from domain.ai import ai_router

app = FastAPI(
    #docs_url=None, # Disable docs (Swagger UI)
    #redoc_url=None, 
)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(log_router.router)
app.include_router(ai_router.router)

app.mount("/tmp", StaticFiles(directory="../tmp"), name="tmp")
app.mount("/", SPAStaticFiles(directory="../deepcheck_frontend/build", html=True), name="static")
