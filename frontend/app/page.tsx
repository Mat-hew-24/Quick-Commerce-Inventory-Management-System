'use client'

import { useCallback, useEffect, useState } from 'react'
import Login from './components/Login'
import QcimsHeader from './components/QcimsHeader'
import SummaryCard from './components/SummaryCard'
import CustomersSection from './components/sections/CustomersSection'
import InventorySection from './components/sections/InventorySection'
import OrderItemsSection from './components/sections/OrderItemsSection'
import OrdersSection from './components/sections/OrdersSection'
import ProductsSection from './components/sections/ProductsSection'
import RestocksSection from './components/sections/RestocksSection'
import SuppliersSection from './components/sections/SuppliersSection'
import WarehousesSection from './components/sections/WarehousesSection'
import {} from './data/mockData'
import { getSectionAccess } from './lib/access'
import { parseRoleFromJwt } from './lib/jwt'
import Lenis from 'lenis'
import type {
  CustomerRow,
  InventoryRow,
  OrderItemRow,
  OrderRow,
  ProductRow,
  RestockRow,
  Role,
  Row,
  SupplierRow,
  WarehouseRow,
} from './types/qcims'

type ApiCustomer = {
  customer_id: number
  name: string
  phone: string
  email: string
  pincode: string
}

type ApiSupplier = {
  supplier_id: number
  name: string
  contact: string
  email: string
}

type ApiWarehouse = {
  warehouse_id: number
  name: string
  city: string
  pincode: string
  capacity: number
}

type ApiProduct = {
  product_id: number
  name: string
  category: string
  unit_price: number
  weight: number
}

type ApiInventory = {
  inventory_id: number
  warehouse_id: number
  product_id: number
  quantity_available: number
  reorder_level: number
  is_available: boolean
}

type ApiOrder = {
  order_id: number
  customer_id: number
  warehouse_id: number
  order_status: string
  total_amount: number
}

type ApiRestock = {
  restock_id: number
  warehouse_id: number
  product_id: number
  supplier_id: number
  quantity_requested: number
  status: string
}

type ApiOrderItem = {
  order_item_id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_order_time: number
}

function mapCustomer(customer: ApiCustomer): CustomerRow {
  return {
    id: customer.customer_id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    pincode: customer.pincode,
  }
}

function mapSupplier(supplier: ApiSupplier): SupplierRow {
  return {
    id: supplier.supplier_id,
    name: supplier.name,
    contact: supplier.contact,
    email: supplier.email,
  }
}

function mapWarehouse(warehouse: ApiWarehouse): WarehouseRow {
  return {
    id: warehouse.warehouse_id,
    name: warehouse.name,
    city: warehouse.city,
    pincode: warehouse.pincode,
    capacity: warehouse.capacity,
  }
}

function mapProduct(product: ApiProduct): ProductRow {
  return {
    id: product.product_id,
    name: product.name,
    category: product.category,
    price: product.unit_price,
    stock: product.weight,
  }
}

