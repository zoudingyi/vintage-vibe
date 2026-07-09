import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the start screen', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /vintage visions/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /insert coin to continue/i })
  ).toBeInTheDocument();
});
