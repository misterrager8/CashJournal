from flask_login import UserMixin
from sqlalchemy import Column, Integer, Text, Date, ForeignKey, Numeric, DateTime, text
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

    def get_accounts(self, order_by: str = "date_added desc"):
        return self.accounts.order_by(text("hidden"), text(order_by))

    def get_txns(self, order_by: str = "timestamp desc"):
        return self.txns.order_by(text(order_by))


class Account(db.Model):
    __tablename__ = "accounts"

    balance = Column(Numeric(10, 2))
    date_added = Column(Date)
    name = Column(Text)
    hidden = Column(db.Boolean, default=False)
    type = Column(Text)
    owner = Column(Integer, ForeignKey("users.id"))
    txns = relationship("Transaction", backref="accounts", lazy="dynamic")
    id = Column(Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)

    def get_txns(self, order_by: str = "timestamp desc"):
        return self.txns.order_by(text(order_by))


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
