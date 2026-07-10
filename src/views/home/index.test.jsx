import { fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import Home from './index';
import { DESKTOP_STORAGE_KEY } from '@/desktop/desktopStorage';

function renderDesktop() {
  return render(
    <ThemeProvider theme={theSixtiesUSA}>
      <Home />
    </ThemeProvider>
  );
}

function openStartMenuItem(name) {
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByText(name));
}

beforeEach(() => {
  window.localStorage.clear();
});

test('opens, minimizes, restores, and closes a desktop app window', () => {
  renderDesktop();

  expect(screen.queryByText(/system properties/i)).not.toBeInTheDocument();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));

  expect(screen.getByText(/system properties/i)).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/minimize my computer/i));

  expect(screen.getByText(/system properties/i)).not.toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: /restore my computer/i }));

  expect(screen.getByText(/system properties/i)).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/close my computer/i));

  expect(screen.queryByText(/system properties/i)).not.toBeInTheDocument();
});

test('preserves application state while its window is minimized', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /media player/i }));
  fireEvent.click(screen.getByRole('button', { name: /play track/i }));
  fireEvent.click(screen.getByRole('button', { name: /next track/i }));
  fireEvent.click(screen.getByLabelText(/minimize media player/i));
  fireEvent.click(screen.getByRole('button', { name: /restore media player/i }));

  expect(
    screen.getByRole('button', { name: /pause track/i })
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole('region', { name: /now playing/i })).getByText(
      /neon file explorer/i
    )
  ).toBeInTheDocument();
});

test('activates the next visible window after closing the active window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.click(screen.getByLabelText(/close projects/i));

  const activeWindow = screen.getByRole('dialog', { name: /my computer/i });

  expect(activeWindow).toHaveAttribute('data-active', 'true');
  expect(activeWindow).toHaveTextContent(/my computer/i);
});

test('activates the next visible window after minimizing the active window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.click(screen.getByLabelText(/minimize projects/i));

  const activeWindow = screen.getByRole('dialog', { name: /my computer/i });

  expect(activeWindow).toHaveAttribute('data-active', 'true');
  expect(activeWindow).toHaveTextContent(/my computer/i);
});

test('brings a background window forward when its content is pressed', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);

  const computerWindow = screen.getByRole('dialog', {
    name: /my computer/i
  });
  const projectsWindow = screen.getByRole('dialog', { name: /projects/i });

  fireEvent.mouseDown(
    screen.getByRole('region', { name: /my computer content/i })
  );

  expect(computerWindow).toHaveAttribute('data-active', 'true');
  expect(Number(computerWindow.style.zIndex)).toBeGreaterThan(
    Number(projectsWindow.style.zIndex)
  );
});

test('brings a background window forward when its title bar is dragged', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);

  const computerWindow = screen.getByRole('dialog', {
    name: /my computer/i
  });
  const projectsWindow = screen.getByRole('dialog', { name: /projects/i });
  const titleBar = within(computerWindow).getByText(/^my computer$/i);

  fireEvent.mouseDown(titleBar, { clientX: 110, clientY: 50 });
  fireEvent.mouseMove(window, { clientX: 130, clientY: 60 });
  fireEvent.mouseUp(window);

  expect(computerWindow).toHaveAttribute('data-active', 'true');
  expect(Number(computerWindow.style.zIndex)).toBeGreaterThan(
    Number(projectsWindow.style.zIndex)
  );
});

test('maximizes and restores an application window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  fireEvent.click(screen.getByLabelText(/maximize my computer/i));

  expect(
    screen.getByRole('button', { name: /restore my computer/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/restore my computer/i));

  expect(
    screen.getByRole('button', { name: /maximize my computer/i })
  ).toBeInTheDocument();
});

test('expands application content to fill a maximized window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  fireEvent.click(screen.getByLabelText(/maximize my computer/i));

  const content = screen.getByRole('region', {
    name: /my computer content/i
  });

  expect(content).toHaveStyle({ flexGrow: '1', minHeight: '0' });
});

test('toggles the active window from its taskbar button', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  fireEvent.click(screen.getByRole('button', { name: /focus my computer/i }));

  expect(screen.getByText(/system properties/i)).not.toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: /restore my computer/i }));

  expect(screen.getByText(/system properties/i)).toBeVisible();
});

