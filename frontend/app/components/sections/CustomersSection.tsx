import AddRecordForm from "../AddRecordForm";
import DataTable from "../dashboard/DataTable";
import SectionCard from "../dashboard/SectionCard";
import type { Access, CustomerRow, Row } from "../../types/qcims";

export default function CustomersSection({
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
  rows: CustomerRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
  editingRow?: CustomerRow | null;
  onEdit: (row: CustomerRow) => void;
  onDelete: (row: CustomerRow) => void;
  statusMessage?: string;
}) {
  return (
    <SectionCard
      title="Customers"
      action={
        access.create ? (
          <button
            type="button"
            onClick={onOpenForm}
            className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Customer
          </button>
        ) : undefined
      }
    >
      {statusMessage && (
        <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {statusMessage}
        </p>
      )}
      {isFormOpen && (
        <AddRecordForm
          title={editingRow ? "Customer Details" : "Customer"}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "phone", label: "Phone", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "pincode", label: "Pincode", type: "text", required: true },
          ]}
          initialValues={editingRow ?? undefined}
          submitLabel={editingRow ? "Update" : "Save"}
          onSubmit={onSubmit}
          onCancel={onCloseForm}
        />
      )}
      <DataTable
        rows={rows}
        access={access}
        actions={{
          primary: "Edit",
          secondary: "Delete",
          onPrimary: onEdit,
          onSecondary: onDelete,
        }}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
          { key: "pincode", label: "Pincode" },
        ]}
      />
    </SectionCard>
  );
}
