from fastapi import APIRouter
from db import supabase
from models import Warehouse

router = APIRouter()

# CREATE
@router.post("/")
def add_warehouse(warehouse: Warehouse):
    return supabase.table("warehouse").insert(warehouse.dict()).execute()

# READ
@router.get("/")
def get_warehouses():
    return supabase.table("warehouse").select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_warehouse(id: int):
    return supabase.table("warehouse").delete().eq("warehouse_id", id).execute()

@router.put("/{id}")
def update_warehouse(id: int, warehouse: Warehouse):
    return supabase.table("warehouse") \
        .update(warehouse.dict()) \
        .eq("warehouse_id", id) \
        .execute()