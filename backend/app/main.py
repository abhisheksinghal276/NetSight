from fastapi import FastAPI
from .database import Base, engine
from . import models
from .routes import servers

# For scheduler worker
from .services.worker import scheduler

# Enabling CORS in Backend for connecting Frontend
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NetSight API",
    version="1.0.0"
)

# Adding the middleware layer
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(servers.router)
# Starting the scheduler worker
scheduler.start()


@app.get("/")
def root():
    return {
        "message": "NetSight API Running"
    }