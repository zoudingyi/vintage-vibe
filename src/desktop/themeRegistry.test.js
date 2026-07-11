import {
  DEFAULT_DESKTOP_THEME_ID,
  desktopThemeOptions,
  getDesktopThemeOption
} from './themeRegistry';

test('registers the curated react95 desktop themes', () => {
  const themeIds = desktopThemeOptions.map(option => option.id);

  expect(themeIds).toEqual([
    'original',
    'theSixtiesUSA',
    'vaporTeal',
    'candy',
    'lilac',
    'matrix',
    'modernDark',
    'highContrast'
  ]);
  expect(new Set(themeIds).size).toBe(themeIds.length);
  expect(DEFAULT_DESKTOP_THEME_ID).toBe('theSixtiesUSA');
  expect(getDesktopThemeOption(DEFAULT_DESKTOP_THEME_ID).theme.name).toBe(
    DEFAULT_DESKTOP_THEME_ID
  );
});
