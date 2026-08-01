import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react';
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

test('preserves the edited now panel and opens the personal record archive', () => {
  renderBrowser();

  const nowOnline = screen.getByRole('region', { name: /now online/i });

  expect(nowOnline).toHaveTextContent(/featured topics\s*sixties usa/i);
  expect(nowOnline).toHaveTextContent(
    /curator's pick\s*oh no, oh yes! - 中森明菜/i
  );

  fireEvent.click(
    screen.getByRole('button', { name: /browse record shelf/i })
  );

  expect(
    screen.getByRole('heading', { name: /favorite records/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/a personal shelf of japanese city pop, aor, boogie/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/profile: coastal light.*city nights/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/female vocals, precise arrangements, deep album cuts/i)
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/228-song personal listening archive/i)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/all eight first-tier albums/i)
  ).not.toBeInTheDocument();
  const albums = screen.getByRole('region', { name: /core albums/i });
  const tracks = screen.getByRole('region', { name: /favorite tracks/i });

  expect(within(albums).getAllByRole('article')).toHaveLength(15);
  [
    /timely!!/i,
    /ゴールデン☆ベスト 石井明美セレクション/i,
    /crimson/i,
    /miss\. g/i,
    /quiet emotion/i,
    /sexy robot/i,
    /music greetings volume one/i,
    /sachet/i
  ].forEach(title => {
    expect(
      within(albums).getByRole('heading', { name: title })
    ).toBeInTheDocument();
  });
  expect(
    within(albums).getByRole('heading', {
      name: /miroir.*鏡の向こう側に/i
    })
  ).toBeInTheDocument();
  expect(
    within(albums).queryByRole('heading', { name: /angel touch/i })
  ).not.toBeInTheDocument();
  expect(
    within(albums).queryByRole('heading', { name: /cologne/i })
  ).not.toBeInTheDocument();
  expect(within(tracks).getAllByRole('article')).toHaveLength(20);
  expect(
    within(tracks).getByRole('heading', {
      name: /4:00 a\.m\./i
    })
  ).toBeInTheDocument();
  expect(within(tracks).getByText(/nocturnal boogie/i)).toBeInTheDocument();
  [
    /oh no, oh yes!/i,
    /プラスティック・ラヴ/i,
    /windy summer/i,
    /熱帯夜/i,
    /candy/i,
    /so high so high/i,
    /kissしたい -wanna kiss-/i,
    /true lies/i,
    /mr\. k/i,
    /dress down/i
  ].forEach(title => {
    expect(
      within(tracks).getByRole('heading', { name: title })
    ).toBeInTheDocument();
  });
  expect(screen.queryByText(/demo pressing/i)).not.toBeInTheDocument();
});

test('lists every radio track grouped by station', () => {
  renderBrowser();

  fireEvent.click(screen.getByRole('button', { name: /radio station/i }));

  expect(
    screen.getByRole('heading', { name: /vaporwave radio/i })
  ).toBeInTheDocument();
  const directory = screen.getByRole('region', {
    name: /full station directory/i
  });
  const palmMirage = within(directory).getByRole('region', {
    name: /88.7 fm palm mirage/i
  });
  const midnightPlaza = within(directory).getByRole('region', {
    name: /94.2 fm midnight plaza/i
  });
  const dreamChannel = within(directory).getByRole('region', {
    name: /101.9 fm dream channel/i
  });

  expect(within(palmMirage).getAllByRole('listitem')).toHaveLength(6);
  expect(within(palmMirage).getByText('Love Philter')).toBeInTheDocument();
  expect(within(midnightPlaza).getAllByRole('listitem')).toHaveLength(10);
  expect(within(midnightPlaza).getByText('Ride On Time')).toBeInTheDocument();
  expect(within(dreamChannel).getAllByRole('listitem')).toHaveLength(6);
  expect(within(dreamChannel).getByText('Sunset Disco')).toBeInTheDocument();
  expect(within(directory).getAllByRole('listitem')).toHaveLength(22);
});

