
import { Yup } from './yup-extension.validator';
import { isEmptyInput } from './helper.validator';

export const basicInfoSchema = Yup.object({
  serviceTitle: Yup.string()
    .required('Service title is required')
    .test('not-empty', 'Service title cannot be empty', value => !isEmptyInput(value as string)),
  category: Yup.string()
    .required('Category is required'),
  yearsOfExperience: Yup.number()
    .required('Years of experience is required')
    .min(0, 'Years of experience must be non-negative')
    .typeError('Years of experience must be a valid number'),
  styleSpecialty: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one specialty must be selected'),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one tag is required'),
  serviceDescription: Yup.string()
    .required('Service description is required')
    .test('not-empty', 'Service description cannot be empty', value => !isEmptyInput(value as string)),
});
