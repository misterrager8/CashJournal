from datetime import date, datetime

from flask import render_template, current_app, url_for, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

from mintClone import login_manager
from mintClone.ctrla import Database
from mintClone.models import User, Account, Transaction

database = Database()


@login_manager.user_loader
def load_user(id_: int):
    return database.get(User, id_)


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/account_create", methods=["POST"])
@login_required
def account_create():
    _ = Account(
        name=request.form["name"],
        balance=float(request.form["balance"]),
        type=request.form["type"],
        date_added=date.today(),
        owner=current_user.id,
    )

    database.create(_)
    return redirect(request.referrer)


@current_app.route("/account")
@login_required
def account():
    _: Account = database.get(Account, request.args.get("id_"))
    return render_template("account.html", account=_)


@current_app.route("/account_update", methods=["POST"])
@login_required
def account_update():
    account_: Account = database.get(Account, int(request.form["id_"]))
    account_.name = request.form["name"]
    account_.balance = float(request.form["balance"])
    account_.type = request.form["type"]

    database.update()
    return redirect(request.referrer)


@current_app.route("/account_delete")
@login_required
def account_delete():
    _: Account = database.get(Account, int(request.args.get("id_")))

    for i in _.txns:
        database.delete(i)
    database.delete(_)
    return redirect(url_for("index"))


@current_app.route("/account_export")
@login_required
def account_export():
    return "\n".join(
        [
            "%s,%s,%s,%s" % (i.balance, i.date_added, i.name, i.type)
            for i in current_user.accounts
        ]
    )


@current_app.route("/txn_create", methods=["POST"])
@login_required
def txn_create():
    account_: Account = database.get(Account, int(request.form["id_"]))
    _ = Transaction(
        recipient=request.form["recipient"],
        amount=0 - float(request.form["amount"])
        if request.form["txn_type"] == "-"
        else float(request.form["amount"]),
        description=request.form["description"],
        timestamp=request.form["timestamp"],
        account_used=account_.id,
        user_id=current_user.id,
    )
    database.create(_)

    account_.balance += _.amount
    database.update()
    return redirect(request.referrer)


@current_app.route("/txn_delete")
@login_required
def txn_delete():
    _: Transaction = database.get(Transaction, int(request.args.get("id_")))
    account_: Account = database.get(Account, _.account_used)

    account_.balance -= _.amount
    database.update()
    database.delete(_)

    return redirect(request.referrer)


@current_app.route("/txn_export")
@login_required
def txn_export():
    return "\n".join(
        [
            "%s,%s,%s,%s,%s"
            % (i.amount, i.recipient, i.accounts.name, i.description, i.timestamp)
            for i in current_user.txns
        ]
    )


@current_app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]

    user = User.query.filter(User.email == email).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        return redirect(url_for("index"))
    else:
        return "Login failed."


@current_app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@current_app.route("/signup", methods=["POST"])
def signup():
    _ = User(
        first_name=request.form["first_name"],
        last_name=request.form["last_name"],
        email=request.form["email"],
        password=generate_password_hash(request.form["password"]),
        date_joined=date.today(),
        dob=datetime.strptime(request.form["dob"], "%Y-%m-%d").date(),
    )

    database.create(_)
    login_user(_)
    return redirect(url_for("index"))
