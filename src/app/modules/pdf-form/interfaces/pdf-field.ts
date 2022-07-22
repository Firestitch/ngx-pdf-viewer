import { FieldType } from '../enums';

export interface PdfField {
  type: FieldType | string;
  guid?: string;
  name?: string;
  value?: any;
  required?: boolean;
  readonly?: boolean;
  numeric?: boolean;
  maxLength?: number;
  label?: string;
  groupLabel?: string;
  groupDescription?: string;
  description?: string;
  formula?: string;
  format?: string;
  default?: any;
  index?: number;
  top?: number,
  left?: number,
  width?: number,
  height?: number,
  pageNumber?: number,
}