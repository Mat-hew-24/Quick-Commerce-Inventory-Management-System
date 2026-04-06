from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, field_validator
from supabase import create_client, Client
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from logger import log
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()


class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class Token(BaseModel):
    access_token: str
    token_type: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(email: str):
    try:
        res = supabase.table("users").select("*").eq("email", email).single().execute()
        return res.data
    except Exception:
        return None


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(email)
    if not user:
        raise credentials_exception
    return user


@router.post("/register", status_code=201)
def register(user: UserCreate):
    existing = get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    res = (
        supabase.table("users")
        .insert({"email": user.email, "hashed_password": hashed})
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return {"message": "User registered successfully"}


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        log(form_data.username, "FAILED LOGIN attempt")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(
        {"sub": str(user["id"]), "email": user["email"], "role": user["role"]}
    )
    log(user["email"], "LOGGED IN")
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {
        "email": current_user["email"],
        "id": current_user["id"],
        "role": current_user["role"],
    }
