import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventsApi } from '../api';
import { EventsState, Event, PaginatedResponse } from '../types';

const initialState: EventsState = {
  events: [],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk<
  PaginatedResponse<Event>,
  { page?: number; pageSize?: number },
  { rejectValue: string }
>('events/fetchEvents', async ({ page = 1, pageSize = 20 }, { rejectWithValue }) => {
  try {
    return await eventsApi.getEvents(page, pageSize);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch events');
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<PaginatedResponse<Event>>) => {
        state.loading = false;
        state.events = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch events';
      });
  },
});

export const { clearError: clearEventsError } = eventsSlice.actions;
export default eventsSlice.reducer;