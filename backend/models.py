from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    name: str
    category: str
    unit_price: float
    weight: float

class Warehouse(BaseModel):
    name: str
    city: str
    pincode: str
    capacity: int

class Inventory(BaseModel):
    warehouse_id: int
    product_id: int
    quantity_available: int
    reorder_level: int
    is_available: bool

class Customer(BaseModel):
    name: str
    phone: str
    email: str
    pincode: str

class Order(BaseModel):
    customer_id: int
    warehouse_id: int
    order_status: str
    total_amount: float

class OrderItem(BaseModel):
    order_id: int
    product_id: int
    quantity: int
    price_at_order_time: float

class Supplier(BaseModel):
    name: str
    contact: str
    email: str

class RestockRequest(BaseModel):
    warehouse_id: int
    product_id: int
    supplier_id: int
    quantity_requested: int
    status: str