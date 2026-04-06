from fastapi import APIRouter, Depends
from db import supabase
from models import Order
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_order(order: Order, current_user=Depends(get_current_user)):
    res = supabase.table("Order").insert(order.dict()).execute()
    log(current_user["email"], f"INSERTED order")
    return res


@router.get("/")
def get_orders():
    return supabase.table("Order").select("*").execute()


@router.delete("/{id}")
def delete_order(id: int, current_user=Depends(get_current_user)):
    res = supabase.table("Order").delete().eq("order_id", id).execute()
    log(current_user["email"], f"DELETED order id={id}")
    return res


@router.put("/{id}")
def update_order(id: int, order: Order, current_user=Depends(get_current_user)):
    res = supabase.table("Order").update(order.dict()).eq("order_id", id).execute()
    log(current_user["email"], f"UPDATED order id={id}")
    return res
