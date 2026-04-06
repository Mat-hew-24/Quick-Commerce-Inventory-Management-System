from fastapi import APIRouter
from db import supabase
from models import Product
from fastapi import HTTPException

router = APIRouter()

# CREATE
@router.post("/")
def add_product(product: Product):
    return supabase.table("product").insert(product.dict()).execute()

# READ
@router.get("/")
def get_products():
    return supabase.table("product").select("*").execute()

# DELETE
# @router.delete("/{id}")
# def delete_product(id: int):
#     return supabase.table("product").delete().eq("product_id", id).execute()

@router.delete("/{id}")
def delete_product(id: int):
    supabase.table("inventory").delete().eq("product_id", id).execute()
    supabase.table("orderitem").delete().eq("product_id", id).execute()
    supabase.table("restockrequest").delete().eq("product_id", id).execute()
    
    result = supabase.table("product").delete().eq("product_id", id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product and associated records deleted successfully"}


@router.put("/{id}")
def update_product(id: int, product: Product):
    return supabase.table("product") \
        .update(product.dict()) \
        .eq("product_id", id) \
        .execute()