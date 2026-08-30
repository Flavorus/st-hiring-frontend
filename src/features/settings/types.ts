export interface Settings {
  maxTicketsPerOrder: number;
  currency: string;
  allowRefunds: boolean;
  refundWindowDays: number;
}

export const DEFAULT_SETTINGS: Settings = {
  maxTicketsPerOrder: 10,
  currency: 'USD',
  allowRefunds: true,
  refundWindowDays: 7,
};

export interface SettingsState {
  data: Settings | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}
