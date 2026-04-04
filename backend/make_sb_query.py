from passlib.context import CryptContext
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

email = input("Email: ")
password = input("Password: ")
role = input("Role: ")

hashed = pwd_context.hash(password)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
res = (
    supabase.table("users")
    .insert({"email": email, "hashed_password": hashed, "role": role})
    .execute()
)
print(res)
