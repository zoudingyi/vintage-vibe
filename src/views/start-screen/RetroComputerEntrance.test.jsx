import { act, createEvent, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DESKTOP_STORAGE_KEY } from '@/desktop/desktopStorage';
import DesktopExperience from '@/desktop/DesktopExperience';
import StartScreen from './index';

const originalMatchMedia = window.matchMedia;

function LocationLabel() {
  const { pathname } = useLocation();
  return <output aria-label="Current route">{pathname}</output>;
}

function renderEntrance(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LocationLabel />
      <Routes>
        <Route path="/" element={<DesktopExperience />}>
          <Route index element={<StartScreen />} />
          <Route path="home" element={<></>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function finishBootAnimation() {
  const surface = document.querySelector('.retro-computer-portal');
  const event = createEvent.animationEnd(surface, { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: 'retro-computer-enter' });
  fireEvent(surface, event);
}

function saveSession({ restoreSession = true } = {}) {
  window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify({
    version: 1,
    settings: { wallpaper: 'clouds', react95Theme: 'original', restoreSession },
    session: {
      activeWindowId: 'my-computer',
      windows: [{
        appId: 'my-computer', id: 'my-computer', position: { x: 64, y: 40 },
        size: { width: 420, height: 300 }, status: 'normal',
        zIndex: 101, restoreBounds: null
      }]
    }
  }));
}

beforeEach(() => {
  jest.useFakeTimers();
  window.localStorage.clear();
  window.matchMedia = jest.fn(() => ({
    matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn()
  }));
});

afterEach(() => {
  jest.useRealTimers();
  window.localStorage.clear();
  window.matchMedia = originalMatchMedia;
});

test.each([
  '启动复古电脑，进入桌面',
  '按下电源键，进入桌面'
])('%s boots the real desktop before changing routes', buttonName => {
  renderEntrance();
  // Read the settings at activation time, including changes after the entrance renders.
  saveSession();
  fireEvent.click(screen.getByRole('button', { name: buttonName }));

  const surface = document.querySelector('.retro-computer-portal');
  const desktop = within(surface).getByTestId('desktop-surface');
  const restoredWindow = within(surface).getByRole('dialog', { name: 'My Computer', hidden: true });
  expect(desktop).toHaveClass('desktop-wallpaper-clouds');
  expect(restoredWindow).toBeInTheDocument();
  expect(surface).toHaveAttribute('inert');
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/');
  expect(screen.getByRole('button', { name: buttonName })).toBeDisabled();
  expect(restoredWindow).not.toHaveFocus();
  fireEvent.keyDown(window, { ctrlKey: true, key: 'Escape' });
  expect(screen.queryByRole('menu', { hidden: true })).not.toBeInTheDocument();

  // Ignore animation events bubbling from desktop decorations.
  fireEvent.animationEnd(desktop);
  expect(surface).toHaveAttribute('inert');
  finishBootAnimation();

  expect(screen.getByLabelText('Current route')).toHaveTextContent('/home');
  expect(screen.getByTestId('desktop-surface')).toBe(desktop);
  expect(screen.getByRole('dialog', { name: 'My Computer' })).toBe(restoredWindow);
  expect(surface).not.toHaveAttribute('inert');
  expect(restoredWindow).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(screen.getByRole('menu')).toBeInTheDocument();
});

test('respects disabled session restore during the boot preview and after entry', () => {
  saveSession({ restoreSession: false });
  renderEntrance();
  fireEvent.click(screen.getByRole('button', { name: '按下电源键，进入桌面' }));
  expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
  finishBootAnimation();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByTestId('desktop-surface')).toHaveClass('desktop-wallpaper-clouds');
});

test('restores the radio without autoplay during or after boot', () => {
  const play = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
  window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify({
    version: 1, settings: { showBootLog: false },
    session: { activeWindowId: 'vaporwave-radio', windows: [{
      appId: 'vaporwave-radio', id: 'vaporwave-radio', position: { x: 64, y: 40 },
      size: { width: 580, height: null }, status: 'normal',
      zIndex: 101, restoreBounds: null
    }] }
  }));
  try {
    renderEntrance();
    fireEvent.click(screen.getByRole('button', { name: '按下电源键，进入桌面' }));
    const audio = document.querySelector('audio');
    expect(audio).toBeInTheDocument();
    finishBootAnimation();
    expect(document.querySelector('audio')).toBe(audio);
    expect(screen.getByRole('button', { name: 'Play music' })).toBeEnabled();
    expect(play).not.toHaveBeenCalled();
  } finally {
    play.mockRestore();
  }
});

