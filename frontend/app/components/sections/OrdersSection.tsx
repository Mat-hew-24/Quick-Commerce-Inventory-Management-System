import AddRecordForm from '../AddRecordForm'
import DataTable from '../dashboard/DataTable'
import SectionCard from '../dashboard/SectionCard'
import { money } from '../../lib/format'
import type { Access, OrderRow, Row } from '../../types/qcims'

export default function OrdersSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
  editingRow,
  onEdit,
  onDelete,
  statusMessage,
  customerOptions,
  warehouseOptions,
  statusOptions,
}: {
  rows: OrderRow[]
  access: Access
  isFormOpen: boolean
  onOpenForm: () => void
  onCloseForm: () => void
  onSubmit: (data: Row) => void
  editingRow?: OrderRow | null
  onEdit: (row: OrderRow) => void
  onDelete: (row: OrderRow) => void
  statusMessage?: string
  customerOptions: Array<{ label: string; value: string }>
  warehouseOptions: Array<{ label: string; value: string }>
  statusOptions: Array<{ label: string; value: string }>
}) {
  return (
    <SectionCard
      title='Orders'
      action={
        access.create ? (
          <button
            type='button'
            onClick={onOpenForm}
            className='ui-button-primary'
          >
            Create Order
          </button>
        ) : undefined
      }
    >
      {statusMessage && (
        <p className='mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
          {statusMessage}
        </p>
      )}
      {isFormOpen && (
        <AddRecordForm
          title={editingRow ? 'Order Details' : 'Order'}
          fields={[
            {
              name: 'customer',
              label: 'Customer',
              type: 'select',
              required: true,
              options: customerOptions,
            },
            {
              name: 'warehouse',
              label: 'Warehouse',
              type: 'select',
              required: true,
              options: warehouseOptions,
            },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              required: true,
              options: statusOptions,
            },
            { name: 'total', label: 'Total', type: 'number', required: true },
          ]}
          initialValues={editingRow ?? undefined}
          submitLabel={editingRow ? 'Update' : 'Save'}
          onSubmit={onSubmit}
          onCancel={onCloseForm}
        />
      )}
      <DataTable
        rows={rows}
        access={access}
        actions={{
          primary: 'Update Status',
          secondary: 'Delete',
          onPrimary: onEdit,
          onSecondary: onDelete,
        }}
        columns={[
          { key: 'id', label: 'Order ID' },
          { key: 'customer', label: 'Customer' },
          { key: 'warehouse', label: 'Warehouse' },
          { key: 'status', label: 'Status' },
          {
            key: 'total',
            label: 'Total',
            render: (value) => money.format(Number(value)),
          },
        ]}
      />
    </SectionCard>
  )
}
