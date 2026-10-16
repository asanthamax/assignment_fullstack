from sqlite3 import IntegrityError
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import StaleDataError
from app.constants.constants import ErrorEnum
from app.models.ticket import PaginatedTickets, Ticket
from app.db.sqlalchemy.models.ticket import Ticket as TicketModel
from app.ports.tickets_repository import TicketsRepository


class SqlAlchemyTicketsRepository(TicketsRepository):

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create_ticket(self, ticket: Ticket) -> Ticket:
        
        try:
            async with self._session.begin_nested():
                ticket_entry = TicketModel()
                ticket_entry.title = ticket.title
                ticket_entry.description = ticket.description
                ticket_entry.priority = ticket.priority
                ticket_entry.tags = ticket.tags
                self._session.add(ticket_entry)
            return ticket
        except Exception as error:
            raise error
        
    
    async def retrieve_tickets(self, page: int = 1, per_page: int = 10) -> PaginatedTickets:
        
        offset = (page - 1) * per_page
        stmt = (
            select(TicketModel)
            .order_by(TicketModel.id)
            .limit(per_page)
            .offset(offset)
        )
        async with self._session.begin_nested():
            result = self._session.execute(stmt)
            tickets = await result
            tickets = tickets.scalars().all()
        tickets = [
            Ticket(
                id=tick.id, 
                title=tick.title, 
                description=tick.description, 
                priority=tick.priority, 
                tags=tick.tags, 
                assigned_user=tick.assigned_user
            ) for tick in tickets
        ]
        return PaginatedTickets(
            tickets=tickets,
            current_page_no=page,
            page_size=per_page
        )


    async def assigned_user_to_ticket(self, ticket_id: int, user_email: str):
        try:
            async with self._session.begin_nested():
                ticket = await self._session.execute(
                    select(TicketModel)
                    .where(TicketModel.id == ticket_id)
                )
                ticket = ticket.scalar_one_or_none()
                if not ticket:
                    raise ValueError(ErrorEnum.TICKET_NOT_FOUND.value)
                
                if ticket.assigned_user is not None:
                    raise ValueError(ErrorEnum.TICKET_ALREADY_ASSIGNED.value)

                ticket.assigned_user = user_email
                await self._session.commit()                
        except StaleDataError:
            await self._session.rollback()
            raise ValueError(ErrorEnum.TICKET_ALREADY_ASSIGNED.value)
        
    
    async def get_tickets_count(self) -> int:
        try:
            async with self._session.begin_nested():
                tickets = await self._session.scalar(
                    select(func.count())
                    .select_from(TicketModel)
                )
                return tickets if tickets else 0
        except Exception as ex:
            raise ex
            