import { Navigate, Route, Routes } from 'react-router-dom';
import EventsPage from '../pages/EventsPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
