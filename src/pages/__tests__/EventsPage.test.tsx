import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import EventsPage from '../EventsPage';
import * as eventsApi from '../../api/eventsApi';
import type { Event } from '../../types/api';

vi.mock('../../api/eventsApi');

const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Test Concert',
    date: '2026-12-01T20:00:00Z',
    location: 'New York',
    description: 'An amazing concert.',
    availableTickets: [
      {
        id: 1,
        eventId: 1,
        type: 'general',
        status: 'available',
        price: 5000,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

describe('EventsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows a loading indicator while fetching', () => {
    vi.mocked(eventsApi.getEvents).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<EventsPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays event cards after a successful fetch', async () => {
    vi.mocked(eventsApi.getEvents).mockResolvedValue(mockEvents);

    renderWithProviders(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Concert')).toBeInTheDocument();
    });
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('shows an empty state when the API returns no events', async () => {
    vi.mocked(eventsApi.getEvents).mockResolvedValue([]);

    renderWithProviders(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No events available/i)).toBeInTheDocument();
    });
  });

  it('shows a user-friendly error message when the API fails', async () => {
    vi.mocked(eventsApi.getEvents).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Unable to load events/i)).toBeInTheDocument();
    });
  });

  it('does not show events when loading', () => {
    vi.mocked(eventsApi.getEvents).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<EventsPage />);

    expect(screen.queryByText('Test Concert')).not.toBeInTheDocument();
  });
});
