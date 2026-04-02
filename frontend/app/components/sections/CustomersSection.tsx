import CrudSection from "../dashboard/CrudSection";
import type { Access, CustomerRow, Row } from "../../types/qcims";

export default function CustomersSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: CustomerRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Customers"
      addLabel="Add Customer"
      rows={rows}
      access={access}
      actions={{ primary: "Edit", secondary: "Delete" }}
      formTitle="Customer"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "phone", label: "Phone", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "pincode", label: "Pincode", type: "text", required: true },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "pincode", label: "Pincode" },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
