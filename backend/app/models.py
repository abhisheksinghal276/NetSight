from sqlalchemy import (
    Column,
    Integer,
    String
)

from .database import Base


class Server(Base):

    __tablename__ = "servers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    ip = Column(
        String,
        nullable=False
    )

    port = Column(
        Integer,
        nullable=False
    )

    status = Column(
        String,
        default="unknown"
    )

    latency = Column(
        Integer,
        default=0
    )

    user_id = Column(
        String,
        nullable=False
    )