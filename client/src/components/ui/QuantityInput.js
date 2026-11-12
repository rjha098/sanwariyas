// FILE: client/src/components/ui/QuantityInput.js
"use client";

const MAX_DIGITS = 7;

// Returns an inline validation message ("" when the value is fine).
// An empty value is allowed because the field is optional on some forms.
export function getQuantityError(value, min = 10, minMessage) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (text.startsWith("-")) return "Quantity cannot be negative.";
  if (!/^\d+$/.test(text)) return "Please enter a whole number (digits only).";
  if (parseInt(text, 10) < min) {
    return minMessage || `Minimum order quantity is ${min} pieces.`;
  }
  return "";
}

const VARIANTS = {
  contact: {
    base: "w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-colors duration-200",
    error: "border-red-400 focus:border-red-500 bg-red-50/30",
    success: "border-green-400 focus:border-green-500 bg-green-50/20",
    idle: "border-[#a07f61]/30 focus:border-[#BE6E5B] bg-[#f8f4ec]",
  },
  plain: {
    base: "w-full px-4 py-3 border font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none transition-colors duration-300",
    error: "border-red-400 focus:border-red-500 bg-white",
    success: "border-brand-lightgold/60 focus:border-brand-coffee bg-white",
    idle: "border-brand-lightgold/60 focus:border-brand-coffee bg-white",
  },
};

function StepButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#a07f61]/30 bg-white/80 text-[#7A3D2A] transition-colors hover:bg-[#BE6E5B]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A3D2A] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/80"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        {children}
      </svg>
    </button>
  );
}

// Digits-only quantity field with its own − / + controls. It never accepts a
// negative number, "e", "+", "-" or "." and the controls never go below `min`.
// `onChange` receives an event-like object ({ target: { name, value } }) so it
// can be dropped into existing handleChange(e) handlers unchanged.
export default function QuantityInput({
  id,
  name = "quantity",
  value,
  onChange,
  onBlur,
  min = 10,
  step = 1,
  suffix = "pcs",
  placeholder = "e.g. 100",
  error = false,
  success = false,
  errorId,
  required = false,
  variant = "contact",
  disabled = false,
}) {
  const v = VARIANTS[variant] || VARIANTS.contact;
  const stateCls = error ? v.error : success ? v.success : v.idle;
  const current = parseInt(String(value ?? ""), 10);
  const hasValue = Number.isFinite(current);

  const emit = (next) => onChange?.({ target: { name, value: String(next) } });

  const handleInput = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, MAX_DIGITS);
    emit(digits);
  };

  const handleKeyDown = (e) => {
    if (["-", "+", "e", "E", ".", ","].includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increase();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrease();
    }
  };

  const increase = () => {
    if (disabled) return;
    emit(hasValue ? Math.min(current + step, 10 ** MAX_DIGITS - 1) : min);
  };

  const decrease = () => {
    if (disabled || !hasValue) return;
    emit(Math.max(min, current - step));
  };

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={value ?? ""}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId || undefined}
        className={`${v.base} ${stateCls} ${suffix ? "pr-32" : "pr-24"}`}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {suffix && (
          <span
            aria-hidden="true"
            className="pointer-events-none select-none font-sans text-[11px] tracking-wide text-[#a07f61]"
          >
            {suffix}
          </span>
        )}
        <div className="flex items-center gap-1">
          <StepButton
            label="Decrease quantity"
            onClick={decrease}
            disabled={disabled || !hasValue || current <= min}
          >
            <path d="M2.5 6h7" />
          </StepButton>
          <StepButton
            label="Increase quantity"
            onClick={increase}
            disabled={disabled}
          >
            <path d="M2.5 6h7M6 2.5v7" />
          </StepButton>
        </div>
      </div>
    </div>
  );
}