from fastapi import APIRouter, Depends
from db import supabase
from fastapi import HTTPException
from models import Supplier
from routes.auth import get_current_user
from logger import log

router = APIRouter()


@router.post("/")
def add_supplier(supplier: Supplier, current_user=Depends(get_current_user)):
    res = supabase.table("supplier").insert(supplier.dict()).execute()
    log(current_user["email"], f"INSERTED supplier '{supplier.name}'")
    return res


@router.get("/")
def get_suppliers():
    return supabase.table("supplier").select("*").execute()


@router.delete("/{id}")
def delete_supplier(id: int, current_user=Depends(get_current_user)):
    res = supabase.table("supplier").delete().eq("supplier_id", id).execute()
    log(current_user["email"], f"DELETED supplier id={id}")
    return res


@router.put("/{id}")
def update_supplier(
    id: int, supplier: Supplier, current_user=Depends(get_current_user)
):
    res = (
        supabase.table("supplier")
        .update(supplier.dict())
        .eq("supplier_id", id)
        .execute()
    )
    log(current_user["email"], f"UPDATED supplier id={id}")
    return res
