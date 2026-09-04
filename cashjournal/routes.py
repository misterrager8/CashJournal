from collections import defaultdict
import datetime
import decimal

import click
from flask import current_app, request, send_from_directory
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from cashjournal.models import (
    Account,
    Bill,
    Category,
    ShoppingListItem,
    Transaction,
    User,
)

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
            login_user(user_, remember=True)
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
        login_user(_, remember=True)
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

        new_account = Account(name=name, user=current_user.id)
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
            name=name,
            day_of_month=day_of_month,
            amount=amount,
            user=current_user.id,
            account=int(request.json.get("accountId")),
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
    accounts = []

    try:
        bills = [i.to_dict() for i in current_user.bills]
        accounts = [i.to_dict() for i in current_user.accounts]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "bills": bills,
        "accounts": accounts,
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
        bill.amount = float(request.json.get("amount"))
        bill.account = int(request.json.get("accountId"))

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
    budgets = []

    try:
        is_charge = -1 if request.json.get("isCharge") else 1
        amount = decimal.Decimal(request.json.get("amount")) * is_charge

        timestamp = datetime.datetime.now()
        type_ = request.json.get("type_")
        account = int(request.json.get("id"))

        merchant = request.json.get("merchant")
        history = [
            i
            for i in current_user.get_txns(month=datetime.date.today().month - 1)
            if i.merchant.casefold() == merchant.casefold()
        ]

        new_txn = Transaction(
            amount=amount,
            timestamp=timestamp,
            merchant=(
                history[0].merchant
                if len(history) > 0 and history[0].merchant
                else merchant
            ),
            account_id=account,
            user=current_user.id,
            category_id=(
                history[0].category_id
                if len(history) > 0 and history[0].category_id
                else None
            ),
            type_=type_,
            pending=request.json.get("pending"),
        )
        new_txn.create()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [i.to_dict() for i in current_user.get_txns()]

        for i in Category.all():
            budgets.append(
                {
                    "id": i.id,
                    "name": i.name,
                    "color": i.color,
                    "icon": i.icon,
                    "txns": [j.to_dict() for j in i.get_txns()],
                }
            )

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "txns": txns,
        "budgets": budgets,
    }


@current_app.post("/get_all_txns")
@login_required
def get_all_txns():
    success = True
    msg = ""

    txns = []

    try:
        txns = [i.to_dict() for i in current_user.txns]

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "txns": txns}


@current_app.post("/get_txns")
@login_required
def get_txns():
    success = True
    msg = ""

    txns = []
    budgets = []

    try:
        account_id = request.json.get("id")
        if account_id:
            txns = [
                i.to_dict()
                for i in Transaction.get_by_account(
                    account_id,
                    int(request.json.get("month")),
                    int(request.json.get("year")),
                )
            ]
        else:
            txns = [
                i.to_dict()
                for i in current_user.get_txns(
                    int(request.json.get("month")), int(request.json.get("year"))
                )
            ]

        # Sort transactions by timestamp
        txns.sort(key=lambda x: x["timestamp"], reverse=True)
        # budgets = [i.to_dict() for i in Category.all()]
        for i in Category.all():
            budgets.append(
                {
                    "id": i.id,
                    "name": i.name,
                    "color": i.color,
                    "icon": i.icon,
                    "maximum": i.maximum,
                    "txns": [
                        j.to_dict()
                        for j in i.get_txns(
                            int(request.json.get("month")),
                            int(request.json.get("year")),
                        )
                    ],
                }
            )

    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "txns": txns, "budgets": budgets}


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

        txn.merchant = request.json.get("merchant")
        txn.type_ = request.json.get("type_")
        txn.description = request.json.get("description")
        txn.amount = decimal.Decimal(request.json.get("amount"))
        txn.pending = request.json.get("pending")
        txn.timestamp = request.json.get("timestamp")

        click.secho(request.json.get("timestamp"), fg="blue")

        txn.edit()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [
            i.to_dict()
            for i in current_user.get_txns(
                int(request.json.get("month")), int(request.json.get("year"))
            )
        ]
        txn = txn.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "txns": txns,
        "txn": txn,
    }


@current_app.post("/search_txns")
@login_required
def search_txns():
    success = True
    msg = ""

    txns = []

    try:
        txns = [
            i.to_dict()
            for i in current_user.txns
            if request.json.get("search").lower() in i.merchant.lower()
        ]

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "txns": txns,
    }


@current_app.post("/switch_accounts")
@login_required
def switch_accounts():
    success = True
    msg = ""

    accounts = []
    txns = []
    txn = None

    try:
        txn = Transaction.get(request.json.get("id"))

        txn.account_id = int(request.json.get("newAccount"))
        txn.edit()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [
            i.to_dict()
            for i in current_user.get_txns(
                int(request.json.get("month")), int(request.json.get("year"))
            )
        ]
        txn = txn.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "txns": txns,
        "txn": txn,
    }


