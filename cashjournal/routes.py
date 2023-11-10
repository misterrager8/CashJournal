import decimal

from flask import current_app, render_template, request
from flask_login import current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from . import login_manager
from .models import Account, User


@login_manager.user_loader
def load_user(id):
    return User.query.get(id)


@current_app.get("/")
def index():
    return render_template("index.html")


@current_app.post("/get_user")
def get_user():
    return {"user": current_user.to_dict()}


@current_app.post("/login")
def login():
    try:
        username = request.json.get("username")
        password = request.json.get("password")

        user_ = User.query.filter(User.username == username).first()
        if user_ and check_password_hash(user_.password, password):
            login_user(user_)
            return {"user": user_.to_dict()}, 200
        else:
            return {"msg": "Invalid username or password"}, 400
    except Exception as e:
        return {"msg": str(e)}, 500


@current_app.post("/logout")
def logout():
    logout_user()
    return {}, 200


@current_app.post("/signup")
def signup():
    try:
        username = request.json.get("username")
        password = request.json.get("password")
        confirm = request.json.get("confirm")

        if password == confirm:
            user_ = User(username=username, password=generate_password_hash(password))
            user_.signup()
            login_user(user_)

            return {"user": user_.to_dict()}, 200
        else:
            return {"msg": "Passwords not matching; Try again"}, 400
    except Exception as e:
        return {"msg": str(e)}, 500


@current_app.post("/add_account")
def add_account():
    try:
        name = request.json.get("name")
        balance = float(request.json.get("balance"))

        account_ = Account(name=name, balance=balance, user_id=current_user.id)
        account_.add()

        return {"account": account_.to_dict()}, 200
    except:
        return {"msg": "Error"}, 400


@current_app.post("/edit_account")
def edit_account():
    try:
        account_ = Account.query.get(int(request.json.get("id")))
        account_.name = request.json.get("name")
        account_.balance = float(request.json.get("balance"))

        account_.edit()

        return {}, 200
    except:
        return {"msg": "Error"}, 400


@current_app.post("/calculate_account")
def calculate_account():
    try:
        account_ = Account.query.get(int(request.json.get("id")))
        account_.balance += decimal.Decimal(request.json.get("amount"))

        account_.edit()

        return {}, 200
    except Exception as e:
        return {"msg": str(e)}, 400


@current_app.post("/delete_account")
def delete_account():
    try:
        account_ = Account.query.get(int(request.json.get("id")))
        account_.delete()

        return {}, 200
    except:
        return {"msg": "Error"}, 400
