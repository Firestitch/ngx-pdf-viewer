import { PdfField } from '../interfaces';

export function pdfFieldRequired(field: PdfField) {
  return field.required && !field.readonly;
}
