import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSettings, updateSettings } from '../../api/settingsApi';
import type { Settings, SettingsState } from './types';

export const fetchSettings = createAsyncThunk<Settings, void, { rejectValue: string }>(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      return await getSettings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load settings';
      return rejectWithValue(message);
    }
  },
);

export const saveSettings = createAsyncThunk<Settings, Settings, { rejectValue: string }>(
  'settings/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      return await updateSettings(settings);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save settings';
      return rejectWithValue(message);
    }
  },
);

const initialState: SettingsState = {
  data: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      })
      .addCase(saveSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
        state.updateSuccess = true;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload ?? 'An unexpected error occurred';
      });
  },
});

export const { resetUpdateStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
