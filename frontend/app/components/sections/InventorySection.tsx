import AddRecordForm from '../AddRecordForm'
import DataTable from '../dashboard/DataTable'
import SectionCard from '../dashboard/SectionCard'
import type { Access, InventoryRow, Row } from '../../types/qcims'

export default function InventorySection({
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
}: {
  rows: InventoryRow[]
  access: Access
  isFormOpen: boolean
  onOpenForm: () => void
  onCloseForm: () => void
  onSubmit: (data: Row) => void
  editingRow?: InventoryRow | null
  onEdit: (row: InventoryRow) => void
  onDelete: (row: InventoryRow) => void
  statusMessage?: string
  warehouseOptions: Array<{ label: string; value: string }>
  productOptions: Array<{ label: string; value: string }>
}) {
  return (
    <SectionCard
      title='Inventory'
      action={
        access.create ? (
          <button
            type='button'
            onClick={onOpenForm}
            className='ui-button-primary'
          >
            Add Inventory
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
          title={editingRow ? 'Inventory Entry' : 'Inventory'}
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
              name: 'quantity',
              label: 'Quantity',
              type: 'number',
              required: true,
            },
            {
              name: 'reorder',
              label: 'Reorder Level',
              type: 'number',
              required: true,
            },
            { name: 'is_available', label: 'Available', type: 'checkbox' },
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
          primary: 'Update Stock',
          secondary: 'Delete',
          onPrimary: onEdit,
          onSecondary: onDelete,
        }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'warehouse', label: 'Warehouse' },
          { key: 'product', label: 'Product' },
          { key: 'quantity', label: 'Qty' },
          { key: 'reorder', label: 'Reorder' },
          {
            key: 'available',
            label: 'Available',
            render: (value) => (value ? 'Yes' : 'No'),
          },
        ]}
      />
    </SectionCard>
  )
}
