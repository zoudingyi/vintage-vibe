import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DESKTOP_STORAGE_KEY } from '@/desktop/desktopStorage';
import RetroComputerEntrance from './RetroComputerEntrance';

function renderEntrance() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<RetroComputerEntrance />} />
        <Route path="/home" element={<h1>Desktop</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  window.localStorage.clear();
  window.matchMedia = jest.fn(() => ({ matches: false }));
});

afterEach(() => {
  jest.useRealTimers();
  window.localStorage.clear();
});

test.each([
  '启动复古电脑，进入桌面',
  '按下电源键，进入桌面'
])('%s boots the computer before entering the desktop', (buttonName) => {
  renderEntrance();

  fireEvent.click(screen.getByRole('button', { name: buttonName }));

  expect(screen.getByRole('status')).toHaveTextContent('VIBE/95 · SYSTEM READY');
  expect(screen.getByRole('button', { name: buttonName })).toBeDisabled();
  expect(screen.queryByRole('heading', { name: 'Desktop' })).not.toBeInTheDocument();

  act(() => jest.advanceTimersByTime(1000));

  expect(screen.getByRole('heading', { name: 'Desktop' })).toBeInTheDocument();
});

test('uses the saved wallpaper for both the computer and expanding desktop preview', () => {
  renderEntrance();
  // Read the setting at activation time, including changes made after the entrance renders.
  window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify({
    version: 1,
    settings: { wallpaper: 'clouds', react95Theme: 'original' },
    session: { activeWindowId: null, windows: [] }
  }));

  fireEvent.click(screen.getByRole('button', { name: '启动复古电脑，进入桌面' }));

  expect(document.querySelector('.retro-computer__connected-desktop .desktop-wallpaper-clouds'))
    .toBeInTheDocument();
  expect(document.querySelector('.retro-computer-portal .desktop-wallpaper-clouds'))
    .toBeInTheDocument();
});

test('enters immediately when reduced motion is requested', () => {
  window.matchMedia = jest.fn(() => ({ matches: true }));
  renderEntrance();

  fireEvent.click(screen.getByRole('button', { name: '启动复古电脑，进入桌面' }));

  expect(screen.getByRole('heading', { name: 'Desktop' })).toBeInTheDocument();
  expect(document.querySelector('.retro-computer-portal')).not.toBeInTheDocument();
});
