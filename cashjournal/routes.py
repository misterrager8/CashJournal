import datetime
import decimal

import click
from flask import current_app, request, send_from_directory
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from cashjournal.models import Account, Bill, ShoppingListItem, Transaction, User

from . import login_manager


@current_app.route("/")
def index():
    return send_from_directory(current_app.static_folder, "index.html")


@login_manager.user_loader
def load_user(id_: int):
    return User.get(id_)


@current_app.post("/login")
def login():
    success = True
    msg = ""

    user = None

    try:
        username = request.json.get("username")
        password = request.json.get("password")

        user_: User = User.query.filter_by(username=username).first()
        if user_ and check_password_hash(user_.password, password):
            login_user(user_)
            user = user_.to_dict()
        else:
            msg = "Wrong password"
            success = False

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "user": user,
    }


@current_app.post("/signup")
def signup():
    success = True
    msg = ""

    try:
        _ = User(
            username=request.json.get("username"),
            email=request.json.get("email"),
            password=generate_password_hash(request.json.get("password")),
        )

        _.create()
        login_user(_)
        user = _.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "user": user,
    }


@current_app.post("/logout")
def logout():
    success = True
    msg = ""

    try:
        logout_user()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/edit_user")
def edit_user():
    success = True
    msg = ""

    try:
        current_user.username = request.json.get("username")
        current_user.password = generate_password_hash(request.json.get("password"))
        current_user.email = request.json.get("email")

        current_user.edit()
        user = current_user.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "user": user,
    }


@current_app.post("/add_account")
@login_required
def add_account():
    success = True
    msg = ""

    accounts = []
    new_account = None

    try:
        name = request.json.get("name")
        balance = float(request.json.get("balance"))

        new_account = Account(name=name, balance=balance, user=current_user.id)
        new_account.create()

        new_account = new_account.to_dict()
        accounts = [i.to_dict() for i in current_user.accounts]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "new_account": new_account,
    }


@current_app.post("/get_accounts")
@login_required
def get_accounts():
    success = True
    msg = ""

    accounts = []

    try:
        accounts = [i.to_dict() for i in current_user.accounts]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
    }


@current_app.post("/edit_account")
@login_required
def edit_account():
    success = True
    msg = ""

    accounts = []
    account = None

    try:
        account = Account.get(request.json.get("id"))

        account.name = request.json.get("name")
        account.balance = float(request.json.get("balance"))

        account.edit()

        accounts = [i.to_dict() for i in current_user.accounts]
        account = account.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "account": account,
    }


@current_app.post("/delete_account")
@login_required
def delete_account():
    success = True
    msg = ""

    accounts = []
    account = None

    try:
        account = Account.get(request.json.get("id"))

        account.delete()

        accounts = [i.to_dict() for i in current_user.accounts]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
    }


@current_app.post("/add_bill")
@login_required
def add_bill():
    success = True
    msg = ""

    bills = []
    new_bill = None

    try:
        name = request.json.get("name")
        day_of_month = int(request.json.get("day_of_month"))
        amount = float(request.json.get("amount"))

        new_bill = Bill(
            name=name, day_of_month=day_of_month, amount=amount, user=current_user.id
        )
        new_bill.create()

        new_bill = new_bill.to_dict()
        bills = [i.to_dict() for i in current_user.bills]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "bills": bills,
        "new_bill": new_bill,
    }


@current_app.post("/get_bills")
@login_required
def get_bills():
    success = True
    msg = ""

    bills = []

    try:
        bills = [i.to_dict() for i in current_user.bills]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "bills": bills,
    }


@current_app.post("/edit_bill")
@login_required
def edit_bill():
    success = True
    msg = ""

    bills = []
    bill = None

    try:
        bill = Bill.get(request.json.get("id"))

        bill.name = request.json.get("name")
        bill.day_of_month = int(request.json.get("day_of_month"))
        bill.amount = int(request.json.get("amount"))

        bill.edit()

        bills = [i.to_dict() for i in current_user.bills]
        bill = bill.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "bills": bills,
        "bill": bill,
    }


@current_app.post("/delete_bill")
@login_required
def delete_bill():
    success = True
    msg = ""

    bills = []
    bill = None

    try:
        bill = Bill.get(request.json.get("id"))

        bill.delete()

        bills = [i.to_dict() for i in current_user.bills]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "bills": bills,
    }


