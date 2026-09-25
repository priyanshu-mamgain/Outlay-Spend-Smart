from sqlalchemy import BigInteger, Column, Date, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ExpenseDB(Base):
    __tablename__ = "expenses"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, nullable=False)