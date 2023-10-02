import { GroupField } from '../interfaces';

export function hasValue(field: GroupField) {
  return field.value !== null && field.value !== undefined && !!String(field.value).length;
}