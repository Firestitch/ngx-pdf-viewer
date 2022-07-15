import { FieldType } from '../enums';

export class Field {
  public name?: string;
  public label?: string;
  public description: string;
  public type?: any;
  public value?: any;
  public id?: string;
  public numeric?: boolean;
  public maxLength?: number; 
  public minLength?: number;
  public index?: number;
  public readonly?: boolean;
  public required?: boolean;
  public format?: 'currency' | string;
  public formula?: string;
  public optionValues?: { label: string, value: any, id: string }[];

  public get hasValue() {
    return this.value !== null && !!String(this.value).length;
  }
}