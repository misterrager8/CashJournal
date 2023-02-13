from flask import current_app, render_template, request

from .models import Account, Txn


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.get("/get_accounts")
def get_accounts():
    return dict(accounts=[i.to_dict() for i in Account.query.all()])


@current_app.post("/create_account")
def create_account():
    acccount_ = Account(name=request.form.get("name"), balance=float(0.00))
    acccount_.create()

    return ""


@current_app.get("/get_account")
def get_account():
    acccount_ = Account.query.get(int(request.args.get("id")))

    return acccount_.to_dict()


@current_app.post("/edit_account")
def edit_account():
    acccount_ = Account.query.get(int(request.form.get("id")))
    acccount_.balance = float(request.form.get("balance"))
    acccount_.name = request.form.get("name")
    acccount_.edit()

    return ""


@current_app.get("/delete_account")
def delete_account():
    acccount_ = Account.query.get(int(request.args.get("id")))
    acccount_.delete()

    return ""


@current_app.get("/get_txns")
def get_txns():
    return dict(txns=[i.to_dict() for i in Txn.query.all()])


@current_app.post("/create_txn")
def create_txn():
    txn_ = Txn(
        merchant=request.form.get("merchant"),
        amount=float(request.form.get("amount")),
        timestamp=request.form.get("timestamp"),
        memo=request.form.get("memo"),
        account_id=int(request.form.get("account_id")),
    )
    txn_.create()

    acccount_ = Account.query.get(int(request.form.get("account_id")))
    acccount_.balance += txn_.amount
    acccount_.edit()

    return ""


@current_app.post("/edit_txn")
def edit_txn():
    txn_ = Txn.query.get(int(request.form.get("id")))
    txn_.name = request.form.get("name")
    txn_.edit()

    return ""


@current_app.get("/delete_txn")
def delete_txn():
    txn_ = Txn.query.get(int(request.args.get("id")))
    acccount_ = Account.query.get(txn_.account_id)

    acccount_.balance -= txn_.amount
    acccount_.edit()
    txn_.delete()

    return ""
