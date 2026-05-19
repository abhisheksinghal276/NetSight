from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Server
from ..schemas import ServerCreate, ServerResponse
from ..services.monitor import check_server

router = APIRouter(
    prefix="/servers",
    tags=["Servers"]
)


@router.post("/", response_model=ServerResponse)
def create_server(
    server: ServerCreate,
    db: Session = Depends(get_db)
):
    new_server = Server(
    name=server.name,
    ip=server.ip,
    port=server.port,
    user_id=server.user_id
    )

    db.add(new_server)
    db.commit()
    db.refresh(new_server)

    return new_server


# Creating monitoring route

@router.get(
    "/",
    response_model=list[ServerResponse]
)
def get_servers(
    user_id: str,
    db: Session = Depends(get_db)
):

    servers = db.query(Server).filter(
        Server.user_id == user_id
    ).all()

    return servers

@router.post("/check/{server_id}")
def check_server_status(
    server_id: int,
    db: Session = Depends(get_db)
):

    server = db.query(Server).filter(Server.id == server_id).first()

    if not server:
        return {
            "error": "Server not found"
        }

    result = check_server(server.ip, server.port)

    server.status = result["status"]
    server.latency = result["latency"]

    db.commit()

    return {
        "server": server.name,
        "status": server.status,
        "latency": server.latency
    }

@router.delete("/{server_id}")
def delete_server(
    server_id: int,
    db: Session = Depends(get_db)
):

    server = db.query(Server).filter(
        Server.id == server_id
    ).first()

    if not server:

        return {
            "error": "Server not found"
        }

    db.delete(server)

    db.commit()

    return {
        "message": "Server deleted"
    }