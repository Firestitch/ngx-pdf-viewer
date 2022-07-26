import { FieldType } from '../enums';
import { PdfField } from '../interfaces';


export function initField(field: PdfField): any {
  field.tabIndex = (field.tabIndex || 0) + (field.pageNumber * 1000);

  if(field.default && !field.value) {
    switch(field.type) {
      case FieldType.Date:
      case FieldType.Birthdate:
        if(field.default === 'today') {
          field.value = new Date();
        }

        break;

      default:
        field.value = field.default;
    }
  }

  return field;
}