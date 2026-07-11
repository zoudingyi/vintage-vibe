import React from 'react';
import {
  Button,
  Fieldset,
  Monitor,
  Tab,
  TabBody,
  Tabs,
  Window,
  WindowContent,
  WindowHeader
} from 'react95';
import {
  desktopThemeOptions,
  getDesktopThemeOption
} from '../themeRegistry';
import { wallpaperOptions } from '../wallpaperRegistry';

const settingsTabs = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'taskbar', label: 'Taskbar' },
  { id: 'system', label: 'System' }
];

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

function SettingsCheckbox({ checked, children, onChange }) {
  return (
    <label className="settings-checkbox">
      <input checked={checked} onChange={onChange} type="checkbox" />
      {children}
    </label>
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

function WallpaperChoice({ active, onClick, option }) {
  return (
    <Button
      active={active ? true : undefined}
      aria-label={option.label}
      aria-pressed={active}
      className="settings-wallpaper-choice"
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className={`settings-wallpaper-preview desktop-wallpaper-${option.id}`}
      />
      <span>{option.label}</span>
    </Button>
  );
}

function AppearanceSettings({ desktopSettings, onDesktopSettingsChange }) {
  const previewTheme = getDesktopThemeOption(
    desktopSettings.react95Theme
  ).theme;

  return (
    <>
      <Fieldset label="Preview">
        <div className="settings-monitor-stage">
          <Monitor
            aria-label="Appearance preview"
            backgroundStyles={{ padding: 0 }}
            role="region"
          >
            <div
              className={`settings-monitor-screen desktop-wallpaper-${desktopSettings.wallpaper}`}
              data-scanline-intensity={desktopSettings.scanlineIntensity}
              data-scanlines={desktopSettings.scanlines}
              data-testid="settings-monitor-screen"
            >
              <div aria-hidden="true" className="settings-monitor-icons">
                <span />
                <span />
              </div>
              <Window
                className="settings-monitor-window"
                data-testid="settings-monitor-window"
              >
                <WindowHeader className="settings-monitor-window-header">
                  <span>Preview</span>
                  <span>×</span>
                </WindowHeader>
                <WindowContent className="settings-monitor-window-content">
                  Theme
                </WindowContent>
              </Window>
              <div
                aria-hidden="true"
                className="settings-monitor-taskbar"
                style={{
                  background: previewTheme.material,
                  borderColor: `${previewTheme.borderLightest} ${previewTheme.borderDark} ${previewTheme.borderDark} ${previewTheme.borderLightest}`
                }}
              >
                <span>Start</span>
              </div>
            </div>
          </Monitor>
        </div>
      </Fieldset>
      <Fieldset label="Wallpaper">
        <div className="settings-wallpaper-grid">
          {wallpaperOptions.map(option => (
            <WallpaperChoice
              active={desktopSettings.wallpaper === option.id}
              key={option.id}
              onClick={() =>
                onDesktopSettingsChange({ wallpaper: option.id })
              }
              option={option}
            />
          ))}
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
      <Fieldset label="Visual Effects">
        <SettingsCheckbox
          checked={desktopSettings.scanlines}
          onChange={event =>
            onDesktopSettingsChange({ scanlines: event.target.checked })
          }
        >
          Scanlines
        </SettingsCheckbox>
        <span className="settings-control-label">Scanline Strength</span>
        <div className="settings-choice-row">
          {['subtle', 'normal', 'strong'].map(intensity => (
            <ChoiceButton
              active={desktopSettings.scanlineIntensity === intensity}
              key={intensity}
              onClick={() =>
                onDesktopSettingsChange({ scanlineIntensity: intensity })
              }
            >
              {intensity[0].toUpperCase() + intensity.slice(1)}
            </ChoiceButton>
          ))}
        </div>
      </Fieldset>
    </>
  );
}

function DesktopSettings({ desktopSettings, onDesktopSettingsChange }) {
  return (
    <>
      <Fieldset label="Icon Layout">
        <div className="settings-choice-row">
          {['column', 'grid'].map(layout => (
            <ChoiceButton
              active={desktopSettings.iconLayout === layout}
              key={layout}
              onClick={() => onDesktopSettingsChange({ iconLayout: layout })}
            >
              {layout[0].toUpperCase() + layout.slice(1)}
            </ChoiceButton>
          ))}
        </div>
      </Fieldset>
      <Fieldset label="Icon Size">
        <div className="settings-choice-row">
          {['small', 'medium', 'large'].map(size => (
            <ChoiceButton
              active={desktopSettings.iconSize === size}
              key={size}
              onClick={() => onDesktopSettingsChange({ iconSize: size })}
            >
              {size[0].toUpperCase() + size.slice(1)}
            </ChoiceButton>
          ))}
        </div>
      </Fieldset>
      <p className="settings-help-text">
        Icons follow the selected layout. Free-position dragging is not enabled.
      </p>
    </>
  );
}

function TaskbarSettings({ desktopSettings, onDesktopSettingsChange }) {
  return (
    <>
      <Fieldset label="Clock Format">
        <div className="settings-choice-row">
          {[
            ['12h', '12-hour'],
            ['24h', '24-hour']
          ].map(([value, label]) => (
            <ChoiceButton
              active={desktopSettings.clockFormat === value}
              key={value}
              onClick={() => onDesktopSettingsChange({ clockFormat: value })}
            >
              {label}
            </ChoiceButton>
          ))}
        </div>
        <SettingsCheckbox
          checked={desktopSettings.showSeconds}
          onChange={event =>
            onDesktopSettingsChange({ showSeconds: event.target.checked })
          }
        >
          Show Seconds
        </SettingsCheckbox>
      </Fieldset>
      <Fieldset label="Task Buttons">
        <div className="settings-choice-row">
          {[
            ['label', 'Icon and Label'],
            ['icon', 'Icon Only']
          ].map(([value, label]) => (
            <ChoiceButton
              active={desktopSettings.taskbarButtonMode === value}
              key={value}
              onClick={() =>
                onDesktopSettingsChange({ taskbarButtonMode: value })
              }
            >
              {label}
            </ChoiceButton>
          ))}
        </div>
      </Fieldset>
    </>
  );
}

function SystemSettings({
  desktopSettings,
  onClearDesktopSession,
  onDesktopSettingsChange,
  onResetAppearance,
  onResetDesktopSettings,
  windowCount
}) {
  return (
    <>
      <Fieldset label="Startup">
        <SettingsCheckbox
          checked={desktopSettings.restoreSession}
          onChange={event =>
            onDesktopSettingsChange({
              restoreSession: event.target.checked
            })
          }
        >
          Restore Previous Session
        </SettingsCheckbox>
        <SettingsCheckbox
          checked={desktopSettings.showBootLog}
          onChange={event =>
            onDesktopSettingsChange({ showBootLog: event.target.checked })
          }
        >
          Show Boot Log
        </SettingsCheckbox>
      </Fieldset>
      <Fieldset label="Local Data">
        <p className="settings-help-text">
          Settings are saved in this browser. Open windows: {windowCount}.
          Guestbook entries are stored separately.
        </p>
        <div className="settings-action-list">
          <Button onClick={onResetAppearance}>Reset Appearance</Button>
          <Button onClick={onResetDesktopSettings}>Reset All Settings</Button>
          <Button onClick={onClearDesktopSession}>Clear Window Session</Button>
        </div>
      </Fieldset>
    </>
  );
}

export default function SettingsApp({
  desktopSettings,
  onClearDesktopSession,
  onDesktopSettingsChange,
  onResetAppearance,
  onResetDesktopSettings,
  windowCount = 0
}) {
  const [activeTab, setActiveTab] = React.useState('appearance');
  const tabRefs = React.useRef({});

  function handleTabKeyDown(event, tabId) {
    const currentIndex = settingsTabs.findIndex(tab => tab.id === tabId);
    let nextIndex = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % settingsTabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + settingsTabs.length) % settingsTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = settingsTabs.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const nextTab = settingsTabs[nextIndex].id;
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  const tabContent = {
    appearance: (
      <AppearanceSettings
        desktopSettings={desktopSettings}
        onDesktopSettingsChange={onDesktopSettingsChange}
      />
    ),
    desktop: (
      <DesktopSettings
        desktopSettings={desktopSettings}
        onDesktopSettingsChange={onDesktopSettingsChange}
      />
    ),
    taskbar: (
      <TaskbarSettings
        desktopSettings={desktopSettings}
        onDesktopSettingsChange={onDesktopSettingsChange}
      />
    ),
    system: (
      <SystemSettings
        desktopSettings={desktopSettings}
        onClearDesktopSession={onClearDesktopSession}
        onDesktopSettingsChange={onDesktopSettingsChange}
        onResetAppearance={onResetAppearance}
        onResetDesktopSettings={onResetDesktopSettings}
        windowCount={windowCount}
      />
    )
  };

  return (
    <div className="settings-app">
      <Tabs
        aria-label="Settings pages"
        className="settings-tabs"
        onChange={setActiveTab}
        value={activeTab}
      >
        {settingsTabs.map(tab => (
          <Tab
            aria-controls={`settings-panel-${tab.id}`}
            id={`settings-tab-${tab.id}`}
            key={tab.id}
            onKeyDown={event => handleTabKeyDown(event, tab.id)}
            ref={element => {
              tabRefs.current[tab.id] = element;
            }}
            tabIndex={activeTab === tab.id ? 0 : -1}
            value={tab.id}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
      <TabBody
        aria-labelledby={`settings-tab-${activeTab}`}
        className="settings-tab-body"
        id={`settings-panel-${activeTab}`}
        role="tabpanel"
      >
        {tabContent[activeTab]}
      </TabBody>
    </div>
  );
}
