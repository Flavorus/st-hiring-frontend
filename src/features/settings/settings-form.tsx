import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { settingsSchema } from './settings.schema';
import type { SettingsInput } from './settings.types';

interface SettingsFormProps {
  initialValues: SettingsInput;
  isSaving: boolean;
  onSubmit: (values: SettingsInput) => Promise<void>;
}

export function SettingsForm({
  initialValues,
  isSaving,
  onSubmit,
}: SettingsFormProps) {
  const formik = useFormik({
    initialValues,
    validationSchema: settingsSchema,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <TextField
        label="Currency"
        {...formik.getFieldProps('currency')}
        error={formik.touched.currency && Boolean(formik.errors.currency)}
        helperText={formik.touched.currency && formik.errors.currency}
      />

      <TextField
        label="Timezone"
        {...formik.getFieldProps('timezone')}
        error={formik.touched.timezone && Boolean(formik.errors.timezone)}
        helperText={formik.touched.timezone && formik.errors.timezone}
      />

      <TextField
        label="Maximum tickets per order"
        type="number"
        inputProps={{ min: 1 }}
        {...formik.getFieldProps('maxTicketsPerOrder')}
        error={
          formik.touched.maxTicketsPerOrder &&
          Boolean(formik.errors.maxTicketsPerOrder)
        }
        helperText={
          formik.touched.maxTicketsPerOrder &&
          formik.errors.maxTicketsPerOrder
        }
      />

      <FormControlLabel
        label="Sales enabled"
        control={
          <Switch
            name="salesEnabled"
            checked={formik.values.salesEnabled}
            onChange={formik.handleChange}
          />
        }
      />

      <Button type="submit" variant="contained" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save settings'}
      </Button>
    </Stack>
  );
}
