import { FieldType } from '../enums';

export interface Field {
  name?: string,
  label?: string,
  description?: string,
  type?: FieldType
  value?: any,
  id?: string,  
  numeric?: boolean,  
  maxLength?: number, 
  minLength?: number,
  index?: number,
  readonly?: boolean,
  format?: 'currency' | string,
  formula?: string,
  optionValues?: { label: string, value: any, id: string }[],
}