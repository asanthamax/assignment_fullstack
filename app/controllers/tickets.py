from fastapi import APIRouter, Depends, Request, HTTPException
from app.constants.constants import ErrorEnum
from app.models.ticket import AssignUser, Ticket

ticket_router = APIRouter(tags=["Tickets"])

@ticket_router.post("/v1/tickets/init_ticket")
async def create_ticket(request: Request, ticket: Ticket):
    try:
        tickets_repository = request.app.state.ticket_repo
        await tickets_repository.create_ticket(ticket)
        return ticket.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error occurred while inserting ticket")
    
@ticket_router.patch("/v1/tickets/assign_user")
async def assign_ticket_to_user(request: Request, ticket_payload: AssignUser):
    try:
        tickets_repository = request.app.state.ticket_repo
        await tickets_repository.assigned_user_to_ticket(ticket_payload.ticket, ticket_payload.user_email)
        return {"msg": "Ticket assigned to the user!!!"}
    except Exception as e:
        if ErrorEnum.TICKET_NOT_FOUND.value in str(e):
            raise HTTPException(status_code=400, detail=ErrorEnum.TICKET_NOT_FOUND.value)
        elif ErrorEnum.TICKET_ALREADY_ASSIGNED.value in str(e):
            raise HTTPException(status_code=422, detail=ErrorEnum.TICKET_ALREADY_ASSIGNED.value)
        else:
            raise HTTPException(status_code=500, detail=ErrorEnum.UNKONWN_ERROR.value)
        
@ticket_router.get("/v1/tickets/:current_page/:page_size")        
async def get_ticket_list(request: Request, current_page: int, page_size: int = 10):
    try:
        tickets_repository = request.app.state.ticket_repo
        tickets_list = await tickets_repository.retrieve_tickets(current_page, page_size)
        return tickets_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=ErrorEnum.UNKONWN_ERROR.value)
    
@ticket_router.get("/v1/tickets/row_count")    
async def get_ticket_count(request: Request):
    try:
        tickets_repository = request.app.state.ticket_repo
        ticket_count = await tickets_repository.get_tickets_count()
        return {"total_tickets": ticket_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=ErrorEnum.UNKONWN_ERROR.value)