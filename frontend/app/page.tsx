"use client";

import { useState } from "react";
import AddRecordForm from "./components/AddRecordForm";
import QcimsHeader from "./components/QcimsHeader";
import SummaryCard from "./components/SummaryCard";

type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};
type WarehouseRow = {
  id: number;
  name: string;
  city: string;
  pincode: string;
  capacity: number;
};
type InventoryRow = {
  id: number;
  warehouse: string;
  product: string;
  quantity: number;
  reorder: number;
  available: boolean;
};
type CustomerRow = {
  id: number;
  name: string;
  phone: string;
  email: string;
  pincode: string;
};
type SupplierRow = { id: number; name: string; contact: string; email: string };
type OrderRow = {
  id: number;
  customer: string;
  warehouse: string;
  status: string;
  total: number;
};
type OrderItemRow = {
  id: number;
  orderId: number;
  product: string;
  quantity: number;
  priceAtOrder: number;
};
type RestockRow = {
  id: number;
  warehouse: string;
  product: string;
  supplier: string;
  quantity: number;
  status: string;
};

const sampleStats = [
  { title: "Products", value: 128, subtitle: "Updated from `Product` entity" },
  { title: "Warehouses", value: 6, subtitle: "Entities in `Warehouse` table" },
  { title: "Customers", value: 89, subtitle: "Active `Customer` entries" },
  { title: "Suppliers", value: 8, subtitle: "Active `Supplier` entries" },
  { title: "Orders", value: 48, subtitle: "Active `Order` entries" },
  { title: "Restocks", value: 12, subtitle: "Pending `RestockRequest`" },
];

const initialProductRows: ProductRow[] = [
  {
    id: 1,
    name: "Grocery Kit",
    category: "Essential",
    price: 259.99,
    stock: 124,
  },
  { id: 2, name: "Milk 1L", category: "Dairy", price: 39.99, stock: 54 },
  { id: 3, name: "Rice 5kg", category: "Grains", price: 299.99, stock: 88 },
];

const initialWarehouseRows: WarehouseRow[] = [
  {
    id: 1,
    name: "Central Hub",
    city: "Chennai",
    pincode: "600001",
    capacity: 2000,
  },
  {
    id: 2,
    name: "North Warehouse",
    city: "Bengaluru",
    pincode: "560001",
    capacity: 1500,
  },
];

const initialInventoryRows: InventoryRow[] = [
  {
    id: 1,
    warehouse: "Central Hub",
    product: "Milk 1L",
    quantity: 54,
    reorder: 30,
    available: true,
  },
  {
    id: 2,
    warehouse: "North Warehouse",
    product: "Rice 5kg",
    quantity: 88,
    reorder: 40,
    available: true,
  },
  {
    id: 3,
    warehouse: "Central Hub",
    product: "Grocery Kit",
    quantity: 124,
    reorder: 20,
    available: true,
  },
];

const initialCustomerRows: CustomerRow[] = [
  {
    id: 1,
    name: "Mohan Kumar",
    phone: "9876543210",
    email: "mohan@example.com",
    pincode: "600028",
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "9123456789",
    email: "priya@example.com",
    pincode: "560075",
  },
];

const initialSupplierRows: SupplierRow[] = [
  { id: 1, name: "DairyCo", contact: "9845712369", email: "sales@dairyco.com" },
  {
    id: 2,
    name: "GrainsRUs",
    contact: "8569743210",
    email: "contact@grainsrus.com",
  },
];

const initialOrderRows: OrderRow[] = [
  {
    id: 101,
    customer: "Mohan Kumar",
    warehouse: "Central Hub",
    status: "Processing",
    total: 1399.5,
  },
  {
    id: 102,
    customer: "Priya Singh",
    warehouse: "North Warehouse",
    status: "Shipped",
    total: 249.0,
  },
];

const initialOrderItemRows: OrderItemRow[] = [
  {
    id: 1001,
    orderId: 101,
    product: "Grocery Kit",
    quantity: 2,
    priceAtOrder: 259.99,
  },
  {
    id: 1002,
    orderId: 101,
    product: "Milk 1L",
    quantity: 6,
    priceAtOrder: 39.99,
  },
  {
    id: 1003,
    orderId: 102,
    product: "Rice 5kg",
    quantity: 1,
    priceAtOrder: 299.99,
  },
];

