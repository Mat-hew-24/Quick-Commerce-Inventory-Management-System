import { getCellValue } from "../../lib/format";
import type { Access, DataColumn, Row } from "../../types/qcims";

function ActionCell({
  access,
  labels,
}: {
  access: Access;
  labels?: { primary: string; secondary?: string };
}) {
  if (!labels || (!access.edit && !access.remove)) {
    return <span className="text-sm text-slate-400">View only</span>;
  }

  return (
    <>
      {access.edit && (
        <span className="mr-3 cursor-not-allowed text-slate-400">
          {labels.primary}
        </span>
      )}
      {access.remove && labels.secondary && (
        <span className="cursor-not-allowed text-slate-400">
          {labels.secondary}
        </span>
      )}
    </>
  );
}

export default function DataTable<T extends Row>({
  columns,
  rows,
  access,
  actions,
}: {
  columns: DataColumn<T>[];
  rows: T[];
  access?: Access;
  actions?: { primary: string; secondary?: string };
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                {column.label}
              </th>
            ))}
            {access && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={String(getCellValue(row, "id"))}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
                  {column.render
                    ? column.render(getCellValue(row, column.key), row)
                    : String(getCellValue(row, column.key))}
                </td>
              ))}
              {access && (
                <td className="px-4 py-3 text-sm">
                  <ActionCell access={access} labels={actions} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
