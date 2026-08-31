import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import SettingsPage from '../SettingsPage';
import * as settingsApi from '../../api/settingsApi';
import type { Settings } from '../../features/settings/types';

vi.mock('../../api/settingsApi');

const mockSettings: Settings = {
  salesEnabled: true,
  defaultCurrency: 'EUR',
  supportEmail: 'support@example.com',
  ticketHoldMinutes: 20,
};

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows a loading indicator while fetching settings', () => {
    vi.mocked(settingsApi.getSettings).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<SettingsPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows a user-friendly error when loading fails', async () => {
    vi.mocked(settingsApi.getSettings).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Unable to load settings/i)).toBeInTheDocument();
    });
  });

  it('populates the form with settings from the API', async () => {
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);

    renderWithProviders(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('support@example.com')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
  });

  it('shows a validation error when ticket hold minutes is invalid', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);

    renderWithProviders(<SettingsPage />);

    const input = await screen.findByLabelText(/Ticket hold duration/i);
    await user.clear(input);
    await user.type(input, '0');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/Must be at least 1/i)).toBeInTheDocument();
    });
  });

  it('prevents submission and shows validation errors for invalid data', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(settingsApi.updateSettings).mockResolvedValue(mockSettings);

    renderWithProviders(<SettingsPage />);

    const input = await screen.findByLabelText(/Ticket hold duration/i);
    await user.clear(input);
    await user.type(input, '0');
    await user.click(screen.getByRole('button', { name: /Save Settings/i }));

    await waitFor(() => {
      expect(screen.getByText(/Must be at least 1/i)).toBeInTheDocument();
    });
    expect(settingsApi.updateSettings).not.toHaveBeenCalled();
  });

  it('calls updateSettings with the form values on valid submission', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(settingsApi.updateSettings).mockResolvedValue(mockSettings);

    renderWithProviders(<SettingsPage />);

    await screen.findByRole('button', { name: /Save Settings/i });
    await user.click(screen.getByRole('button', { name: /Save Settings/i }));

    await waitFor(() => {
      expect(settingsApi.updateSettings).toHaveBeenCalledWith(mockSettings);
    });
  });

  it('shows a success message after a successful submission', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(settingsApi.updateSettings).mockResolvedValue(mockSettings);

    renderWithProviders(<SettingsPage />);

    await screen.findByRole('button', { name: /Save Settings/i });
    await user.click(screen.getByRole('button', { name: /Save Settings/i }));

    await waitFor(() => {
      expect(screen.getByText(/Settings saved successfully/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when submission fails', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(settingsApi.updateSettings).mockRejectedValue(new Error('Server error'));

    renderWithProviders(<SettingsPage />);

    await screen.findByRole('button', { name: /Save Settings/i });
    await user.click(screen.getByRole('button', { name: /Save Settings/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to save settings/i)).toBeInTheDocument();
    });
  });

  it('disables and relabels the submit button while submitting', async () => {
    const user = userEvent.setup();
    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    // Never resolves — keeps isSubmitting true
    vi.mocked(settingsApi.updateSettings).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<SettingsPage />);

    await screen.findByRole('button', { name: /Save Settings/i });
    await user.click(screen.getByRole('button', { name: /Save Settings/i }));

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Saving/i });
      expect(button).toBeDisabled();
    });
  });
});