export default function Home() {
  const [role, setRole] = useState<Role | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([])
  const [inventory, setInventory] = useState<InventoryRow[]>([])
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([])
  const [restocks, setRestocks] = useState<RestockRow[]>([])
  const [openForm, setOpenForm] = useState<string | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(
    null,
  )
  const [customersStatus, setCustomersStatus] = useState('Loading customers...')
  const [editingSupplier, setEditingSupplier] = useState<SupplierRow | null>(
    null,
  )
  const [suppliersStatus, setSuppliersStatus] = useState('Loading suppliers...')
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseRow | null>(
    null,
  )
  const [warehousesStatus, setWarehousesStatus] = useState(
    'Loading warehouses...',
  )
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)
  const [productsStatus, setProductsStatus] = useState('Loading products...')
  const [editingInventory, setEditingInventory] = useState<InventoryRow | null>(
    null,
  )
  const [inventoryStatus, setInventoryStatus] = useState('Loading inventory...')
  const [editingOrder, setEditingOrder] = useState<OrderRow | null>(null)
  const [ordersStatus, setOrdersStatus] = useState('Loading orders...')
  const [editingOrderItem, setEditingOrderItem] = useState<OrderItemRow | null>(
    null,
  )
  const [orderItemsStatus, setOrderItemsStatus] = useState(
    'Loading order items...',
  )
  const [editingRestock, setEditingRestock] = useState<RestockRow | null>(null)
  const [restocksStatus, setRestocksStatus] = useState('Loading restocks...')

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token')
    } catch {
      // ignore
    }
    setToken(null)
    setRole(null)
  }, [])

  useEffect(() => {
    try {
      const existingToken = localStorage.getItem('token')
      if (!existingToken) {
        return
      }

      const existingRole = parseRoleFromJwt(existingToken)
      if (!existingRole) {
        localStorage.removeItem('token')
        return
      }

      setToken(existingToken)
      setRole(existingRole)
    } catch {}
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.5,
      smoothWheel: true,
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const apiFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      if (!apiBaseUrl) {
        throw new Error('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      }

      const activeToken = token ?? localStorage.getItem('token')
      if (!activeToken) {
        handleLogout()
        throw new Error('Missing authentication token. Please log in again.')
      }

      const headers = new Headers(init.headers)
      headers.set('Authorization', `Bearer ${activeToken}`)

      const normalizedPath = path.startsWith('/') ? path : `/${path}`
      const res = await fetch(`${apiBaseUrl}${normalizedPath}`, {
        ...init,
        headers,
      })

      if (res.status === 401 || res.status === 403) {
        handleLogout()
      }

      return res
    },
    [apiBaseUrl, handleLogout, token],
  )

  const closeCustomerForm = () => {
    setEditingCustomer(null)
    setOpenForm(null)
  }

  const closeSupplierForm = () => {
    setEditingSupplier(null)
    setOpenForm(null)
  }

  const closeWarehouseForm = () => {
    setEditingWarehouse(null)
    setOpenForm(null)
  }

  const closeProductForm = () => {
    setEditingProduct(null)
    setOpenForm(null)
  }

  const closeInventoryForm = () => {
    setEditingInventory(null)
    setOpenForm(null)
  }

  const closeOrderForm = () => {
    setEditingOrder(null)
    setOpenForm(null)
  }

  const closeOrderItemForm = () => {
    setEditingOrderItem(null)
    setOpenForm(null)
  }

  const closeRestockForm = () => {
    setEditingRestock(null)
    setOpenForm(null)
  }

  const loadCustomers = useCallback(async () => {
    if (!apiBaseUrl) {
      setCustomersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setCustomersStatus('Loading customers...')

    try {
      const res = await apiFetch('/customers/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const rows = Array.isArray(payload.data)
        ? payload.data.map((customer: ApiCustomer) => mapCustomer(customer))
        : []

      setCustomers(rows)
      setCustomersStatus(
        rows.length
          ? ''
          : 'No customer records yet. Add one to test the live flow.',
      )
    } catch (error) {
      setCustomersStatus(
        error instanceof Error
          ? `Could not load customers: ${error.message}`
          : 'Could not load customers.',
      )
    }
  }, [apiBaseUrl, apiFetch])

  const loadSuppliers = useCallback(async () => {
    if (!apiBaseUrl) {
      setSuppliersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setSuppliersStatus('Loading suppliers...')

    try {
      const res = await apiFetch('/suppliers/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const rows = Array.isArray(payload.data)
        ? payload.data.map((supplier: ApiSupplier) => mapSupplier(supplier))
        : []

      setSuppliers(rows)
      setSuppliersStatus(
        rows.length
          ? ''
          : 'No supplier records yet. Add one to test the live flow.',
      )
    } catch (error) {
      setSuppliersStatus(
        error instanceof Error
          ? `Could not load suppliers: ${error.message}`
          : 'Could not load suppliers.',
      )
    }
  }, [apiBaseUrl, apiFetch])

  const loadWarehouses = useCallback(async () => {
    if (!apiBaseUrl) {
      setWarehousesStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setWarehousesStatus('Loading warehouses...')

    try {
      const res = await apiFetch('/warehouses/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const rows = Array.isArray(payload.data)
        ? payload.data.map((warehouse: ApiWarehouse) => mapWarehouse(warehouse))
        : []

      setWarehouses(rows)
      setWarehousesStatus(
        rows.length
          ? ''
          : 'No warehouse records yet. Add one to test the live flow.',
      )
    } catch (error) {
      setWarehousesStatus(
        error instanceof Error
          ? `Could not load warehouses: ${error.message}`
          : 'Could not load warehouses.',
      )
    }
  }, [apiBaseUrl, apiFetch])

  const loadProducts = useCallback(async () => {
    if (!apiBaseUrl) {
      setProductsStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setProductsStatus('Loading products...')

    try {
      const res = await apiFetch('/products/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const rows = Array.isArray(payload.data)
        ? payload.data.map((product: ApiProduct) => mapProduct(product))
        : []

      setProducts(rows)
      setProductsStatus(
        rows.length
          ? ''
          : 'No product records yet. Add one to test the live flow.',
      )
    } catch (error) {
      setProductsStatus(
        error instanceof Error
          ? `Could not load products: ${error.message}`
          : 'Could not load products.',
      )
    }
  }, [apiBaseUrl, apiFetch])

  const loadInventory = useCallback(async () => {
    if (!apiBaseUrl) {
      setInventoryStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setInventoryStatus('Loading inventory...')

    try {
      const res = await apiFetch('/inventory/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const warehouseMap = new Map(
        warehouses.map((warehouse) => [warehouse.id, warehouse.name]),
      )
      const productMap = new Map(
        products.map((product) => [product.id, product.name]),
      )
      const rows = Array.isArray(payload.data)
        ? payload.data.map((entry: ApiInventory) => ({
            id: entry.inventory_id,
            warehouseId: entry.warehouse_id,
            productId: entry.product_id,
            warehouse:
              warehouseMap.get(entry.warehouse_id) ??
              `Warehouse #${entry.warehouse_id}`,
            product:
              productMap.get(entry.product_id) ??
              `Product #${entry.product_id}`,
            quantity: entry.quantity_available,
            reorder: entry.reorder_level,
            available: entry.is_available,
          }))
        : []

      setInventory(rows)
      setInventoryStatus(
        rows.length
          ? ''
          : 'No inventory records yet. Add one to test the live flow.',
      )
    } catch (error) {
      setInventoryStatus(
        error instanceof Error
          ? `Could not load inventory: ${error.message}`
          : 'Could not load inventory.',
      )
    }
  }, [apiBaseUrl, apiFetch, products, warehouses])

  const loadOrders = useCallback(async () => {
    if (!apiBaseUrl) {
      setOrdersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setOrdersStatus('Loading orders...')

    try {
      const res = await apiFetch('/orders/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const customerMap = new Map(
        customers.map((customer) => [customer.id, customer.name]),
      )
      const warehouseMap = new Map(
        warehouses.map((warehouse) => [warehouse.id, warehouse.name]),
      )
      const rows = Array.isArray(payload.data)
        ? payload.data.map((order: ApiOrder) => ({
            id: order.order_id,
            customerId: order.customer_id,
            warehouseId: order.warehouse_id,
            customer:
              customerMap.get(order.customer_id) ??
              `Customer #${order.customer_id}`,
            warehouse:
              warehouseMap.get(order.warehouse_id) ??
              `Warehouse #${order.warehouse_id}`,
            status: order.order_status,
            total: order.total_amount,
          }))
        : []

      setOrders(rows)
      setOrdersStatus(
        rows.length ? '' : 'No orders yet. Create one to test the live flow.',
      )
    } catch (error) {
      setOrdersStatus(
        error instanceof Error
          ? `Could not load orders: ${error.message}`
          : 'Could not load orders.',
      )
    }
  }, [apiBaseUrl, apiFetch, customers, warehouses])

  const loadRestocks = useCallback(async () => {
    if (!apiBaseUrl) {
      setRestocksStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setRestocksStatus('Loading restocks...')

    try {
      const res = await apiFetch('/restock/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const warehouseMap = new Map(
        warehouses.map((warehouse) => [warehouse.id, warehouse.name]),
      )
      const productMap = new Map(
        products.map((product) => [product.id, product.name]),
      )
      const supplierMap = new Map(
        suppliers.map((supplier) => [supplier.id, supplier.name]),
      )
      const rows = Array.isArray(payload.data)
        ? payload.data.map((restock: ApiRestock) => ({
            id: restock.restock_id,
            warehouseId: restock.warehouse_id,
            productId: restock.product_id,
            supplierId: restock.supplier_id,
            warehouse:
              warehouseMap.get(restock.warehouse_id) ??
              `Warehouse #${restock.warehouse_id}`,
            product:
              productMap.get(restock.product_id) ??
              `Product #${restock.product_id}`,
            supplier:
              supplierMap.get(restock.supplier_id) ??
              `Supplier #${restock.supplier_id}`,
            quantity: restock.quantity_requested,
            status: restock.status,
          }))
        : []

      setRestocks(rows)
      setRestocksStatus(
        rows.length
          ? ''
          : 'No restock requests yet. Create one to test the live flow.',
      )
    } catch (error) {
      setRestocksStatus(
        error instanceof Error
          ? `Could not load restocks: ${error.message}`
          : 'Could not load restocks.',
      )
    }
  }, [apiBaseUrl, apiFetch, products, suppliers, warehouses])

  const loadOrderItems = useCallback(async () => {
    if (!apiBaseUrl) {
      setOrderItemsStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    setOrderItemsStatus('Loading order items...')

    try {
      const res = await apiFetch('/order_items/', { cache: 'no-store' })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      const payload = await res.json()
      const productMap = new Map(
        products.map((product) => [product.id, product.name]),
      )
      const rows = Array.isArray(payload.data)
        ? payload.data.map((item: ApiOrderItem) => ({
            id: item.order_item_id,
            orderId: item.order_id,
            productId: item.product_id,
            product:
              productMap.get(item.product_id) ?? `Product #${item.product_id}`,
            quantity: item.quantity,
            priceAtOrder: item.price_at_order_time,
          }))
        : []

      setOrderItems(rows)
      setOrderItemsStatus(
        rows.length ? '' : 'No order items yet. Add one to test the live flow.',
      )
    } catch (error) {
      setOrderItemsStatus(
        error instanceof Error
          ? `Could not load order items: ${error.message}`
          : 'Could not load order items.',
      )
    }
  }, [apiBaseUrl, apiFetch, products])

  useEffect(() => {
    if (role) {
      void loadProducts()
      void loadCustomers()
      void loadSuppliers()
      void loadWarehouses()
    }
  }, [loadCustomers, loadProducts, loadSuppliers, loadWarehouses, role])

  useEffect(() => {
    if (role && products.length && warehouses.length) {
      void loadInventory()
    }
  }, [loadInventory, products, role, warehouses])

  useEffect(() => {
    if (!role) {
      return
    }

    const customersReady = customersStatus !== 'Loading customers...'
    const warehousesReady = warehousesStatus !== 'Loading warehouses...'

    if (!customersReady || !warehousesReady) {
      return
    }

    if (!customers.length || !warehouses.length) {
      setOrders([])
      setOrdersStatus(
        'Add at least one customer and one warehouse before managing orders.',
      )
      return
    }

    void loadOrders()
  }, [
    customers,
    customersStatus,
    loadOrders,
    role,
    warehouses,
    warehousesStatus,
  ])

  useEffect(() => {
    if (!role) {
      return
    }

    const productsReady = productsStatus !== 'Loading products...'
    const warehousesReady = warehousesStatus !== 'Loading warehouses...'
    const suppliersReady = suppliersStatus !== 'Loading suppliers...'

    if (!productsReady || !warehousesReady || !suppliersReady) {
      return
    }

    if (!products.length || !warehouses.length || !suppliers.length) {
      setRestocks([])
      setRestocksStatus(
        'Add at least one product, warehouse, and supplier before managing restocks.',
      )
      return
    }

    void loadRestocks()
  }, [
    loadRestocks,
    products,
    productsStatus,
    role,
    suppliers,
    suppliersStatus,
    warehouses,
    warehousesStatus,
  ])

  useEffect(() => {
    if (!role) {
      return
    }

    const ordersReady = ordersStatus !== 'Loading orders...'
    const productsReady = productsStatus !== 'Loading products...'

    if (!ordersReady || !productsReady) {
      return
    }

    if (!orders.length || !products.length) {
      setOrderItems([])
      setOrderItemsStatus(
        'Add at least one order and one product before managing order items.',
      )
      return
    }

    void loadOrderItems()
  }, [loadOrderItems, orders, ordersStatus, products, productsStatus, role])

  const handleCreateCustomer = async (data: Row) => {
    if (!apiBaseUrl) {
      setCustomersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const payload = {
      name: String(data.name || ''),
      phone: String(data.phone || ''),
      email: String(data.email || ''),
      pincode: String(data.pincode || ''),
    }

    try {
      const res = await apiFetch('/customers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeCustomerForm()
      await loadCustomers()
    } catch (error) {
      setCustomersStatus(
        error instanceof Error
          ? `Could not add customer: ${error.message}`
          : 'Could not add customer.',
      )
    }
  }

  const handleUpdateCustomer = async (data: Row) => {
    if (!apiBaseUrl || !editingCustomer) {
      return
    }

    const payload = {
      name: String(data.name || ''),
      phone: String(data.phone || ''),
      email: String(data.email || ''),
      pincode: String(data.pincode || ''),
    }

    try {
      const res = await apiFetch(`/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeCustomerForm()
      await loadCustomers()
    } catch (error) {
      setCustomersStatus(
        error instanceof Error
          ? `Could not update customer: ${error.message}`
          : 'Could not update customer.',
      )
    }
  }

  const handleDeleteCustomer = async (customer: CustomerRow) => {
    if (!apiBaseUrl) {
      setCustomersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete customer "${customer.name}"?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/customers/${customer.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingCustomer?.id === customer.id) {
        closeCustomerForm()
      }

      await loadCustomers()
    } catch (error) {
      setCustomersStatus(
        error instanceof Error
          ? `Could not delete customer: ${error.message}`
          : 'Could not delete customer.',
      )
    }
  }

  const handleCustomerSubmit = async (data: Row) => {
    if (editingCustomer) {
      await handleUpdateCustomer(data)
      return
    }

    await handleCreateCustomer(data)
  }

  const handleCreateSupplier = async (data: Row) => {
    if (!apiBaseUrl) {
      setSuppliersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const payload = {
      name: String(data.name || ''),
      contact: String(data.contact || ''),
      email: String(data.email || ''),
    }

    try {
      const res = await apiFetch('/suppliers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeSupplierForm()
      await loadSuppliers()
    } catch (error) {
      setSuppliersStatus(
        error instanceof Error
          ? `Could not add supplier: ${error.message}`
          : 'Could not add supplier.',
      )
    }
  }

  const handleUpdateSupplier = async (data: Row) => {
    if (!apiBaseUrl || !editingSupplier) {
      return
    }

    const payload = {
      name: String(data.name || ''),
      contact: String(data.contact || ''),
      email: String(data.email || ''),
    }

    try {
      const res = await apiFetch(`/suppliers/${editingSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeSupplierForm()
      await loadSuppliers()
    } catch (error) {
      setSuppliersStatus(
        error instanceof Error
          ? `Could not update supplier: ${error.message}`
          : 'Could not update supplier.',
      )
    }
  }

  const handleDeleteSupplier = async (supplier: SupplierRow) => {
    if (!apiBaseUrl) {
      setSuppliersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete supplier "${supplier.name}"?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/suppliers/${supplier.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingSupplier?.id === supplier.id) {
        closeSupplierForm()
      }

      await loadSuppliers()
    } catch (error) {
      setSuppliersStatus(
        error instanceof Error
          ? `Could not delete supplier: ${error.message}`
          : 'Could not delete supplier.',
      )
    }
  }

  const handleSupplierSubmit = async (data: Row) => {
    if (editingSupplier) {
      await handleUpdateSupplier(data)
      return
    }

    await handleCreateSupplier(data)
  }

  const handleCreateWarehouse = async (data: Row) => {
    if (!apiBaseUrl) {
      setWarehousesStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const payload = {
      name: String(data.name || ''),
      city: String(data.city || ''),
      pincode: String(data.pincode || ''),
      capacity: Number(data.capacity || 0),
    }

    try {
      const res = await apiFetch('/warehouses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeWarehouseForm()
      await loadWarehouses()
    } catch (error) {
      setWarehousesStatus(
        error instanceof Error
          ? `Could not add warehouse: ${error.message}`
          : 'Could not add warehouse.',
      )
    }
  }

  const handleUpdateWarehouse = async (data: Row) => {
    if (!apiBaseUrl || !editingWarehouse) {
      return
    }

    const payload = {
      name: String(data.name || ''),
      city: String(data.city || ''),
      pincode: String(data.pincode || ''),
      capacity: Number(data.capacity || 0),
    }

    try {
      const res = await apiFetch(`/warehouses/${editingWarehouse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeWarehouseForm()
      await loadWarehouses()
    } catch (error) {
      setWarehousesStatus(
        error instanceof Error
          ? `Could not update warehouse: ${error.message}`
          : 'Could not update warehouse.',
      )
    }
  }

  const handleDeleteWarehouse = async (warehouse: WarehouseRow) => {
    if (!apiBaseUrl) {
      setWarehousesStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete warehouse "${warehouse.name}"?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/warehouses/${warehouse.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingWarehouse?.id === warehouse.id) {
        closeWarehouseForm()
      }

      await loadWarehouses()
    } catch (error) {
      setWarehousesStatus(
        error instanceof Error
          ? `Could not delete warehouse: ${error.message}`
          : 'Could not delete warehouse.',
      )
    }
  }

  const handleWarehouseSubmit = async (data: Row) => {
    if (editingWarehouse) {
      await handleUpdateWarehouse(data)
      return
    }

    await handleCreateWarehouse(data)
  }

  const handleCreateProduct = async (data: Row) => {
    if (!apiBaseUrl) {
      setProductsStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const payload = {
      name: String(data.name || ''),
      category: String(data.category || ''),
      unit_price: Number(data.unit_price || 0),
      weight: Number(data.stock || 0),
    }

    try {
      const res = await apiFetch('/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeProductForm()
      await loadProducts()
    } catch (error) {
      setProductsStatus(
        error instanceof Error
          ? `Could not add product: ${error.message}`
          : 'Could not add product.',
      )
    }
  }

  const handleUpdateProduct = async (data: Row) => {
    if (!apiBaseUrl || !editingProduct) {
      return
    }

    const payload = {
      name: String(data.name || ''),
      category: String(data.category || ''),
      unit_price: Number(data.unit_price || 0),
      weight: Number(data.stock || 0),
    }

    try {
      const res = await apiFetch(`/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeProductForm()
      await loadProducts()
    } catch (error) {
      setProductsStatus(
        error instanceof Error
          ? `Could not update product: ${error.message}`
          : 'Could not update product.',
      )
    }
  }

  const handleDeleteProduct = async (product: ProductRow) => {
    if (!apiBaseUrl) {
      setProductsStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete product "${product.name}"?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/products/${product.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingProduct?.id === product.id) {
        closeProductForm()
      }

      await loadProducts()
    } catch (error) {
      setProductsStatus(
        error instanceof Error
          ? `Could not delete product: ${error.message}`
          : 'Could not delete product.',
      )
    }
  }

  const handleProductSubmit = async (data: Row) => {
    if (editingProduct) {
      await handleUpdateProduct(data)
      return
    }

    await handleCreateProduct(data)
  }

  const inventoryPayloadFromForm = (data: Row) => ({
    warehouse_id: Number(data.warehouse || 0),
    product_id: Number(data.product || 0),
    quantity_available: Number(data.quantity || 0),
    reorder_level: Number(data.reorder || 0),
    is_available: Boolean(data.is_available),
  })

  const handleCreateInventory = async (data: Row) => {
    if (!apiBaseUrl) {
      setInventoryStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    try {
      const res = await apiFetch('/inventory/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeInventoryForm()
      await loadInventory()
    } catch (error) {
      setInventoryStatus(
        error instanceof Error
          ? `Could not add inventory: ${error.message}`
          : 'Could not add inventory.',
      )
    }
  }

  const handleUpdateInventory = async (data: Row) => {
    if (!apiBaseUrl || !editingInventory) {
      return
    }

    try {
      const res = await apiFetch(`/inventory/${editingInventory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeInventoryForm()
      await loadInventory()
    } catch (error) {
      setInventoryStatus(
        error instanceof Error
          ? `Could not update inventory: ${error.message}`
          : 'Could not update inventory.',
      )
    }
  }

  const handleDeleteInventory = async (entry: InventoryRow) => {
    if (!apiBaseUrl) {
      setInventoryStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(
      `Delete inventory entry for "${entry.product}" in "${entry.warehouse}"?`,
    )
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/inventory/${entry.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingInventory?.id === entry.id) {
        closeInventoryForm()
      }

      await loadInventory()
    } catch (error) {
      setInventoryStatus(
        error instanceof Error
          ? `Could not delete inventory: ${error.message}`
          : 'Could not delete inventory.',
      )
    }
  }

  const handleInventorySubmit = async (data: Row) => {
    if (editingInventory) {
      await handleUpdateInventory(data)
      return
    }

    await handleCreateInventory(data)
  }

  const orderPayloadFromForm = (data: Row) => ({
    customer_id: Number(data.customer || 0),
    warehouse_id: Number(data.warehouse || 0),
    order_status: String(data.status || 'placed'),
    total_amount: Number(data.total || 0),
  })

  const handleCreateOrder = async (data: Row) => {
    if (!apiBaseUrl) {
      setOrdersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    try {
      const res = await apiFetch('/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeOrderForm()
      await loadOrders()
    } catch (error) {
      setOrdersStatus(
        error instanceof Error
          ? `Could not add order: ${error.message}`
          : 'Could not add order.',
      )
    }
  }

  const handleUpdateOrder = async (data: Row) => {
    if (!apiBaseUrl || !editingOrder) {
      return
    }

    try {
      const res = await apiFetch(`/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeOrderForm()
      await loadOrders()
    } catch (error) {
      setOrdersStatus(
        error instanceof Error
          ? `Could not update order: ${error.message}`
          : 'Could not update order.',
      )
    }
  }

  const handleDeleteOrder = async (order: OrderRow) => {
    if (!apiBaseUrl) {
      setOrdersStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete order #${order.id}?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/orders/${order.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingOrder?.id === order.id) {
        closeOrderForm()
      }

      await loadOrders()
    } catch (error) {
      setOrdersStatus(
        error instanceof Error
          ? `Could not delete order: ${error.message}`
          : 'Could not delete order.',
      )
    }
  }

  const handleOrderSubmit = async (data: Row) => {
    if (editingOrder) {
      await handleUpdateOrder(data)
      return
    }

    await handleCreateOrder(data)
  }

  const restockPayloadFromForm = (data: Row) => ({
    warehouse_id: Number(data.warehouse || 0),
    product_id: Number(data.product || 0),
    supplier_id: Number(data.supplier || 0),
    quantity_requested: Number(data.quantity || 0),
    status: String(data.status || 'pending'),
  })

  const handleCreateRestock = async (data: Row) => {
    if (!apiBaseUrl) {
      setRestocksStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    try {
      const res = await apiFetch('/restock/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restockPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeRestockForm()
      await loadRestocks()
    } catch (error) {
      setRestocksStatus(
        error instanceof Error
          ? `Could not add restock: ${error.message}`
          : 'Could not add restock.',
      )
    }
  }

  const handleUpdateRestock = async (data: Row) => {
    if (!apiBaseUrl || !editingRestock) {
      return
    }

    try {
      const res = await apiFetch(`/restock/${editingRestock.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restockPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeRestockForm()
      await loadRestocks()
    } catch (error) {
      setRestocksStatus(
        error instanceof Error
          ? `Could not update restock: ${error.message}`
          : 'Could not update restock.',
      )
    }
  }

  const handleDeleteRestock = async (restock: RestockRow) => {
    if (!apiBaseUrl) {
      setRestocksStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete restock request #${restock.id}?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/restock/${restock.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingRestock?.id === restock.id) {
        closeRestockForm()
      }

      await loadRestocks()
    } catch (error) {
      setRestocksStatus(
        error instanceof Error
          ? `Could not delete restock: ${error.message}`
          : 'Could not delete restock.',
      )
    }
  }

  const handleRestockSubmit = async (data: Row) => {
    if (editingRestock) {
      await handleUpdateRestock(data)
      return
    }

    await handleCreateRestock(data)
  }

  const orderItemPayloadFromForm = (data: Row) => ({
    order_id: Number(data.orderId || 0),
    product_id: Number(data.productId || 0),
    quantity: Number(data.quantity || 0),
    price_at_order_time: Number(data.priceAtOrder || 0),
  })

  const handleCreateOrderItem = async (data: Row) => {
    if (!apiBaseUrl) {
      setOrderItemsStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    try {
      const res = await apiFetch('/order_items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderItemPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeOrderItemForm()
      await loadOrderItems()
    } catch (error) {
      setOrderItemsStatus(
        error instanceof Error
          ? `Could not add order item: ${error.message}`
          : 'Could not add order item.',
      )
    }
  }

  const handleUpdateOrderItem = async (data: Row) => {
    if (!apiBaseUrl || !editingOrderItem) {
      return
    }

    try {
      const res = await apiFetch(`/order_items/${editingOrderItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderItemPayloadFromForm(data)),
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      closeOrderItemForm()
      await loadOrderItems()
    } catch (error) {
      setOrderItemsStatus(
        error instanceof Error
          ? `Could not update order item: ${error.message}`
          : 'Could not update order item.',
      )
    }
  }

  const handleDeleteOrderItem = async (item: OrderItemRow) => {
    if (!apiBaseUrl) {
      setOrderItemsStatus('Missing NEXT_PUBLIC_API_URL in frontend/.env.local.')
      return
    }

    const confirmed = window.confirm(`Delete order item #${item.id}?`)
    if (!confirmed) {
      return
    }

    try {
      const res = await apiFetch(`/order_items/${item.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`)
      }

      if (editingOrderItem?.id === item.id) {
        closeOrderItemForm()
      }

      await loadOrderItems()
    } catch (error) {
      setOrderItemsStatus(
        error instanceof Error
          ? `Could not delete order item: ${error.message}`
          : 'Could not delete order item.',
      )
    }
  }

  const handleOrderItemSubmit = async (data: Row) => {
    if (editingOrderItem) {
      await handleUpdateOrderItem(data)
      return
    }

    await handleCreateOrderItem(data)
  }

  if (!role) {
    return (
      <Login
        onLogin={(nextRole, nextToken) => {
          setRole(nextRole)
          setToken(nextToken)
        }}
      />
    )
  }

  const access = getSectionAccess(role)
  const dashboardStats = [
    {
      title: 'Products',
      value: products.length,
      subtitle: 'Live `Product` records',
    },
    {
      title: 'Warehouses',
      value: warehouses.length,
      subtitle: 'Live `Warehouse` records',
    },
    {
      title: 'Customers',
      value: customers.length,
      subtitle: 'Live `Customer` entries',
    },
    {
      title: 'Suppliers',
      value: suppliers.length,
      subtitle: 'Live `Supplier` entries',
    },
    { title: 'Orders', value: orders.length, subtitle: 'Live `Order` entries' },
    {
      title: 'Restocks',
      value: restocks.length,
      subtitle: 'Live `RestockRequest` entries',
    },
  ]

  return (
    <div className='min-h-screen bg-slate-50 p-5 md:p-10'>
      <div className='mx-auto w-full max-w-6xl'>
        <QcimsHeader role={role} onLogout={handleLogout} />

        <section className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {dashboardStats.map((stat) => (
            <SummaryCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </section>

        <ProductsSection
          rows={products}
          access={access.products}
          isFormOpen={openForm === 'products'}
          onOpenForm={() => {
            setEditingProduct(null)
            setOpenForm('products')
          }}
          onCloseForm={closeProductForm}
          onSubmit={handleProductSubmit}
          editingRow={editingProduct}
          onEdit={(product) => {
            setEditingProduct(product)
            setOpenForm('products')
          }}
          onDelete={handleDeleteProduct}
          statusMessage={productsStatus}
        />

        <WarehousesSection
          rows={warehouses}
          access={access.warehouses}
          isFormOpen={openForm === 'warehouses'}
          onOpenForm={() => {
            setEditingWarehouse(null)
            setOpenForm('warehouses')
          }}
          onCloseForm={closeWarehouseForm}
          onSubmit={handleWarehouseSubmit}
          editingRow={editingWarehouse}
          onEdit={(warehouse) => {
            setEditingWarehouse(warehouse)
            setOpenForm('warehouses')
          }}
          onDelete={handleDeleteWarehouse}
          statusMessage={warehousesStatus}
        />

        <InventorySection
          rows={inventory}
          access={access.inventory}
          isFormOpen={openForm === 'inventory'}
          onOpenForm={() => {
            setEditingInventory(null)
            setOpenForm('inventory')
          }}
          onCloseForm={closeInventoryForm}
          onSubmit={handleInventorySubmit}
          editingRow={
            editingInventory
              ? {
                  ...editingInventory,
                  warehouse: String(editingInventory.warehouseId),
                  product: String(editingInventory.productId),
                }
              : null
          }
          onEdit={(entry) => {
            setEditingInventory(entry)
            setOpenForm('inventory')
          }}
          onDelete={handleDeleteInventory}
          statusMessage={inventoryStatus}
          warehouseOptions={warehouses.map((warehouse) => ({
            label: warehouse.name,
            value: String(warehouse.id),
          }))}
          productOptions={products.map((product) => ({
            label: product.name,
            value: String(product.id),
          }))}
        />

        <CustomersSection
          rows={customers}
          access={access.customers}
          isFormOpen={openForm === 'customers'}
          onOpenForm={() => {
            setEditingCustomer(null)
            setOpenForm('customers')
          }}
          onCloseForm={closeCustomerForm}
          onSubmit={handleCustomerSubmit}
          editingRow={editingCustomer}
          onEdit={(customer) => {
            setEditingCustomer(customer)
            setOpenForm('customers')
          }}
          onDelete={handleDeleteCustomer}
          statusMessage={customersStatus}
        />

        <SuppliersSection
          rows={suppliers}
          access={access.suppliers}
          isFormOpen={openForm === 'suppliers'}
          onOpenForm={() => {
            setEditingSupplier(null)
            setOpenForm('suppliers')
          }}
          onCloseForm={closeSupplierForm}
          onSubmit={handleSupplierSubmit}
          editingRow={editingSupplier}
          onEdit={(supplier) => {
            setEditingSupplier(supplier)
            setOpenForm('suppliers')
          }}
          onDelete={handleDeleteSupplier}
          statusMessage={suppliersStatus}
        />

        <OrderItemsSection
          rows={orderItems}
          access={access.orders}
          isFormOpen={openForm === 'order-items'}
          onOpenForm={() => {
            setEditingOrderItem(null)
            setOpenForm('order-items')
          }}
          onCloseForm={closeOrderItemForm}
          onSubmit={handleOrderItemSubmit}
          editingRow={
            editingOrderItem
              ? {
                  ...editingOrderItem,
                  orderId: Number(editingOrderItem.orderId),
                  productId: Number(editingOrderItem.productId),
                }
              : null
          }
          onEdit={(item) => {
            setEditingOrderItem(item)
            setOpenForm('order-items')
          }}
          onDelete={handleDeleteOrderItem}
          statusMessage={orderItemsStatus}
          orderOptions={orders.map((order) => ({
            label: `Order #${order.id}`,
            value: String(order.id),
          }))}
          productOptions={products.map((product) => ({
            label: product.name,
            value: String(product.id),
          }))}
        />

        <OrdersSection
          rows={orders}
          access={access.orders}
          isFormOpen={openForm === 'orders'}
          onOpenForm={() => {
            setEditingOrder(null)
            setOpenForm('orders')
          }}
          onCloseForm={closeOrderForm}
          onSubmit={handleOrderSubmit}
          editingRow={
            editingOrder
              ? {
                  ...editingOrder,
                  customer: String(editingOrder.customerId),
                  warehouse: String(editingOrder.warehouseId),
                }
              : null
          }
          onEdit={(order) => {
            setEditingOrder(order)
            setOpenForm('orders')
          }}
          onDelete={handleDeleteOrder}
          statusMessage={ordersStatus}
          customerOptions={customers.map((customer) => ({
            label: customer.name,
            value: String(customer.id),
          }))}
          warehouseOptions={warehouses.map((warehouse) => ({
            label: warehouse.name,
            value: String(warehouse.id),
          }))}
          statusOptions={[
            { label: 'Placed', value: 'placed' },
            { label: 'Packed', value: 'packed' },
            { label: 'Dispatched', value: 'dispatched' },
            { label: 'Delivered', value: 'delivered' },
          ]}
        />

        <RestocksSection
          rows={restocks}
          access={access.restocks}
          isFormOpen={openForm === 'restocks'}
          onOpenForm={() => {
            setEditingRestock(null)
            setOpenForm('restocks')
          }}
          onCloseForm={closeRestockForm}
          onSubmit={handleRestockSubmit}
          editingRow={
            editingRestock
              ? {
                  ...editingRestock,
                  warehouse: String(editingRestock.warehouseId),
                  product: String(editingRestock.productId),
                  supplier: String(editingRestock.supplierId),
                }
              : null
          }
          onEdit={(restock) => {
            setEditingRestock(restock)
            setOpenForm('restocks')
          }}
          onDelete={handleDeleteRestock}
          statusMessage={restocksStatus}
          warehouseOptions={warehouses.map((warehouse) => ({
            label: warehouse.name,
            value: String(warehouse.id),
          }))}
          productOptions={products.map((product) => ({
            label: product.name,
            value: String(product.id),
          }))}
          supplierOptions={suppliers.map((supplier) => ({
            label: supplier.name,
            value: String(supplier.id),
          }))}
          statusOptions={[
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Received', value: 'received' },
          ]}
        />
      </div>
    </div>
  )
}
