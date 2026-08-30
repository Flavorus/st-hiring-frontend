import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" fontWeight={700} sx={{ flexGrow: 1 }}>
            See Tickets
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/events"
            sx={{ fontWeight: pathname === '/events' ? 700 : 400 }}
          >
            Events
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/settings"
            sx={{ fontWeight: pathname === '/settings' ? 700 : 400 }}
          >
            Settings
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
