import {
  BROWSER_STORAGE_KEY,
  HOME_ADDRESS,
  browserReducer,
  createBrowserState,
  loadBrowserState,
  resolveBrowserAddress,
  saveBrowserState
} from './browserModel';

beforeEach(() => {
  window.localStorage.clear();
});

test('resolves local aliases, search terms, external links, and unsafe protocols', () => {
  expect(resolveBrowserAddress('projects')).toEqual({
    address: 'vintage://projects',
    kind: 'internal'
  });
  expect(resolveBrowserAddress('react component architecture')).toEqual({
    address: 'vintage://search?q=react%20component%20architecture',
    kind: 'internal'
  });
  expect(resolveBrowserAddress('https://github.com/zoudingyi')).toEqual({
    address: 'https://github.com/zoudingyi',
    kind: 'external'
  });
  expect(resolveBrowserAddress('javascript:alert(1)')).toEqual({
    kind: 'blocked',
    reason: 'VaporNet blocked an unsafe or unsupported address.'
  });
});

test('keeps a browser-style history when navigating from the middle', () => {
  let state = createBrowserState();

  state = browserReducer(state, {
    type: 'NAVIGATE',
    address: 'vintage://about'
  });
  state = browserReducer(state, {
    type: 'NAVIGATE',
    address: 'vintage://projects'
  });
  state = browserReducer(state, { type: 'BACK' });
  state = browserReducer(state, {
    type: 'NAVIGATE',
    address: 'vintage://radio'
  });

  expect(state.entries).toEqual([
    HOME_ADDRESS,
    'vintage://about',
    'vintage://radio'
  ]);
  expect(state.index).toBe(2);
  expect(state.revision).toBe(0);
});

test('refreshes without adding history and avoids consecutive duplicates', () => {
  let state = createBrowserState();

  state = browserReducer(state, {
    type: 'NAVIGATE',
    address: HOME_ADDRESS
  });
  state = browserReducer(state, { type: 'REFRESH' });

  expect(state.entries).toEqual([HOME_ADDRESS]);
  expect(state.revision).toBe(2);
});

test('adds and removes unique local favorites', () => {
  let state = createBrowserState();

  state = browserReducer(state, {
    type: 'ADD_FAVORITE',
    favorite: { address: 'vintage://about', title: 'About Me' }
  });
  state = browserReducer(state, {
    type: 'ADD_FAVORITE',
    favorite: { address: 'vintage://about', title: 'About Me' }
  });

  expect(
    state.favorites.filter(item => item.address === 'vintage://about')
  ).toHaveLength(1);

  state = browserReducer(state, {
    type: 'REMOVE_FAVORITE',
    address: 'vintage://about'
  });

  expect(
    state.favorites.some(item => item.address === 'vintage://about')
  ).toBe(false);
});

test('persists valid browser state and recovers from corrupted storage', () => {
  const state = browserReducer(createBrowserState(), {
    type: 'NAVIGATE',
    address: 'vintage://projects'
  });

  expect(saveBrowserState(state, window.localStorage)).toBe(true);
  expect(loadBrowserState(window.localStorage)).toMatchObject({
    entries: [HOME_ADDRESS, 'vintage://projects'],
    index: 1
  });

  window.localStorage.setItem(BROWSER_STORAGE_KEY, '{broken-json');

  expect(loadBrowserState(window.localStorage)).toMatchObject({
    entries: [HOME_ADDRESS],
    index: 0,
    recoveredFromError: true
  });
});
