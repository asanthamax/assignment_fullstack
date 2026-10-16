from sqlite3 import IntegrityError
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from sqlalchemy.orm.exc import StaleDataError
from app.constants.constants import ErrorEnum
from app.models.ticket import PaginatedTickets, Ticket
from app.db.sqlalchemy.models.ticket import Ticket as TicketModel
from app.ports.tickets_repository import TicketsRepository


class SqlAlchemyTicketsRepository(TicketsRepository):

    def __init__(self, session_factory: async_sessionmaker[AsyncSession]) -> None:
        # A session is not safe for concurrent use, so each call opens its own.
        self._session_factory = session_factory

    async def create_ticket(self, ticket: Ticket) -> Ticket:
        async with self._session_factory() as session, session.begin():
            ticket_entry = TicketModel()
            ticket_entry.title = ticket.title
            ticket_entry.description = ticket.description
            ticket_entry.priority = ticket.priority
            ticket_entry.tags = ticket.tags
            ticket_entry.assigned_user = ticket.assigned_user
            session.add(ticket_entry)
            await session.flush()
            # Return the DB-generated id, not the model's in-memory counter.
            return ticket.model_copy(update={"id": ticket_entry.id})

    async def retrieve_tickets(self, page: int = 1, per_page: int = 10) -> PaginatedTickets:
        offset = (page - 1) * per_page
        stmt = select(TicketModel).order_by(TicketModel.id).limit(per_page).offset(offset)
        async with self._session_factory() as session:
            rows = (await session.execute(stmt)).scalars().all()
        tickets = [
            Ticket(
                id=tick.id,
                title=tick.title,
                description=tick.description,
                priority=tick.priority,
                tags=tick.tags,
                assigned_user=tick.assigned_user,
            )
            for tick in rows
        ]
        return PaginatedTickets(tickets=tickets, current_page_no=page, page_size=per_page)

    async def assigned_user_to_ticket(self, ticket_id: int, user_email: str):
        try:
            async with self._session_factory() as session, session.begin():
                ticket = (
                    await session.execute(select(TicketModel).where(TicketModel.id == ticket_id))
                ).scalar_one_or_none()
                if not ticket:
                    raise ValueError(ErrorEnum.TICKET_NOT_FOUND.value)
                if ticket.assigned_user is not None:
                    raise ValueError(ErrorEnum.TICKET_ALREADY_ASSIGNED.value)
                ticket.assigned_user = user_email
        except StaleDataError:
            raise ValueError(ErrorEnum.TICKET_ALREADY_ASSIGNED.value)

    async def get_tickets_count(self) -> int:
        async with self._session_factory() as session:
            count = await session.scalar(select(func.count()).select_from(TicketModel))
        return count or 0
