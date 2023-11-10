from flask_login import UserMixin

from . import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)
    password = db.Column(db.Text)
    accounts = db.relationship("Account", backref="users", lazy="dynamic")

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    def signup(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "username": self.username,
            "id": self.id,
            "accounts": [i.to_dict() for i in self.accounts],
        }


class Account(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    balance = db.Column(db.Numeric(10, 2))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)

    def add(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {"name": self.name, "balance": self.balance, "id": self.id}
