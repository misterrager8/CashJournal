from datetime import date, datetime

from sqlalchemy import Column, Integer, Text, Date, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship

from mintClone import db


class User(db.Model):
    __tablename__ = "users"

    full_name = Column(Text)
    email = Column(Text)
    username = Column(Text)
    password = Column(Text)
    date_joined = Column(Date, default=date.today())
    dob = Column(Date)
    accounts = relationship("Account", backref="user")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)


class Account(db.Model):
    __tablename__ = "accounts"

    balance = Column(Numeric)
    date_opened = Column(Date, default=date.today())
    name = Column(Text)
    type = Column(Text)
    owner = Column(Integer, ForeignKey("users.id"))
    txns = relationship("Transaction", backref="accounts")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)


class Transaction(db.Model):
    __tablename__ = "transactions"

    amount = Column(Numeric)
    recipient = Column(Text)
    account_used = Column(Integer, ForeignKey("accounts.id"))
    description = Column(Text)
    timestamp = Column(DateTime, default=datetime.now())
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)


db.create_all()
