import { vi, describe, it, expect, beforeEach } from 'vitest';
import settingsReducer, { fetchSettings, updateSettings, clearSettingsError } from './settingsSlice';
import { SettingsState } from '../types';

describe('settingsSlice', () => {
  const initialState: SettingsState = {
    settings: null,
    loading: false,
    error: null,
    saving: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchSettings', () => {
    it('should set loading to true when pending', () => {
      const action = { type: fetchSettings.pending.type, payload: undefined };
      const state = settingsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set settings when fulfilled', () => {
      const mockSettings = {
        _id: '1',
        siteName: 'Test',
        maintenanceMode: false,
        maxTicketsPerOrder: 10,
        supportEmail: 'test@test.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      const action = { type: fetchSettings.fulfilled.type, payload: mockSettings };
      const state = settingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.settings).toEqual(mockSettings);
    });

    it('should set error when rejected', () => {
      const action = { type: fetchSettings.rejected.type, payload: 'Failed to fetch', error: { message: 'Failed to fetch' } };
      const state = settingsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch');
    });
  });

  describe('updateSettings', () => {
    it('should set saving to true when pending', () => {
      const action = { type: updateSettings.pending.type, payload: undefined };
      const state = settingsReducer(initialState, action);
      expect(state.saving).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update settings when fulfilled', () => {
      const mockSettings = {
        _id: '1',
        siteName: 'Updated',
        maintenanceMode: true,
        maxTicketsPerOrder: 20,
        supportEmail: 'updated@test.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };
      const action = { type: updateSettings.fulfilled.type, payload: mockSettings };
      const state = settingsReducer({ ...initialState, saving: true }, action);
      expect(state.saving).toBe(false);
      expect(state.settings).toEqual(mockSettings);
    });

    it('should set error when rejected', () => {
      const action = { type: updateSettings.rejected.type, payload: 'Failed to update', error: { message: 'Failed to update' } };
      const state = settingsReducer({ ...initialState, saving: true }, action);
      expect(state.saving).toBe(false);
      expect(state.error).toBe('Failed to update');
    });
  });

  describe('clearSettingsError', () => {
    it('should clear error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = clearSettingsError();
      const state = settingsReducer(stateWithError, action);
      expect(state.error).toBeNull();
    });
  });
});