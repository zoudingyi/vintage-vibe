import React from 'react';
import { Button, Fieldset } from 'react95';

function ChoiceButton({ active, children, onClick }) {
  return (
    <Button active={active ? true : undefined} onClick={onClick}>
      {children}
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
      <Fieldset label="Accent">
        <div className="settings-choice-row">
          <ChoiceButton
            active={desktopSettings.accent === 'purple'}
            onClick={() => onDesktopSettingsChange({ accent: 'purple' })}
          >
            Purple
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.accent === 'green'}
            onClick={() => onDesktopSettingsChange({ accent: 'green' })}
          >
            CRT Green
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.accent === 'amber'}
            onClick={() => onDesktopSettingsChange({ accent: 'amber' })}
          >
            Amber
          </ChoiceButton>
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
