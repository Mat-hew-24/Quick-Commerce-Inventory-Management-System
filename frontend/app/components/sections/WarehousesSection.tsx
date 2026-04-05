import AddRecordForm from '../AddRecordForm'
import DataTable from '../dashboard/DataTable'
import SectionCard from '../dashboard/SectionCard'
import type { Access, Row, WarehouseRow } from '../../types/qcims'

export default function WarehousesSection({
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
}: {
  rows: WarehouseRow[]
  access: Access
  isFormOpen: boolean
  onOpenForm: () => void
  onCloseForm: () => void
  onSubmit: (data: Row) => void
  editingRow?: WarehouseRow | null
  onEdit: (row: WarehouseRow) => void
  onDelete: (row: WarehouseRow) => void
  statusMessage?: string
}) {
  return (
    <SectionCard
      title='Warehouses'
      action={
        access.create ? (
          <button
            type='button'
            onClick={onOpenForm}
            className='ui-button-primary'
          >
            Add Warehouse
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
          title={editingRow ? 'Warehouse Details' : 'Warehouse'}
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'city', label: 'City', type: 'text', required: true },
            { name: 'pincode', label: 'Pincode', type: 'text', required: true },
            {
              name: 'capacity',
              label: 'Capacity',
              type: 'number',
              required: true,
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
          primary: 'Edit',
          secondary: 'Delete',
          onPrimary: onEdit,
          onSecondary: onDelete,
        }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'city', label: 'City' },
          { key: 'pincode', label: 'Pincode' },
          { key: 'capacity', label: 'Capacity' },
        ]}
      />
    </SectionCard>
  )
}