test('focuses a maximized window from the taskbar without restoring it', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  fireEvent.click(screen.getByLabelText(/maximize my computer/i));
  openStartMenuItem(/projects/i);
  fireEvent.click(screen.getByRole('button', { name: /focus my computer/i }));

  expect(
    screen.getByRole('button', { name: /restore my computer/i })
  ).toBeInTheDocument();
});

test('shows the desktop from the context menu', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 24,
    clientY: 32
  });
  fireEvent.click(screen.getByRole('button', { name: /show desktop/i }));

  expect(screen.getByText(/system properties/i)).not.toBeVisible();
  expect(screen.getByText(/projects explorer/i)).not.toBeVisible();
});

test('cascades visible windows from the context menu', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 24,
    clientY: 32
  });
  fireEvent.click(screen.getByRole('button', { name: /cascade windows/i }));

  const computerFrame = screen.getByRole('dialog', {
    name: /my computer/i
  });
  const projectsFrame = screen.getByRole('dialog', { name: /projects/i });

  expect(computerFrame).toHaveStyle('transform: translate(24px,24px)');
  expect(projectsFrame).toHaveStyle('transform: translate(52px,52px)');
});

test('tiles visible windows from the context menu', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 24,
    clientY: 32
  });
  fireEvent.click(screen.getByRole('button', { name: /tile windows/i }));

  const computerFrame = screen.getByRole('dialog', {
    name: /my computer/i
  });
  const projectsFrame = screen.getByRole('dialog', { name: /projects/i });

  expect(computerFrame).toHaveStyle('transform: translate(8px,8px)');
  expect(projectsFrame).toHaveStyle('transform: translate(516px,8px)');
});

test('resizes a normal application window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));

  const resizeHandle = screen.getByLabelText(/resize my computer/i);
  const windowFrame = screen.getByRole('dialog', { name: /my computer/i });
  const windowSurface = screen.getByTestId('window-surface-my-computer');
  const content = screen.getByRole('region', {
    name: /my computer content/i
  });

  fireEvent.mouseDown(resizeHandle, { clientX: 420, clientY: 180 });
  fireEvent.mouseMove(window, { clientX: 520, clientY: 230 });
  fireEvent.mouseUp(window);

  expect(windowFrame).toHaveStyle('width: 520px');
  expect(windowSurface).toHaveStyle({ height: '100%', width: '100%' });
  expect(content).toHaveStyle({ flexGrow: '1', minHeight: '0' });
});

test('keeps the desktop context menu inside the viewport', () => {
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 320
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 240
  });

  renderDesktop();
  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 310,
    clientY: 230
  });

  const contextMenu = screen.getByRole('menu');

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: originalWidth
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: originalHeight
  });

  expect(contextMenu).toHaveStyle({ left: '156px', top: '48px' });
});

test('opens apps from the start menu', () => {
  renderDesktop();

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByText(/projects/i));

  expect(screen.getByText(/projects explorer/i)).toBeInTheDocument();
});

test('opens the focused desktop icon with Enter', () => {
  renderDesktop();

  const computerIcon = screen.getByRole('button', { name: /my computer/i });
  fireEvent.focus(computerIcon);
  fireEvent.keyDown(computerIcon, { key: 'Enter' });

  expect(screen.getByText(/system properties/i)).toBeVisible();
});

test('moves focus between desktop icons with arrow keys', () => {
  renderDesktop();

  const computerIcon = screen.getByRole('button', { name: /my computer/i });
  const folderIcon = screen.getByRole('button', { name: /my folder/i });
  fireEvent.focus(computerIcon);
  fireEvent.keyDown(computerIcon, { key: 'ArrowDown' });

  expect(folderIcon).toHaveFocus();
});

test('toggles the start menu with Ctrl+Escape', () => {
  renderDesktop();

  fireEvent.keyDown(window, { ctrlKey: true, key: 'Escape' });

  expect(screen.getByText(/profile/i)).toBeVisible();

  fireEvent.keyDown(window, { ctrlKey: true, key: 'Escape' });

  expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
});

test('dismisses desktop menus with Escape', () => {
  renderDesktop();

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.keyDown(window, { key: 'Escape' });

  expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();

  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 24,
    clientY: 32
  });
  fireEvent.keyDown(window, { key: 'Escape' });

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('switches visible windows with Alt+Tab', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.keyDown(window, { altKey: true, key: 'Tab' });

  const activeWindow = screen.getByRole('dialog', { name: /my computer/i });

  expect(activeWindow).toHaveAttribute('data-active', 'true');
  expect(activeWindow).toHaveTextContent(/my computer/i);
});

