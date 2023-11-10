import os

import dotenv

dotenv.load_dotenv()

PORT = os.getenv("port")
SQLALCHEMY_DATABASE_URI = os.getenv("sqlalchemy_database_uri")
SECRET_KEY = os.getenv("secret_key")
