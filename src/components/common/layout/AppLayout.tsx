import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: 'Events', to: '/events' },
  { label: 'Settings', to: '/settings' },
];

export default function AppLayout({ children }: Props) {
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1} component="header">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/events"
            fontWeight={700}
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            See Tickets
          </Typography>

          <Box component="nav" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, to }) => {
              const isActive = pathname === to;
              return (
                <Button
                  key={to}
                  color="inherit"
                  component={Link}
                  to={to}
                  aria-current={isActive ? 'page' : undefined}
                  sx={{
                    fontWeight: isActive ? 700 : 400,
                    borderBottom: isActive ? '2px solid white' : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                    '&:hover': { borderBottomColor: 'rgba(255,255,255,0.6)' },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