test('closes the active window with Alt+F4', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  fireEvent.keyDown(window, { altKey: true, key: 'F4' });

  expect(screen.queryByText(/system properties/i)).not.toBeInTheDocument();
});

test('navigates and opens start menu apps with the keyboard', () => {
  renderDesktop();

  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  const mediaPlayerItem = screen.getByRole('menuitem', {
    name: /media player/i
  });
  const profileItem = screen.getByRole('menuitem', { name: /profile/i });

  expect(mediaPlayerItem).toHaveFocus();

  fireEvent.keyDown(mediaPlayerItem, { key: 'ArrowDown' });
  expect(profileItem).toHaveFocus();

  fireEvent.keyDown(profileItem, { key: 'Enter' });
  expect(screen.getByText(/frontend system/i)).toBeVisible();
});

test('labels an opened application window as a dialog', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));

  expect(
    screen.getByRole('dialog', { name: /my computer/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('dialog', { name: /my computer/i })
  ).toHaveFocus();
});

test('restores focus to the desktop icon after closing its window', () => {
  renderDesktop();

  const computerIcon = screen.getByRole('button', { name: /my computer/i });
  fireEvent.focus(computerIcon);
  fireEvent.keyDown(computerIcon, { key: 'Enter' });
  fireEvent.click(screen.getByLabelText(/close my computer/i));

  expect(computerIcon).toHaveFocus();
});

test('closes the start menu when clicking the desktop', () => {
  renderDesktop();

  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  expect(screen.getByText(/profile/i)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('desktop-surface'));

  expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
});

test('enters the shutdown screen from the start menu', () => {
  renderDesktop();

  openStartMenuItem(/shutdown/i);

  expect(
    screen.getByText(/it is now safe to turn off your computer/i)
  ).toBeInTheDocument();
});

test('shows profile skills from the start menu', () => {
  renderDesktop();

  openStartMenuItem(/profile/i);

  expect(screen.getByText(/frontend system/i)).toBeInTheDocument();
  expect(screen.getByText(/react/i)).toBeInTheDocument();
});

test('opens a project detail with external links', () => {
  renderDesktop();

  openStartMenuItem(/projects/i);
  fireEvent.click(screen.getByRole('button', { name: /vintage vibe/i }));

  expect(screen.getByText(/react95 desktop portfolio/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /project github/i })).toHaveAttribute(
    'href',
    'https://github.com/zoudingyi/vintage-vibe'
  );
});

test('controls the media player playlist', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /media player/i }));

  const display = screen.getByRole('region', { name: /now playing/i });

  expect(display).toHaveTextContent(/midnight boot sequence/i);

  fireEvent.click(screen.getByRole('button', { name: /play track/i }));

  expect(
    screen.getByRole('button', { name: /pause track/i })
  ).toBeInTheDocument();
  expect(display).toHaveTextContent(/playing/i);

  fireEvent.click(screen.getByRole('button', { name: /next track/i }));

  expect(within(display).getByText(/neon file explorer/i)).toBeInTheDocument();
});

test('persists wallpaper settings from the settings app', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('button', { name: /starfield/i }));

  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-starfield'
  );
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .wallpaper
  ).toBe('starfield');
});

test('loads persisted desktop settings', () => {
  window.localStorage.setItem(
    'vintage-vibe-desktop-settings',
    JSON.stringify({ accent: 'green', wallpaper: 'sunset' })
  );

  renderDesktop();

  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-sunset'
  );
  expect(screen.getByTestId('desktop-environment')).toHaveClass(
    'desktop-accent-green'
  );
});

test('clears the current window session from settings', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('button', { name: /clear session/i }));

  expect(screen.queryByText(/system properties/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/^settings$/i)).not.toBeInTheDocument();
});

test('persists the session restore preference', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByLabelText(/restore previous session/i));

  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .restoreSession
  ).toBe(false);
});

test('restores an open window from the previous desktop session', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: { restoreSession: true },
      session: {
        activeWindowId: 'my-computer',
        windows: [
          {
            appId: 'my-computer',
            id: 'my-computer',
            position: { x: 96, y: 32 },
            restoreBounds: null,
            size: { height: null, width: 420 },
            status: 'normal',
            zIndex: 101
          }
        ]
      }
    })
  );

  renderDesktop();

  expect(screen.getByText(/system properties/i)).toBeVisible();
});

