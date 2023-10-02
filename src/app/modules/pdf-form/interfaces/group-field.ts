import { FieldType } from "../enums";

export interface GroupField {
  name?: string,
  required?: boolean,
  readonly?: boolean,
  value?: any,
  values?: any,
  type?: FieldType | string,
}