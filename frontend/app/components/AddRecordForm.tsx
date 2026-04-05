import { useEffect, useState } from 'react'

type FieldSpec = {
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'checkbox' | 'select'
  required?: boolean
  options?: Array<{ label: string; value: string }>
}

type AddRecordFormProps = {
  title: string
  fields: FieldSpec[]
  onSubmit: (data: Record<string, string | number | boolean>) => void
  onCancel: () => void
  initialValues?: Record<string, string | number | boolean>
  submitLabel?: string
}

function buildInitialForm(
  fields: FieldSpec[],
  initialValues?: Record<string, string | number | boolean>,
) {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      initialValues?.[field.name] ?? (field.type === 'checkbox' ? false : ''),
    ]),
  )
}

export default function AddRecordForm({
  title,
  fields,
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = 'Save',
}: AddRecordFormProps) {
  const [form, setForm] = useState<Record<string, string | number | boolean>>(
    buildInitialForm(fields, initialValues),
  )

  useEffect(() => {
    setForm(buildInitialForm(fields, initialValues))
  }, [fields, initialValues])

  const handleChange = (name: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(form)
    setForm(buildInitialForm(fields, initialValues))
  }

  return (
    <form onSubmit={handleSubmit} className='ui-card mb-4 p-4'>
      <h3 className='mb-3 text-base font-semibold text-slate-900'>{title}</h3>

      <div className='grid gap-4 md:grid-cols-2'>
        {fields.map((field) => (
          <label key={field.name} className='flex flex-col gap-1'>
            <span className='ui-label'>{field.label}</span>
            {field.type === 'checkbox' ? (
              <span className='mt-2 flex items-center'>
                <input
                  type='checkbox'
                  checked={Boolean(form[field.name])}
                  onChange={(event) =>
                    handleChange(field.name, event.target.checked)
                  }
                  className='h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                />
              </span>
            ) : field.type === 'select' ? (
              <select
                value={String(form[field.name] ?? '')}
                required={field.required}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
                className='ui-select'
              >
                <option value=''>Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={String(form[field.name] ?? '')}
                required={field.required}
                onChange={(event) => {
                  const v =
                    field.type === 'number'
                      ? Number(event.target.value)
                      : event.target.value
                  handleChange(field.name, v)
                }}
                className='ui-input'
              />
            )}
          </label>
        ))}
      </div>
      <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end'>
        <button type='submit' className='ui-button-primary'>
          {submitLabel}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='ui-button-secondary'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
