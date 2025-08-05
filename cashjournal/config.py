import os
import pathlib

import click
import dotenv

dotenv.load_dotenv()
SQLALCHEMY_DATABASE_URI = os.getenv("db")
PORT = os.getenv("port") or "3939"
SECRET_KEY = os.getenv("secret_key")
