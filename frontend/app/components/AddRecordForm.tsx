import { useState } from "react";

type FieldSpec = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "checkbox";
  required?: boolean;
};

type AddRecordFormProps = {
  title: string;
  fields: FieldSpec[];
  onSubmit: (data: Record<string, string | number | boolean>) => void;
  onCancel: () => void;
};

export default function AddRecordForm({
  title,
  fields,
  onSubmit,
  onCancel,
}: AddRecordFormProps) {
  const [form, setForm] = useState<Record<string, string | number | boolean>>(
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.type === "checkbox" ? false : "",
      ]),
    ),
  );

  const handleChange = (name: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
    setForm(
      Object.fromEntries(
        fields.map((field) => [
          field.name,
          field.type === "checkbox" ? false : "",
        ]),
      ),
    );
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
          Save
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
