import AddRecordForm from "../AddRecordForm";
import type { Access, DataColumn, FormField, Row } from "../../types/qcims";
import DataTable from "./DataTable";
import SectionCard from "./SectionCard";

export default function CrudSection<T extends Row>({
  title,
  addLabel,
  rows,
  columns,
  access,
  actions,
  formTitle,
  fields,
  isFormOpen,
  onOpenForm,
  onCloseForm,
  onSubmit,
}: {
  title: string;
  addLabel?: string;
  rows: T[];
  columns: DataColumn<T>[];
  access: Access;
  actions?: { primary: string; secondary?: string };
  formTitle?: string;
  fields?: FormField[];
  isFormOpen?: boolean;
  onOpenForm?: () => void;
  onCloseForm?: () => void;
  onSubmit?: (data: Row) => void;
}) {
  return (
    <SectionCard
      title={title}
      action={
        access.create && addLabel && onOpenForm ? (
          <button
            type="button"
            onClick={onOpenForm}
            className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {addLabel}
          </button>
        ) : undefined
      }
    >
      {isFormOpen && fields && onSubmit && onCloseForm && (
        <AddRecordForm
          title={formTitle || title}
          fields={fields}
          onSubmit={onSubmit}
          onCancel={onCloseForm}
        />
      )}
      <DataTable columns={columns} rows={rows} access={access} actions={actions} />
    </SectionCard>
  );
}
