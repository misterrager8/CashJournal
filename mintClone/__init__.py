import os

import dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

dotenv.load_dotenv()

db_host = os.getenv("host")
db_user = os.getenv("user")
db_pass = os.getenv("passwd")
db_name = os.getenv("db")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{db_user}:{db_pass}@{db_host}/{db_name}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100, 'pool_recycle': 280}

db = SQLAlchemy(app)
