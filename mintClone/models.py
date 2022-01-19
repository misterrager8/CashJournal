from flask_login import UserMixin
from sqlalchemy import Column, Integer, Text, Date, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship

from mintClone import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    first_name = Column(Text)
    last_name = Column(Text)
    email = Column(Text)
    password = Column(Text)
    date_joined = Column(Date)
    dob = Column(Date)
    accounts = relationship("Account", backref="users", lazy="dynamic")
    txns = relationship("Transaction", backref="users", lazy="dynamic")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)


class Account(db.Model):
    __tablename__ = "accounts"

    balance = Column(Numeric(10, 2))
    date_added = Column(Date)
    name = Column(Text)
    type = Column(Text)
    owner = Column(Integer, ForeignKey("users.id"))
    txns = relationship("Transaction", backref="accounts", lazy="subquery")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)


class Transaction(db.Model):
    __tablename__ = "transactions"

    amount = Column(Numeric(10, 2))
    recipient = Column(Text)
    account_used = Column(Integer, ForeignKey("accounts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(Text)
    timestamp = Column(DateTime)
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)
