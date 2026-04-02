"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AddRecordForm from "./components/AddRecordForm";
import QcimsHeader from "./components/QcimsHeader";
import SummaryCard from "./components/SummaryCard";

// ── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  stock: number;
};

type Warehouse = {
  id: number;
  name: string;
  city: string;
  pincode: string;
  capacity: number;
};

type Inventory = {
  id: number;
  warehouse_id: number;
  product_id: number;
  quantity: number;
  reorder_level: number;
  is_available: boolean;
  warehouses: { name: string } | null;
  products: { name: string } | null;
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  pincode: string;
};

type Supplier = {
  id: number;
  name: string;
  contact: string;
  email: string;
};

type Order = {
  id: number;
  customer_id: number;
  warehouse_id: number;
  status: string;
  total: number;
  customers: { name: string } | null;
  warehouses: { name: string } | null;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_order: number;
  products: { name: string } | null;
};

type RestockRequest = {
  id: number;
  warehouse_id: number;
  product_id: number;
  supplier_id: number;
  quantity: number;
  status: string;
  warehouses: { name: string } | null;
  products: { name: string } | null;
  suppliers: { name: string } | null;
};

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [restockRequests, setRestockRequests] = useState<RestockRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form visibility
  const [showProductForm, setShowProductForm] = useState(false);
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);

  // ── Fetch all data on mount ────────────────────────────────────────────────

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [
        { data: productsData },
        { data: warehousesData },
        { data: inventoryData },
        { data: customersData },
        { data: suppliersData },
        { data: ordersData },
        { data: orderItemsData },
        { data: restockData },
      ] = await Promise.all([
        supabase.from("products").select("*").order("id"),
        supabase.from("warehouses").select("*").order("id"),
        supabase
          .from("inventory")
          .select("*, warehouses(name), products(name)")
          .order("id"),
        supabase.from("customers").select("*").order("id"),
        supabase.from("suppliers").select("*").order("id"),
        supabase
          .from("orders")
          .select("*, customers(name), warehouses(name)")
          .order("id"),
        supabase
          .from("order_items")
          .select("*, products(name)")
          .order("id"),
        supabase
          .from("restock_requests")
          .select("*, warehouses(name), products(name), suppliers(name)")
          .order("id"),
      ]);

      setProducts(productsData ?? []);
      setWarehouses(warehousesData ?? []);
      setInventory(inventoryData ?? []);
      setCustomers(customersData ?? []);
      setSuppliers(suppliersData ?? []);
      setOrders(ordersData ?? []);
      setOrderItems(orderItemsData ?? []);
      setRestockRequests(restockData ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // ── Add handlers ──────────────────────────────────────────────────────────

  async function addProduct(data: Record<string, string | number | boolean>) {
    const { data: inserted, error } = await supabase
      .from("products")
      .insert({
        name: String(data.name),
        category: String(data.category),
        unit_price: Number(data.unit_price),
        stock: Number(data.stock),
      })
      .select()
      .single();
    if (!error && inserted) setProducts((prev) => [...prev, inserted]);
    setShowProductForm(false);
  }

  async function addWarehouse(data: Record<string, string | number | boolean>) {
    const { data: inserted, error } = await supabase
      .from("warehouses")
      .insert({
        name: String(data.name),
        city: String(data.city),
        pincode: String(data.pincode),
        capacity: Number(data.capacity),
      })
      .select()
      .single();
    if (!error && inserted) setWarehouses((prev) => [...prev, inserted]);
    setShowWarehouseForm(false);
  }

  async function addInventory(data: Record<string, string | number | boolean>) {
    // Look up IDs from names
    const warehouse = warehouses.find((w) => w.name === String(data.warehouse));
    const product = products.find((p) => p.name === String(data.product));
    if (!warehouse || !product) return alert("Warehouse or product not found");

    const { data: inserted, error } = await supabase
      .from("inventory")
      .insert({
        warehouse_id: warehouse.id,
        product_id: product.id,
        quantity: Number(data.quantity),
        reorder_level: Number(data.reorder_level),
        is_available: Boolean(data.is_available),
      })
      .select("*, warehouses(name), products(name)")
      .single();
    if (!error && inserted) setInventory((prev) => [...prev, inserted]);
    setShowInventoryForm(false);
  }

  async function addCustomer(data: Record<string, string | number | boolean>) {
    const { data: inserted, error } = await supabase
      .from("customers")
      .insert({
        name: String(data.name),
        phone: String(data.phone),
        email: String(data.email),
        pincode: String(data.pincode),
      })
      .select()
      .single();
    if (!error && inserted) setCustomers((prev) => [...prev, inserted]);
    setShowCustomerForm(false);
  }

  async function addSupplier(data: Record<string, string | number | boolean>) {
    const { data: inserted, error } = await supabase
      .from("suppliers")
      .insert({
        name: String(data.name),
        contact: String(data.contact),
        email: String(data.email),
      })
      .select()
      .single();
    if (!error && inserted) setSuppliers((prev) => [...prev, inserted]);
    setShowSupplierForm(false);
  }

  async function addOrder(data: Record<string, string | number | boolean>) {
    const customer = customers.find((c) => c.name === String(data.customer));
    const warehouse = warehouses.find((w) => w.name === String(data.warehouse));
    if (!customer || !warehouse) return alert("Customer or warehouse not found");

    const { data: inserted, error } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        warehouse_id: warehouse.id,
        status: String(data.status) || "Pending",
        total: Number(data.total),
      })
      .select("*, customers(name), warehouses(name)")
      .single();
    if (!error && inserted) setOrders((prev) => [...prev, inserted]);
    setShowOrderForm(false);
  }

  async function addRestock(data: Record<string, string | number | boolean>) {
    const warehouse = warehouses.find((w) => w.name === String(data.warehouse));
    const product = products.find((p) => p.name === String(data.product));
    const supplier = suppliers.find((s) => s.name === String(data.supplier));
    if (!warehouse || !product || !supplier)
      return alert("Warehouse, product or supplier not found");

    const { data: inserted, error } = await supabase
      .from("restock_requests")
      .insert({
        warehouse_id: warehouse.id,
        product_id: product.id,
        supplier_id: supplier.id,
        quantity: Number(data.quantity),
        status: String(data.status) || "Pending",
      })
      .select("*, warehouses(name), products(name), suppliers(name)")
      .single();
    if (!error && inserted) setRestockRequests((prev) => [...prev, inserted]);
    setShowRestockForm(false);
  }

  // ── Delete handlers ───────────────────────────────────────────────────────

  async function deleteProduct(id: number) {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function deleteWarehouse(id: number) {
    await supabase.from("warehouses").delete().eq("id", id);
    setWarehouses((prev) => prev.filter((w) => w.id !== id));
  }

  async function deleteCustomer(id: number) {
    await supabase.from("customers").delete().eq("id", id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  async function deleteSupplier(id: number) {
    await supabase.from("suppliers").delete().eq("id", id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  }

  async function deleteOrder(id: number) {
    await supabase.from("orders").delete().eq("id", id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  async function markRestockReceived(id: number) {
    await supabase
      .from("restock_requests")
      .update({ status: "Received" })
      .eq("id", id);
    setRestockRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Received" } : r))
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg animate-pulse">Loading QCIMS data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white p-5 md:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <QcimsHeader />

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { title: "Products", value: products.length, subtitle: "Total products in catalogue" },
            { title: "Warehouses", value: warehouses.length, subtitle: "Active warehouse locations" },
            { title: "Customers", value: customers.length, subtitle: "Registered customers" },
            { title: "Suppliers", value: suppliers.length, subtitle: "Active suppliers" },
            { title: "Orders", value: orders.length, subtitle: "All orders placed" },
            { title: "Restocks", value: restockRequests.filter((r) => r.status === "Pending").length, subtitle: "Pending restock requests" },
          ].map((s) => (
            <SummaryCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} />
          ))}
        </section>

        {/* ── Products ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Products</h2>
            <button onClick={() => setShowProductForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Product
            </button>
          </div>
          {showProductForm && (
            <AddRecordForm
              title="Product"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "category", label: "Category", type: "text", required: true },
                { name: "unit_price", label: "Unit price", type: "number", required: true },
                { name: "stock", label: "Stock", type: "number", required: true },
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
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{p.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">₹{p.unit_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{p.stock}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => deleteProduct(p.id)} className="text-rose-600 hover:text-rose-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Warehouses ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Warehouses</h2>
            <button onClick={() => setShowWarehouseForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Warehouse
            </button>
          </div>
          {showWarehouseForm && (
            <AddRecordForm
              title="Warehouse"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "city", label: "City", type: "text", required: true },
                { name: "pincode", label: "Pincode", type: "text", required: true },
                { name: "capacity", label: "Capacity", type: "number", required: true },
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
                {warehouses.map((w) => (
                  <tr key={w.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{w.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{w.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{w.city}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{w.pincode}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{w.capacity}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => deleteWarehouse(w.id)} className="text-rose-600 hover:text-rose-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Inventory ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Inventory</h2>
            <button onClick={() => setShowInventoryForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Inventory
            </button>
          </div>
          {showInventoryForm && (
            <AddRecordForm
              title="Inventory Entry"
              fields={[
                { name: "warehouse", label: "Warehouse name", type: "text", required: true },
                { name: "product", label: "Product name", type: "text", required: true },
                { name: "quantity", label: "Quantity", type: "number", required: true },
                { name: "reorder_level", label: "Reorder Level", type: "number", required: true },
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
                </tr>
              </thead>
              <tbody>
                {inventory.map((inv) => (
                  <tr key={inv.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{inv.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{inv.warehouses?.name ?? inv.warehouse_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{inv.products?.name ?? inv.product_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{inv.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{inv.reorder_level}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{inv.is_available ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Customers ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Customers</h2>
            <button onClick={() => setShowCustomerForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Customer
            </button>
          </div>
          {showCustomerForm && (
            <AddRecordForm
              title="Customer"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "phone", label: "Phone", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "pincode", label: "Pincode", type: "text", required: true },
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
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.pincode}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => deleteCustomer(c.id)} className="text-rose-600 hover:text-rose-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Suppliers ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Suppliers</h2>
            <button onClick={() => setShowSupplierForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Supplier
            </button>
          </div>
          {showSupplierForm && (
            <AddRecordForm
              title="Supplier"
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "contact", label: "Contact", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
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
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{s.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{s.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{s.contact}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{s.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => deleteSupplier(s.id)} className="text-rose-600 hover:text-rose-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Order Items ── */}
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
                {orderItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.order_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.products?.name ?? item.product_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">₹{item.price_at_order.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Orders ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Orders</h2>
            <button onClick={() => setShowOrderForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Create Order
            </button>
          </div>
          {showOrderForm && (
            <AddRecordForm
              title="Order"
              fields={[
                { name: "customer", label: "Customer name", type: "text", required: true },
                { name: "warehouse", label: "Warehouse name", type: "text", required: true },
                { name: "status", label: "Status", type: "text", required: true },
                { name: "total", label: "Total", type: "number", required: true },
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
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{o.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{o.customers?.name ?? o.customer_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{o.warehouses?.name ?? o.warehouse_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{o.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">₹{o.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => deleteOrder(o.id)} className="text-rose-600 hover:text-rose-800">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Restock Requests ── */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Restock Requests</h2>
            <button onClick={() => setShowRestockForm(true)} className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              New Restock
            </button>
          </div>
          {showRestockForm && (
            <AddRecordForm
              title="Restock Request"
              fields={[
                { name: "warehouse", label: "Warehouse name", type: "text", required: true },
                { name: "product", label: "Product name", type: "text", required: true },
                { name: "supplier", label: "Supplier name", type: "text", required: true },
                { name: "quantity", label: "Quantity", type: "number", required: true },
                { name: "status", label: "Status", type: "text", required: true },
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
                {restockRequests.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{r.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.warehouses?.name ?? r.warehouse_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.products?.name ?? r.product_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.suppliers?.name ?? r.supplier_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.status}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => markRestockReceived(r.id)}
                        disabled={r.status === "Received"}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
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