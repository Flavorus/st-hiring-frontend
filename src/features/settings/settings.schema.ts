import * as yup from 'yup';
import type { SettingsInput } from './settings.types';

export const settingsSchema: yup.ObjectSchema<SettingsInput> = yup.object({
  currency: yup.string().trim().required('Currency is required'),
  timezone: yup.string().trim().required('Timezone is required'),
  maxTicketsPerOrder: yup
    .number()
    .integer('Maximum tickets must be a whole number')
    .positive('Maximum tickets must be greater than zero')
    .required('Maximum tickets is required'),
  salesEnabled: yup.boolean().required(),
});
