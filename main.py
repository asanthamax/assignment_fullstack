from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.adapters.db.sqlalchemy.tickets_adapter import SqlAlchemyTicketsRepository
from app.db.sqlalchemy.models.ticket import Ticket
from app.controllers.tickets import ticket_router


SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./sql_app.db"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
db_session = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Ticket.metadata.create_all)
        app.state.ticket_repo = SqlAlchemyTicketsRepository(db_session())
    yield

    await engine.dispose()

app = FastAPI(lifespan=lifespan)
app.include_router(ticket_router)

@app.get("/")
def main():
    return {"message": "Hello World"}
