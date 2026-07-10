import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import About from './index';

test('renders a useful profile fallback outside the desktop shell', () => {
  render(
    <ThemeProvider theme={theSixtiesUSA}>
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <About />
      </MemoryRouter>
    </ThemeProvider>
  );

  expect(screen.getByText(/frontend system/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /open desktop/i })).toHaveAttribute(
    'href',
    '/home'
  );
});
