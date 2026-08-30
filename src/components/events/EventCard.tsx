import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import type { Event } from '../../types/api';

interface Props {
  event: Event;
  currency: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

interface TicketTypeSummary {
  type: string;
  minPrice: number;
  count: number;
}

function buildTicketSummary(tickets: Event['availableTickets']): TicketTypeSummary[] {
  const byType = tickets.reduce<Record<string, number[]>>((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t.price);
    return acc;
  }, {});

  return Object.entries(byType).map(([type, prices]) => ({
    type,
    minPrice: Math.min(...prices),
    count: prices.length,
  }));
}

export default function EventCard({ event, currency }: Props) {
  const ticketSummary = buildTicketSummary(event.availableTickets);
  const totalAvailable = event.availableTickets.length;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2" fontWeight={600} lineHeight={1.3}>
            {event.name}
          </Typography>
        }
        subheader={
          <Stack spacing={0.75} sx={{ mt: 0.75 }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(event.date)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {event.location}
              </Typography>
            </Stack>
          </Stack>
        }
      />

      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <ConfirmationNumberIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="overline" color="text.secondary" lineHeight={1}>
              Available Tickets
            </Typography>
          </Stack>
          <Chip
            label={totalAvailable}
            size="small"
            color={totalAvailable > 0 ? 'success' : 'default'}
          />
        </Stack>

        {ticketSummary.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {ticketSummary.map(({ type, minPrice, count }) => (
              <Chip
                key={type}
                label={`${type} · from ${formatPrice(minPrice, currency)} (${count})`}
                variant="outlined"
                size="small"
                color="primary"
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.disabled">
            No tickets currently available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
