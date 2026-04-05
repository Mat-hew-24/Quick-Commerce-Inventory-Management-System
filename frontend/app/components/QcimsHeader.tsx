type QcimsHeaderProps = {
  role: 'admin' | 'staff'
  onLogout: () => void
}

export default function QcimsHeader({ role, onLogout }: QcimsHeaderProps) {
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
        <div className='flex items-center gap-3 self-start md:self-auto'>
          <span className='rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700'>
            {role}
          </span>
          <button
            type='button'
            onClick={onLogout}
            className='ui-button-secondary'
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
