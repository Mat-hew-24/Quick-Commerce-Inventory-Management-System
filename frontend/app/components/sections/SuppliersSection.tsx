import AddRecordForm from '../AddRecordForm'
import DataTable from '../dashboard/DataTable'
import SectionCard from '../dashboard/SectionCard'
import type { Access, Row, SupplierRow } from '../../types/qcims'

export default function SuppliersSection({
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
  rows: SupplierRow[]
  access: Access
  isFormOpen: boolean
  onOpenForm: () => void
  onCloseForm: () => void
  onSubmit: (data: Row) => void
  editingRow?: SupplierRow | null
  onEdit: (row: SupplierRow) => void
  onDelete: (row: SupplierRow) => void
  statusMessage?: string
}) {
  return (
    <SectionCard
      title='Suppliers'
      action={
        access.create ? (
          <button
            type='button'
            onClick={onOpenForm}
            className='ui-button-primary'
          >
            Add Supplier
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
          title={editingRow ? 'Supplier Details' : 'Supplier'}
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'contact', label: 'Contact', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
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
          { key: 'contact', label: 'Contact' },
          { key: 'email', label: 'Email' },
        ]}
      />
    </SectionCard>
  )
}
