import type { FieldDefinition } from "@/types/contact";
export function FormField({
  field,
  error,
}: {
  field: FieldDefinition;
  error?: string;
}) {
  const describedBy =
    [field.hint ? `${field.name}-hint` : "", error ? `${field.name}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined;
  const props = {
    id: field.name,
    name: field.name,
    required: field.required,
    autoComplete: field.autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": describedBy,
  };
  return (
    <div
      className={`form-field ${field.type === "textarea" ? "full-width" : ""}`}
    >
      <label htmlFor={field.name}>
        {field.label}{" "}
        {field.required ? (
          <span aria-hidden="true">*</span>
        ) : (
          <span className="optional">(optional)</span>
        )}
      </label>
      {field.type === "textarea" ? (
        <textarea {...props} maxLength={2500} rows={5} />
      ) : field.type === "select" ? (
        <select {...props} defaultValue="">
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          {...props}
          type={field.type ?? "text"}
          min={field.type === "number" ? 1 : undefined}
          step={field.type === "number" ? 1 : undefined}
          maxLength={
            field.type === "number" || field.type === "date" ? undefined : 250
          }
        />
      )}
      {field.hint && (
        <p id={`${field.name}-hint`} className="field-hint">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={`${field.name}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
