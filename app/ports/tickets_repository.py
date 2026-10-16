from typing import List, Protocol

from app.models.ticket import PaginatedTickets, Ticket


class TicketsRepository(Protocol):

    async def create_ticket(self, ticket: Ticket) -> Ticket:
        """
            create a new ticket based on the ticket object
            and return the newly created ticket

        Args:
            ticket: Ticket object to be created
        Returns:
            ticket: returns newly created ticket
        """
        ...

    async def retrieve_tickets(self, page: int = 1, per_page: int = 10) -> PaginatedTickets:
        """
            retrieve tickets list in a paginateable style

        Args:
            page: page to return
            per_page: number of records per page

        Returns:
            tickets: List of paginated tickets
        """
        ...

    async def assigned_user_to_ticket(self, ticket_id: int, user_email: str):
        """
            assigned an assignee to the ticket

        Args:
            ticket_id: ticket id to be assigned
            user_email: user email needed to be assigned

        Returns: None
        """
        ...

    async def get_tickets_count(self) -> int:
        """
            Return total tickets count exists in the db
        Returns: total records count
        """
        ...