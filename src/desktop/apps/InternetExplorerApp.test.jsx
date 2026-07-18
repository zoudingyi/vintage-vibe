import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import candy from 'react95/dist/themes/candy';
import { theSixtiesUSA } from 'react95/dist/themes';
import InternetExplorerApp from './InternetExplorerApp';
import { BROWSER_STORAGE_KEY } from './browser/browserModel';

function renderBrowser(props = {}, theme = theSixtiesUSA) {
  const onOpenApp = props.onOpenApp || jest.fn();

  return {
    onOpenApp,
    ...render(
      <ThemeProvider theme={theme}>
        <InternetExplorerApp onOpenApp={onOpenApp} />
      </ThemeProvider>
    )
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

test('opens on the VaporNet home page with an IE-style browser shell', () => {
  renderBrowser();

  expect(
    screen.getByRole('heading', { name: /welcome to vapornet/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/address/i)).toHaveValue('vintage://home');
  expect(screen.getByLabelText(/address/i).parentElement).toHaveClass(
    'ie-address-field'
  );
  expect(
    screen.getByLabelText(/address/i).parentElement.querySelector('img')
  ).toBeInTheDocument();
  expect(screen.getByText(/^local intranet$/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
});

test('dismisses an open menu when clicking outside the menu bar', () => {
  renderBrowser();
  const fileMenuButton = screen.getByRole('button', { name: /file menu/i });

  fireEvent.click(fileMenuButton);
  expect(screen.getByRole('menu')).toBeInTheDocument();

  fireEvent.pointerDown(screen.getByLabelText(/address/i));

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(fileMenuButton).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(fileMenuButton);
  fireEvent.pointerDown(document.body);

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(fileMenuButton).toHaveAttribute('aria-expanded', 'false');
});

test('keeps the menu open while interacting inside the menu bar', () => {
  renderBrowser();

  fireEvent.click(screen.getByRole('button', { name: /file menu/i }));
  fireEvent.pointerDown(
    screen.getByRole('menuitem', { name: /open location/i })
  );

  expect(screen.getByRole('menu')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /edit menu/i }));

  expect(
    screen.getByRole('menuitem', { name: /copy address/i })
  ).toBeInTheDocument();
  expect(screen.queryByRole('menuitem', { name: /open location/i }))
    .not.toBeInTheDocument();
});

test('maps the active React95 theme onto the browser chrome', () => {
  const { container } = renderBrowser({}, candy);
  const browserChrome = container.querySelector('.internet-explorer-app');

  expect(browserChrome).toHaveStyle({
    '--ie-border-dark': candy.borderDark,
    '--ie-canvas': candy.canvas,
    '--ie-hover': candy.hoverBackground,
    '--ie-material': candy.material,
    '--ie-material-text': candy.materialText
  });
  expect(candy.material).not.toBe(theSixtiesUSA.material);
});

test('navigates by address and supports back, forward, home, and refresh', () => {
  renderBrowser();
  const address = screen.getByLabelText(/address/i);

  fireEvent.change(address, { target: { value: 'projects' } });
  fireEvent.submit(address.closest('form'));
  expect(
    screen.getByRole('heading', { name: /project archive/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^back/i }));
  expect(
    screen.getByRole('heading', { name: /welcome to vapornet/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^forward/i }));
  expect(
    screen.getByRole('heading', { name: /project archive/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^refresh/i }));
  expect(screen.getByText(/page refreshed/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^home/i }));
  expect(address).toHaveValue('vintage://home');
});

test('searches built-in pages and project data', () => {
  renderBrowser();

  fireEvent.click(screen.getByRole('button', { name: /^search/i }));
  fireEvent.change(screen.getByLabelText(/search vapornet/i), {
    target: { value: 'React' }
  });
  fireEvent.submit(screen.getByRole('search'));

  expect(
    screen.getByRole('heading', { name: /search results/i })
  ).toBeInTheDocument();
  expect(screen.getByText('Vintage Vibe')).toBeInTheDocument();
});

test('shows a safe confirmation page instead of embedding external websites', () => {
  renderBrowser();
  const address = screen.getByLabelText(/address/i);

  fireEvent.change(address, {
    target: { value: 'https://github.com/zoudingyi' }
  });
  fireEvent.submit(address.closest('form'));

  const externalLink = screen.getByRole('link', {
    name: /open in a new browser tab/i
  });

  expect(screen.getByRole('heading', { name: /external link/i })).toBeInTheDocument();
  expect(externalLink).toHaveAttribute('target', '_blank');
  expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  expect(document.querySelector('iframe')).not.toBeInTheDocument();
});

test('blocks unsafe protocols without changing the current page', () => {
  renderBrowser();
  const address = screen.getByLabelText(/address/i);

  fireEvent.change(address, { target: { value: 'javascript:alert(1)' } });
  fireEvent.submit(address.closest('form'));

  expect(screen.getByRole('status')).toHaveTextContent(/blocked/i);
  expect(
    screen.getByRole('heading', { name: /welcome to vapornet/i })
  ).toBeInTheDocument();
});

test('adds the current page to favorites and restores it after remounting', () => {
  const firstRender = renderBrowser();
  const address = screen.getByLabelText(/address/i);

  fireEvent.change(address, { target: { value: 'about' } });
  fireEvent.submit(address.closest('form'));
  fireEvent.click(screen.getByRole('button', { name: /favorites menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /add current page/i }));

  expect(JSON.parse(window.localStorage.getItem(BROWSER_STORAGE_KEY))).toEqual(
    expect.objectContaining({
      favorites: expect.arrayContaining([
        expect.objectContaining({ address: 'vintage://about' })
      ])
    })
  );

  firstRender.unmount();
  renderBrowser();
  fireEvent.click(screen.getByRole('button', { name: /favorites menu/i }));

  expect(
    screen.getByRole('menuitem', { name: /open favorite about me/i })
  ).toBeInTheDocument();
});

test('launches existing desktop applications from VaporNet pages', () => {
  const { onOpenApp } = renderBrowser();

  fireEvent.click(screen.getByRole('button', { name: /radio station/i }));
  fireEvent.click(screen.getByRole('button', { name: /launch vaporwave radio/i }));

  expect(onOpenApp).toHaveBeenCalledWith('vaporwave-radio');
});
