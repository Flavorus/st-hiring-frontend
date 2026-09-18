export interface SettingsInput {
  currency: string;
  timezone: string;
  maxTicketsPerOrder: number;
  salesEnabled: boolean;
}

export interface Settings extends SettingsInput {
  _id: string;
  key: string;
  createdAt: string;
  updatedAt: string;
}
