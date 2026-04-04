import AddRecordForm from "../AddRecordForm";
import DataTable from "../dashboard/DataTable";
import SectionCard from "../dashboard/SectionCard";
import { money } from "../../lib/format";
import type { Access, ProductRow, Row } from "../../types/qcims";

export default function ProductsSection({
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
  rows: ProductRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
  editingRow?: ProductRow | null;
  onEdit: (row: ProductRow) => void;
  onDelete: (row: ProductRow) => void;
  statusMessage?: string;
}) {
  return (
    <SectionCard
      title="Products"
      action={
        access.create ? (
          <button
            type="button"
            onClick={onOpenForm}
            className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Product
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
          title={editingRow ? "Product Details" : "Product"}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "category", label: "Category", type: "text", required: true },
            { name: "unit_price", label: "Unit price", type: "number", required: true },
            { name: "stock", label: "Weight", type: "number", required: true },
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
          { key: "category", label: "Category" },
          { key: "price", label: "Price", render: (value) => money.format(Number(value)) },
          { key: "stock", label: "Weight" },
        ]}
      />
    </SectionCard>
  );
}
