from pydantic import BaseModel


class ServerCreate(BaseModel):

    name: str

    ip: str

    port: int

    user_id: str


class ServerResponse(ServerCreate):

    id: int

    status: str

    latency: int

    class Config:

        from_attributes = True