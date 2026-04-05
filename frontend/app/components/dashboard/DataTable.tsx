import { getCellValue } from '../../lib/format'
import type { Access, DataColumn, Row } from '../../types/qcims'

function ActionCell({
  access,
  labels,
  onPrimary,
  onSecondary,
}: {
  access: Access
  labels?: { primary: string; secondary?: string }
  onPrimary?: () => void
  onSecondary?: () => void
}) {
  if (!labels || (!access.edit && !access.remove)) {
    return <span className='text-sm text-slate-400'>View only</span>
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {access.edit && (
        <button
          type='button'
          onClick={onPrimary}
          disabled={!onPrimary}
          className='inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 shadow-sm cursor-pointer hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {labels.primary}
        </button>
      )}
      {access.remove && labels.secondary && (
        <button
          type='button'
          onClick={onSecondary}
          disabled={!onSecondary}
          className='inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-sm cursor-pointer hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {labels.secondary}
        </button>
      )}
    </div>
  )
}

export default function DataTable<T extends Row>({
  columns,
  rows,
  access,
  actions,
}: {
  columns: DataColumn<T>[]
  rows: T[]
  access?: Access
  actions?: {
    primary: string
    secondary?: string
    onPrimary?: (row: T) => void
    onSecondary?: (row: T) => void
  }
}) {
  return (
    <div className='max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white'>
      <table className='min-w-full border-collapse text-left'>
        <thead>
          <tr className='bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600'>
            {columns.map((column) => (
              <th key={column.key} className='px-4 py-3'>
                {column.label}
              </th>
            ))}
            {access && <th className='px-4 py-3'>Actions</th>}
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-100'>
          {rows.map((row) => (
            <tr
              key={String(getCellValue(row, 'id'))}
              className='hover:bg-slate-50'
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className='px-4 py-3 text-sm text-slate-700'
                >
                  {column.render
                    ? column.render(getCellValue(row, column.key), row)
                    : String(getCellValue(row, column.key))}
                </td>
              ))}
              {access && (
                <td className='px-4 py-3 text-sm'>
                  <ActionCell
                    access={access}
                    labels={actions}
                    onPrimary={
                      actions?.onPrimary
                        ? () => actions.onPrimary?.(row)
                        : undefined
                    }
                    onSecondary={
                      actions?.onSecondary
                        ? () => actions.onSecondary?.(row)
                        : undefined
                    }
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
