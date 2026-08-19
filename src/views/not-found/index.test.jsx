import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import NotFound from './index';

test('renders the retro not found view', () => {
  render(
    <ThemeProvider theme={theSixtiesUSA}>
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <NotFound />
      </MemoryRouter>
    </ThemeProvider>
  );

  expect(screen.getByText(/404 - shortcut target not found/i)).toBeInTheDocument();
  expect(screen.getByTestId('system-error-window')).toHaveClass(
    'system-error-glitch'
  );
  expect(screen.getByRole('link', { name: /return to desktop/i })).toHaveAttribute(
    'href',
    '/home'
  );
});
