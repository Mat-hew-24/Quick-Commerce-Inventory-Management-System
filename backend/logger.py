import logging
import os
from datetime import datetime

os.makedirs("logs", exist_ok=True)


class PrettyFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        now = datetime.fromtimestamp(record.created).strftime("%d %b %Y  %I:%M:%S %p")
        parts = record.getMessage().split(" | ", 1)
        if len(parts) == 2:
            email, action = parts
            return f"[{now}]  {email:<30} {action}"
        return f"[{now}]  {record.getMessage()}"


handler = logging.FileHandler("logs/activity.log", encoding="utf-8")
handler.setFormatter(PrettyFormatter())

logger = logging.getLogger("qcims")
logger.setLevel(logging.INFO)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger.addHandler(handler)


def log(email: str, action: str):
    logger.info(f"{email} | {action}")
