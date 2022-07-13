export interface Field {
  name?: string,
  label?: string,
  description?: string,
  type?: 'textarea' | 'input' | 'date' | 'birthdate' | 'currency'
  value?: any,
  id?: string,  
  numeric?: boolean,  
  maxLength?: number; 
  minLength?: number;
  index?: number;
}