test('does not restore windows when session restore is disabled', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: { restoreSession: false },
      session: {
        activeWindowId: 'my-computer',
        windows: [
          {
            appId: 'my-computer',
            id: 'my-computer',
            position: { x: 96, y: 32 },
            restoreBounds: null,
            size: { height: null, width: 420 },
            status: 'normal',
            zIndex: 101
          }
        ]
      }
    })
  );

  renderDesktop();

  expect(screen.queryByText(/system properties/i)).not.toBeInTheDocument();
});

test('opens desktop apps with one tap in compact desktop mode', () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    matches: true,
    removeEventListener: jest.fn()
  });

  renderDesktop();
  fireEvent.click(screen.getByRole('button', { name: /media player/i }));

  window.matchMedia = originalMatchMedia;

  expect(screen.getByText(/now playing/i)).toBeVisible();
});

test('reports when corrupted desktop data is reset', () => {
  window.localStorage.setItem(DESKTOP_STORAGE_KEY, '{not-json');

  renderDesktop();

  expect(screen.getByRole('status')).toHaveTextContent(
    /desktop settings were reset/i
  );
});

test('uses the desktop context menu for personalization actions', () => {
  renderDesktop();

  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 24,
    clientY: 32
  });

  expect(screen.getByText(/arrange icons/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/arrange icons/i));

  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-icons-grid'
  );

  fireEvent.contextMenu(screen.getByTestId('desktop-surface'), {
    clientX: 24,
    clientY: 32
  });
  fireEvent.click(screen.getByText(/personalize/i));

  expect(screen.getByText(/wallpaper/i)).toBeInTheDocument();
});

test('shows and dismisses the boot log without blocking the desktop', () => {
  renderDesktop();

  expect(screen.getByLabelText(/boot sequence/i)).toHaveTextContent(
    /boot sequence complete/i
  );

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));

  expect(screen.getByText(/system properties/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /dismiss boot log/i }));

  expect(screen.queryByLabelText(/boot sequence/i)).not.toBeInTheDocument();
});

test('runs terminal commands and hidden commands', () => {
  renderDesktop();

  openStartMenuItem(/terminal/i);

  fireEvent.change(screen.getByLabelText(/terminal command/i), {
    target: { value: 'help' }
  });
  fireEvent.click(screen.getByRole('button', { name: /run/i }));

  expect(screen.getByText(/commands: about/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/terminal command/i), {
    target: { value: 'theme green' }
  });
  fireEvent.click(screen.getByRole('button', { name: /run/i }));

  expect(screen.getByTestId('desktop-environment')).toHaveClass(
    'desktop-accent-green'
  );

  fireEvent.change(screen.getByLabelText(/terminal command/i), {
    target: { value: 'rosebud' }
  });
  fireEvent.click(screen.getByRole('button', { name: /run/i }));

  expect(screen.getByText(/infinite nostalgia credits/i)).toBeInTheDocument();
});

test('persists guestbook signatures', () => {
  renderDesktop();

  openStartMenuItem(/guestbook/i);

  fireEvent.change(screen.getByLabelText(/guestbook name/i), {
    target: { value: 'Ada' }
  });
  fireEvent.change(screen.getByLabelText(/guestbook message/i), {
    target: { value: 'Great desktop shell.' }
  });
  fireEvent.click(screen.getByRole('button', { name: /sign guestbook/i }));

  expect(screen.getByText('Ada')).toBeInTheDocument();
  expect(screen.getByText(/great desktop shell/i)).toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem('vintage-vibe-guestbook'))[0]
      .message
  ).toBe('Great desktop shell.');
});

test('reports corrupted local guestbook data', () => {
  window.localStorage.setItem('vintage-vibe-guestbook', '{not-json');
  renderDesktop();

  openStartMenuItem(/guestbook/i);

  expect(screen.getByRole('status')).toHaveTextContent(
    /guestbook data could not be read/i
  );
});

test('recovers when local guestbook data has an invalid shape', () => {
  window.localStorage.setItem(
    'vintage-vibe-guestbook',
    JSON.stringify({ message: 'not an entry list' })
  );
  renderDesktop();

  openStartMenuItem(/guestbook/i);

  expect(screen.getByRole('status')).toHaveTextContent(
    /guestbook data could not be read/i
  );
  expect(screen.getByText(/no signatures yet/i)).toBeInTheDocument();
});

test('renders the desktop without React console errors', () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);

  renderDesktop();

  const consoleErrorCalls = consoleError.mock.calls;
  consoleError.mockRestore();

  expect(consoleErrorCalls).toEqual([]);
});
