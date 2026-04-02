from fastapi import APIRouter
from db import supabase
from models import Inventory

router = APIRouter()

# CREATE
@router.post("/")
def add_inventory(inventory: Inventory):
    return supabase.table("inventory").insert(inventory.dict()).execute()

# READ
@router.get("/")
def get_inventory():
    return supabase.table("inventory").select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_inventory(id: int):
    return supabase.table("inventory").delete().eq("inventory_id", id).execute()

@router.put("/{id}")
def update_inventory(id: int, inventory: Inventory):
    return supabase.table("inventory") \
        .update(inventory.dict()) \
        .eq("inventory_id", id) \
        .execute()