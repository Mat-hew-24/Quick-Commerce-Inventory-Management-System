import logging
import os
from datetime import datetime

os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    filename="logs/activity.log",
    level=logging.INFO,
    format="%(asctime)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger("qcims")


def log(email: str, action: str):
    logger.info(f"{email} | {action}")
