import * as Yup from 'yup';
import { isEmptyInput } from './helper.validator';

// Extend Yup with custom methods
declare module 'yup' {
  interface ArraySchema<TIn extends any[] | null | undefined, TContext = any, TDefault = undefined, TFlags extends Yup.Flags = ""> {
    noEmptyStrings(): ArraySchema<TIn, TContext, TDefault, TFlags>;
  } 
  
  interface StringSchema {
    validDateFormat(): StringSchema;
  }
}

// Custom Yup method for checking non-empty arrays with non-empty string items
Yup.addMethod(Yup.array, 'noEmptyStrings', function() {
  return this.test('no-empty-strings', 'Items cannot be empty', function(value : any) {
    if (!value || !Array.isArray(value)) return true;
    
    const hasEmptyString = value.some(item => typeof item === 'string' && isEmptyInput(item));
    return !hasEmptyString;
  });
});

// Custom Yup method for validating date format
Yup.addMethod(Yup.string, 'validDateFormat', function() {
  return this.test('valid-date-format', 'Must be a valid date in YYYY-MM-DD format', function(value) {
    if (!value) return true;
    
    // Check format using regex
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) return false;
    
    // Check if it's a valid date
    const date = new Date(value);
    return !isNaN(date.getTime());
  });
});

export { Yup };
