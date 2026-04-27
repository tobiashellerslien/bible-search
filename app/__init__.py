import os
from pathlib import Path

from flask import Flask, request

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

    # Force revalidation on JS/CSS so a redeploy isn't masked by a still-valid
    # browser HTTP cache entry. Flask still emits ETag/Last-Modified, so unchanged
    # files come back as 304 — cheap, and the SW gets fresh bytes when it precaches.
    @app.after_request
    def _no_cache_for_assets(response):
        path = (request.path or "")
        if path.startswith("/static/") and (path.endswith(".js") or path.endswith(".css")):
            response.headers["Cache-Control"] = "no-cache"
        return response

    return app
