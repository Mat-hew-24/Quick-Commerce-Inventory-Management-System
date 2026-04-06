from fastapi import APIRouter, Depends
from db import supabase
from models import Product
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_product(product: Product, current_user=Depends(get_current_user)):
    res = supabase.table("product").insert(product.dict()).execute()
    log(current_user["email"], f"INSERTED product '{product.name}'")
    return res


@router.get("/")
def get_products():
    return supabase.table("product").select("*").execute()


@router.delete("/{id}")
def delete_product(id: int, current_user=Depends(get_current_user)):
    res = supabase.table("product").delete().eq("product_id", id).execute()
    log(current_user["email"], f"DELETED product id={id}")
    return res


@router.put("/{id}")
def update_product(id: int, product: Product, current_user=Depends(get_current_user)):
    res = (
        supabase.table("product").update(product.dict()).eq("product_id", id).execute()
    )
    log(current_user["email"], f"UPDATED product id={id}")
    return res
