from fastapi import APIRouter, Depends, HTTPException
from db import supabase
from models import RestockRequest
from routes.auth import get_current_user
from logger import log

router = APIRouter()
RESTOCK_TABLE_CANDIDATES = ("RestockRequest", "restockrequest", "restock")


def get_restock_table_name() -> str:
    errors = []
    for table_name in RESTOCK_TABLE_CANDIDATES:
        try:
            supabase.table(table_name).select("*").limit(1).execute()
            return table_name
        except Exception as exc:
            errors.append(f"{table_name}: {exc}")
    raise HTTPException(
        status_code=500,
        detail="Unable to resolve restock table. Tried: " + " | ".join(errors),
    )


@router.post("/")
def add_restock(restock: RestockRequest, current_user=Depends(get_current_user)):
    res = supabase.table(get_restock_table_name()).insert(restock.dict()).execute()
    log(current_user["email"], f"INSERTED restock request")
    return res


@router.get("/")
def get_restocks():
    return supabase.table(get_restock_table_name()).select("*").execute()


@router.delete("/{id}")
def delete_restock(id: int, current_user=Depends(get_current_user)):
    res = (
        supabase.table(get_restock_table_name()).delete().eq("restock_id", id).execute()
    )
    log(current_user["email"], f"DELETED restock id={id}")
    return res


@router.put("/{id}")
def update_restock(
    id: int, restock: RestockRequest, current_user=Depends(get_current_user)
):
    res = (
        supabase.table(get_restock_table_name())
        .update(restock.dict())
        .eq("restock_id", id)
        .execute()
    )
    log(current_user["email"], f"UPDATED restock id={id}")
    return res
