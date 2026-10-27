// FILE: server/utils/validateState.js
// Shared State / Province validation for every inquiry form.
// Letters (any language), spaces and . ' - & only, 2-80 characters.
const STATE_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'&-]*$/u;

export const normalizeState = (value) =>
  String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Returns { value } when valid, otherwise { error }.
export const validateState = (value) => {
  const v = normalizeState(value);
  if (!v) return { error: "Please enter your state." };
  if (v.length < 2 || v.length > 80 || !STATE_RE.test(v)) {
    return { error: "Please enter a valid state (letters only, 2-80 characters)." };
  }
  return { value: v };
};