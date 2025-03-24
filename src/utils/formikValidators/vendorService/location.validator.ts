import { Yup } from './yup-extension.validator';
import { isEmptyInput, nameRegex } from './helper.validator';

export const locationSchema = Yup.object({
  location: Yup.object({
    options: Yup.object({
      studio: Yup.boolean(),
      onLocation: Yup.boolean()
    }),
    travelFee: Yup.number().min(0, 'Travel fee must be non-negative'),
    city: Yup.string()
      .required('City is required')
      .matches(nameRegex, 'City must contain only letters and spaces')
      .test('not-empty', 'City cannot be empty', value => !isEmptyInput(value as string)),
    state: Yup.string()
      .required('State is required')
      .matches(nameRegex, 'State must contain only letters and spaces')
      .test('not-empty', 'State cannot be empty', value => !isEmptyInput(value as string)),
    country: Yup.string()
      .required('Country is required')
      .matches(nameRegex, 'Country must contain only letters and spaces')
      .test('not-empty', 'Country cannot be empty', value => !isEmptyInput(value as string))
  }),
  equipment: Yup.array()
    .of(Yup.string()
      .test('not-empty', 'Equipment cannot be empty', value => !isEmptyInput(value as string))
    )
    .min(1, 'At least one equipment item must be listed'),
});
