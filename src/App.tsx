import { ThemeProvider, createTheme, CssBaseline, Box, Container, Tabs, Tab, AppBar } from '@mui/material';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import EventsList from './components/EventsList';
import SettingsForm from './components/SettingsForm';

const theme = createTheme({
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 1,
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            sx={{ px: 2, '& .MuiTab-root': { color: 'common.white' } }}
          >
            <Tab label="Events" />
            <Tab label="Settings" />
          </Tabs>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {tab === 0 && <EventsList />}
          {tab === 1 && <SettingsForm />}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;