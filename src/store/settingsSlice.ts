import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsApi } from '../api';
import { SettingsState, Settings } from '../types';

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
  saving: false,
};

export const fetchSettings = createAsyncThunk<Settings, void, { rejectValue: string }>(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsApi.getSettings();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk<Settings, Partial<Settings>, { rejectValue: string }>(
  'settings/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      return await settingsApi.updateSettings(settings);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch settings';
      })
      .addCase(updateSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to update settings';
      });
  },
});

export const { clearError: clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;