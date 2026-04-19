FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY bible_versions/ ./bible_versions/
COPY app/ ./app/
COPY templates/ ./templates/
COPY static/ ./static/
COPY main.py ./

ENV HOST=0.0.0.0
ENV PORT=8421

EXPOSE 8421

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8421} --workers ${WEB_CONCURRENCY:-2} --threads ${GUNICORN_THREADS:-2} --timeout ${GUNICORN_TIMEOUT:-120} --preload main:app"]
