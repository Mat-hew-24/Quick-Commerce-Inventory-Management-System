from fastapi import APIRouter
from db import supabase
from models import Product

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
@router.delete("/{id}")
def delete_product(id: int):
    return supabase.table("product").delete().eq("product_id", id).execute()

@router.put("/{id}")
def update_product(id: int, product: Product):
    return supabase.table("product") \
        .update(product.dict()) \
        .eq("product_id", id) \
        .execute()