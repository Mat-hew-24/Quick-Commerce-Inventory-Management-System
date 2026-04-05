import type { ReactNode } from 'react'

export default function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className='ui-card mb-8 p-6'>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-lg font-semibold text-slate-900 md:text-xl'>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
