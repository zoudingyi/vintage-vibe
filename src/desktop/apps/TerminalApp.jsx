import React, { useState } from 'react';
import { Button } from 'react95';

export default function TerminalApp({ onDesktopSettingsChange, onOpenApp }) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([
    'Vintage Vibe Terminal [Version 1.0]',
    'Type help for available commands.'
  ]);

  function getTerminalOutput(normalizedCommand) {
    if (normalizedCommand === 'help') {
      return 'Commands: about, projects, contact, theme green, theme amber, theme purple, clear, rosebud';
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
      const accent = normalizedCommand.replace('theme ', '');

      if (['green', 'amber', 'purple'].includes(accent)) {
        onDesktopSettingsChange({ accent });
        return `Theme accent set to ${accent}.`;
      }
    }

    if (normalizedCommand === 'rosebud') {
      return 'Secret unlocked: infinite nostalgia credits.';
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
      <strong>Terminal</strong>
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
