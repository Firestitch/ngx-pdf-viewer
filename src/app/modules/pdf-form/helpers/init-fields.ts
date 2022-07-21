import { Field } from '../classes/field';
import { FieldType } from '../enums';
import { initField } from './init-field';


export function initFields(accum, field: Field): any {
  const isRadioButton = field.type === FieldType.RadioButton;
  const isCheckbox = field.type === FieldType.Checkbox;

  field = initField(field);

  if(isRadioButton || isCheckbox) {
    const optionValue = { 
      label: field.label, 
      value: field.value || field.label, 
      top: field.top, 
      left: field.left, 
      width: field.width, 
      height: field.height, 
    };

    if(isRadioButton) {
      const radioButtonField: Field = accum.find((fieldItem) => field.name === fieldItem.name);

      if(radioButtonField) {
        radioButtonField.optionValues = [
          ...radioButtonField.optionValues,
          optionValue
        ];

      } else {
        accum.push({
          ...field,
          optionValues: [optionValue],
          value: null
        });
      }
    } else if(isCheckbox) {
      accum.push({
        ...field,
        optionValues: [optionValue],
        value: []
      });
    }
  } else {
    accum = [
      ...accum,
      field
    ];
  }

  return accum;
}
