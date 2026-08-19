import {
  DESKTOP_STORAGE_KEY,
  LEGACY_SETTINGS_STORAGE_KEY,
  loadDesktopData
} from './desktopStorage';

beforeEach(() => {
  window.localStorage.clear();
});

test('defaults global audio preferences to enabled at a low volume', () => {
  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.settings).toMatchObject({
    masterVolume: 25,
    soundEnabled: true
  });
});

test('defaults VHS distortion to enabled', () => {
  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.settings.vhsEffects).toBe(true);
});

test('defaults the radio appearance to Cassette Deck', () => {
  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.settings.radioAppearance).toBe('cassette');
});

test('migrates legacy desktop settings into versioned data', () => {
  window.localStorage.setItem(
    LEGACY_SETTINGS_STORAGE_KEY,
    JSON.stringify({ accent: 'green', wallpaper: 'sunset' })
  );

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData).toMatchObject({
    settings: {
      react95Theme: 'matrix',
      wallpaper: 'sunset'
    },
    version: 1
  });
  expect(desktopData.settings).not.toHaveProperty('accent');
  expect(window.localStorage.getItem(DESKTOP_STORAGE_KEY)).not.toBeNull();
});

test('recovers from corrupted desktop data with safe defaults', () => {
  window.localStorage.setItem(DESKTOP_STORAGE_KEY, '{not-json');

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData).toMatchObject({
    recoveredFromError: true,
    session: { activeWindowId: null, windows: [] },
    settings: { react95Theme: 'theSixtiesUSA', wallpaper: 'sunset' }
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

test('loads supported multi-page desktop settings', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: {
        animationMode: 'reduced',
        clockFormat: '12h',
        iconGlowEffect: 'frame',
        iconLayout: 'grid',
        iconSize: 'large',
        masterVolume: 40,
        radioAppearance: 'broadcast',
        scanlineIntensity: 'strong',
        showBootLog: false,
        showSeconds: true,
        soundEnabled: true,
        taskbarButtonMode: 'icon',
        vhsEffects: false,
        wallpaper: 'neon-horizon'
      },
      session: { activeWindowId: null, windows: [] }
    })
  );

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.settings).toMatchObject({
    clockFormat: '12h',
    iconGlowEffect: 'frame',
    iconLayout: 'grid',
    iconSize: 'large',
    masterVolume: 40,
    radioAppearance: 'broadcast',
    scanlineIntensity: 'strong',
    showBootLog: false,
    showSeconds: true,
    soundEnabled: true,
    taskbarButtonMode: 'icon',
    vhsEffects: false,
    wallpaper: 'neon-horizon'
  });
  expect(desktopData.settings).not.toHaveProperty('animationMode');
});

test('falls back from unsupported multi-page desktop settings', () => {
  window.localStorage.setItem(
    DESKTOP_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      settings: {
        animationMode: 'sometimes',
        clockFormat: 'analog',
        iconGlowEffect: 'none',
        iconSize: 'huge',
        masterVolume: 101,
        radioAppearance: 'hologram',
        scanlineIntensity: 'blinding',
        showBootLog: 'yes',
        showSeconds: 1,
        soundEnabled: 'yes',
        taskbarButtonMode: 'both',
        vhsEffects: 'sometimes',
        wallpaper: 'missing'
      },
      session: { activeWindowId: null, windows: [] }
    })
  );

  const desktopData = loadDesktopData(window.localStorage);

  expect(desktopData.settings).toMatchObject({
    clockFormat: '24h',
    iconGlowEffect: 'soft',
    iconSize: 'medium',
    masterVolume: 25,
    radioAppearance: 'cassette',
    scanlineIntensity: 'normal',
    showBootLog: true,
    showSeconds: false,
    soundEnabled: true,
    taskbarButtonMode: 'label',
    vhsEffects: true,
    wallpaper: 'sunset'
  });
  expect(desktopData.settings).not.toHaveProperty('animationMode');
});
