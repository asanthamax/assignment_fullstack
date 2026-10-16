from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Ticket(Base):

    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(255))
    priority: Mapped[str] = mapped_column(String(255))
    tags: Mapped[str] = mapped_column(String(255))
    assigned_user: Mapped[str | None] = mapped_column(String(255), nullable=True)

    version_id: Mapped[int] = mapped_column(Integer, nullable=True)

    __mapper_args__ = {
        "version_id_col": version_id
    }