from fastapi import FastAPI, Depends, HTTPException
from .database import Base, engine
from . import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Napravi tabele
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "To-do API is live!"}

from . import auth
app.include_router(auth.router)

from fastapi import Depends
from . import crud, schemas, dependencies
from sqlalchemy.orm import Session
from typing import List

@app.post("/lists", response_model=schemas.ToDoListResponse)
def create_list(
    list_data: schemas.ToDoListCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return crud.create_list(db, list_data.name, current_user.id)

@app.get("/lists", response_model=List[schemas.ToDoListResponse])
def get_user_lists(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return crud.get_lists(db, current_user.id)

@app.delete("/lists/{list_id}", response_model=schemas.ToDoListResponse)
def delete_list(
    list_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    deleted = crud.delete_list(db, list_id, current_user.id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="List not found")
    return deleted

@app.post("/lists/{list_id}/tasks", response_model=schemas.TaskResponse)
def create_task(
    list_id: int,
    task_data: schemas.TaskCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    task = crud.create_task(db, task_data, list_id, current_user.id)
    if task is None:
        raise HTTPException(status_code=404, detail="List not found")
    return task

@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return db.query(models.Task).join(models.ToDoList).filter(
        models.ToDoList.owner_id == current_user.id,
        models.Task.archived == False
    ).all()

@app.patch("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task_status(
    task_id: int,
    status: str,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    task = crud.update_task_status(db, task_id, status, current_user.id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    updated_data: schemas.TaskCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    task = db.query(models.Task).join(models.ToDoList).filter(
        models.Task.id == task_id,
        models.ToDoList.owner_id == current_user.id
    ).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in updated_data.dict(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}", response_model=schemas.TaskResponse)
def delete_task(
    task_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    task = crud.delete_task(db, task_id, current_user.id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/lists/{list_id}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks_by_list(
    list_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return crud.get_tasks_by_list(db, list_id, current_user.id)

@app.get("/tasks/sorted", response_model=List[schemas.TaskResponse])
def get_sorted_tasks(
    sort_by: str = "due_date",
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return crud.get_sorted_tasks(db, current_user.id, sort_by)

@app.get("/tasks/search", response_model=List[schemas.TaskResponse])
def search_tasks(
    query: str,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return crud.search_tasks(db, current_user.id, query)

@app.get("/tasks/stats")
def get_task_stats(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return crud.get_task_stats(db, current_user.id)

@app.patch("/tasks/{task_id}/archive", response_model=schemas.TaskResponse)
def archive_task(
    task_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    task = crud.archive_task(db, task_id, current_user.id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.get("/tasks/archived", response_model=List[schemas.TaskResponse])
def get_archived_tasks(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return db.query(models.Task).join(models.ToDoList).filter(
        models.ToDoList.owner_id == current_user.id,
        models.Task.archived == True
    ).all()
