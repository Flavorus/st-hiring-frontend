import type { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import eventsReducer from '../features/events/eventsSlice';
import settingsReducer from '../features/settings/settingsSlice';
import type { RootState } from '../store/store';
import { theme } from '../theme/theme';

type PreloadedState = Partial<RootState>;

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
}

function renderWithProviders(
  ui: ReactElement,
  { preloadedState = {}, ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const store = configureStore({
    reducer: { events: eventsReducer, settings: settingsReducer },
    preloadedState,
  });

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export { renderWithProviders };
