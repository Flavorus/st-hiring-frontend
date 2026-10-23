import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEvents, clearEventsError } from '../store/eventsSlice';
import { Event } from '../types';

const EventsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, pagination, loading, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents({ page: pagination.page, pageSize: pagination.pageSize }));
  }, [dispatch, pagination.page, pagination.pageSize]);

  const handlePageChange = (_: unknown, page: number) => {
    dispatch(fetchEvents({ page, pageSize: pagination.pageSize }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(fetchEvents({ page: 1, pageSize: parseInt(event.target.value, 10) }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'sold':
        return 'error';
      case 'reserved':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTicketTypeGroups = (tickets: Event['availableTickets']) => {
    const groups: Record<string, { available: number; sold: number; reserved: number; price: number }> = {};
    tickets.forEach((ticket) => {
      if (!groups[ticket.type]) {
        groups[ticket.type] = { available: 0, sold: 0, reserved: 0, price: ticket.price };
      }
      const status = ticket.status.toLowerCase();
      if (status === 'available') groups[ticket.type].available++;
      else if (status === 'sold') groups[ticket.type].sold++;
      else if (status === 'reserved') groups[ticket.type].reserved++;
    });
    return groups;
  };

  const getTotalAvailable = (tickets: Event['availableTickets']) => {
    return tickets.filter((t) => t.status.toLowerCase() === 'available').length;
  };

  if (loading && events.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Events</Typography>
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearEventsError())} sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Ticket Types</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: Event) => (
                <TableRow key={event.id} hover>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {getTotalAvailable(event.availableTickets)} available
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {event.availableTickets.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap={1}>
                        {Object.entries(getTicketTypeGroups(event.availableTickets)).map(
                          ([type, counts]) => (
                            <Box
                              key={type}
                              display="flex"
                              alignItems="center"
                              gap={1.5}
                              flexWrap="wrap"
                              sx={{ py: 0.5 }}
                            >
                              <Box sx={{ minWidth: 120, fontWeight: 500 }}>
                                {type} - ${(counts.price / 100).toFixed(2)}
                              </Box>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                {counts.available > 0 && (
                                  <Chip
                                    label={`Available: ${counts.available}`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                )}
                                {counts.reserved > 0 && (
                                  <Chip
                                    label={`Reserved: ${counts.reserved}`}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                  />
                                )}
                                {counts.sold > 0 && (
                                  <Chip
                                    label={`Sold: ${counts.sold}`}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No tickets
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          boundaryCount={2}
          siblingCount={1}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {events.length} of {pagination.total} events
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Rows per page:
          </Typography>
          <select
            value={pagination.pageSize}
            onChange={handleRowsPerPageChange}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #ccc',
              minWidth: 80,
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </Box>
      </Box>
    </Box>
  );
};

export default EventsList;