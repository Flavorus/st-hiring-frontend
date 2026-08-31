import type { RootState } from '../../store/store';

export const selectEvents = (state: RootState) => (state as RootState).events.data;
export const selectEventsLoading = (state: RootState) => (state as RootState).events.loading;
export const selectEventsError = (state: RootState) => (state as RootState).events.error;
