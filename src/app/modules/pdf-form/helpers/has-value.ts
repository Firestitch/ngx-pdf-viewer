export function hasValue(field) {
  return field.value !== null && !!String(field.value).length;
}