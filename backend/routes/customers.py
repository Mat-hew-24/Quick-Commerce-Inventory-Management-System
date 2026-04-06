from fastapi import APIRouter, Depends
from db import supabase
from models import Customer
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_customer(customer: Customer, current_user=Depends(get_current_user)):
    res = supabase.table("customer").insert(customer.dict()).execute()
    log(current_user["email"], f"INSERTED customer '{customer.name}'")
    return res


@router.get("/")
def get_customers():
    return supabase.table("customer").select("*").execute()


@router.delete("/{id}")
def delete_customer(id: int, current_user=Depends(get_current_user)):
    res = supabase.table("customer").delete().eq("customer_id", id).execute()
    log(current_user["email"], f"DELETED customer id={id}")
    return res


@router.put("/{id}")
def update_customer(
    id: int, customer: Customer, current_user=Depends(get_current_user)
):
    res = (
        supabase.table("customer")
        .update(customer.dict())
        .eq("customer_id", id)
        .execute()
    )
    log(current_user["email"], f"UPDATED customer id={id}")
    return res
