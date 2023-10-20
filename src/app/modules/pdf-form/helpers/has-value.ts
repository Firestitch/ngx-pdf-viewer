import { FieldType } from '../enums';
import { GroupField, PdfField } from '../interfaces';

export function hasValue(field: GroupField | PdfField) {
  if (field.type === FieldType.Checkbox) {
    return (field.value || []).length;
  }

  return field.value !== null && field.value !== undefined;
}
