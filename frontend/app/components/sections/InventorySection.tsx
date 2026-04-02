import CrudSection from "../dashboard/CrudSection";
import type { Access, InventoryRow, Row } from "../../types/qcims";

export default function InventorySection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: InventoryRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Inventory"
      addLabel="Add Inventory"
      rows={rows}
      access={access}
      actions={{ primary: "Update Stock" }}
      formTitle="Inventory Entry"
      fields={[
        { name: "warehouse", label: "Warehouse", type: "text", required: true },
        { name: "product", label: "Product", type: "text", required: true },
        { name: "quantity", label: "Quantity", type: "number", required: true },
        { name: "reorder", label: "Reorder Level", type: "number", required: true },
        { name: "is_available", label: "Available", type: "checkbox" },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "warehouse", label: "Warehouse" },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Qty" },
        { key: "reorder", label: "Reorder" },
        { key: "available", label: "Available", render: (value) => (value ? "Yes" : "No") },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
