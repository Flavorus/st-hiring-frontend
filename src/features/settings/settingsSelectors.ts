import type { RootState } from '../../store/store';

export const selectSettings = (state: RootState) => state.settings.data;
export const selectSettingsLoading = (state: RootState) => state.settings.loading;
export const selectSettingsError = (state: RootState) => state.settings.error;
export const selectSettingsUpdateLoading = (state: RootState) => state.settings.updateLoading;
export const selectSettingsUpdateError = (state: RootState) => state.settings.updateError;
export const selectSettingsUpdateSuccess = (state: RootState) => state.settings.updateSuccess;
