from fastapi import APIRouter, Depends
from db import supabase
from models import Warehouse
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_warehouse(warehouse: Warehouse, current_user=Depends(get_current_user)):
    res = supabase.table("warehouse").insert(warehouse.dict()).execute()
    log(current_user["email"], f"INSERTED warehouse '{warehouse.name}'")
    return res


@router.get("/")
def get_warehouses():
    return supabase.table("warehouse").select("*").execute()


@router.delete("/{id}")
def delete_warehouse(id: int, current_user=Depends(get_current_user)):
    res = supabase.table("warehouse").delete().eq("warehouse_id", id).execute()
    log(current_user["email"], f"DELETED warehouse id={id}")
    return res


@router.put("/{id}")
def update_warehouse(
    id: int, warehouse: Warehouse, current_user=Depends(get_current_user)
):
    res = (
        supabase.table("warehouse")
        .update(warehouse.dict())
        .eq("warehouse_id", id)
        .execute()
    )
    log(current_user["email"], f"UPDATED warehouse id={id}")
    return res