const initialRestockRows: RestockRow[] = [
  {
    id: 201,
    warehouse: "Central Hub",
    product: "Milk 1L",
    supplier: "DairyCo",
    quantity: 500,
    status: "Pending",
  },
  {
    id: 202,
    warehouse: "North Warehouse",
    product: "Rice 5kg",
    supplier: "GrainsRUs",
    quantity: 300,
    status: "Ordered",
  },
];

export default function Home() {
  const [productRows, setProductRows] =
    useState<ProductRow[]>(initialProductRows);
  const [warehouseRows, setWarehouseRows] =
    useState<WarehouseRow[]>(initialWarehouseRows);
  const [inventoryRows, setInventoryRows] =
    useState<InventoryRow[]>(initialInventoryRows);
  const [customerRows, setCustomerRows] =
    useState<CustomerRow[]>(initialCustomerRows);
  const [supplierRows, setSupplierRows] =
    useState<SupplierRow[]>(initialSupplierRows);
  const [orderRows, setOrderRows] = useState<OrderRow[]>(initialOrderRows);
  const [orderItemRows] = useState<OrderItemRow[]>(initialOrderItemRows);
  const [restockRows, setRestockRows] =
    useState<RestockRow[]>(initialRestockRows);

  const [showProductForm, setShowProductForm] = useState(false);
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);

  const addProduct = (data: Record<string, string | number | boolean>) => {
    setProductRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
        name: String(data.name || ""),
        category: String(data.category || ""),
        price: Number(data.unit_price || 0),
        stock: Number(data.stock || 0),
      },
    ]);
    setShowProductForm(false);
  };

  const addWarehouse = (data: Record<string, string | number | boolean>) => {
    setWarehouseRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((w) => w.id)) + 1 : 1,
        name: String(data.name || ""),
        city: String(data.city || ""),
        pincode: String(data.pincode || ""),
        capacity: Number(data.capacity || 0),
      },
    ]);
    setShowWarehouseForm(false);
  };

  const addInventory = (data: Record<string, string | number | boolean>) => {
    setInventoryRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((i) => i.id)) + 1 : 1,
        warehouse: String(data.warehouse || ""),
        product: String(data.product || ""),
        quantity: Number(data.quantity || 0),
        reorder: Number(data.reorder || 0),
        available: Boolean(data.is_available),
      },
    ]);
    setShowInventoryForm(false);
  };

  const addCustomer = (data: Record<string, string | number | boolean>) => {
    setCustomerRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
        name: String(data.name || ""),
        phone: String(data.phone || ""),
        email: String(data.email || ""),
        pincode: String(data.pincode || ""),
      },
    ]);
    setShowCustomerForm(false);
  };

  const addSupplier = (data: Record<string, string | number | boolean>) => {
    setSupplierRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1,
        name: String(data.name || ""),
        contact: String(data.contact || ""),
        email: String(data.email || ""),
      },
    ]);
    setShowSupplierForm(false);
  };

  const addOrder = (data: Record<string, string | number | boolean>) => {
    setOrderRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((o) => o.id)) + 1 : 1,
        customer: String(data.customer || ""),
        warehouse: String(data.warehouse || ""),
        status: String(data.status || "Pending"),
        total: Number(data.total || 0),
      },
    ]);
    setShowOrderForm(false);
  };

  const addRestock = (data: Record<string, string | number | boolean>) => {
    setRestockRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        warehouse: String(data.warehouse || ""),
        product: String(data.product || ""),
        supplier: String(data.supplier || ""),
        quantity: Number(data.quantity || 0),
        status: String(data.status || "Pending"),
      },
    ]);
    setShowRestockForm(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white p-5 md:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <QcimsHeader />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {sampleStats.map((s) => (
            <SummaryCard
              key={s.title}
              title={s.title}
              value={s.value}
              subtitle={s.subtitle}
            />
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Products</h2>
            <button
              onClick={() => setShowProductForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
          {showProductForm && (
            <AddRecordForm
              title="Product"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                {
                  name: "category",
                  label: "Category",
                  type: "text",
                  required: true,
                },
                {
                  name: "unit_price",
                  label: "Unit price",
                  type: "number",
                  required: true,
                },
                {
                  name: "stock",
                  label: "Stock",
                  type: "number",
                  required: true,
                },
              ]}
              onSubmit={addProduct}
              onCancel={() => setShowProductForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productRows.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {product.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button className="text-rose-600 hover:text-rose-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Warehouses</h2>
            <button
              onClick={() => setShowWarehouseForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Warehouse
            </button>
          </div>
          {showWarehouseForm && (
            <AddRecordForm
              title="Warehouse"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "city", label: "City", type: "text", required: true },
                {
                  name: "pincode",
                  label: "Pincode",
                  type: "text",
                  required: true,
                },
                {
                  name: "capacity",
                  label: "Capacity",
                  type: "number",
                  required: true,
                },
              ]}
              onSubmit={addWarehouse}
              onCancel={() => setShowWarehouseForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Pincode</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouseRows.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {warehouse.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {warehouse.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {warehouse.city}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {warehouse.pincode}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {warehouse.capacity}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button className="text-rose-600 hover:text-rose-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Inventory</h2>
            <button
              onClick={() => setShowInventoryForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Inventory
            </button>
          </div>
          {showInventoryForm && (
            <AddRecordForm
              title="Inventory Entry"
              fields={[
                {
                  name: "warehouse",
                  label: "Warehouse",
                  type: "text",
                  required: true,
                },
                {
                  name: "product",
                  label: "Product",
                  type: "text",
                  required: true,
                },
                {
                  name: "quantity",
                  label: "Quantity",
                  type: "number",
                  required: true,
                },
                {
                  name: "reorder",
                  label: "Reorder Level",
                  type: "number",
                  required: true,
                },
                { name: "is_available", label: "Available", type: "checkbox" },
              ]}
              onSubmit={addInventory}
              onCancel={() => setShowInventoryForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Reorder</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryRows.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.warehouse}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.product}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.reorder}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.available ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button className="text-rose-600 hover:text-rose-800">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Customers</h2>
            <button
              onClick={() => setShowCustomerForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Customer
            </button>
          </div>
          {showCustomerForm && (
            <AddRecordForm
              title="Customer"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "phone", label: "Phone", type: "text", required: true },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                },
                {
                  name: "pincode",
                  label: "Pincode",
                  type: "text",
                  required: true,
                },
              ]}
              onSubmit={addCustomer}
              onCancel={() => setShowCustomerForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Pincode</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customerRows.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {customer.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {customer.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {customer.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {customer.pincode}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button className="text-rose-600 hover:text-rose-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Suppliers</h2>
            <button
              onClick={() => setShowSupplierForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Supplier
            </button>
          </div>
          {showSupplierForm && (
            <AddRecordForm
              title="Supplier"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                {
                  name: "contact",
                  label: "Contact",
                  type: "text",
                  required: true,
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                },
              ]}
              onSubmit={addSupplier}
              onCancel={() => setShowSupplierForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplierRows.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {supplier.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {supplier.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {supplier.contact}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {supplier.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button className="text-rose-600 hover:text-rose-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Order Items</h2>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Price at Order</th>
                </tr>
              </thead>
              <tbody>
                {orderItemRows.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.orderId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.product}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      ₹{item.priceAtOrder.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Orders</h2>
            <button
              onClick={() => setShowOrderForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Order
            </button>
          </div>
          {showOrderForm && (
            <AddRecordForm
              title="Order"
              fields={[
                {
                  name: "customer",
                  label: "Customer",
                  type: "text",
                  required: true,
                },
                {
                  name: "warehouse",
                  label: "Warehouse",
                  type: "text",
                  required: true,
                },
                {
                  name: "status",
                  label: "Status",
                  type: "text",
                  required: true,
                },
                {
                  name: "total",
                  label: "Total",
                  type: "number",
                  required: true,
                },
              ]}
              onSubmit={addOrder}
              onCancel={() => setShowOrderForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderRows.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {order.warehouse}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {order.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Details
                      </button>
                      <button className="text-rose-600 hover:text-rose-800">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Restock Requests
            </h2>
            <button
              onClick={() => setShowRestockForm(true)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              New Restock
            </button>
          </div>
          {showRestockForm && (
            <AddRecordForm
              title="Restock Request"
              fields={[
                {
                  name: "warehouse",
                  label: "Warehouse",
                  type: "text",
                  required: true,
                },
                {
                  name: "product",
                  label: "Product",
                  type: "text",
                  required: true,
                },
                {
                  name: "supplier",
                  label: "Supplier",
                  type: "text",
                  required: true,
                },
                {
                  name: "quantity",
                  label: "Quantity",
                  type: "number",
                  required: true,
                },
                {
                  name: "status",
                  label: "Status",
                  type: "text",
                  required: true,
                },
              ]}
              onSubmit={addRestock}
              onCancel={() => setShowRestockForm(false)}
            />
          )}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restockRows.map((restock) => (
                  <tr
                    key={restock.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {restock.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {restock.warehouse}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {restock.product}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {restock.supplier}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {restock.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {restock.status}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        Mark Received
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
