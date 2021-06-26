from flask import render_template, redirect, url_for, request

from mintClone import app, db
from mintClone.models import User, Account, Transaction


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def login():
    # username = request.form["username"]
    # password = request.form["password"]

    return redirect(url_for("index"))


@app.route("/user_add", methods=["POST"])
def user_add():
    db.session.add(User(full_name=request.form["full_name"],
                        email=request.form["email"],
                        username=request.form["username"],
                        password=request.form["password"],
                        dob=request.form["dob"]))
    db.session.commit()

    return redirect(url_for("index"))


@app.route("/user_edit", methods=["POST"])
def user_edit():
    id_: int = request.args.get("id_")
    user_: User = db.session.query(User).get(id_)

    user_.full_name = request.form["full_name"]
    user_.email = request.form["email"]
    user_.username = request.form["username"]
    user_.password = request.form["password"]
    user_.date_joined = request.form["date_joined"]
    user_.dob = request.form["dob"]

    db.session.commit()

    return redirect(url_for("index"))


@app.route("/account_add", methods=["POST"])
def account_add():
    id_: int = request.args.get("id_")
    user_: User = db.session.query(User).get(id_)

    db.session.add(Account(balance=request.form["balance"],
                           date_opened=request.form["date_opened"],
                           name=request.form["name"],
                           type=request.form["type"],
                           owner=user_.id))
    db.session.commit()

    return redirect(url_for("index"))


@app.route("/account_edit", methods=["POST"])
def account_edit():
    id_: int = request.args.get("id_")
    account_: Account = db.session.query(Account).get(id_)

    account_.balance = request.form["balance"]
    account_.date_opened = request.form["date_opened"]
    account_.name = request.form["name"]
    account_.type = request.form["type"]

    db.session.commit()

    return redirect(url_for("index"))


@app.route("/txn_add", methods=["POST"])
def txn_add():
    id_: int = request.args.get("id_")
    account_: Account = db.session.query(Account).get(id_)

    db.session.add(Transaction(amount=request.form["amount"],
                               recipient=request.form["recipient"],
                               description=request.form["description"],
                               timestamp=request.form["timestamp"],
                               account_used=account_.id))
    db.session.commit()

    return redirect(url_for("index"))


@app.route("/txn_edit", methods=["POST"])
def txn_edit():
    id_: int = request.args.get("id_")
    txn_: Transaction = db.session.query(Transaction).get(id_)

    txn_.amount = request.form["amount"]
    txn_.recipient = request.form["recipient"]
    txn_.account_used = request.form["account_used"]
    txn_.description = request.form["description"]
    txn_.timestamp = request.form["timestamp"]

    db.session.commit()

    return redirect(url_for("index"))
