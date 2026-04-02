from fastapi import APIRouter
from db import supabase
from models import Supplier

router = APIRouter()

# CREATE
@router.post("/")
def add_supplier(supplier: Supplier):
    return supabase.table("supplier").insert(supplier.dict()).execute()

# READ
@router.get("/")
def get_suppliers():
    return supabase.table("supplier").select("*").execute()

# DELETE
@router.delete("/{id}")
def delete_supplier(id: int):
    return supabase.table("supplier").delete().eq("supplier_id", id).execute()

@router.put("/{id}")
def update_supplier(id: int, supplier: Supplier):
    return supabase.table("supplier") \
        .update(supplier.dict()) \
        .eq("supplier_id", id) \
        .execute()