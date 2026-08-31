import * as Yup from 'yup';
import { CURRENCY_VALUES } from './constants';

export const settingsValidationSchema = Yup.object({
  salesEnabled: Yup.boolean().required(),
  defaultCurrency: Yup.string()
    .oneOf([...CURRENCY_VALUES], 'Select a valid currency')
    .required('Required'),
  supportEmail: Yup.string().email('Enter a valid email address').required('Required'),
  ticketHoldMinutes: Yup.number()
    .typeError('Must be a number')
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .required('Required'),
});
