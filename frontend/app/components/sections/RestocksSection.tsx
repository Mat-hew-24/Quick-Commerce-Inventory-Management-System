import AddRecordForm from '../AddRecordForm'
import DataTable from '../dashboard/DataTable'
import SectionCard from '../dashboard/SectionCard'
import type { Access, RestockRow, Row } from '../../types/qcims'

export default function RestocksSection({
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
  warehouseOptions,
  productOptions,
  supplierOptions,
  statusOptions,
}: {
  rows: RestockRow[]
  access: Access
  isFormOpen: boolean
  onOpenForm: () => void
  onCloseForm: () => void
  onSubmit: (data: Row) => void
  editingRow?: RestockRow | null
  onEdit: (row: RestockRow) => void
  onDelete: (row: RestockRow) => void
  statusMessage?: string
  warehouseOptions: Array<{ label: string; value: string }>
  productOptions: Array<{ label: string; value: string }>
  supplierOptions: Array<{ label: string; value: string }>
  statusOptions: Array<{ label: string; value: string }>
}) {
  return (
    <SectionCard
      title='Restock Requests'
      action={
        access.create ? (
          <button
            type='button'
            onClick={onOpenForm}
            className='ui-button-primary'
          >
            New Restock
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
          title={editingRow ? 'Restock Request' : 'Restock'}
          fields={[
            {
              name: 'warehouse',
              label: 'Warehouse',
              type: 'select',
              required: true,
              options: warehouseOptions,
            },
            {
              name: 'product',
              label: 'Product',
              type: 'select',
              required: true,
              options: productOptions,
            },
            {
              name: 'supplier',
              label: 'Supplier',
              type: 'select',
              required: true,
              options: supplierOptions,
            },
            {
              name: 'quantity',
              label: 'Quantity',
              type: 'number',
              required: true,
            },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              required: true,
              options: statusOptions,
            },
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
          primary: 'Update',
          secondary: 'Delete',
          onPrimary: onEdit,
          onSecondary: onDelete,
        }}
        columns={[
          { key: 'id', label: 'Request ID' },
          { key: 'warehouse', label: 'Warehouse' },
          { key: 'product', label: 'Product' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </SectionCard>
  )
}
