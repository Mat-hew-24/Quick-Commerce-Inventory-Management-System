import CrudSection from "../dashboard/CrudSection";
import type { Access, Row, SupplierRow } from "../../types/qcims";

export default function SuppliersSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: SupplierRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Suppliers"
      addLabel="Add Supplier"
      rows={rows}
      access={access}
      actions={{ primary: "Edit", secondary: "Delete" }}
      formTitle="Supplier"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "contact", label: "Contact", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "contact", label: "Contact" },
        { key: "email", label: "Email" },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
