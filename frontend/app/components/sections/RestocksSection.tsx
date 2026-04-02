import CrudSection from "../dashboard/CrudSection";
import type { Access, RestockRow, Row } from "../../types/qcims";

export default function RestocksSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: RestockRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Restock Requests"
      addLabel="New Restock"
      rows={rows}
      access={access}
      actions={{ primary: "Mark Received" }}
      formTitle="Restock Request"
      fields={[
        { name: "warehouse", label: "Warehouse", type: "text", required: true },
        { name: "product", label: "Product", type: "text", required: true },
        { name: "supplier", label: "Supplier", type: "text", required: true },
        { name: "quantity", label: "Quantity", type: "number", required: true },
        { name: "status", label: "Status", type: "text", required: true },
      ]}
      columns={[
        { key: "id", label: "Request ID" },
        { key: "warehouse", label: "Warehouse" },
        { key: "product", label: "Product" },
        { key: "supplier", label: "Supplier" },
        { key: "quantity", label: "Quantity" },
        { key: "status", label: "Status" },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