test('signs the shared local guestbook directly inside VaporNet', async () => {
  const { onOpenApp } = renderBrowser();

  fireEvent.click(screen.getByRole('button', { name: /^guestbook/i }));

  expect(
    screen.getByRole('heading', { name: /^guestbook$/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('region', { name: /node status/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/from the webmaster/i)).toBeInTheDocument();
  expect(
    screen.getByRole('region', { name: /signature preview/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/private storage/i)).not.toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getAllByText(/^archived transmission$/i)).toHaveLength(2);
  });

  fireEvent.change(screen.getByLabelText(/guestbook name/i), {
    target: { value: 'Ada' }
  });
  fireEvent.change(screen.getByLabelText(/guestbook message/i), {
    target: { value: 'Great desktop shell.' }
  });
  fireEvent.click(screen.getByRole('button', { name: /sign guestbook/i }));

  const transmissions = screen.getByRole('region', {
    name: /recent transmissions/i
  });
  await waitFor(() => {
    expect(within(transmissions).getByText('Ada')).toBeInTheDocument();
  });
  expect(
    within(transmissions).getByText(/great desktop shell/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole('status', { name: /guestbook status/i })
  ).toHaveTextContent(/transmission accepted.*signature id/i);
  expect(
    JSON.parse(window.localStorage.getItem('vintage-vibe-guestbook'))[0]
  ).toEqual(
    expect.objectContaining({
      authorType: 'visitor',
      createdAt: expect.any(String),
      message: 'Great desktop shell.',
      name: 'Ada',
      status: 'local'
    })
  );
  expect(onOpenApp).not.toHaveBeenCalledWith('guestbook');
});

test('shows Devo personal interests without career or technical content', () => {
  renderBrowser();

  fireEvent.change(screen.getByLabelText(/address/i), {
    target: { value: 'about' }
  });
  fireEvent.submit(screen.getByLabelText(/address/i).closest('form'));

  expect(
    screen.getByRole('heading', { name: /devo control room/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText('「未来は消えても、信号は永遠に」')
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /welcome to devo control room.*失われた未来へようこそ.*all personal signals online/i
    )
  ).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: /devo zou.*yamaha yzf-r3/i })
  ).toBeInTheDocument();
  const operatorProfile = screen.getByRole('region', { name: /devo zou/i });
  ['YZF-R3', 'DOTA 2', 'EVA-01', '5 ONLINE'].forEach(value => {
    expect(within(operatorProfile).getByText(value)).toBeInTheDocument();
  });
  expect(
    within(operatorProfile).getByText(/Hi ~ 👋.*🏍️.*🎧.*🎮/)
  ).toBeInTheDocument();
  expect(within(operatorProfile).getByText(/擦眼泪不安全/)).toBeInTheDocument();

  const machineFile = screen.getByRole('region', {
    name: /machine.*speed/i
  });
  expect(
    within(machineFile).getByText(/yamaha yzF-r3/i)
  ).toBeInTheDocument();
  expect(
    within(machineFile).getByRole('img', { name: /yamaha yzf-r3/i })
  ).toBeInTheDocument();

  const racingSignal = screen.getByRole('region', {
    name: /racing signal/i
  });
  expect(
    within(racingSignal).getByText(/marc márquez/i)
  ).toBeInTheDocument();
  expect(
    within(racingSignal).getByRole('img', {
      name: /marc márquez.*number 93/i
    })
  ).toBeInTheDocument();

  const dotaTerminal = screen.getByRole('region', {
    name: /dota 2 terminal/i
  });
  expect(
    within(dotaTerminal).getByRole('img', { name: /dota 2 logo/i })
  ).toBeInTheDocument();
  expect(within(dotaTerminal).getByText(/ping 32 ms/i)).toBeInTheDocument();
  expect(within(dotaTerminal).getByText(/^songoku$/i)).toBeInTheDocument();
  expect(within(dotaTerminal).getByText(/^3号位$/i)).toBeInTheDocument();
  expect(within(dotaTerminal).getByText(/^斧王$/i)).toBeInTheDocument();
  expect(within(dotaTerminal).getByText(/^冠绝一世$/i)).toBeInTheDocument();

  const evaMonitor = screen.getByRole('region', {
    name: /eva sync monitor/i
  });
  expect(
    within(evaMonitor).getByRole('img', {
      name: /eva unit-01 synchronization monitor/i
    })
  ).toBeInTheDocument();
  expect(within(evaMonitor).getByText(/pattern.*blue/i)).toBeInTheDocument();
  expect(within(evaMonitor).getByText(/^碇シンジ$/i)).toBeInTheDocument();
  expect(within(evaMonitor).getByText(/^14$/i)).toBeInTheDocument();
  expect(
    within(evaMonitor).getByText(/^third children$/i)
  ).toBeInTheDocument();
  expect(within(evaMonitor).getByText(/^初号机$/i)).toBeInTheDocument();
  expect(
    within(evaMonitor).getByText(/a\.t\. field.*deployed/i)
  ).toBeInTheDocument();
  expect(
    within(evaMonitor).getByText(
      '逃げちゃダメだ、逃げちゃダメだ、逃げちゃダメだ!'
    )
  ).toBeInTheDocument();
  expect(within(evaMonitor).queryByText(/あんた、バカぁ/)).not
    .toBeInTheDocument();
  expect(within(evaMonitor).queryByText(/どこだって天国/)).not
    .toBeInTheDocument();

  const catNetwork = screen.getByRole('region', {
    name: /cat surveillance wall/i
  });
  expect(within(catNetwork).getAllByRole('listitem')).toHaveLength(5);
  expect(within(catNetwork).getAllByRole('img')).toHaveLength(5);
  ['Hana', 'Cookie', '桃桃', '洋芋', '坨坨'].forEach(catName => {
    expect(within(catNetwork).getByText(catName)).toBeInTheDocument();
  });
  expect(within(catNetwork).getByText(/5 nodes online/i)).toBeInTheDocument();

  const personalTelemetry = screen.getByRole('region', {
    name: /personal telemetry/i
  });
  [
    'CHENGDU',
    'OFFLINE',
    'LOST',
    'FRAGMENTED',
    'MAXIMUM',
    'GRANTED',
    'ONLINE',
    'ETERNAL'
  ].forEach(value => {
    expect(within(personalTelemetry).getByText(value)).toBeInTheDocument();
  });
  expect(within(personalTelemetry).getByText(/reality status/i))
    .toBeInTheDocument();
  expect(within(personalTelemetry).getByText(/transmission/i))
    .toBeInTheDocument();

  expect(
    screen.queryByRole('group', { name: /interface manifesto/i })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/react and component architecture/i))
    .not.toBeInTheDocument();
});

test('curates external links through the existing confirmation page', () => {
  renderBrowser();

  fireEvent.change(screen.getByLabelText(/address/i), {
    target: { value: 'links' }
  });
  fireEvent.submit(screen.getByLabelText(/address/i).closest('form'));

  expect(screen.getByText(/rough but personal web/i)).toBeInTheDocument();
  expect(
    screen.getByText(/restraint is also a design choice/i)
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: /cameron's world/i })
  );

  expect(
    screen.getByRole('heading', { name: /external link/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /open in a new browser tab/i })
  ).toHaveAttribute('href', 'https://www.cameronsworld.net/');
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
