import { Field } from "../interfaces";


export function initField(fieldAnnotation, indexes): Field {
  const field: Field = {
    name: fieldAnnotation.fieldName,
    description: fieldAnnotation.alternativeText,
    type: 'input',
    value: fieldAnnotation.fieldValue,
    id: fieldAnnotation.id,
    index: indexes[fieldAnnotation.id]
  };

  fieldAnnotation.fieldName.split('|')
  .forEach((part) => {
    const index = part.indexOf(':');             
    if(index === -1) {
      switch(part) {
        case 'name':
          field.numeric = true;
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
          
          case 'label':
            field.label = value;
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
      
          case 'numeric':
            field.numeric = value;
            break;
      }
    }
  });

  if(!field.label && field.name) {
    field.label = field.name.split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  return field;
}