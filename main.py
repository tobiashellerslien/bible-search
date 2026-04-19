import os

from app import create_app

PORT = int(os.environ.get("PORT", 8421))
HOST = os.environ.get("HOST", "0.0.0.0")

app = create_app()


if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
