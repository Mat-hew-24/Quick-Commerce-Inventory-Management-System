import logging
import os
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler  # 1. Import the new handler

os.makedirs("logs", exist_ok=True)


class PrettyFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        now = datetime.fromtimestamp(record.created).strftime("%d %b %Y  %I:%M:%S %p")
        parts = record.getMessage().split(" | ", 1)
        if len(parts) == 2:
            email, action = parts
            return f"[{now}]  {email:<30} {action}"
        return f"[{now}]  {record.getMessage()}"


# 2. Swap FileHandler for TimedRotatingFileHandler
handler = TimedRotatingFileHandler(
    filename="logs/activity.log",
    when="midnight",  # Rotate the logs at midnight
    interval=1,  # Every 1 day
    backupCount=7,  # Keep exactly 7 backups (deletes older ones automatically)
    encoding="utf-8",
)
handler.setFormatter(PrettyFormatter())

logger = logging.getLogger("qcims")
logger.setLevel(logging.INFO)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger.addHandler(handler)


def log(email: str, action: str):
    logger.info(f"{email} | {action}")
