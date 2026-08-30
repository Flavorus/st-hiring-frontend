import type { Event } from '../../types/api';

export interface EventsState {
  data: Event[];
  loading: boolean;
  error: string | null;
}
