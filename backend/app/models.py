from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    lists = relationship("ToDoList", back_populates="owner")

class ToDoList(Base):
    __tablename__ = "lists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="lists")
    tasks = relationship("Task", back_populates="list")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    priority = Column(String, nullable=False)
    status = Column(String, default="todo", nullable=False)
    list_id = Column(Integer, ForeignKey("lists.id"), nullable=False)
    archived = Column(Boolean, default=False, nullable=False)

    list = relationship("ToDoList", back_populates="tasks")
