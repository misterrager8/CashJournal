from datetime import date, datetime

from flask import Blueprint, render_template, request, url_for
from flask_login import current_user, login_required
from werkzeug.utils import redirect

from CashJournal import db
from CashJournal.models import Account

accounts_ = Blueprint("accounts_", __name__)


@accounts_.route("/account_create", methods=["POST"])
@login_required
def account_create():
    _ = Account(
        name=request.form["name"],
        balance=float(request.form["balance"]),
        type=request.form["type"],
        date_added=date.today(),
        owner=current_user.id,
    )

    db.session.add(_)
    db.session.commit()
    return redirect(request.referrer)


@accounts_.route("/account")
@login_required
def account():
    _ = Account.query.get(int(request.args.get("id_")))
    return render_template("account.html", account_=_)


@accounts_.route("/account_update", methods=["POST"])
@login_required
def account_update():
    account_ = Account.query.get(int(request.form["id_"]))
    account_.name = request.form["name"]
    account_.balance = float(request.form["balance"])
    account_.type = request.form["type"]

    db.session.commit()
    return redirect(request.referrer)


@accounts_.route("/account_delete")
@login_required
def account_delete():
    _ = Account.query.get(int(request.args.get("id_")))

    for i in _.txns:
        db.session.delete(i)
    db.session.delete(_)
    db.session.commit()
    return redirect(url_for("index"))


@accounts_.route("/account_toggle")
@login_required
def account_toggle():
    _ = Account.query.get(int(request.args.get("id_")))

    _.hidden = not _.hidden
    db.session.commit()
    return redirect(url_for("index"))


@accounts_.route("/account_export")
@login_required
def account_export():
    return "\n".join(
        [
            "%s,%s,%s,%s" % (i.balance, i.date_added, i.name, i.type)
            for i in current_user.accounts
        ]
    )
