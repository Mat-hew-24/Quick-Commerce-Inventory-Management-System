from fastapi import APIRouter
from db import supabase
from models import Customer

router = APIRouter()

# CREATE
@router.post("/")
def add_customer(customer: Customer):
    return supabase.table("customer").insert(customer.dict()).execute()

# READ
@router.get("/")
def get_customers():
    return supabase.table("customer").select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_customer(id: int):
    return supabase.table("customer").delete().eq("customer_id", id).execute()

@router.put("/{id}")
def update_customer(id: int, customer: Customer):
    return supabase.table("customer") \
        .update(customer.dict()) \
        .eq("customer_id", id) \
        .execute()