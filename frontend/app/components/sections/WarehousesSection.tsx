import CrudSection from "../dashboard/CrudSection";
import type { Access, Row, WarehouseRow } from "../../types/qcims";

export default function WarehousesSection({
  rows,
  access,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  rows: WarehouseRow[];
  access: Access;
  isFormOpen: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onSubmit: (data: Row) => void;
}) {
  return (
    <CrudSection
      title="Warehouses"
      addLabel="Add Warehouse"
      rows={rows}
      access={access}
      actions={{ primary: "Edit", secondary: "Delete" }}
      formTitle="Warehouse"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "city", label: "City", type: "text", required: true },
        { name: "pincode", label: "Pincode", type: "text", required: true },
        { name: "capacity", label: "Capacity", type: "number", required: true },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "city", label: "City" },
        { key: "pincode", label: "Pincode" },
        { key: "capacity", label: "Capacity" },
      ]}
      isFormOpen={isFormOpen}
      onOpenForm={onOpenForm}
      onCloseForm={onCloseForm}
      onSubmit={onSubmit}
    />
  );
}
