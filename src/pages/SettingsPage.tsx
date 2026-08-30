import { Container, Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Settings configuration will be available soon.
      </Typography>
    </Container>
  );
}
