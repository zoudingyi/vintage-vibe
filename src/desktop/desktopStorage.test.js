import {
  DESKTOP_STORAGE_KEY,
  LEGACY_SETTINGS_STORAGE_KEY,
  loadDesktopData
} from './desktopStorage';

beforeEach(() => {
  window.localStorage.clear();
});

test('migrates legacy desktop settings into versioned data', () => {
  window.localStorage.setItem(
    LEGACY_SETTINGS_STORAGE_KEY,
    JSON.stringify({ accent: 'green', wallpaper: 'sunset' })
  );

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData).toMatchObject({
    settings: {
      accent: 'green',
      react95Theme: 'matrix',
      wallpaper: 'sunset'
    },
    version: 1
  });
  expect(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).not.toBeNull();
});

test('recovers from corrupted desktop data with safe defaults', () => {
  window.localStorage.setItem(DESKTOP_STORAGE_KEY, '{not-json');

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData).toMatchObject({
    recoveredFromError: true,
    session: { activeWindowId: null, windows: [] },
    settings: { accent: 'purple', wallpaper: 'teal' }
  });
});

test('drops malformed windows from a stored desktop session', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: {},
      session: {
        activeWindowId: 'broken',
        windows: [{ appId: 'my-computer', id: 'broken' }]
      }
    })
  );

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.session).toEqual({
    activeWindowId: null,
    windows: []
  });
});

test('falls back when a stored react95 theme is unsupported', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: { react95Theme: 'missing-theme' },
      session: { activeWindowId: null, windows: [] }
    })
  );

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.settings.react95Theme).toBe('theSixtiesUSA');
});
