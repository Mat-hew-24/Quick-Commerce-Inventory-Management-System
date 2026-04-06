from fastapi import APIRouter, HTTPException
from db import supabase
from models import OrderItem

router = APIRouter()

@router.post("/")
def add_order_item(order_item: OrderItem):
    return supabase.table("orderitem").insert(order_item.dict()).execute()


@router.get("/")
def get_order_items():
    return supabase.table("orderitem").select("*").execute()


@router.delete("/{id}")
def delete_order_item(id: int):
    return (
        supabase.table("orderitem")
        .delete()
        .eq("order_item_id", id)
        .execute()
    )


@router.put("/{id}")
def update_order_item(id: int, order_item: OrderItem):
    return (
        supabase.table("orderitem")
        .update(order_item.dict())
        .eq("order_item_id", id)
        .execute()
    )
