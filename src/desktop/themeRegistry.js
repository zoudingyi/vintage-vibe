import candy from 'react95/dist/themes/candy';
import highContrast from 'react95/dist/themes/highContrast';
import lilac from 'react95/dist/themes/lilac';
import matrix from 'react95/dist/themes/matrix';
import modernDark from 'react95/dist/themes/modernDark';
import original from 'react95/dist/themes/original';
import theSixtiesUSA from 'react95/dist/themes/theSixtiesUSA';
import vaporTeal from 'react95/dist/themes/vaporTeal';

export const DEFAULT_DESKTOP_THEME_ID = 'theSixtiesUSA';

export const desktopThemeOptions = [
  { id: 'original', label: 'Windows 95', theme: original },
  { id: 'theSixtiesUSA', label: 'Sixties USA', theme: theSixtiesUSA },
  { id: 'vaporTeal', label: 'Vapor Teal', theme: vaporTeal },
  { id: 'candy', label: 'Candy', theme: candy },
  { id: 'lilac', label: 'Lilac', theme: lilac },
  { id: 'matrix', label: 'Matrix', theme: matrix },
  { id: 'modernDark', label: 'Modern Dark', theme: modernDark },
  { id: 'highContrast', label: 'High Contrast', theme: highContrast }
];

const terminalThemeAliases = {
  amber: 'candy',
  candy: 'candy',
  contrast: 'highContrast',
  dark: 'modernDark',
  green: 'matrix',
  highcontrast: 'highContrast',
  lilac: 'lilac',
  matrix: 'matrix',
  moderndark: 'modernDark',
  original: 'original',
  purple: 'theSixtiesUSA',
  sixties: 'theSixtiesUSA',
  thesixtiesusa: 'theSixtiesUSA',
  vapor: 'vaporTeal',
  vaporteal: 'vaporTeal'
};

export function getDesktopThemeOption(themeId) {
  return (
    desktopThemeOptions.find(option => option.id === themeId) ||
    desktopThemeOptions.find(option => option.id === DEFAULT_DESKTOP_THEME_ID)
  );
}

export function resolveDesktopThemeId(commandValue) {
  return terminalThemeAliases[commandValue.toLowerCase()] || null;
}
