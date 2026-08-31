import { useEffect } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Snackbar, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchSettings, resetUpdateStatus, saveSettings } from '../features/settings/settingsSlice';
import {
  selectSettings,
  selectSettingsError,
  selectSettingsLoading,
  selectSettingsUpdateError,
  selectSettingsUpdateSuccess,
} from '../features/settings/settingsSelectors';
import { DEFAULT_SETTINGS } from '../features/settings/types';
import type { Settings } from '../features/settings/types';
import SettingsForm from '../components/settings/SettingsForm';

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

  const handleSubmit = async (values: Settings) => {
    await dispatch(saveSettings(values));
  };

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

      {loading && !settings && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress aria-label="Loading settings" />
        </Box>
      )}

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

      {!loading && <SettingsForm initialValues={initialValues} onSubmit={handleSubmit} />}

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
