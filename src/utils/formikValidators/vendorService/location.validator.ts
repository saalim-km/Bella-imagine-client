
import { Yup } from './yup-extension.validator';

export const locationSchema = Yup.object({
  equipment: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one equipment item must be listed'),
});
