import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' },
    secondary: { main: '#e65100' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 2 },
    },
  },
});
