
import { Yup } from './yup-extension.validator';
import { isEmptyInput } from './helper.validator';

export const policiesSchema = Yup.object({
  paymentRequired: Yup.boolean(),
  cancellationPolicies: Yup.array().of(
    Yup.string()
  ).min(1, 'At least one cancellation policy is required'),
  termsAndConditions: Yup.array().of(
    Yup.string()
  ).min(1, 'At least one term and condition is required'),
});
