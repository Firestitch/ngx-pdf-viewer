import { Field } from '../classes/field';
import { FieldType } from '../enums';
import { FieldAnnotation, PdfField } from '../interfaces';


export function initField(fieldAnnotation: FieldAnnotation, pdfFields: PdfField[]): any {
  const field = new Field;
  field.guid = fieldAnnotation.fieldName;
  field.id = fieldAnnotation.id;
  field.index = -1;
  let _default = null;

  const optionValue = { label: '', value: null, id: field.id };
  const pdfField = pdfFields.find((pdfField) => pdfField.guid === field.guid);

  if(pdfField) {
    field.description = pdfField.description;
    field.type = pdfField.type;
    field.readonly = pdfField.readonly;
    field.required = pdfField.required;
    field.index = pdfField.index;
    field.name = pdfField.name;
    field.maxLength = pdfField.maxLength;
    field.formula = pdfField.formula;
    field.numeric = pdfField.numeric;
    field.format = pdfField.format;
    _default = pdfField.default;
  }

  if(fieldAnnotation.fieldType === 'Btn') {
    field.type = fieldAnnotation.radioButton ? FieldType.RadioButton : FieldType.Checkbox;
    
    if(pdfField) {
      field.label = pdfField.groupLabel;
      field.description = pdfField.groupDescription;
      optionValue.label = pdfField.label;
      optionValue.value = pdfField.value;
    }
  } else {
    if(pdfField) {
      field.label = pdfField.label;
      field.description = pdfField.description;
      field.value = pdfField.value;
    }
  }

  if(field.type === FieldType.Checkbox) {
    if(!Array.isArray(field.value)) {
      field.value = [];
    }

    if(optionValue.value === null) {
      optionValue.value = 1;
    }
  }

  if(field.type === FieldType.RadioButton && optionValue.value === null) {
    optionValue.value = optionValue.label;
  }

  if(field.type === FieldType.Checkbox || field.type === FieldType.RadioButton) {
    field.optionValues = [optionValue];
  }

  if(_default && field.value === null) {
    switch(field.type) {
      case FieldType.Date:
      case FieldType.Birthdate:
        if(_default === 'now') {
          field.value = new Date();
        }

        break;

      default:
        field.value = _default;
    }
  }

  if(!field.label && field.name) {
    field.label = field.name.split(/(?=[A-Z])/)
    .map((word, index) => {
      const letter = index ? word.charAt(0).toLowerCase() : word.charAt(0).toUpperCase();
      return letter + word.slice(1);
    })
    .join(' ');
  }

  return field;
}