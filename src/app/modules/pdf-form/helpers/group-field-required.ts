import { GroupField } from '../interfaces';

export function groupFieldRequired(field: GroupField) {
  return field.required && !field.readonly;
}
