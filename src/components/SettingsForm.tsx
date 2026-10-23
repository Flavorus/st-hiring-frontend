import { useEffect } from 'react';
import { Formik, Form, Field, useField } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Switch,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSettings, updateSettings, clearSettingsError } from '../store/settingsSlice';
import { Settings } from '../types';

const SwitchField = ({ name, ...props }: { name: string } & React.ComponentProps<typeof Switch>) => {
  const [field, meta, helpers] = useField<boolean>(name);
  return (
    <Switch
      {...props}
      checked={field.value ?? false}
      onChange={(event) => {
        helpers.setValue(event.target.checked);
        helpers.setTouched(true);
      }}
    />
  );
};

const validationSchema = Yup.object().shape({
  siteName: Yup.string().required('Site name is required').max(100, 'Site name must be at most 100 characters'),
  maintenanceMode: Yup.boolean(),
  maxTicketsPerOrder: Yup.number()
    .required('Max tickets per order is required')
    .positive('Must be a positive number')
    .integer('Must be an integer')
    .min(1, 'Must be at least 1')
    .max(100, 'Must be at most 100'),
  supportEmail: Yup.string()
    .required('Support email is required')
    .email('Invalid email format')
    .max(255, 'Email must be at most 255 characters'),
});

const initialValues: Partial<Settings> = {
  siteName: '',
  maintenanceMode: false,
  maxTicketsPerOrder: 10,
  supportEmail: '',
};

const SettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings, loading, saving, error } = useAppSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleSubmit = async (values: Partial<Settings>, { setSubmitting }: { setSubmitting: (v: boolean) => void }) => {
    try {
      await dispatch(updateSettings(values)).unwrap();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !settings) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Settings</Typography>
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearSettingsError())} sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Formik
        initialValues={settings ? { ...initialValues, ...settings } : initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Paper elevation={1} sx={{ p: 3, maxWidth: 600 }}>
              <Box display="flex" flexDirection="column" gap={3}>
                <Field
                  as={TextField}
                  name="siteName"
                  label="Site Name"
                  fullWidth
                  error={!!(touched.siteName && errors.siteName)}
                  helperText={touched.siteName && errors.siteName}
                />

                <Field
                  as={TextField}
                  name="supportEmail"
                  label="Support Email"
                  type="email"
                  fullWidth
                  error={!!(touched.supportEmail && errors.supportEmail)}
                  helperText={touched.supportEmail && errors.supportEmail}
                />

                <Field
                  as={TextField}
                  name="maxTicketsPerOrder"
                  label="Max Tickets Per Order"
                  type="number"
                  fullWidth
                  error={!!(touched.maxTicketsPerOrder && errors.maxTicketsPerOrder)}
                  helperText={touched.maxTicketsPerOrder && errors.maxTicketsPerOrder}
                  inputProps={{ min: 1, max: 100 }}
                />

                <FormControlLabel
                  control={
                    <Field
                      name="maintenanceMode"
                      as={SwitchField}
                      color="primary"
                    />
                  }
                  label="Maintenance Mode"
                />

                <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || saving}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SettingsForm;