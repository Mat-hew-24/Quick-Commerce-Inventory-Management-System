from fastapi import FastAPI, Depends, HTTPException
from routes import (
    product,
    warehouse,
    inventory,
    customers,
    order_items,
    orders,
    suppliers,
    restock,
    auth,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import os
import csv
import io
from supabase import create_client, Client
from dotenv import load_dotenv


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product.router, prefix="/products")
app.include_router(warehouse.router, prefix="/warehouses")
app.include_router(inventory.router, prefix="/inventory")
app.include_router(customers.router, prefix="/customers")
app.include_router(order_items.router, prefix="/order_items")
app.include_router(orders.router, prefix="/orders")
app.include_router(suppliers.router, prefix="/suppliers")
app.include_router(restock.router, prefix="/restock")
app.include_router(auth.router)


@app.get("/logs")
def get_logs():
    log_path = "logs/activity.log"
    if not os.path.exists(log_path):
        return {"detail": "No logs yet"}
    return FileResponse(log_path, media_type="text/plain", filename="activity.log")


def table_to_csv(table_name: str, id_col: str) -> StreamingResponse:
    res = supabase.table(table_name).select("*").execute()
    rows = res.data or []
    if not rows:
        return StreamingResponse(iter([""]), media_type="text/csv")
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={table_name}.csv"},
    )


@app.get("/export/{table}")
def export_table(table: str, current_user=Depends(auth.get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    allowed = {
        "product",
        "warehouse",
        "inventory",
        "customer",
        "supplier",
        "Order",
        "restock",
    }
    if table not in allowed:
        raise HTTPException(status_code=400, detail="Unknown table")
    return table_to_csv(table, table)
