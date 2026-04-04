import AddRecordForm from "../AddRecordForm";
import DataTable from "../dashboard/DataTable";
import SectionCard from "../dashboard/SectionCard";
import { money } from "../../lib/format";
import type { Access, DataColumn, OrderItemRow, Row } from "../../types/qcims";

const columns: DataColumn<OrderItemRow>[] = [
  { key: "id", label: "ID" },
  { key: "orderId", label: "Order ID" },
  { key: "product", label: "Product" },
  { key: "quantity", label: "Quantity" },
  { key: "priceAtOrder", label: "Price at Order", render: (value) => money.format(Number(value)) },
];

export default function OrderItemsSection({
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
  orderOptions,
  productOptions,
}: {
  rows: OrderItemRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
  editingRow?: OrderItemRow | null;
  onEdit: (row: OrderItemRow) => void;
  onDelete: (row: OrderItemRow) => void;
  statusMessage?: string;
  orderOptions: Array<{ label: string; value: string }>;
  productOptions: Array<{ label: string; value: string }>;
}) {
  return (
    <SectionCard
      title="Order Items"
      action={
        access.create ? (
          <button
            type="button"
            onClick={onOpenForm}
            className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Order Item
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
          title={editingRow ? "Order Item" : "Order Item"}
          fields={[
            {
              name: "orderId",
              label: "Order",
              type: "select",
              required: true,
              options: orderOptions,
            },
            {
              name: "productId",
              label: "Product",
              type: "select",
              required: true,
              options: productOptions,
            },
            { name: "quantity", label: "Quantity", type: "number", required: true },
            { name: "priceAtOrder", label: "Price at Order", type: "number", required: true },
          ]}
          initialValues={editingRow ?? undefined}
          submitLabel={editingRow ? "Update" : "Save"}
          onSubmit={onSubmit}
          onCancel={onCloseForm}
        />
      )}
      <DataTable
        columns={columns}
        rows={rows}
        access={access}
        actions={{
          primary: "Edit",
          secondary: "Delete",
          onPrimary: onEdit,
          onSecondary: onDelete,
        }}
      />
    </SectionCard>
  );
}
