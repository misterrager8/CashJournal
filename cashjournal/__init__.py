import pymysql
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

pymysql.install_as_MySQLdb()

app = Flask(__name__)
db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config):
    app.config.from_object(config)

    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        from . import routes

        db.create_all()

        return app
