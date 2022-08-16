from flask_login import UserMixin

from mintClone import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    first_name = db.Column(db.Text)
    last_name = db.Column(db.Text)
    email = db.Column(db.Text)
    password = db.Column(db.Text)
    date_joined = db.Column(db.Date)
    dob = db.Column(db.Date)
    accounts = db.relationship("Account", backref="users", lazy="dynamic")
    txns = db.relationship("Transaction", backref="users", lazy="dynamic")
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    def get_accounts(self, order_by: str = "date_added desc"):
        return self.accounts.order_by(db.text("hidden"), db.text(order_by))

    def get_txns(self, order_by: str = "timestamp desc"):
        return self.txns.order_by(db.text(order_by))


class Account(db.Model):
    __tablename__ = "accounts"

    balance = db.Column(db.Numeric(10, 2))
    date_added = db.Column(db.Date)
    name = db.Column(db.Text)
    hidden = db.Column(db.Boolean, default=False)
    type = db.Column(db.Text)
    owner = db.Column(db.Integer, db.ForeignKey("users.id"))
    txns = db.relationship("Transaction", backref="accounts", lazy="dynamic")
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)

    def get_txns(self, order_by: str = "timestamp desc"):
        return self.txns.order_by(db.text(order_by))


class Transaction(db.Model):
    __tablename__ = "transactions"

    amount = db.Column(db.Numeric(10, 2))
    recipient = db.Column(db.Text)
    account_used = db.Column(db.Integer, db.ForeignKey("accounts.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    description = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)
