from fastapi import FastAPI
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
from fastapi.responses import FileResponse
import os

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
