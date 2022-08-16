from flask import Blueprint, request
from flask_login import current_user, login_required
from werkzeug.utils import redirect

from mintClone import db
from mintClone.models import Account, Transaction

txns = Blueprint("txns", __name__)


@txns.route("/txn_create", methods=["POST"])
@login_required
def txn_create():
    account_ = Account.query.get(int(request.form["id_"]))
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
    db.session.add(_)
    db.session.commit()

    account_.balance += _.amount
    db.session.commit()
    return redirect(request.referrer)


@txns.route("/txn_delete")
@login_required
def txn_delete():
    _ = Transaction.query.get(int(request.args.get("id_")))
    account_ = Account.query.get(_.account_used)

    account_.balance -= _.amount
    db.session.commit()

    db.session.delete(_)
    db.session.commit()

    return redirect(request.referrer)


@txns.route("/txn_export")
@login_required
def txn_export():
    return "\n".join(
        [
            "%s,%s,%s,%s,%s"
            % (i.amount, i.recipient, i.accounts.name, i.description, i.timestamp)
            for i in current_user.txns
        ]
    )
