import React, { useState } from 'react';
import './index.css';
import styled from 'styled-components';

import Taskbar from '@/components/Taskbar';
import DesktopWindow from '@/desktop/DesktopWindow';
import { DesktopProvider, useDesktop } from '@/desktop/DesktopProvider';
import desktopApps from '@/desktop/apps';

const DESKTOP_SETTINGS_STORAGE_KEY = 'vintage-vibe-desktop-settings';
const DEFAULT_DESKTOP_SETTINGS = {
  accent: 'purple',
  iconLayout: 'column',
  scanlines: true,
  wallpaper: 'teal'
};
const CONTEXT_MENU_SIZE = { height: 184, width: 156 };

function getContextMenuPosition(x, y) {
  const margin = 8;

  return {
    x: Math.max(
      margin,
      Math.min(x, window.innerWidth - CONTEXT_MENU_SIZE.width - margin)
    ),
    y: Math.max(
      margin,
      Math.min(y, window.innerHeight - CONTEXT_MENU_SIZE.height - margin)
    )
  };
}

const Wrapper = styled.div`
  // background-color: ${({ theme }) => theme.desktopBackground};
`;
const Button = styled.button`
  &:focus {
    & > span {
      outline: black dotted 1px;
      background-color: ${({ theme }) => theme.hoverBackground};
    }
  }
`;

function loadDesktopSettings() {
  try {
    const storedSettings = window.localStorage.getItem(
      DESKTOP_SETTINGS_STORAGE_KEY
    );

    if (!storedSettings) {
      return DEFAULT_DESKTOP_SETTINGS;
    }

    return {
      ...DEFAULT_DESKTOP_SETTINGS,
      ...JSON.parse(storedSettings)
    };
  } catch (error) {
    return DEFAULT_DESKTOP_SETTINGS;
  }
}

function DesktopShell() {
  const [openStartMenu, setOpenStartMenu] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [showBootLog, setShowBootLog] = useState(true);
  const [desktopSettings, setDesktopSettings] = useState(loadDesktopSettings);
  const {
    apps,
    windows,
    activeWindowId,
    cascadeWindows,
    clampWindows,
    openApp,
    closeWindow,
    minimizeWindow,
    moveWindow,
    resizeWindow,
    restoreWindow,
    showDesktop,
    tileWindows,
    focusWindow,
    toggleMaximizeWindow
  } = useDesktop();

  React.useEffect(() => {
    window.localStorage.setItem(
      DESKTOP_SETTINGS_STORAGE_KEY,
      JSON.stringify(desktopSettings)
    );
  }, [desktopSettings]);

  React.useEffect(() => {
    function keepWindowsInBounds() {
      clampWindows({
        height: window.innerHeight - 47,
        width: window.innerWidth
      });
    }

    window.addEventListener('resize', keepWindowsInBounds);
    return () => window.removeEventListener('resize', keepWindowsInBounds);
  }, [clampWindows]);

  function updateDesktopSettings(nextSettings) {
    setDesktopSettings(currentSettings => ({
      ...currentSettings,
      ...nextSettings
    }));
  }

  function arrangeDesktopIcons() {
    updateDesktopSettings({ iconLayout: 'grid' });
    setContextMenu(null);
  }

  function openPersonalization() {
    openApp('settings');
    setContextMenu(null);
  }

  function resetDesktopSettings() {
    setDesktopSettings(DEFAULT_DESKTOP_SETTINGS);
  }

  if (shutdown) {
    return (
      <Wrapper
        className={`desktop-environment-wrapper desktop-accent-${desktopSettings.accent}`}
        data-scanlines={desktopSettings.scanlines}
      >
        <div className="shutdown-screen">
          <p>Windows is shutting down...</p>
          <p>Saving desktop settings to localStorage.</p>
          <p>It is now safe to turn off your computer.</p>
          <button onClick={() => setShutdown(false)}>Restart</button>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper
        className={`desktop-environment-wrapper desktop-accent-${desktopSettings.accent}`}
        data-scanlines={desktopSettings.scanlines}
      >
        <div
          className={`desktop desktop-wallpaper-${desktopSettings.wallpaper} desktop-icons-${desktopSettings.iconLayout}`}
          data-testid="desktop-surface"
          onClick={() => {
            setOpenStartMenu(false);
            setContextMenu(null);
          }}
          onContextMenu={event => {
            event.preventDefault();
            setOpenStartMenu(false);
            setContextMenu(
              getContextMenuPosition(event.clientX, event.clientY)
            );
          }}
        >
          {apps.filter(app => app.showOnDesktop).map(app => (
            <Button
              className="desktop-application-item"
              onDoubleClick={event => {
                event.stopPropagation();
                openApp(app.id);
              }}
              key={app.id}
            >
              <img src={app.icon} width={32} height={32} alt="" />
              <span>{app.title}</span>
            </Button>
          ))}
          {windows.map(windowState => {
            const app = apps.find(item => item.id === windowState.appId);

            if (!app) {
              return null;
            }

            return (
              <DesktopWindow
                app={app}
                windowState={windowState}
                active={activeWindowId === windowState.id}
                onClose={closeWindow}
                onFocus={focusWindow}
                onMinimize={minimizeWindow}
                onMove={moveWindow}
                onResize={resizeWindow}
                onToggleMaximize={toggleMaximizeWindow}
                appProps={{
                  desktopSettings,
                  onOpenApp: openApp,
                  onArrangeDesktopIcons: arrangeDesktopIcons,
                  onDesktopSettingsChange: updateDesktopSettings,
                  onResetDesktopSettings: resetDesktopSettings
                }}
                key={windowState.id}
              />
            );
          })}
          {contextMenu && (
            <div
              className="desktop-context-menu"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={event => event.stopPropagation()}
              role="menu"
            >
              <button onClick={arrangeDesktopIcons}>Arrange Icons</button>
              <button
                onClick={() => {
                  cascadeWindows();
                  setContextMenu(null);
                }}
              >
                Cascade Windows
              </button>
              <button
                onClick={() => {
                  tileWindows({
                    height: window.innerHeight - 47,
                    width: window.innerWidth
                  });
                  setContextMenu(null);
                }}
              >
                Tile Windows
              </button>
              <button
                onClick={() => {
                  showDesktop();
                  setContextMenu(null);
                }}
              >
                Show Desktop
              </button>
              <button onClick={openPersonalization}>Personalize</button>
              <button onClick={() => setContextMenu(null)}>Refresh</button>
            </div>
          )}
          {showBootLog && (
            <div className="boot-sequence" aria-label="Boot sequence">
              <strong>Vintage BIOS 0.95</strong>
              <p>Memory check: 640K OK</p>
              <p>Loading desktop shell...</p>
              <p>Boot sequence complete.</p>
              <button onClick={() => setShowBootLog(false)}>
                Dismiss boot log
              </button>
            </div>
          )}
        </div>
        <Taskbar
          open={openStartMenu}
          setOpen={setOpenStartMenu}
          apps={apps}
          windows={windows}
          activeWindowId={activeWindowId}
          onFocusWindow={focusWindow}
          onMinimizeWindow={minimizeWindow}
          onRestoreWindow={restoreWindow}
          onOpenApp={openApp}
          onShutdown={() => setShutdown(true)}
        />
      </Wrapper>
    </>
  );
}

function Home() {
  return (
    <DesktopProvider apps={desktopApps}>
      <DesktopShell />
    </DesktopProvider>
  );
}

export default Home;
