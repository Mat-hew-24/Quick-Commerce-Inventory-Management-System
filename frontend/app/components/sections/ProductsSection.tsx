import CrudSection from "../dashboard/CrudSection";
import { money } from "../../lib/format";
import type { Access, ProductRow, Row } from "../../types/qcims";

export default function ProductsSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: ProductRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Products"
      addLabel="Add Product"
      rows={rows}
      access={access}
      actions={{ primary: "Edit", secondary: "Delete" }}
      formTitle="Product"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "unit_price", label: "Unit price", type: "number", required: true },
        { name: "stock", label: "Stock", type: "number", required: true },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "price", label: "Price", render: (value) => money.format(Number(value)) },
        { key: "stock", label: "Stock" },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
