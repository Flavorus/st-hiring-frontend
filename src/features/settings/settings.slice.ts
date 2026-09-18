import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type { Settings, SettingsInput } from './settings.types';

export type SettingsStatus =
  | 'idle'
  | 'loading'
  | 'succeeded'
  | 'failed';

export interface SettingsState {
  data: Settings | null;
  loadStatus: SettingsStatus;
  saveStatus: SettingsStatus;
  error: string | null;
}

const initialState: SettingsState = {
  data: null,
  loadStatus: 'idle',
  saveStatus: 'idle',
  error: null,
};

export const fetchSettings: AsyncThunk<Settings | null, void, object> =
  createAsyncThunk<Settings | null, void, object>(
    'settings/fetchSettings',
    async () => {
      const response = await fetch('/settings');

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Unable to load settings');
      }

      return (await response.json()) as Settings;
    },
  );

export const saveSettings: AsyncThunk<Settings, SettingsInput, object> =
  createAsyncThunk<Settings, SettingsInput, object>(
    'settings/saveSettings',
    async (settings) => {
      const response = await fetch('/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Unable to save settings');
      }

      return (await response.json()) as Settings;
    },
  );

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSaveStatus: (state) => {
      state.saveStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loadStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loadStatus = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loadStatus = 'failed';
        state.error = action.error.message ?? 'Unable to load settings';
      })
      .addCase(saveSettings.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.data = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.error.message ?? 'Unable to save settings';
      });
  },
});

export const { resetSaveStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
