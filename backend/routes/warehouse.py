from fastapi import APIRouter
from fastapi import HTTPException
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
# @router.delete("/{id}")
# def delete_warehouse(id: int):
#     return supabase.table("warehouse").delete().eq("warehouse_id", id).execute()

@router.delete("/{id}")
@router.delete("/{id}")
def delete_warehouse(id: int):
    orders = supabase.table("Order").select("order_id").eq("warehouse_id", id).execute()
    for order in orders.data:
        supabase.table("orderitem").delete().eq("order_id", order["order_id"]).execute()

    supabase.table("Order").delete().eq("warehouse_id", id).execute()
    supabase.table("inventory").delete().eq("warehouse_id", id).execute()

    result = supabase.table("warehouse").delete().eq("warehouse_id", id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    return {"message": "Warehouse and associated records deleted successfully"}


@router.put("/{id}")
def update_warehouse(id: int, warehouse: Warehouse):
    return supabase.table("warehouse") \
        .update(warehouse.dict()) \
        .eq("warehouse_id", id) \
        .execute()