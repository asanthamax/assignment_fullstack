from itertools import count
from typing import Sequence
from pydantic import BaseModel, Field


_id_counter = count(1)

class Ticket(BaseModel):
    id: int = Field(default_factory=lambda: next(_id_counter), description="primary key of the ticket table")
    title: str = Field(description="title of the ticket")
    description: str = Field(description="ticket description")
    priority: str = Field(description="priority of the ticket")
    tags: str = Field(description="comma seprated list of tags")
    assigned_user: str | None = Field(default=None, description="ticket assigned user email address")


class PaginatedTickets(BaseModel):
    tickets: Sequence[Ticket] = Field(description="list of tickets in the page")
    current_page_no: int = Field(description="current page no")
    page_size: int = Field(description="number of records per page")


class AssignUser(BaseModel):
    user_email: str = Field(description="user email to assign")
    ticket: int = Field(description="ticket id to assigned")