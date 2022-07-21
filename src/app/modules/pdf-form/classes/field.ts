import { FieldType } from '../enums';
import { PdfField } from '../interfaces';

export class Field implements PdfField {
  public type: FieldType;
  public guid?: string;
  public name?: string;
  public label?: string;
  public description?: string;
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
  public optionValues?: { label: string, value: any, top: number, left: number, height: number, width: number }[];
  public top?: number;
  public left?: number;
  public width?: number;
  public height?: number;
  public pageNumber?: number;
  public default?: any;

  public get hasValue() {
    return this.value !== null && !!String(this.value).length;
  }
}