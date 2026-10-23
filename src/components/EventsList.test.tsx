import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import EventsList from '../components/EventsList';
import { eventsApi } from '../api';

vi.mock('../api', () => ({
  eventsApi: {
    getEvents: vi.fn(),
  },
}));

const renderWithStore = (component: React.ReactNode) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('EventsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.dispatch({ type: 'events/clearError' });
  });

  it('should show loading spinner initially', () => {
    vi.mocked(eventsApi.getEvents).mockImplementation(() => new Promise(() => {}));
    renderWithStore(<EventsList />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display events when loaded', async () => {
    const mockEvents = [
      {
        id: 1,
        name: 'Event 1',
        description: 'Description 1',
        date: '2024-06-15T19:00:00.000Z',
        location: 'New York',
        availableTickets: [
          { id: 1, eventId: 1, type: 'General', status: 'available', price: 1000, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      data: mockEvents,
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });

    renderWithStore(<EventsList />);

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });
  });

  it('should show empty state when no events', async () => {
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    });

    renderWithStore(<EventsList />);

    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  it('should show error message when fetch fails', async () => {
    vi.mocked(eventsApi.getEvents).mockRejectedValue(new Error('Network error'));
    renderWithStore(<EventsList />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});