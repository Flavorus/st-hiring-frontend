import { apiClient } from './client';
import type { Settings } from '../features/settings/types';

export const getSettings = (): Promise<Settings> => apiClient.get<Settings>('/settings');

export const updateSettings = (settings: Settings): Promise<Settings> => {
  const payload = {
    salesEnabled: settings.salesEnabled,
    defaultCurrency: settings.defaultCurrency,
    supportEmail: settings.supportEmail,
    ticketHoldMinutes: settings.ticketHoldMinutes,
  };

  return apiClient.post<Settings>('/settings', payload);
};
