
import { Yup } from './yup-extension.validator';
import { isEmptyInput } from './helper.validator';

export const customFieldSchema = Yup.object({
  name: Yup.string()
    .required('Field name is required')
    .test('not-empty', 'Field name cannot be empty', value => !isEmptyInput(value as string)),
  type: Yup.string().required('Field type is required'),
  required: Yup.boolean(),
  options: Yup.array().of(
    Yup.string()
  ).when('type', {
    is: 'enum',
    then: (schema) => schema.min(1, 'At least one option is required for enum field')
  })
});

export const portfolioSchema = Yup.object({
  customFields: Yup.array()
    .of(customFieldSchema)
    .min(3, 'At least 3 custom fields are required'),
});
