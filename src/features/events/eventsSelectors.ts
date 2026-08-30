import type { RootState } from '../../store/store';

export const selectEvents = (state: RootState) => state.events.data;
export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventsError = (state: RootState) => state.events.error;
