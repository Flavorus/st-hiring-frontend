// Settings schema is TBD — typed loosely until the backend contract is defined
export type Settings = Record<string, unknown>;

export interface SettingsState {
  data: Settings | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}
