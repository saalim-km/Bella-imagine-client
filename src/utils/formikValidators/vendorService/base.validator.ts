
import { Yup } from './yup-extension.validator';
import { basicInfoSchema } from './basic-info.validator';
import { sessionPricingSchema } from './session.validator';
import { locationSchema } from './location.validator';
import { availabilitySchema } from './availability.validator';
import { policiesSchema } from './policies.validator';

// Complete schema - combination of all section schemas
export const serviceValidationSchema = Yup.object({
  ...basicInfoSchema.fields,
  ...sessionPricingSchema.fields,
  ...locationSchema.fields,
  ...availabilitySchema.fields,
  ...policiesSchema.fields,
});

// Function to validate a specific section
export const validateSection = async (values: any, section: string): Promise<{isValid: boolean, errors: any}> => {
  try {
    let schema;
    switch (section) {
      case 'basic':
        schema = basicInfoSchema;
        break;
      case 'session':
        schema = sessionPricingSchema;
        break;
      case 'location':
        schema = locationSchema;
        break;
      case 'availability':
        schema = availabilitySchema;
        break;
      case 'policies':
        schema = policiesSchema;
        break;
      default:
        schema = Yup.object({});
    }
    
    await schema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const validationErrors: any = {};
      error.inner.forEach((err) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      return { isValid: false, errors: validationErrors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

// Re-export everything for backward compatibility
export * from './helper.validator';
export * from './basic-info.validator';
export * from './session.validator';
export * from './location.validator';
export * from './availability.validator';
export * from './policies.validator';
