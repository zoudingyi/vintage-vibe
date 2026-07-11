import React from 'react';
import { Button, Fieldset } from 'react95';
import { desktopThemeOptions } from '../themeRegistry';

function ChoiceButton({ active, children, onClick }) {
  return (
    <Button
      active={active ? true : undefined}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ThemeChoice({ active, onClick, option }) {
  const previewColors = [
    option.theme.headerBackground,
    option.theme.material,
    option.theme.hoverBackground
  ];

  return (
    <Button
      active={active ? true : undefined}
      aria-label={option.label}
      aria-pressed={active}
      className="settings-theme-choice"
      onClick={onClick}
    >
      <span aria-hidden="true" className="settings-theme-preview">
        {previewColors.map((color, index) => (
          <span
            className="settings-theme-swatch"
            key={`${option.id}-${index}`}
            style={{ background: color }}
          />
        ))}
      </span>
      <span>{option.label}</span>
    </Button>
  );
}

export default function SettingsApp({
  desktopSettings,
  onArrangeDesktopIcons,
  onClearDesktopSession,
  onDesktopSettingsChange,
  onResetDesktopSettings
}) {
  return (
    <div className="settings-app">
      <strong>Settings</strong>
      <Fieldset label="Wallpaper">
        <div className="settings-choice-row">
          <ChoiceButton
            active={desktopSettings.wallpaper === 'teal'}
            onClick={() => onDesktopSettingsChange({ wallpaper: 'teal' })}
          >
            Teal Grid
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.wallpaper === 'starfield'}
            onClick={() => onDesktopSettingsChange({ wallpaper: 'starfield' })}
          >
            Starfield
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.wallpaper === 'sunset'}
            onClick={() => onDesktopSettingsChange({ wallpaper: 'sunset' })}
          >
            Sunset
          </ChoiceButton>
        </div>
      </Fieldset>
      <Fieldset label="System Theme">
        <div className="settings-theme-grid">
          {desktopThemeOptions.map(option => (
            <ThemeChoice
              active={desktopSettings.react95Theme === option.id}
              key={option.id}
              onClick={() =>
                onDesktopSettingsChange({ react95Theme: option.id })
              }
              option={option}
            />
          ))}
        </div>
      </Fieldset>
      <Fieldset label="Desktop">
        <label className="settings-checkbox">
          <input
            checked={desktopSettings.scanlines}
            onChange={event =>
              onDesktopSettingsChange({ scanlines: event.target.checked })
            }
            type="checkbox"
          />
          Scanlines
        </label>
        <label className="settings-checkbox">
          <input
            checked={desktopSettings.restoreSession}
            onChange={event =>
              onDesktopSettingsChange({
                restoreSession: event.target.checked
              })
            }
            type="checkbox"
          />
          Restore previous session
        </label>
        <div className="settings-choice-row">
          <Button onClick={onArrangeDesktopIcons}>Arrange Icons</Button>
          <Button onClick={onResetDesktopSettings}>Reset</Button>
          <Button onClick={onClearDesktopSession}>Clear Session</Button>
        </div>
      </Fieldset>
    </div>
  );
}
