import type { CurrencyCode } from './constants';

export interface Settings {
  salesEnabled: boolean;
  defaultCurrency: CurrencyCode;
  supportEmail: string;
  ticketHoldMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_SETTINGS: Settings = {
  salesEnabled: true,
  defaultCurrency: 'USD',
  supportEmail: 'support@example.com',
  ticketHoldMinutes: 15,
};

export interface SettingsState {
  data: Settings | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}
