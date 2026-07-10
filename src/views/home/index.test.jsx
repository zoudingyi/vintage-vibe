import { fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import Home from './index';

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
    within(screen.getByText(/now playing/i).closest('.media-player-display'))
      .getByText(/neon file explorer/i)
  ).toBeInTheDocument();
});

test('activates the next visible window after closing the active window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.click(screen.getByLabelText(/close projects/i));

  const activeWindow = document.querySelector(
    '.desktop-window[data-active="true"]'
  );

  expect(activeWindow).toHaveTextContent(/my computer/i);
});

test('activates the next visible window after minimizing the active window', () => {
  renderDesktop();

  fireEvent.doubleClick(screen.getByRole('button', { name: /my computer/i }));
  openStartMenuItem(/projects/i);
  fireEvent.click(screen.getByLabelText(/minimize projects/i));

  const activeWindow = document.querySelector(
    '.desktop-window[data-active="true"]'
  );

  expect(activeWindow).toHaveTextContent(/my computer/i);
});

test('opens apps from the start menu', () => {
  renderDesktop();

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByText(/projects/i));

  expect(screen.getByText(/projects explorer/i)).toBeInTheDocument();
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

  const display = screen
    .getByText(/now playing/i)
    .closest('.media-player-display');

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
    JSON.parse(
      window.localStorage.getItem('vintage-vibe-desktop-settings')
    ).wallpaper
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
  expect(screen.getByTestId('desktop-surface').parentElement).toHaveClass(
    'desktop-accent-green'
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

  expect(screen.getByTestId('desktop-surface').parentElement).toHaveClass(
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
