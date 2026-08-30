import { apiClient } from './client';
import type { Settings } from '../features/settings/types';

export const getSettings = (): Promise<Settings> => apiClient.get<Settings>('/settings');

export const updateSettings = (settings: Settings): Promise<Settings> =>
  apiClient.post<Settings>('/settings', settings);
