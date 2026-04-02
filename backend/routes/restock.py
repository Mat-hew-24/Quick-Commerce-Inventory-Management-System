from fastapi import APIRouter
from db import supabase
from models import RestockRequest

router = APIRouter()

# CREATE
@router.post("/")
def add_restock(restock: RestockRequest):
    return supabase.table("restock").insert(restock.dict()).execute()

# READ
@router.get("/")
def get_restocks():
    return supabase.table("restock").select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_restock(id: int):
    return supabase.table("restock").delete().eq("restock_id", id).execute()

@router.put("/{id}")
def update_restock(id: int, restock: RestockRequest):
    return supabase.table("restock") \
        .update(restock.dict()) \
        .eq("restock_id", id) \
        .execute()