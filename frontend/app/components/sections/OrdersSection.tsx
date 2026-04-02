import CrudSection from "../dashboard/CrudSection";
import { money } from "../../lib/format";
import type { Access, OrderRow, Row } from "../../types/qcims";

export default function OrdersSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: OrderRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Orders"
      addLabel="Create Order"
      rows={rows}
      access={access}
      actions={{ primary: "Update Status" }}
      formTitle="Order"
      fields={[
        { name: "customer", label: "Customer", type: "text", required: true },
        { name: "warehouse", label: "Warehouse", type: "text", required: true },
        { name: "status", label: "Status", type: "text", required: true },
        { name: "total", label: "Total", type: "number", required: true },
      ]}
      columns={[
        { key: "id", label: "Order ID" },
        { key: "customer", label: "Customer" },
        { key: "warehouse", label: "Warehouse" },
        { key: "status", label: "Status" },
        { key: "total", label: "Total", render: (value) => money.format(Number(value)) },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
