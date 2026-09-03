from calendar import Calendar
import datetime

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
    budgets = db.relationship("Category", lazy="dynamic")

    def __init__(self, **kwargs):
        """Initialize a new user with the provided attributes."""
        super(User, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        """Return all users."""
        return User.query.all()

    @classmethod
    def get(cls, id):
        """Return a user by their ID."""
        return User.query.get(id)

    def get_txns(
        self, month=datetime.date.today().month, year=datetime.date.today().year
    ):
        """Return transactions for the given month and year."""
        return [
            i
            for i in self.txns
            if (i.timestamp.month == month and i.timestamp.year == year) or (i.pending)
        ]

    def create(self):
        """Create and persist the user."""
        db.session.add(self)
        db.session.commit()

    def edit(self):
        """Persist changes to the user."""
        db.session.commit()

    def delete(self):
        """Delete the user and all associated related records."""
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
        """Return the user as a dictionary."""
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
        """Initialize a new account with the provided attributes."""
        super(Account, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        """Return all accounts."""
        return Account.query.all()

    @classmethod
    def get(cls, id):
        """Return an account by its ID."""
        return Account.query.get(id)

    def create(self):
        """Create and persist the account."""
        db.session.add(self)
        db.session.commit()

    def edit(self):
        """Persist changes to the account."""
        db.session.commit()

    def delete(self):
        """Delete the account and its related transactions."""
        for i in self.transactions.all():
            db.session.delete(i)

        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        """Return the account as a dictionary."""
        txns = self.transactions.all()
        return {
            "id": self.id,
            "name": self.name,
            "balance": str(sum([i.amount for i in txns if not i.pending])),
            "balancePending": str(sum([i.amount for i in txns])),
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
    type_ = db.Column(db.Text)
    pending = db.Column(db.Boolean)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"))
    user = db.Column(db.Integer, db.ForeignKey("users.id"))
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))
    account = db.relationship("Account")
    category = db.relationship("Category")

    def __init__(self, **kwargs):
        """Initialize a new transaction with the provided attributes."""
        super(Transaction, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        """Return all transactions ordered by newest first."""
        return Transaction.query.order_by(desc(Transaction.timestamp)).all()

    @classmethod
    def get(cls, id):
        """Return a transaction by its ID."""
        return Transaction.query.get(id)

    @classmethod
    def get_by_account(cls, id, month, year):
        """Return account transactions for the given month and year."""
        return (
            Account.query.filter(Account.id == id)
            .filter(Account.timestamp.month == month)
            .filter(Account.timestamp.year == year)
        )
        # return [
        #     i
        #     for i in Account.get(id).transactions
        #     if i.timestamp.month == month and i.timestamp.year == year
        # ]

    def create(self):
        """Create and persist the transaction."""
        db.session.add(self)
        db.session.commit()

    def edit(self):
        """Persist changes to the transaction."""
        db.session.commit()

    def delete(self):
        """Delete the transaction."""
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        """Return the transaction as a dictionary."""
        return {
            "id": self.id,
            "amount": str(self.amount),
            "timestamp": (
                self.timestamp.strftime("%Y-%m-%d %H:%M") if self.timestamp else None
            ),
            "description": self.description,
            "merchant": self.merchant,
            "memo": self.memo,
            "type_": self.type_,
            "pending": self.pending,
            "accountId": self.account_id,
            "category": self.category.to_dict() if self.category else None,
            "accountName": self.account.name if self.account else None,
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
        """Initialize a new bill with the provided attributes."""
        super(Bill, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        """Return all bills sorted by day of month."""
        return sorted(Bill.query.all(), key=lambda x: x.day_of_month)

    @classmethod
    def get_calendar(cls, month, year, user_id):
        """Return a calendar-style list of days with bills for the selected month."""
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
        """Return a bill by its ID."""
        return Bill.query.get(id)

    def create(self):
        """Create and persist the bill."""
        db.session.add(self)
        db.session.commit()

    def edit(self):
        """Persist changes to the bill."""
        db.session.commit()

    def delete(self):
        """Delete the bill."""
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        """Return the bill as a dictionary."""
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
        """Initialize a new shopping list item with the provided attributes."""
        super(ShoppingListItem, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        """Return all shopping list items."""
        return ShoppingListItem.query.order_by(ShoppingListItem.bought).all()

    @classmethod
    def get(cls, id):
        """Return a shopping list item by its ID."""
        return ShoppingListItem.query.get(id)

    def create(self):
        """Create and persist the shopping list item."""
        db.session.add(self)
        db.session.commit()

    def edit(self):
        """Persist changes to the shopping list item."""
        db.session.commit()

    def toggle_bought(self):
        """Toggle the bought state of the shopping list item and persist it."""
        self.bought = not self.bought
        db.session.commit()

    def delete(self):
        """Delete the shopping list item."""
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        """Return the shopping list item as a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "estimate": str(self.estimate),
            "date_added": self.date_added.isoformat() if self.date_added else None,
            "bought": self.bought,
        }


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    color = db.Column(db.Text)
    icon = db.Column(db.Text)
    maximum = db.Column(db.Numeric(10, 2))
    txns = db.relationship("Transaction", lazy="dynamic")
    user = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, **kwargs):
        """Initialize a new category with the provided attributes."""
        super(Category, self).__init__(**kwargs)

    @classmethod
    def all(cls):
        """Return all categories."""
        return Category.query.all()

    @classmethod
    def get(cls, id):
        """Return a category by its ID."""
        return Category.query.get(id)

    def get_txns(
        self, month=datetime.date.today().month, year=datetime.date.today().year
    ):
        """Return transactions for the given month and year."""
        return [
            i
            for i in self.txns
            if i.timestamp.month == month and i.timestamp.year == year
        ]

    def create(self):
        """Create and persist the category."""
        db.session.add(self)
        db.session.commit()

    def edit(self):
        """Persist changes to the category."""
        db.session.commit()

    def delete(self):
        """Delete the category and unlink its transactions."""
        for i in self.txns.all():
            i.category = None
            i.edit()

        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        """Return the category as a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "maximum": str(self.maximum),
            "color": self.color,
            "icon": self.icon,
            # "transactions": sorted(
            #     [t.to_dict() for t in self.txns.all()],
            #     key=lambda x: x["timestamp"],
            #     reverse=True,
            # ),
        }
