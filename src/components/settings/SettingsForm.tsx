import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { settingsValidationSchema } from '../../features/settings/validationSchema';
import { CURRENCIES } from '../../features/settings/constants';
import type { Settings } from '../../features/settings/types';

interface Props {
  initialValues: Settings;
  onSubmit: (values: Settings) => Promise<void>;
}

export default function SettingsForm({ initialValues, onSubmit }: Props) {
  return (
    <Formik<Settings>
      initialValues={initialValues}
      validationSchema={settingsValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize={false}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
        <Form noValidate aria-label="Settings form">
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Order Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <TextField
                id="maxTicketsPerOrder"
                name="maxTicketsPerOrder"
                label="Max tickets per order"
                type="number"
                inputProps={{ min: 1, max: 20 }}
                value={values.maxTicketsPerOrder}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.maxTicketsPerOrder && Boolean(errors.maxTicketsPerOrder)}
                helperText={
                  (touched.maxTicketsPerOrder && errors.maxTicketsPerOrder) ||
                  'Maximum number of tickets a customer can buy in one order (1–20).'
                }
                fullWidth
              />

              <FormControl fullWidth error={touched.currency && Boolean(errors.currency)}>
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  id="currency"
                  name="currency"
                  label="Currency"
                  value={values.currency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {CURRENCIES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.currency && errors.currency && (
                  <FormHelperText>{errors.currency}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Refund Policy
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    id="allowRefunds"
                    name="allowRefunds"
                    checked={values.allowRefunds}
                    onChange={(e) => setFieldValue('allowRefunds', e.target.checked)}
                    inputProps={{ 'aria-label': 'Allow refunds' }}
                  />
                }
                label="Allow refunds"
              />

              {values.allowRefunds && (
                <TextField
                  id="refundWindowDays"
                  name="refundWindowDays"
                  label="Refund window (days before event)"
                  type="number"
                  inputProps={{ min: 0, max: 30 }}
                  value={values.refundWindowDays}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.refundWindowDays && Boolean(errors.refundWindowDays)}
                  helperText={
                    (touched.refundWindowDays && errors.refundWindowDays) ||
                    'Customers can request a refund up to this many days before the event (0–30).'
                  }
                  fullWidth
                />
              )}
            </Stack>
          </Paper>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" aria-hidden="true" />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {isSubmitting ? 'Saving…' : 'Save Settings'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
