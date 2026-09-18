import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { EventCard } from '../features/events/event-card';
import { fetchEvents } from '../features/events/events.slice';

export function EventsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [dispatch, status]);

  if (status === 'idle' || status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return <Alert severity="error">{error}</Alert>;
  }

  if (items.length === 0) {
    return <Alert severity="info">No events available.</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {items.map((event) => (
        <Grid item xs={12} sm={6} lg={4} xl={3} key={event.id}>
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
}
