import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type AppPage = 'events' | 'settings';

interface AppLayoutProps {
  children: ReactNode;
  selectedPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

export function AppLayout({
  children,
  selectedPage,
  onPageChange,
}: AppLayoutProps) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        {selectedPage === 'events' ? 'See Tickets' : 'See Settings'}
      </Typography>

      <Tabs
        value={selectedPage}
        onChange={(_, page: AppPage) => onPageChange(page)}
        aria-label="Application pages"
        centered
        sx={{
          mb: 4,
          '& .MuiTab-root': { color: 'white' },
          '& .MuiTab-root.Mui-selected': { color: 'white' },
        }}
      >
        <Tab label="Events" value="events" />
        <Tab label="Settings" value="settings" />
      </Tabs>

      {children}
    </Container>
  );
}
