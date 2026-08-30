import { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { fetchEvents } from '../features/events/eventsSlice';
import {
  selectEvents,
  selectEventsError,
  selectEventsLoading,
} from '../features/events/eventsSelectors';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import EventCard from '../components/events/EventCard';

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Upcoming Events
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={52} aria-label="Loading events" />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Unable to load events. Please check your connection and try again.
        </Alert>
      )}

      {!loading && !error && events.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 12,
            gap: 1.5,
            color: 'text.secondary',
          }}
        >
          <EventIcon sx={{ fontSize: 64, opacity: 0.3 }} />
          <Typography variant="h6">No events available right now</Typography>
          <Typography variant="body2">Check back soon for upcoming events.</Typography>
        </Box>
      )}

      {!loading && !error && events.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} lg={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