@current_app.post("/duplicate_txn")
@login_required
def duplicate_txn():
    success = True
    msg = ""

    accounts = []
    txns = []
    txn = None

    try:
        txn_ = Transaction.get(request.json.get("id"))
        txn = Transaction(
            amount=txn_.amount,
            timestamp=datetime.datetime.now(),
            description=txn_.description,
            merchant=txn_.merchant,
            memo=txn_.memo,
            account_id=txn_.account_id,
            user=current_user.id,
            category_id=txn_.category_id,
            type_=txn_.type_,
        )
        txn.create()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [
            i.to_dict()
            for i in current_user.get_txns(
                int(request.json.get("month")), int(request.json.get("year"))
            )
        ]
        txn = txn.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "accounts": accounts,
        "txns": txns,
        "txn": txn,
    }


@current_app.post("/unpend")
@login_required
def unpend():
    success = True
    msg = ""

    accounts = []
    txns = []

    try:
        txn_ = Transaction.get(request.json.get("id"))
        txn_.pending = False
        txn_.edit()

        accounts = [i.to_dict() for i in current_user.accounts]
        txns = [i.to_dict() for i in current_user.get_txns()]

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

        txns = [
            i.to_dict()
            for i in current_user.get_txns(
                int(request.json.get("month")), int(request.json.get("year"))
            )
        ]
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


@current_app.post("/add_budget")
@login_required
def add_budget():
    success = True
    msg = ""
    budgets = []
    budget = None

    try:
        budget = Category(
            name=request.json.get("name"), user=current_user.id, icon="uis:graph-bar"
        )
        budget.create()

        budget = budget.to_dict()
        for i in Category.all():
            budgets.append(
                {
                    "id": i.id,
                    "name": i.name,
                    "color": i.color,
                    "icon": i.icon,
                    "txns": [j.to_dict() for j in i.get_txns()],
                }
            )
    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "budgets": budgets, "budget": budget}


@current_app.post("/get_budgets")
@login_required
def get_budgets():
    success = True
    msg = ""
    budgets = []

    try:
        budgets = [i.to_dict() for i in current_user.budgets]
    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "budgets": budgets}


@current_app.post("/edit_budget")
@login_required
def edit_budget():
    success = True
    msg = ""
    budgets = []

    try:
        budget = Category.get(int(request.json.get("id")))
        budget.name = request.json.get("name")
        budget.color = request.json.get("color")
        budget.icon = request.json.get("icon")
        budget.maximum = (
            decimal.Decimal(request.json.get("maximum"))
            if request.json.get("maximum")
            else 0
        )
        click.secho(
            (
                decimal.Decimal(request.json.get("maximum"))
                if request.json.get("maximum")
                else 0
            ),
            fg="blue",
        )

        budget.edit()

        for i in Category.all():
            budgets.append(
                {
                    "id": i.id,
                    "name": i.name,
                    "color": i.color,
                    "icon": i.icon,
                    "txns": [j.to_dict() for j in i.get_txns()],
                }
            )
    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "budgets": budgets}


@current_app.post("/delete_budget")
@login_required
def delete_budget():
    success = True
    msg = ""
    budgets = []

    try:
        budget = Category.get(int(request.json.get("id")))
        budget.delete()

        for i in Category.all():
            budgets.append(
                {
                    "id": i.id,
                    "name": i.name,
                    "icon": i.icon,
                    "color": i.color,
                    "txns": [j.to_dict() for j in i.get_txns()],
                }
            )
    except Exception as e:
        success = False
        msg = str(e)
    return {"success": success, "msg": msg, "budgets": budgets}


@current_app.post("/switch_budget")
@login_required
def switch_budget():
    success = True
    msg = ""

    txns = []
    txn = None

    try:
        txn = Transaction.get(request.json.get("id"))

        txn.category_id = request.json.get("budgetId")
        txn.edit()

        txns = [
            i.to_dict()
            for i in current_user.get_txns(
                int(request.json.get("month")), int(request.json.get("year"))
            )
        ]
        txn = txn.to_dict()

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "txns": txns,
        "txn": txn,
    }


@current_app.post("/get_balance_at_point")
@login_required
def get_balance_at_point():
    success = True
    msg = ""

    account_balance = None
    net_balance = None

    try:
        txn = Transaction.get(request.json.get("id"))
        txns = [i for i in current_user.txns]

        account_balance = sum(
            [
                i.amount
                for i in txns
                if i.timestamp <= txn.timestamp and i.account_id == txn.account_id
            ]
        )
        net_balance = sum([i.amount for i in txns if i.timestamp <= txn.timestamp])

    except Exception as e:
        success = False
        msg = str(e)
    return {
        "success": success,
        "msg": msg,
        "account_balance": account_balance,
        "net_balance": net_balance,
    }