@current_app.post("/get_calendar")
@login_required
def get_calendar():
    success = True
    msg = ""
    days_ = []

    try:
        days_ = Bill.get_calendar(
            int(request.json.get("month")),
            int(request.json.get("year")),
            current_user.id,
        )
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days_,
    }


@current_app.post("/add_txn")
@login_required
def add_txn():
    success = True
    msg = ""

    new_txn = None
    accounts = []
    txns = []

    try:
        is_charge = -1 if request.json.get("isCharge") else 1
        amount = decimal.Decimal(request.json.get("amount")) * is_charge

        timestamp = datetime.datetime.now()
        merchant = request.json.get("merchant")
        account = int(request.json.get("id"))

        new_txn = Transaction(
            amount=amount,
            timestamp=timestamp,
            merchant=merchant,
            account=account,
            user=current_user.id,
        )
        new_txn.create()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [i.to_dict() for i in current_user.txns]

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "accounts": accounts, "txns": txns}


@current_app.post("/get_txns")
@login_required
def get_txns():
    success = True
    msg = ""

    txns = []

    try:
        account_id = request.json.get("id")
        if account_id:
            txns = [i.to_dict() for i in Transaction.get_by_account(account_id)]
        else:
            txns = [i.to_dict() for i in current_user.txns]

        # Sort transactions by timestamp
        txns.sort(key=lambda x: x["timestamp"], reverse=True)

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "txns": txns}


@current_app.post("/edit_txn")
@login_required
def edit_txn():
    success = True
    msg = ""

    accounts = []
    txns = []
    txn = None

    try:
        txn = Transaction.get(request.json.get("id"))
        account = Account.get(txn.account)

        account.balance -= txn.amount

        txn.amount = float(request.json.get("amount"))
        txn.merchant = request.json.get("merchant")
        txn.timestamp = request.json.get("timestamp")

        txn.edit()

        account.balance += txn.amount

        account.edit()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [i.to_dict() for i in current_user.txns]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "txns": txns,
    }


@current_app.post("/delete_txn")
@login_required
def delete_txn():
    success = True
    msg = ""

    accounts = []
    txns = []
    txn = None

    try:
        txn = Transaction.get(request.json.get("id"))
        txn.delete()

        txns = [i.to_dict() for i in current_user.txns]
        accounts = [i.to_dict() for i in current_user.accounts]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "txns": txns,
        "accounts": accounts,
    }


@current_app.post("/add_shopping_item")
@login_required
def add_shopping_item():
    success = True
    msg = ""

    new_sli = None
    slis = []

    try:
        name = request.json.get("name")
        estimate = float(request.json.get("estimate"))

        new_sli = ShoppingListItem(
            name=name,
            estimate=estimate,
            date_added=datetime.datetime.now(),
            user=current_user.id,
        )
        new_sli.create()

        new_sli = new_sli.to_dict()
        slis = [i.to_dict() for i in current_user.shopping_list]

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "slis": slis}


@current_app.post("/get_shopping_list")
@login_required
def get_shopping_list():
    success = True
    msg = ""

    shopping_list = []

    try:
        shopping_list = [i.to_dict() for i in current_user.shopping_list]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "shoppingList": shopping_list,
    }


@current_app.post("/edit_shopping_item")
@login_required
def edit_shopping_item():
    success = True
    msg = ""

    shopping_list = []

    try:
        sli = ShoppingListItem.get(int(request.json.get("id")))

        sli.name = request.json.get("name")
        sli.estimate = float(request.json.get("estimate"))

        sli.edit()

        shopping_list = [i.to_dict() for i in current_user.shopping_list]

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "shoppingList": shopping_list}


@current_app.post("/toggle_bought")
@login_required
def toggle_bought():
    success = True
    msg = ""

    shopping_list = []

    try:
        sli = ShoppingListItem.get(int(request.json.get("id")))
        sli.toggle_bought()

        shopping_list = [i.to_dict() for i in current_user.shopping_list]

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "shoppingList": shopping_list}


@current_app.post("/delete_shopping_item")
@login_required
def delete_shopping_item():
    success = True
    msg = ""

    sli = None
    slis = []

    try:
        sli = ShoppingListItem.get(int(request.json.get("id")))
        sli.delete()

        slis = [i.to_dict() for i in current_user.shopping_list]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "shoppingList": slis,
    }
