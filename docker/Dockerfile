FROM python:3.11-slim

COPY runner.py /opt/runner.py
WORKDIR /app

# optional but recommended
ENV PYTHONUNBUFFERED=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python"]