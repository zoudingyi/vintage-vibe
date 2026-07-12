import { fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import Home from './index';
import { DESKTOP_STORAGE_KEY } from '@/desktop/desktopStorage';

const originalAudioContext = window.AudioContext;

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

afterEach(() => {
  jest.useRealTimers();
  window.AudioContext = originalAudioContext;
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

  expect(contextMenu).toHaveStyle({ left: '156px', top: '78px' });
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

test('switches between settings pages', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);

  expect(screen.getByRole('tab', { name: /appearance/i })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  fireEvent.click(screen.getByRole('tab', { name: /desktop/i }));

  expect(screen.getByRole('tabpanel')).toHaveTextContent(/icon layout/i);
  expect(screen.queryByText(/^wallpaper$/i)).not.toBeInTheDocument();
});

test('updates and persists global audio preferences from settings', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /audio/i }));

  const soundToggle = screen.getByLabelText(/enable sound/i);
  const volumeControl = screen.getByLabelText(/master volume/i);

  expect(soundToggle).not.toBeChecked();
  expect(volumeControl).toHaveValue('25');

  fireEvent.click(soundToggle);
  fireEvent.change(volumeControl, { target: { value: '40' } });

  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
  ).toMatchObject({ masterVolume: 40, soundEnabled: true });
});

test('plays a test sound through the global audio controls', () => {
  const gain = {
    connect: jest.fn(),
    gain: {
      exponentialRampToValueAtTime: jest.fn(),
      setValueAtTime: jest.fn()
    }
  };
  const oscillator = {
    connect: jest.fn(),
    frequency: { setValueAtTime: jest.fn() },
    start: jest.fn(),
    stop: jest.fn()
  };
  const audioContext = {
    createGain: jest.fn(() => gain),
    createOscillator: jest.fn(() => oscillator),
    currentTime: 2,
    destination: {}
  };
  window.AudioContext = jest.fn(() => audioContext);

  renderDesktop();
  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /audio/i }));

  const testSoundButton = screen.getByRole('button', { name: /test sound/i });
  expect(testSoundButton).toBeDisabled();

  fireEvent.click(screen.getByLabelText(/enable sound/i));
  fireEvent.change(screen.getByLabelText(/master volume/i), {
    target: { value: '40' }
  });
  fireEvent.click(testSoundButton);

  expect(window.AudioContext).toHaveBeenCalledTimes(1);
  expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.4, 2);
  expect(oscillator.start).toHaveBeenCalledWith(2);
  expect(oscillator.stop).toHaveBeenCalledWith(2.25);
  expect(screen.getByRole('status')).toHaveTextContent(/test sound played/i);
});

test('reports when test sound is unsupported without crashing', () => {
  window.AudioContext = undefined;

  renderDesktop();
  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /audio/i }));
  fireEvent.click(screen.getByLabelText(/enable sound/i));
  fireEvent.click(screen.getByRole('button', { name: /test sound/i }));

  expect(screen.getByRole('status')).toHaveTextContent(
    /audio is not supported/i
  );
});

test('switches and persists the Radio appearance from Settings', () => {
  renderDesktop();

  openStartMenuItem(/vaporwave radio/i);
  expect(
    screen.getByRole('region', { name: /cassette deck/i })
  ).toBeInTheDocument();

  openStartMenuItem(/settings/i);
  const settingsWindow = screen.getByRole('dialog', { name: /settings/i });
  fireEvent.click(
    within(settingsWindow).getByRole('tab', { name: /audio/i })
  );
  fireEvent.click(
    within(settingsWindow).getByRole('button', { name: /night drive/i })
  );

  expect(
    screen.getByRole('region', { name: /night drive/i })
  ).toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .radioAppearance
  ).toBe('night-drive');
});

test('preserves Radio playback state while changing appearance', () => {
  renderDesktop();

  openStartMenuItem(/vaporwave radio/i);
  const radioWindow = screen.getByRole('dialog', {
    name: /vaporwave radio/i
  });
  fireEvent.click(
    within(radioWindow).getByRole('button', { name: /play preview/i })
  );
  fireEvent.click(
    within(radioWindow).getByRole('button', { name: /88.7 palm mirage/i })
  );

  openStartMenuItem(/settings/i);
  const settingsWindow = screen.getByRole('dialog', { name: /settings/i });
  fireEvent.click(
    within(settingsWindow).getByRole('tab', { name: /audio/i })
  );
  fireEvent.click(
    within(settingsWindow).getByRole('button', {
      name: /broadcast terminal/i
    })
  );

  expect(
    within(radioWindow).getByRole('button', { name: /pause preview/i })
  ).toBeInTheDocument();
  expect(within(radioWindow).getByText('PALM MIRAGE')).toBeInTheDocument();
});

