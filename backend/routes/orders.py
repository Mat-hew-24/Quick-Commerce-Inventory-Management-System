from fastapi import APIRouter
from db import supabase
from models import Order

router = APIRouter()

# CREATE
@router.post("/")
def add_order(order: Order):
    return supabase.table("Order").insert(order.dict()).execute()

# READ
@router.get("/")
def get_orders():
    return supabase.table("Order").select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_order(id: int):
    return supabase.table("Order").delete().eq("order_id", id).execute()

@router.put("/{id}")
def update_order(id: int, order: Order):
    return supabase.table("Order") \
        .update(order.dict()) \
        .eq("order_id", id) \
        .execute()
