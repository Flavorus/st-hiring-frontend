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
              Sales Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    id="salesEnabled"
                    name="salesEnabled"
                    checked={values.salesEnabled}
                    onChange={(e) => setFieldValue('salesEnabled', e.target.checked)}
                    inputProps={{ 'aria-label': 'Sales enabled' }}
                  />
                }
                label="Sales enabled"
              />

              <FormControl fullWidth error={touched.defaultCurrency && Boolean(errors.defaultCurrency)}>
                <InputLabel id="defaultCurrency-label">Default currency</InputLabel>
                <Select
                  labelId="defaultCurrency-label"
                  id="defaultCurrency"
                  name="defaultCurrency"
                  label="Default currency"
                  value={values.defaultCurrency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {CURRENCIES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.defaultCurrency && errors.defaultCurrency && (
                  <FormHelperText>{errors.defaultCurrency}</FormHelperText>
                )}
              </FormControl>

              <TextField
                id="supportEmail"
                name="supportEmail"
                label="Support email"
                type="email"
                value={values.supportEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.supportEmail && Boolean(errors.supportEmail)}
                helperText={
                  (touched.supportEmail && errors.supportEmail) ||
                  'Email shown to customers for ticket support.'
                }
                fullWidth
              />

              <TextField
                id="ticketHoldMinutes"
                name="ticketHoldMinutes"
                label="Ticket hold duration (minutes)"
                type="number"
                inputProps={{ min: 1 }}
                value={values.ticketHoldMinutes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ticketHoldMinutes && Boolean(errors.ticketHoldMinutes)}
                helperText={
                  (touched.ticketHoldMinutes && errors.ticketHoldMinutes) ||
                  'How long a reserved ticket remains on hold before release.'
                }
                fullWidth
              />
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
