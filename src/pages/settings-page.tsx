import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { SettingsForm } from "../features/settings/settings-form";
import {
  fetchSettings,
  resetSaveStatus,
  saveSettings,
} from "../features/settings/settings.slice";
import type { SettingsInput } from "../features/settings/settings.types";

const defaultSettings: SettingsInput = {
  currency: "USD",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  maxTicketsPerOrder: 10,
  salesEnabled: true,
};

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const { data, loadStatus, saveStatus, error } = useAppSelector(
    (state) => state.settings,
  );

  useEffect(() => {
    if (loadStatus === "idle") {
      dispatch(fetchSettings());
    }
  }, [dispatch, loadStatus]);

  useEffect(() => {
    if (saveStatus !== "succeeded") {
      return;
    }

    const timeoutId = setTimeout(() => {
      dispatch(resetSaveStatus());
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [dispatch, saveStatus]);

  if (loadStatus === "idle" || loadStatus === "loading") {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadStatus === "failed") {
    return <Alert severity="error">{error}</Alert>;
  }

  const initialValues: SettingsInput = data
    ? {
        currency: data.currency,
        timezone: data.timezone,
        maxTicketsPerOrder: data.maxTicketsPerOrder,
        salesEnabled: data.salesEnabled,
      }
    : defaultSettings;

  const handleSubmit = async (values: SettingsInput): Promise<void> => {
    try {
      await dispatch(saveSettings(values)).unwrap();
    } catch {
      return;
    }
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h2">
            Settings
          </Typography>

          {saveStatus === "succeeded" && (
            <Alert severity="success">Settings saved successfully.</Alert>
          )}

          {saveStatus === "failed" && <Alert severity="error">{error}</Alert>}

          <SettingsForm
            initialValues={initialValues}
            isSaving={saveStatus === "loading"}
            onSubmit={handleSubmit}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
