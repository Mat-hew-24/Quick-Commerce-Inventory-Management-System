from fastapi import APIRouter, HTTPException
from db import supabase
from models import RestockRequest

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

# CREATE
@router.post("/")
def add_restock(restock: RestockRequest):
    return supabase.table(get_restock_table_name()).insert(restock.dict()).execute()

# READ
@router.get("/")
def get_restocks():
    return supabase.table(get_restock_table_name()).select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_restock(id: int):
    return (
        supabase.table(get_restock_table_name())
        .delete()
        .eq("restock_id", id)
        .execute()
    )

@router.put("/{id}")
def update_restock(id: int, restock: RestockRequest):
    return supabase.table(get_restock_table_name()) \
        .update(restock.dict()) \
        .eq("restock_id", id) \
        .execute()
