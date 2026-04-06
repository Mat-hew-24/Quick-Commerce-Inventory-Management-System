from fastapi import APIRouter
from db import supabase
from fastapi import HTTPException
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
# @router.delete("/{id}")
# def delete_supplier(id: int):
#     return supabase.table("supplier").delete().eq("supplier_id", id).execute()

@router.delete("/{id}")
def delete_supplier(id: int):
    supabase.table("restockrequest").delete().eq("supplier_id", id).execute()
    
    result = supabase.table("supplier").delete().eq("supplier_id", id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    return {"message": "Supplier and associated restock requests deleted successfully"}

@router.put("/{id}")
def update_supplier(id: int, supplier: Supplier):
    return supabase.table("supplier") \
        .update(supplier.dict()) \
        .eq("supplier_id", id) \
        .execute()