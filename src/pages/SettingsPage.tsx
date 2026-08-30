import { useEffect } from 'react';
import { Form, Formik } from 'formik';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchSettings, resetUpdateStatus, saveSettings } from '../features/settings/settingsSlice';
import {
  selectSettings,
  selectSettingsError,
  selectSettingsLoading,
  selectSettingsUpdateError,
  selectSettingsUpdateSuccess,
} from '../features/settings/settingsSelectors';
import { settingsValidationSchema } from '../features/settings/validationSchema';
import { DEFAULT_SETTINGS } from '../features/settings/types';
import type { Settings } from '../features/settings/types';

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
];

export default function SettingsPage() {
  const dispatch = useAppDispatch();

  const settings = useAppSelector(selectSettings);
  const loading = useAppSelector(selectSettingsLoading);
  const error = useAppSelector(selectSettingsError);
  const updateError = useAppSelector(selectSettingsUpdateError);
  const updateSuccess = useAppSelector(selectSettingsUpdateSuccess);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleCloseSnackbar = () => dispatch(resetUpdateStatus());

  // Merge with defaults to guard against missing fields in the API response
  const initialValues: Settings = settings
    ? { ...DEFAULT_SETTINGS, ...settings }
    : DEFAULT_SETTINGS;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Settings
      </Typography>

      {/* Initial fetch — loading */}
      {loading && !settings && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress aria-label="Loading settings" />
        </Box>
      )}

      {/* Initial fetch — error with no cached data */}
      {!loading && error && !settings && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => dispatch(fetchSettings())}>
              Retry
            </Button>
          }
        >
          Unable to load settings. Please try again.
        </Alert>
      )}

      {/* Form — shown as soon as we have data (stays visible during saves) */}
      {settings && (
        <Formik<Settings>
          initialValues={initialValues}
          validationSchema={settingsValidationSchema}
          onSubmit={async (values) => {
            await dispatch(saveSettings(values));
          }}
          enableReinitialize={false}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form noValidate aria-label="Settings form">
              {/* Order settings */}
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
                    inputProps={{ min: 1, max: 20, 'aria-describedby': 'maxTicketsPerOrder-helper' }}
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

              {/* Refund policy */}
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

              {/* Submit row */}
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
      )}

      {/* Success toast */}
      <Snackbar
        open={updateSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully.
        </Alert>
      </Snackbar>

      {/* Error toast */}
      <Snackbar
        open={Boolean(updateError)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Failed to save settings. Please try again.
        </Alert>
      </Snackbar>
    </Container>
  );
}
