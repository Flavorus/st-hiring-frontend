import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { Event } from './events.types';

export type EventsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface EventsState {
  items: Event[];
  status: EventsStatus;
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchEvents: AsyncThunk<Event[], void, object> =
  createAsyncThunk<Event[], void, object>('events/fetchEvents', async () => {
    const response = await fetch('/events');

    if (!response.ok) {
      throw new Error('Unable to load events');
    }

    return (await response.json()) as Event[];
  });

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unable to load events';
      });
  },
});

export default eventsSlice.reducer;
