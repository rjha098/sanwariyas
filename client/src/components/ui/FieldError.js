// FILE: client/src/components/ui/FieldError.js
// Simple inline field-level validation message. Pass `id` and reference it from
// the input via aria-describedby so screen readers announce it with the field.

export default function FieldError({ id, message, className = "" }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={`mt-1.5 font-sans text-xs leading-snug text-red-600 ${className}`}
    >
      {message}
    </p>
  );
}