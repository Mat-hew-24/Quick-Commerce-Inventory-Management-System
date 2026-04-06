from fastapi import APIRouter
from db import supabase
from fastapi import HTTPException
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
# @router.delete("/{id}")
# def delete_customer(id: int):
#     return supabase.table("customer").delete().eq("customer_id", id).execute()

@router.delete("/{id}")
def delete_customer(id: int):
    supabase.table("Order").delete().eq("customer_id", id).execute()
    
    result = supabase.table("customer").delete().eq("customer_id", id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return {"message": "Customer and associated orders deleted successfully"}

@router.put("/{id}")
def update_customer(id: int, customer: Customer):
    return supabase.table("customer") \
        .update(customer.dict()) \
        .eq("customer_id", id) \
        .execute()