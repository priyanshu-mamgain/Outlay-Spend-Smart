from datetime import date

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import SessionLocal
from models import ExpenseDB


app = FastAPI(title="Outlay API")


FRONTEND_URL = "https://outlay-spend-smart.netlify.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def serialize_expense(expense):
    return {
        "id": int(expense.id),
        "user_id": str(expense.user_id),
        "title": expense.title,
        "amount": float(expense.amount),
        "category": expense.category,
        "date": expense.date.isoformat(),
    }


@app.get("/")
def root():
    return {"message": "Outlay API is running"}


@app.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    expenses = (
        db.query(ExpenseDB)
        .filter(ExpenseDB.user_id == user_id)
        .all()
    )

    return [serialize_expense(expense) for expense in expenses]


@app.post("/expenses", status_code=201)
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    new_expense = ExpenseDB(
        user_id=user_id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return serialize_expense(new_expense)


@app.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    existing_expense = (
        db.query(ExpenseDB)
        .filter(
            ExpenseDB.id == expense_id,
            ExpenseDB.user_id == user_id,
        )
        .first()
    )

    if not existing_expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    existing_expense.title = expense.title
    existing_expense.amount = expense.amount
    existing_expense.category = expense.category
    existing_expense.date = expense.date

    db.commit()
    db.refresh(existing_expense)

    return serialize_expense(existing_expense)


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    existing_expense = (
        db.query(ExpenseDB)
        .filter(
            ExpenseDB.id == expense_id,
            ExpenseDB.user_id == user_id,
        )
        .first()
    )

    if not existing_expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    db.delete(existing_expense)
    db.commit()

    return {"message": "Expense deleted successfully"}