test('completes boot if the browser does not deliver an animation end event', () => {
  renderEntrance();
  fireEvent.click(screen.getByRole('button', { name: '按下电源键，进入桌面' }));
  act(() => jest.advanceTimersByTime(2800));
  expect(screen.getByLabelText('Current route')).toHaveTextContent(/^\/$/);
  expect(screen.getByRole('button', { name: '按下电源键，进入桌面' })).toBeDisabled();
  act(() => jest.advanceTimersByTime(200));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/home');
  expect(screen.getByRole('button', { name: /start/i })).toBeEnabled();
});

test('shows the in-screen startup before handing the same desktop to the route', () => {
  renderEntrance();
  expect(screen.queryByText('VIBE/95', { exact: true })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '按下电源键，进入桌面' }));
  const logo = screen.getByText('VIBE/95', { exact: true });
  expect(screen.getByRole('button', { name: '启动复古电脑，进入桌面' })).toContainElement(logo);
  expect(within(screen.getByRole('main')).getByRole('status')).toHaveTextContent('VIBE/95 · BOOTING');
  const desktop = document.querySelector('[data-testid="desktop-surface"]');
  const surface = document.querySelector('.retro-computer-portal');

  // 调谐、启动标识和桌面淡入结束都不能提前切换路由或解锁。
  fireEvent.animationEnd(logo);
  const tuningEnd = createEvent.animationEnd(logo, { bubbles: true });
  Object.defineProperty(tuningEnd, 'animationName', { value: 'retro-computer-signal-lock' });
  fireEvent(logo, tuningEnd);
  const revealEnd = createEvent.animationEnd(surface, { bubbles: true });
  Object.defineProperty(revealEnd, 'animationName', { value: 'retro-computer-desktop-reveal' });
  fireEvent(surface, revealEnd);
  act(() => jest.advanceTimersByTime(2050));
  expect(screen.getByLabelText('Current route')).toHaveTextContent(/^\/$/);
  expect(surface).toHaveAttribute('inert');

  finishBootAnimation();
  expect(screen.queryByText('VIBE/95', { exact: true })).not.toBeInTheDocument();
  expect(screen.getByTestId('desktop-surface')).toBe(desktop);
  expect(surface).not.toHaveAttribute('inert');
});

test('enters immediately with the saved desktop when reduced motion is requested', () => {
  window.matchMedia = jest.fn(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    addEventListener: jest.fn(), removeEventListener: jest.fn()
  }));
  saveSession();
  renderEntrance();
  fireEvent.click(screen.getByRole('button', { name: '按下电源键，进入桌面' }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/home');
  expect(screen.getByRole('dialog', { name: 'My Computer' })).toHaveFocus();
  expect(document.querySelector('.retro-computer-portal')).not.toBeInTheDocument();
  expect(screen.queryByText('VIBE/95', { exact: true })).not.toBeInTheDocument();
});

test('uses compact windows during boot and enables single-tap launch after entry', () => {
  window.matchMedia = jest.fn(query => ({
    matches: query.includes('max-width'),
    addEventListener: jest.fn(), removeEventListener: jest.fn()
  }));
  saveSession();
  renderEntrance();
  fireEvent.click(screen.getByRole('button', { name: '按下电源键，进入桌面' }));
  const restoredWindow = screen.getByRole('dialog', { name: 'My Computer', hidden: true });
  expect(within(restoredWindow).queryByLabelText('Maximize My Computer')).not.toBeInTheDocument();
  finishBootAnimation();
  expect(screen.getByRole('dialog', { name: 'My Computer' })).toBe(restoredWindow);
  fireEvent.click(screen.getByRole('button', { name: 'Close My Computer' }));
  fireEvent.click(screen.getByRole('button', { name: 'My Computer', exact: true }));
  expect(screen.getByRole('dialog', { name: 'My Computer' })).toBeInTheDocument();
});

test.each(['/home', '/home/', '/HOME'])('direct entry at %s renders the saved desktop', path => {
  saveSession();
  renderEntrance(path);
  expect(screen.getByRole('dialog', { name: 'My Computer' })).toHaveFocus();
  expect(screen.getByTestId('desktop-surface')).toHaveClass('desktop-wallpaper-clouds');
  expect(document.querySelector('.retro-computer-portal')).not.toBeInTheDocument();
});
