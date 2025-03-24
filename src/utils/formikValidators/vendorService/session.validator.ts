import { Yup } from './yup-extension.validator';
import { isEmptyInput } from './helper.validator';

export const sessionDurationSchema = Yup.object({
  durationInHours: Yup.number()
    .required('Duration is required')
    .min(0.5, 'Duration must be at least 0.5 hours')
    .typeError('Duration must be a valid number'),
  price: Yup.number()
    .required('Price is required')
    .min(1, 'Price must be positive')
    .typeError('Price must be a valid number'),
});

export const sessionPricingSchema = Yup.object({
  sessionDurations: Yup.array()
    .of(sessionDurationSchema)
    .min(1, 'At least one session duration is required'),
  features: Yup.array()
    .of(Yup.string()
      .test('not-empty', 'Features cannot be empty', value => !isEmptyInput(value as string))
    )
    .min(1, 'At least one feature must be added'),
});
