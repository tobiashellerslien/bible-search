import os
from pathlib import Path

from flask import Flask

from .config import config
from .routes import bp
from .services.bible import BibleData


BASE_DIR = Path(__file__).resolve().parent.parent


def create_app():
    env = os.environ.get("FLASK_ENV", "default")
    app = Flask(
        __name__,
        template_folder=str(BASE_DIR / "templates"),
        static_folder=str(BASE_DIR / "static"),
    )
    app.config.from_object(config[env])

    bible_data = BibleData()
    if not bible_data.translations:
        print("Error: No Bible versions found. Make sure bible.db exists and contains data.")
        print("Run: python migrate_to_db.py")

    app.config["BIBLE_DATA"] = bible_data
    app.register_blueprint(bp)
    return app
