import { useEffect, useState } from "react";

type FieldSpec = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "checkbox" | "select";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
};

type AddRecordFormProps = {
  title: string;
  fields: FieldSpec[];
  onSubmit: (data: Record<string, string | number | boolean>) => void;
  onCancel: () => void;
  initialValues?: Record<string, string | number | boolean>;
  submitLabel?: string;
};

function buildInitialForm(
  fields: FieldSpec[],
  initialValues?: Record<string, string | number | boolean>,
) {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      initialValues?.[field.name] ?? (field.type === "checkbox" ? false : ""),
    ]),
  );
}

export default function AddRecordForm({
  title,
  fields,
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = "Save",
}: AddRecordFormProps) {
  const [form, setForm] = useState<Record<string, string | number | boolean>>(
    buildInitialForm(fields, initialValues),
  );

  useEffect(() => {
    setForm(buildInitialForm(fields, initialValues));
  }, [fields, initialValues]);

  const handleChange = (name: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
    setForm(buildInitialForm(fields, initialValues));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4"
    >
      <h3 className="mb-3 text-lg font-semibold text-blue-800">Add {title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className="flex flex-col text-sm text-slate-700"
          >
            <span className="mb-1 font-medium">{field.label}</span>
            {field.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={Boolean(form[field.name])}
                onChange={(event) =>
                  handleChange(field.name, event.target.checked)
                }
                className="h-4 w-4"
              />
            ) : field.type === "select" ? (
              <select
                value={String(form[field.name] ?? "")}
                required={field.required}
                onChange={(event) => handleChange(field.name, event.target.value)}
                className="rounded-md border border-slate-300 p-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={String(form[field.name] ?? "")}
                required={field.required}
                onChange={(event) => {
                  const v =
                    field.type === "number"
                      ? Number(event.target.value)
                      : event.target.value;
                  handleChange(field.name, v);
                }}
                className="rounded-md border border-slate-300 p-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
