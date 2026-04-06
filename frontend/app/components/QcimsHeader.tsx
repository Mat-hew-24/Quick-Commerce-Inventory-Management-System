'use client'

import { useState, useRef, useEffect } from 'react'

type QcimsHeaderProps = {
  role: 'admin' | 'staff'
  onLogout: () => void
  onAddUser?: () => void
}

const TABLES = [
  'product',
  'warehouse',
  'inventory',
  'customer',
  'supplier',
  'Order',
  'restock',
]

export default function QcimsHeader({
  role,
  onLogout,
  onAddUser,
}: QcimsHeaderProps) {
  const [showExport, setShowExport] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowExport(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDownloadLogs = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'activity.log'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadTable = async (table: string) => {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/export/${table}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${table}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowExport(false)
  }

  return (
    <header className='ui-card mb-7 w-full p-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl'>
            Quick Commerce Inventory Management System
          </h1>
          <p className='mt-2 text-sm text-slate-600 md:text-base'>
            Real-time overview for Products, Warehouses, Inventory, Orders and
            Restocks.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 self-start md:self-auto'>
          {/* ✅ Add User button (from Rachel branch) */}
          {role === 'admin' && (
            <button
              type='button'
              onClick={onAddUser}
              className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm'
            >
              + Add User
            </button>
          )}

          <span className='rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-600'>
            {role}
          </span>

          {role === 'admin' && (
            <>
              <button
                type='button'
                onClick={handleDownloadLogs}
                className='inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50'
              >
                Logs
              </button>

              <div className='relative' ref={dropdownRef}>
                <button
                  type='button'
                  onClick={() => setShowExport((v) => !v)}
                  className='inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50'
                >
                  Export Tables
                </button>

                {showExport && (
                  <div className='absolute right-0 top-full z-10 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg'>
                    <div className='py-1'>
                      {TABLES.map((table) => (
                        <button
                          key={table}
                          onClick={() => downloadTable(table)}
                          className='block w-full px-4 py-2 text-left text-sm capitalize hover:bg-slate-100'
                        >
                          {table}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type='button'
            onClick={onLogout}
            className='rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800'
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
