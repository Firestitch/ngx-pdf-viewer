import { FieldType } from '../enums';
import { PdfField } from '../interfaces';


export function initField(field: PdfField): any {
  field.tabIndex = (field.tabIndex ?? 1000) + (field.pageNumber * 10000);
  field.name = field.name || field.guid;

  if (field.default && !field.value) {
    switch (field.type) {
      case FieldType.Date:
        if (field.default === 'today') {
          field.value = new Date();
        }

        break;

      default:
        field.value = field.default;
    }
  }

  return field;
}