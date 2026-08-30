import * as Yup from 'yup';

export const settingsValidationSchema = Yup.object({
  maxTicketsPerOrder: Yup.number()
    .typeError('Must be a number')
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(20, 'Cannot exceed 20')
    .required('Required'),
  currency: Yup.string()
    .oneOf(['USD', 'EUR', 'GBP'], 'Select a valid currency')
    .required('Required'),
  allowRefunds: Yup.boolean().required(),
  refundWindowDays: Yup.number()
    .typeError('Must be a number')
    .integer('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(30, 'Cannot exceed 30 days')
    .when('allowRefunds', {
      is: true,
      then: (schema) => schema.required('Required when refunds are enabled'),
      otherwise: (schema) => schema.notRequired(),
    }),
});
