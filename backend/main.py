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
from fastapi.responses import FileResponse, StreamingResponse, PlainTextResponse
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
def get_logs(current_user=Depends(auth.get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    log_dir = "logs"
    combined_logs = ""
    if os.path.exists(log_dir):
        files = [f for f in os.listdir(log_dir) if f.startswith("activity.log")]
        files.sort(key=lambda x: os.path.getmtime(os.path.join(log_dir, x)))
        for filename in files:
            filepath = os.path.join(log_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                combined_logs += f.read()
    if not combined_logs:
        raise HTTPException(status_code=404, detail="No logs found")
    return PlainTextResponse(
        content=combined_logs,
        headers={
            "Content-Disposition": 'attachment; filename="activity_past_7_days.log"'
        },
    )


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
