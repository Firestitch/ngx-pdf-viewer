import { Field } from "../classes/field";
import { FieldType } from "../enums";



export function initField(fieldAnnotation): any {
  const field = new Field;
  field.name = fieldAnnotation.fieldName;
  field.description = fieldAnnotation.alternativeText;
  field.type = FieldType.Input;
  field.value = null;
  field.readonly = false;
  field.id = fieldAnnotation.id;
  field.index = -1;
  field.required = false;
  
  const optionValue = { label: '', value: null, id: field.id };
  let _default = null;

  if(fieldAnnotation.fieldType === 'Btn') {
    field.type = fieldAnnotation.radioButton ? FieldType.RadioButton : FieldType.Checkbox;
  }

  fieldAnnotation.fieldName.split('|')
  .forEach((part) => {
    const index = part.indexOf(':');             
    if(index === -1) {
      switch(part) {
        case 'numeric':
          field.numeric = true;
          break; 

        case 'readonly':
          field.readonly = true;
          break; 

        case 'required':
          field.required = true;
          break;                 

        default:
          field.name = part;
      }
    } else {
      const value: any = part.substring(index + 1);
      switch(part.substring(0,index)) {
        case 'name':
          field.name = value;
          break;
        
        case 'groupLabel':
          field.label = value;
          break;

        case 'label':
          if(field.type === FieldType.Checkbox || field.type === FieldType.RadioButton) {
            optionValue.label = value;
          } else {
            field.label = value;
          }
          
          break;
      
        case 'type':
          field.type = value;
          break;
      
        case 'maxLength':
          field.maxLength = value;
          break;
    
        case 'minLength':
          field.minLength = value;
          break;
    
        case 'formula':
          field.formula = value;
          break;
  
        case 'format':
          field.format = value;
          break;
  
        case 'index':
          field.index = Number(value);
          break;
  
        case 'default':
          _default = value;
          break;
  
        case 'value':
          if(field.type === FieldType.Checkbox || field.type === FieldType.RadioButton) {
            optionValue.value = value;
          }

          break;
      }
    }
  });

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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  return field;
}