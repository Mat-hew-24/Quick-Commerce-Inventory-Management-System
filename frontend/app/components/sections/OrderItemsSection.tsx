import { money } from "../../lib/format";
import type { DataColumn, OrderItemRow } from "../../types/qcims";
import DataTable from "../dashboard/DataTable";
import SectionCard from "../dashboard/SectionCard";

const columns: DataColumn<OrderItemRow>[] = [
  { key: "id", label: "ID" },
  { key: "orderId", label: "Order ID" },
  { key: "product", label: "Product" },
  { key: "quantity", label: "Quantity" },
  { key: "priceAtOrder", label: "Price at Order", render: (value) => money.format(Number(value)) },
];

export default function OrderItemsSection({ rows }: { rows: OrderItemRow[] }) {
  return (
    <SectionCard title="Order Items">
      <DataTable columns={columns} rows={rows} />
    </SectionCard>
  );
}
