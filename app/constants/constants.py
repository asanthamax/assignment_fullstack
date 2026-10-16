from enum import Enum


class ErrorEnum(Enum):
    TICKET_NOT_FOUND = "Ticket is not found in the db"
    TICKET_ALREADY_ASSIGNED = "Ticket is already assigned to another user"
    UNKONWN_ERROR = "Unknown server error!!!"
