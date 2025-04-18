from sqlalchemy.orm import Session
from . import models, schemas

def create_list(db: Session, name: str, user_id: int):
    new_list = models.ToDoList(name=name, owner_id=user_id)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list

def get_lists(db: Session, user_id: int):
    return db.query(models.ToDoList).filter(models.ToDoList.owner_id == user_id).all()

def delete_list(db: Session, list_id: int, user_id: int):
    db_list = db.query(models.ToDoList).filter(
        models.ToDoList.id == list_id,
        models.ToDoList.owner_id == user_id
    ).first()
    if db_list:
        db.delete(db_list)
        db.commit()
    return db_list


from .models import Task, ToDoList
from sqlalchemy.orm import Session
from . import schemas

def create_task(db: Session, task_data: schemas.TaskCreate, list_id: int, user_id: int):
    db_list = db.query(ToDoList).filter(ToDoList.id == list_id, ToDoList.owner_id == user_id).first()
    if not db_list:
        return None
    task = Task(**task_data.dict(), list_id=list_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks(db: Session, user_id: int):
    return db.query(Task).join(ToDoList).filter(ToDoList.owner_id == user_id).all()

def update_task_status(db: Session, task_id: int, new_status: str, user_id: int):
    task = db.query(Task).join(ToDoList).filter(
        Task.id == task_id,
        ToDoList.owner_id == user_id
    ).first()
    if task:
        task.status = new_status
        db.commit()
        db.refresh(task)
    return task

def delete_task(db: Session, task_id: int, user_id: int):
    task = db.query(Task).join(ToDoList).filter(
        Task.id == task_id,
        ToDoList.owner_id == user_id
    ).first()
    if task:
        db.delete(task)
        db.commit()
    return task


def get_tasks_by_list(db: Session, list_id: int, user_id: int):
    return db.query(Task).join(ToDoList).filter(
        Task.list_id == list_id,
        ToDoList.owner_id == user_id
    ).all()


def get_sorted_tasks(db: Session, user_id: int, sort_by: str = "due_date"):
    valid_fields = {"due_date", "priority"}
    if sort_by not in valid_fields:
        sort_by = "due_date"
    
    order_column = getattr(Task, sort_by)
    return db.query(Task).join(ToDoList).filter(
        ToDoList.owner_id == user_id
    ).order_by(order_column).all()


def search_tasks(db: Session, user_id: int, query: str):
    return db.query(Task).join(ToDoList).filter(
        ToDoList.owner_id == user_id,
        (Task.title.ilike(f"%{query}%")) | (Task.description.ilike(f"%{query}%"))
    ).all()


from sqlalchemy import func
from datetime import datetime

def get_task_stats(db: Session, user_id: int):
    now = datetime.utcnow()

    # Po statusu
    status_counts = dict(
        db.query(Task.status, func.count(Task.id))
        .join(ToDoList)
        .filter(ToDoList.owner_id == user_id)
        .group_by(Task.status)
        .all()
    )

    # Po prioritetu
    priority_counts = dict(
        db.query(Task.priority, func.count(Task.id))
        .join(ToDoList)
        .filter(ToDoList.owner_id == user_id)
        .group_by(Task.priority)
        .all()
    )

    # Overdue tasks (nije "done" i rok je prošao)
    overdue_count = db.query(func.count(Task.id)).join(ToDoList).filter(
        ToDoList.owner_id == user_id,
        Task.due_date < now,
        Task.status != "done"
    ).scalar()

    return {
        "by_status": status_counts,
        "by_priority": priority_counts,
        "overdue": overdue_count
    }


def archive_task(db: Session, task_id: int, user_id: int):
    task = db.query(Task).join(ToDoList).filter(
        Task.id == task_id,
        ToDoList.owner_id == user_id
    ).first()
    if task:
        task.archived = not task.archived  # 👈 promeni vrednost
        db.commit()
        db.refresh(task)
    return task

