import { PdfField } from '../interfaces';
import { initField } from './init-field';


export function initFields(accum, field: PdfField): any {
  field = initField(field);
    accum = [
      ...accum,
      field
    ];

  return accum;
}
