import React, { useState } from 'react';
import { Button } from 'react95';
import {
  getDesktopThemeOption,
  resolveDesktopThemeId
} from '../themeRegistry';

export default function TerminalApp({ onDesktopSettingsChange, onOpenApp }) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([
    'Vintage Vibe Terminal [Version 1.0]',
    'Type help for available commands.'
  ]);

  function getTerminalOutput(normalizedCommand) {
    if (normalizedCommand === 'help') {
      return 'Commands: about, projects, contact, theme original, theme vapor, theme candy, theme lilac, theme matrix, theme dark, theme contrast, clear, rosebud';
    }

    if (normalizedCommand === 'about') {
      return 'Vintage Vibe is a playable retro desktop portfolio shell built with React and react95.';
    }

    if (normalizedCommand === 'projects') {
      onOpenApp('projects');
      return 'Opening Projects Explorer...';
    }

    if (normalizedCommand === 'contact') {
      return 'Email: 18483641399@163.com | GitHub: zoudingyi';
    }

    if (normalizedCommand.startsWith('theme ')) {
      const themeId = resolveDesktopThemeId(
        normalizedCommand.replace('theme ', '')
      );

      if (themeId) {
        onDesktopSettingsChange({ react95Theme: themeId });
        return `System theme set to ${getDesktopThemeOption(themeId).label}.`;
      }

      return 'Unknown theme. Try original, vapor, candy, lilac, matrix, dark, or contrast.';
    }

    if (normalizedCommand === 'rosebud') {
      return 'Secret unlocked: infinite nostalgia credits.';
    }

    if (normalizedCommand === 'aesthetic') {
      onDesktopSettingsChange({
        react95Theme: 'vaporTeal',
        scanlineIntensity: 'strong',
        scanlines: true,
        wallpaper: 'neon-horizon'
      });
      return 'Aesthetic mode engaged. Neon horizon synchronized.';
    }

    if (normalizedCommand === 'mallsoft') {
      onDesktopSettingsChange({
        react95Theme: 'candy',
        scanlineIntensity: 'subtle',
        scanlines: true,
        wallpaper: 'clouds'
      });
      return 'Mallsoft ambience loaded. Please enjoy the empty food court.';
    }

    if (normalizedCommand === 'vhs on') {
      onDesktopSettingsChange({
        scanlineIntensity: 'strong',
        scanlines: true
      });
      return 'VHS tracking enabled.';
    }

    if (normalizedCommand === 'vhs off') {
      onDesktopSettingsChange({ scanlines: false });
      return 'VHS tracking disabled.';
    }

    if (normalizedCommand === 'sunset') {
      onDesktopSettingsChange({ wallpaper: 'sunset' });
      return 'Sunset drive restored.';
    }

    return `Bad command or file name: ${command}`;
  }

  function runCommand(event) {
    event.preventDefault();

    const normalizedCommand = command.trim().toLowerCase();

    if (!normalizedCommand) {
      return;
    }

    if (normalizedCommand === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    }

    const output = getTerminalOutput(normalizedCommand);
    setHistory(currentHistory => [
      ...currentHistory,
      `C:\\VIBE> ${command}`,
      output
    ]);
    setCommand('');
  }

  return (
    <div className="terminal-app">
      <div className="terminal-output" aria-label="Terminal output">
        {history.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form className="terminal-form" onSubmit={runCommand}>
        <span>C:\VIBE&gt;</span>
        <input
          aria-label="Terminal command"
          onChange={event => setCommand(event.target.value)}
          value={command}
        />
        <Button type="submit">Run</Button>
      </form>
    </div>
  );
}
