from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from enum import Enum

class PriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ToDoListBase(BaseModel):
    name: str

class ToDoListCreate(ToDoListBase):
    pass

class ToDoListResponse(ToDoListBase):
    id: int

    class Config:
        orm_mode = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    priority: Optional[PriorityEnum]
    status: Optional[str] = "todo"

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    list_id: int

    class Config:
        orm_mode = True