test('moves between settings pages with arrow keys', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);

  const appearanceTab = screen.getByRole('tab', { name: /appearance/i });
  const desktopTab = screen.getByRole('tab', { name: /desktop/i });
  fireEvent.focus(appearanceTab);
  fireEvent.keyDown(appearanceTab, { key: 'ArrowRight' });

  expect(desktopTab).toHaveFocus();
  expect(desktopTab).toHaveAttribute('aria-selected', 'true');
});

test('selects and persists an expanded wallpaper option', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(
    screen.getByRole('button', { name: /pixel checkerboard/i })
  );

  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-checkerboard'
  );
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .wallpaper
  ).toBe('checkerboard');
});

test('selects and previews the Neon Horizon wallpaper', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('button', { name: /neon horizon/i }));

  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-neon-horizon'
  );
  expect(screen.getByTestId('settings-monitor-screen')).toHaveClass(
    'desktop-wallpaper-neon-horizon'
  );
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .wallpaper
  ).toBe('neon-horizon');
});

test('applies scanline intensity without exposing inactive animation settings', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('button', { name: /strong/i }));

  expect(screen.getByTestId('desktop-environment')).toHaveAttribute(
    'data-scanline-intensity',
    'strong'
  );
  expect(
    screen.queryByText(/^animation mode$/i)
  ).not.toBeInTheDocument();
  expect(screen.getByTestId('desktop-environment')).not.toHaveAttribute(
    'data-animation-mode'
  );
});

test('previews appearance changes inside the settings monitor', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);

  const preview = screen.getByRole('region', {
    name: /appearance preview/i
  });
  expect(within(preview).getByTestId('settings-monitor-screen')).toHaveClass(
    'desktop-wallpaper-sunset'
  );
  expect(within(preview).getByTestId('settings-monitor-screen')).toHaveAttribute(
    'data-scanlines',
    'true'
  );

  fireEvent.click(screen.getByRole('button', { name: /pixel clouds/i }));
  fireEvent.click(screen.getByRole('button', { name: /matrix/i }));
  fireEvent.click(screen.getByLabelText(/^scanlines$/i));

  expect(within(preview).getByTestId('settings-monitor-screen')).toHaveClass(
    'desktop-wallpaper-clouds'
  );
  expect(within(preview).getByTestId('settings-monitor-screen')).toHaveAttribute(
    'data-scanlines',
    'false'
  );
  expect(within(preview).getByTestId('settings-monitor-window')).toHaveStyle({
    backgroundColor: '#535353'
  });
});

test('applies desktop icon layout and size preferences', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /desktop/i }));
  fireEvent.click(screen.getByRole('button', { name: /grid/i }));
  fireEvent.click(screen.getByRole('button', { name: /large/i }));

  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-icons-grid',
    'desktop-icon-size-large'
  );
  expect(screen.getByTestId('desktop-icon-my-computer')).toHaveAttribute(
    'width',
    '40'
  );
});

test('selects and persists a desktop icon glow effect', () => {
  renderDesktop();

  expect(screen.getByTestId('desktop-surface')).toHaveAttribute(
    'data-icon-glow',
    'soft'
  );
  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /desktop/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /pixel rgb split/i })
  );
  fireEvent.click(screen.getByRole('button', { name: /my computer/i }));

  expect(screen.getByTestId('desktop-surface')).toHaveAttribute(
    'data-icon-glow',
    'pixel'
  );
  expect(screen.getByRole('button', { name: /my computer/i })).toHaveAttribute(
    'data-selected',
    'true'
  );
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .iconGlowEffect
  ).toBe('pixel');
});

test('applies taskbar clock and button preferences', () => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2025, 0, 1, 13, 5, 9));
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /taskbar/i }));
  fireEvent.click(screen.getByLabelText(/show seconds/i));
  fireEvent.click(screen.getByRole('button', { name: /icon only/i }));

  expect(screen.getByTestId('taskbar-clock')).toHaveTextContent('13:05:09');
  expect(screen.getByTestId('taskbar-window-list')).toHaveAttribute(
    'data-button-mode',
    'icon'
  );
});

test('switches and persists the react95 theme from settings', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('button', { name: /matrix/i }));

  expect(screen.getByTestId('window-surface-settings')).toHaveStyle({
    backgroundColor: '#535353'
  });
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .react95Theme
  ).toBe('matrix');
});

test('shows the active theme and resets it to the default', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);

  const defaultTheme = screen.getByRole('button', { name: /sixties usa/i });
  const matrixTheme = screen.getByRole('button', { name: /matrix/i });

  expect(defaultTheme).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(matrixTheme);
  expect(matrixTheme).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(screen.getByRole('tab', { name: /system/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /reset all settings/i })
  );
  fireEvent.click(screen.getByRole('tab', { name: /appearance/i }));
  expect(
    screen.getByRole('button', { name: /sixties usa/i })
  ).toHaveAttribute('aria-pressed', 'true');
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
  expect(screen.getByTestId('desktop-environment')).toHaveStyle({
    '--desktop-accent': '#a7a7a7',
    '--desktop-accent-dark': '#282828'
  });
});

