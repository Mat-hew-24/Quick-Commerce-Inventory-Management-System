'use client'

import { useState } from 'react'
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
import {
  dashboardStats,
  initialCustomers,
  initialInventory,
  initialOrderItems,
  initialOrders,
  initialProducts,
  initialRestocks,
  initialSuppliers,
  initialWarehouses,
} from './data/mockData'
import { getSectionAccess } from './lib/access'
import { createAddRowHandler } from './lib/state'
import type { Role } from './types/qcims'

export default function Home() {
  const [role, setRole] = useState<Role | null>(null)
  const [products, setProducts] = useState(initialProducts)
  const [warehouses, setWarehouses] = useState(initialWarehouses)
  const [inventory, setInventory] = useState(initialInventory)
  const [customers, setCustomers] = useState(initialCustomers)
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [orders, setOrders] = useState(initialOrders)
  const [orderItems] = useState(initialOrderItems)
  const [restocks, setRestocks] = useState(initialRestocks)
  const [openForm, setOpenForm] = useState<string | null>(null)

  if (!role) {
    return <Login onLogin={(r) => setRole(r)} />
  }

  const access = getSectionAccess(role)
  const closeForm = () => setOpenForm(null)

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white p-5 md:p-10'>
      <div className='mx-auto w-full max-w-6xl'>
        <QcimsHeader role={role} onLogout={() => setRole(null)} />

        <section className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
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
          onOpenForm={() => setOpenForm('products')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(setProducts, closeForm, (data, id) => ({
            id,
            name: String(data.name || ''),
            category: String(data.category || ''),
            price: Number(data.unit_price || 0),
            stock: Number(data.stock || 0),
          }))}
        />

        <WarehousesSection
          rows={warehouses}
          access={access.warehouses}
          isFormOpen={openForm === 'warehouses'}
          onOpenForm={() => setOpenForm('warehouses')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(
            setWarehouses,
            closeForm,
            (data, id) => ({
              id,
              name: String(data.name || ''),
              city: String(data.city || ''),
              pincode: String(data.pincode || ''),
              capacity: Number(data.capacity || 0),
            }),
          )}
        />

        <InventorySection
          rows={inventory}
          access={access.inventory}
          isFormOpen={openForm === 'inventory'}
          onOpenForm={() => setOpenForm('inventory')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(
            setInventory,
            closeForm,
            (data, id) => ({
              id,
              warehouse: String(data.warehouse || ''),
              product: String(data.product || ''),
              quantity: Number(data.quantity || 0),
              reorder: Number(data.reorder || 0),
              available: Boolean(data.is_available),
            }),
          )}
        />

        <CustomersSection
          rows={customers}
          access={access.customers}
          isFormOpen={openForm === 'customers'}
          onOpenForm={() => setOpenForm('customers')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(
            setCustomers,
            closeForm,
            (data, id) => ({
              id,
              name: String(data.name || ''),
              phone: String(data.phone || ''),
              email: String(data.email || ''),
              pincode: String(data.pincode || ''),
            }),
          )}
        />

        <SuppliersSection
          rows={suppliers}
          access={access.suppliers}
          isFormOpen={openForm === 'suppliers'}
          onOpenForm={() => setOpenForm('suppliers')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(
            setSuppliers,
            closeForm,
            (data, id) => ({
              id,
              name: String(data.name || ''),
              contact: String(data.contact || ''),
              email: String(data.email || ''),
            }),
          )}
        />

        <OrderItemsSection rows={orderItems} />

        <OrdersSection
          rows={orders}
          access={access.orders}
          isFormOpen={openForm === 'orders'}
          onOpenForm={() => setOpenForm('orders')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(setOrders, closeForm, (data, id) => ({
            id,
            customer: String(data.customer || ''),
            warehouse: String(data.warehouse || ''),
            status: String(data.status || 'Pending'),
            total: Number(data.total || 0),
          }))}
        />

        <RestocksSection
          rows={restocks}
          access={access.restocks}
          isFormOpen={openForm === 'restocks'}
          onOpenForm={() => setOpenForm('restocks')}
          onCloseForm={closeForm}
          onSubmit={createAddRowHandler(setRestocks, closeForm, (data, id) => ({
            id,
            warehouse: String(data.warehouse || ''),
            product: String(data.product || ''),
            supplier: String(data.supplier || ''),
            quantity: Number(data.quantity || 0),
            status: String(data.status || 'Pending'),
          }))}
        />
      </div>
    </div>
  )
}
