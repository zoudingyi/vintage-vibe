import {
  DEFAULT_DESKTOP_THEME_ID,
  getDesktopThemeOption
} from './themeRegistry';

export const DESKTOP_STORAGE_KEY = 'vintage-vibe-desktop-state';
export const LEGACY_SETTINGS_STORAGE_KEY = 'vintage-vibe-desktop-settings';
export const DESKTOP_STORAGE_VERSION = 1;

export const DEFAULT_DESKTOP_SETTINGS = {
  clockFormat: '24h',
  iconGlowEffect: 'soft',
  iconLayout: 'column',
  iconSize: 'medium',
  masterVolume: 25,
  radioAppearance: 'cassette',
  react95Theme: DEFAULT_DESKTOP_THEME_ID,
  restoreSession: true,
  scanlineIntensity: 'normal',
  scanlines: true,
  showBootLog: true,
  showSeconds: false,
  soundEnabled: true,
  taskbarButtonMode: 'label',
  vhsEffects: true,
  wallpaper: 'sunset'
};

const legacyAccentThemes = {
  amber: 'candy',
  green: 'matrix',
  purple: DEFAULT_DESKTOP_THEME_ID
};

export const DEFAULT_DESKTOP_SESSION = {
  activeWindowId: null,
  windows: []
};

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidBounds(bounds) {
  return (
    isFiniteNumber(bounds?.position?.x) &&
    isFiniteNumber(bounds?.position?.y) &&
    isFiniteNumber(bounds?.size?.width) &&
    (bounds.size.height === null || isFiniteNumber(bounds.size.height))
  );
}

function isValidWindow(windowState) {
  return (
    typeof windowState?.appId === 'string' &&
    typeof windowState?.id === 'string' &&
    isFiniteNumber(windowState?.position?.x) &&
    isFiniteNumber(windowState?.position?.y) &&
    isFiniteNumber(windowState?.size?.width) &&
    (windowState.size.height === null ||
      isFiniteNumber(windowState.size.height)) &&
    ['normal', 'minimized', 'maximized'].includes(windowState?.status) &&
    isFiniteNumber(windowState?.zIndex) &&
    (windowState.restoreBounds === null ||
      isValidBounds(windowState.restoreBounds)) &&
    (windowState.status !== 'maximized' ||
      isValidBounds(windowState.restoreBounds))
  );
}

function normalizeSession(session) {
  const windows = Array.isArray(session?.windows)
    ? session.windows.filter(isValidWindow)
    : [];
  const activeWindowId = windows.some(
    windowState => windowState.id === session?.activeWindowId
  )
    ? session.activeWindowId
    : null;

  return { activeWindowId, windows };
}

function normalizeSettings(settings) {
  const requestedThemeId =
    typeof settings?.react95Theme === 'string'
      ? settings.react95Theme
      : legacyAccentThemes[settings?.accent];

  return {
    clockFormat: ['12h', '24h'].includes(settings?.clockFormat)
      ? settings.clockFormat
      : DEFAULT_DESKTOP_SETTINGS.clockFormat,
    iconGlowEffect: ['soft', 'pixel', 'frame'].includes(
      settings?.iconGlowEffect
    )
      ? settings.iconGlowEffect
      : DEFAULT_DESKTOP_SETTINGS.iconGlowEffect,
    iconLayout: ['column', 'grid'].includes(settings?.iconLayout)
      ? settings.iconLayout
      : DEFAULT_DESKTOP_SETTINGS.iconLayout,
    iconSize: ['small', 'medium', 'large'].includes(settings?.iconSize)
      ? settings.iconSize
      : DEFAULT_DESKTOP_SETTINGS.iconSize,
    masterVolume:
      isFiniteNumber(settings?.masterVolume) &&
      settings.masterVolume >= 0 &&
      settings.masterVolume <= 100
        ? settings.masterVolume
        : DEFAULT_DESKTOP_SETTINGS.masterVolume,
    radioAppearance: ['cassette', 'night-drive', 'broadcast'].includes(
      settings?.radioAppearance
    )
      ? settings.radioAppearance
      : DEFAULT_DESKTOP_SETTINGS.radioAppearance,
    react95Theme: getDesktopThemeOption(requestedThemeId).id,
    restoreSession:
      typeof settings?.restoreSession === 'boolean'
        ? settings.restoreSession
        : DEFAULT_DESKTOP_SETTINGS.restoreSession,
    scanlines:
      typeof settings?.scanlines === 'boolean'
        ? settings.scanlines
        : DEFAULT_DESKTOP_SETTINGS.scanlines,
    scanlineIntensity: ['subtle', 'normal', 'strong'].includes(
      settings?.scanlineIntensity
    )
      ? settings.scanlineIntensity
      : DEFAULT_DESKTOP_SETTINGS.scanlineIntensity,
    showBootLog:
      typeof settings?.showBootLog === 'boolean'
        ? settings.showBootLog
        : DEFAULT_DESKTOP_SETTINGS.showBootLog,
    showSeconds:
      typeof settings?.showSeconds === 'boolean'
        ? settings.showSeconds
        : DEFAULT_DESKTOP_SETTINGS.showSeconds,
    soundEnabled:
      typeof settings?.soundEnabled === 'boolean'
        ? settings.soundEnabled
        : DEFAULT_DESKTOP_SETTINGS.soundEnabled,
    taskbarButtonMode: ['label', 'icon'].includes(
      settings?.taskbarButtonMode
    )
      ? settings.taskbarButtonMode
      : DEFAULT_DESKTOP_SETTINGS.taskbarButtonMode,
    vhsEffects:
      typeof settings?.vhsEffects === 'boolean'
        ? settings.vhsEffects
        : DEFAULT_DESKTOP_SETTINGS.vhsEffects,
    wallpaper: [
      'teal',
      'starfield',
      'sunset',
      'neon-horizon',
      'midnight',
      'checkerboard',
      'circuit',
      'clouds'
    ].includes(settings?.wallpaper)
      ? settings.wallpaper
      : DEFAULT_DESKTOP_SETTINGS.wallpaper
  };
}

function createDesktopData(settings = {}, session = DEFAULT_DESKTOP_SESSION) {
  const normalizedSession = normalizeSession(session);

  return {
    session: normalizedSession,
    settings: normalizeSettings(settings),
    version: DESKTOP_STORAGE_VERSION
  };
}

export function saveDesktopData(data, storage = window.localStorage) {
  try {
    storage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

export function loadDesktopData(storage = window.localStorage) {
  try {
    const storedData = storage.getItem(DESKTOP_STORAGE_KEY);

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      if (parsedData.version === DESKTOP_STORAGE_VERSION) {
        return createDesktopData(parsedData.settings, parsedData.session);
      }
    }

    const legacySettings = storage.getItem(LEGACY_SETTINGS_STORAGE_KEY);
    const desktopData = createDesktopData(
      legacySettings ? JSON.parse(legacySettings) : {}
    );
    saveDesktopData(desktopData, storage);
    return desktopData;
  } catch (error) {
    return {
      ...createDesktopData(),
      recoveredFromError: true
    };
  }
}
