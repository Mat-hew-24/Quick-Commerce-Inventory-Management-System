from fastapi import APIRouter, Depends
from db import supabase
from models import Inventory
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_inventory(inventory: Inventory, current_user=Depends(get_current_user)):
    res = supabase.table("inventory").insert(inventory.dict()).execute()
    log(current_user["email"], f"INSERTED inventory record")
    return res


@router.get("/")
def get_inventory():
    return supabase.table("inventory").select("*").execute()


@router.delete("/{id}")
def delete_inventory(id: int, current_user=Depends(get_current_user)):
    res = supabase.table("inventory").delete().eq("inventory_id", id).execute()
    log(current_user["email"], f"DELETED inventory id={id}")
    return res


@router.put("/{id}")
def update_inventory(
    id: int, inventory: Inventory, current_user=Depends(get_current_user)
):
    res = (
        supabase.table("inventory")
        .update(inventory.dict())
        .eq("inventory_id", id)
        .execute()
    )
    log(current_user["email"], f"UPDATED inventory id={id}")
    return res
