from . import db


class Account(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    balance = db.Column(db.Numeric(10, 2))
    txns = db.relationship("Txn", backref="accounts", lazy="dynamic")

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)

    def create(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            balance=str(self.balance),
            txns=[i.to_dict() for i in self.txns],
        )


class Txn(db.Model):
    __tablename__ = "txns"

    id = db.Column(db.Integer, primary_key=True)
    merchant = db.Column(db.Text)
    amount = db.Column(db.Numeric(10, 2))
    timestamp = db.Column(db.Text)
    memo = db.Column(db.Text)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"))

    def __init__(self, **kwargs):
        super(Txn, self).__init__(**kwargs)

    def create(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return dict(
            id=self.id,
            merchant=self.merchant,
            amount=str(self.amount),
            timestamp=self.timestamp,
            memo=self.memo,
        )
