from fastapi import APIRouter, Depends, HTTPException
from db import supabase
from models import OrderItem
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_order_item(order_item: OrderItem, current_user=Depends(get_current_user)):
    res = (
        supabase.table(get_order_item_table_name()).insert(order_item.dict()).execute()
    )
    log(current_user["email"], f"INSERTED order item")
    return res


@router.get("/")
def get_order_items():
    return supabase.table("orderitem").select("*").execute()


@router.delete("/{id}")
def delete_order_item(id: int, current_user=Depends(get_current_user)):
    res = (
        supabase.table(get_order_item_table_name())
        .delete()
        .eq("order_item_id", id)
        .execute()
    )
    log(current_user["email"], f"DELETED order item id={id}")
    return res


@router.put("/{id}")
def update_order_item(
    id: int, order_item: OrderItem, current_user=Depends(get_current_user)
):
    res = (
        supabase.table(get_order_item_table_name())
        .update(order_item.dict())
        .eq("order_item_id", id)
        .execute()
    )
    log(current_user["email"], f"UPDATED order item id={id}")
    return res
