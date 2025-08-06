from calendar import Calendar

from flask_login import UserMixin
from sqlalchemy import desc

from . import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)
    password = db.Column(db.Text)
    email = db.Column(db.Text)
    accounts = db.relationship("Account", lazy="dynamic")
    txns = db.relationship(
        "Transaction", lazy="dynamic", order_by="desc(Transaction.timestamp)"
    )
    bills = db.relationship("Bill", lazy="dynamic", order_by="Bill.day_of_month")
    shopping_list = db.relationship(
        "ShoppingListItem", lazy="dynamic", order_by="ShoppingListItem.bought"
    )

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        return User.query.all()

    @classmethod
    def get(cls, id):
        return User.query.get(id)

    def create(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        for i in self.accounts.all():
            db.session.delete(i)
        for i in self.txns.all():
            db.session.delete(i)
        for i in self.bills.all():
            db.session.delete(i)
        for i in self.shopping_list.all():
            db.session.delete(i)

        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }


class Account(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    balance = db.Column(db.Numeric(10, 2))
    transactions = db.relationship(
        "Transaction", lazy="dynamic", order_by="desc(Transaction.timestamp)"
    )
    bills = db.relationship("Bill", lazy="dynamic")
    user = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        return Account.query.all()

    @classmethod
    def get(cls, id):
        return Account.query.get(id)

    def create(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        for i in self.transactions.all():
            db.session.delete(i)

        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "balance": str(self.balance),
            "transactions": sorted(
                [t.to_dict() for t in self.transactions.all()],
                key=lambda x: x["timestamp"],
                reverse=True,
            ),
        }


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(10, 2))
    timestamp = db.Column(db.DateTime)
    description = db.Column(db.Text)
    merchant = db.Column(db.Text)
    memo = db.Column(db.Text)
    account = db.Column(db.Integer, db.ForeignKey("accounts.id"))
    user = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        return Transaction.query.order_by(desc(Transaction.timestamp)).all()

    @classmethod
    def get(cls, id):
        return Transaction.query.get(id)

    @classmethod
    def get_by_account(cls, id):
        return [i for i in Account.get(id).transactions]

    def create(self):
        account_ = Account.get(self.account)
        account_.balance += self.amount

        account_.edit()

        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        account_ = Account.get(self.account)
        account_.balance -= self.amount

        account_.edit()

        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "amount": str(self.amount),
            "timestamp": (
                self.timestamp.strftime("%Y-%m-%d %H:%M") if self.timestamp else None
            ),
            "description": self.description,
            "merchant": self.merchant,
            "memo": self.memo,
            "accountId": self.account,
            "accountName": Account.get(self.account).name,
        }


class Bill(db.Model):
    __tablename__ = "bills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    day_of_month = db.Column(db.Integer)
    amount = db.Column(db.Numeric(10, 2))
    user = db.Column(db.Integer, db.ForeignKey("users.id"))
    account = db.Column(db.Integer, db.ForeignKey("accounts.id"))

    def __init__(self, **kwargs):
        super(Bill, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        return sorted(Bill.query.all(), key=lambda x: x.day_of_month)

    @classmethod
    def get_calendar(cls, month, year, user_id):
        days_ = []

        for i in Calendar(6).itermonthdates(year, month):
            if i.month == month:
                bills_ = []
                for j in Bill.all():
                    if j.day_of_month == i.day and j.user == user_id:
                        bills_.append(j.to_dict())

                days_.append(
                    {
                        "id": i.strftime("%y%m%d"),
                        "year": i.year,
                        "month": i.month,
                        "day": i.day,
                        "monthLabel": i.strftime("%B %Y"),
                        "weekdayInt": i.weekday(),
                        "label": i.strftime("%B %-d, %Y"),
                        "bills": bills_,
                    }
                )

        return days_

    @classmethod
    def get(cls, id):
        return Bill.query.get(id)

    def create(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "accountName": Account.get(self.account).name if self.account else "",
            "accountId": self.account,
            "name": self.name,
            "day_of_month": str(self.day_of_month),
            "amount": str(self.amount),
        }


class ShoppingListItem(db.Model):
    __tablename__ = "shopping_list_items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    estimate = db.Column(db.Numeric(10, 2))
    date_added = db.Column(db.DateTime)
    bought = db.Column(db.Boolean, default=False)
    user = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, **kwargs):
        super(ShoppingListItem, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        return ShoppingListItem.query.order_by(ShoppingListItem.bought).all()

    @classmethod
    def get(cls, id):
        return ShoppingListItem.query.get(id)

    def create(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def toggle_bought(self):
        self.bought = not self.bought
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "estimate": str(self.estimate),
            "date_added": self.date_added.isoformat() if self.date_added else None,
            "bought": self.bought,
        }
