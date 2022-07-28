export function hasValue(field) {
  return field.value !== null && field.value !== undefined && !!String(field.value).length;
}