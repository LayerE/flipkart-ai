FROM python:3.10-alpine
RUN pip install --upgrade pip

WORKDIR /app
COPY requirements.txt /app
RUN pip install --upgrade -r requirements.txt

COPY copilot.py /app

CMD ["celery", "-A", "copilot", "worker", "--loglevel=info", "--concurrency=10", "--without-gossip", "--without-mingle", "--without-heartbeat"]


# docker stop ad && docker rm ad && docker build -t celeryworkerapi . && docker run -d --restart always --env-file <(doppler secrets download --no-file --format docker) celeryworkerapi