from datetime import date, datetime

from flask import current_app, render_template, request, url_for
from flask_login import current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

from CashJournal import db, login_manager
from CashJournal.models import User


@login_manager.user_loader
def load_user(id_: int):
    return User.query.get(id_)


@current_app.route("/")
def index():
    return render_template("index.html")


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

    db.session.add(_)
    db.session.commit()
    login_user(_)
    return redirect(url_for("index"))
