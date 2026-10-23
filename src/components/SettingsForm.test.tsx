import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import SettingsForm from '../components/SettingsForm';
import { settingsApi } from '../api';

vi.mock('../api', () => ({
  settingsApi: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

const renderWithStore = (component: React.ReactNode) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('SettingsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.dispatch({ type: 'settings/clearError' });
  });

  it('should show loading spinner initially', () => {
    vi.mocked(settingsApi.getSettings).mockImplementation(() => new Promise(() => {}));
    renderWithStore(<SettingsForm />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display form with settings when loaded', async () => {
    const mockSettings = {
      _id: '1',
      siteName: 'Test Site',
      maintenanceMode: false,
      maxTicketsPerOrder: 10,
      supportEmail: 'support@test.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    renderWithStore(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('Site Name')).toHaveValue('Test Site');
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Support Email')).toHaveValue('support@test.com');
    });

    await waitFor(() => {
      const maxTicketsField = screen.getByLabelText('Max Tickets Per Order');
      expect(maxTicketsField).toHaveValue(10);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Maintenance Mode')).not.toBeChecked();
    });
  });

  it('should show validation error for invalid email', async () => {
    vi.mocked(settingsApi.getSettings).mockResolvedValue({
      _id: '1',
      siteName: 'Test',
      maintenanceMode: false,
      maxTicketsPerOrder: 10,
      supportEmail: 'support@test.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    });

    renderWithStore(<SettingsForm />);

    await waitFor(() => {
      const emailField = screen.getByLabelText('Support Email');
      fireEvent.change(emailField, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailField);
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should call updateSettings on submit with valid data', async () => {
    const mockSettings = {
      _id: '1',
      siteName: 'Test Site',
      maintenanceMode: false,
      maxTicketsPerOrder: 10,
      supportEmail: 'support@test.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(settingsApi.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(settingsApi.updateSettings).mockResolvedValue({
      ...mockSettings,
      siteName: 'Updated Site',
      updatedAt: '2024-01-02',
    });

    renderWithStore(<SettingsForm />);

    await waitFor(() => {
      const siteNameField = screen.getByLabelText('Site Name');
      fireEvent.change(siteNameField, { target: { value: 'Updated Site' } });
    });

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(settingsApi.updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ siteName: 'Updated Site' })
      );
    });
  });

  it('should show error when update fails', async () => {
    vi.mocked(settingsApi.getSettings).mockResolvedValue({
      _id: '1',
      siteName: 'Test',
      maintenanceMode: false,
      maxTicketsPerOrder: 10,
      supportEmail: 'support@test.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    });
    vi.mocked(settingsApi.updateSettings).mockRejectedValue(new Error('Save failed'));

    renderWithStore(<SettingsForm />);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /save settings/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/save failed/i)).toBeInTheDocument();
    });
  });
});