test('applies the persisted react95 theme to desktop windows', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: { react95Theme: 'matrix' },
      session: { activeWindowId: null, windows: [] }
    })
  );

  renderDesktop();
  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));

  expect(screen.getByTestId('window-surface-my-computer')).toHaveStyle({
    backgroundColor: '#535353'
  });
  expect(screen.getByTestId('desktop-environment')).toHaveStyle({
    '--desktop-accent': '#a7a7a7',
    '--desktop-accent-dark': '#282828'
  });
});

test('clears the current window session from settings', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /system/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /clear window session/i })
  );

  expect(screen.queryByText(/system properties/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/^settings$/i)).not.toBeInTheDocument();
});

test('persists the session restore preference', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /system/i }));
  fireEvent.click(screen.getByLabelText(/restore previous session/i));

  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .restoreSession
  ).toBe(false);
});

test('hides and persists the boot log preference', () => {
  renderDesktop();

  expect(screen.getByLabelText(/boot sequence/i)).toBeInTheDocument();
  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('tab', { name: /system/i }));
  fireEvent.click(screen.getByLabelText(/show boot log/i));

  expect(screen.queryByLabelText(/boot sequence/i)).not.toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
      .showBootLog
  ).toBe(false);
});

test('resets appearance without changing system preferences', () => {
  renderDesktop();

  openStartMenuItem(/settings/i);
  fireEvent.click(screen.getByRole('button', { name: /matrix/i }));
  fireEvent.click(screen.getByRole('button', { name: /sunset/i }));
  fireEvent.click(screen.getByRole('tab', { name: /audio/i }));
  fireEvent.click(screen.getByRole('button', { name: /night drive/i }));
  fireEvent.click(screen.getByRole('tab', { name: /system/i }));
  fireEvent.click(screen.getByLabelText(/restore previous session/i));
  fireEvent.click(screen.getByRole('button', { name: /reset appearance/i }));

  const settings = JSON.parse(
    window.localStorage.getItem(DESKTOP_STORAGE_KEY)
  ).settings;
  expect(settings).toMatchObject({
    radioAppearance: 'cassette',
    react95Theme: 'theSixtiesUSA',
    restoreSession: false,
    wallpaper: 'sunset'
  });
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

  expect(screen.queryByText(/arrange icons/i)).not.toBeInTheDocument();
  fireEvent.click(screen.getByText(/personalize/i));

  expect(
    screen.getByRole('tab', { name: /appearance/i })
  ).toHaveAttribute('aria-selected', 'true');
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
    target: { value: 'theme matrix' }
  });
  fireEvent.click(screen.getByRole('button', { name: /run/i }));

  expect(screen.getByTestId('window-surface-terminal')).toHaveStyle({
    backgroundColor: '#535353'
  });

  fireEvent.change(screen.getByLabelText(/terminal command/i), {
    target: { value: 'rosebud' }
  });
  fireEvent.click(screen.getByRole('button', { name: /run/i }));

  expect(screen.getByText(/infinite nostalgia credits/i)).toBeInTheDocument();
});

test('applies hidden vaporwave terminal presets without listing them in help', () => {
  renderDesktop();

  openStartMenuItem(/terminal/i);

  const runCommand = value => {
    fireEvent.change(screen.getByLabelText(/terminal command/i), {
      target: { value }
    });
    fireEvent.click(screen.getByRole('button', { name: /run/i }));
  };

  runCommand('help');
  expect(screen.getByText(/commands: about/i)).not.toHaveTextContent(
    /aesthetic|mallsoft|vhs on|sunset/i
  );

  runCommand('aesthetic');
  expect(screen.getByText(/aesthetic mode engaged/i)).toBeInTheDocument();
  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-neon-horizon'
  );
  expect(screen.getByTestId('desktop-environment')).toHaveAttribute(
    'data-scanline-intensity',
    'strong'
  );
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
  ).toMatchObject({
    react95Theme: 'vaporTeal',
    scanlineIntensity: 'strong',
    scanlines: true,
    wallpaper: 'neon-horizon'
  });

  runCommand('mallsoft');
  expect(screen.getByText(/mallsoft ambience loaded/i)).toBeInTheDocument();
  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-clouds'
  );
  expect(
    JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).settings
  ).toMatchObject({
    react95Theme: 'candy',
    scanlineIntensity: 'subtle',
    scanlines: true,
    wallpaper: 'clouds'
  });

  runCommand('vhs off');
  expect(screen.getByTestId('desktop-environment')).toHaveAttribute(
    'data-scanlines',
    'false'
  );

  runCommand('vhs on');
  expect(screen.getByTestId('desktop-environment')).toHaveAttribute(
    'data-scanlines',
    'true'
  );
  expect(screen.getByTestId('desktop-environment')).toHaveAttribute(
    'data-scanline-intensity',
    'strong'
  );

  runCommand('sunset');
  expect(screen.getByTestId('desktop-surface')).toHaveClass(
    'desktop-wallpaper-sunset'
  );
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
