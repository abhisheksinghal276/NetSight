from apscheduler.schedulers.background import BackgroundScheduler

from ..database import SessionLocal
from ..models import Server

from .monitor import check_server


def monitor_all_servers():

    db = SessionLocal()

    try:

        servers = db.query(Server).all()

        for server in servers:

            result = check_server(
                server.ip,
                server.port
            )

            server.status = result["status"]

            server.latency = result["latency"]

            print(
                f"{server.name} | "
                f"{server.status} | "
                f"{server.latency}ms"
            )

        db.commit()

    finally:
        db.close()


scheduler = BackgroundScheduler()

scheduler.add_job(
    monitor_all_servers,
    "interval",
    seconds=30
)