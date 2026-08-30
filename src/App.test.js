import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the start screen', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /vintage vibe/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /boot desktop/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/vaporos 0\.95/i)).toBeInTheDocument();
  expect(screen.getByText(/portfolio online/i)).toBeInTheDocument();
  expect(
    screen.getByText(/a playable portfolio by devo zou/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/interactive portfolio system/i)).toBeInTheDocument();
  expect(screen.getByText(/system ready/i)).toBeInTheDocument();
});
