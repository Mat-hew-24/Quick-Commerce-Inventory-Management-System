from fastapi import FastAPI
from routes import product, warehouse, inventory, customers, orders, suppliers, restock

app = FastAPI()

app.include_router(product.router, prefix="/products")
app.include_router(warehouse.router, prefix="/warehouses")
app.include_router(inventory.router, prefix="/inventory")
app.include_router(customers.router, prefix="/customers")
app.include_router(orders.router, prefix="/orders")
app.include_router(suppliers.router, prefix="/suppliers")
app.include_router(restock.router, prefix="/restock")
# app.include_router(order_items.router, prefix="/order_items")