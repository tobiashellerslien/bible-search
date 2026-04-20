from app import create_app
from app.config import config
import os

app = create_app()

if __name__ == "__main__":
    env = os.environ.get("FLASK_ENV", "default")
    cfg = config[env]
    app.run(host=cfg.HOST, port=cfg.PORT, debug=cfg.DEBUG)
