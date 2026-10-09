import React, { useState } from 'react';
import '@/desktop/DesktopWallpaper.css';
import './index.css';
import styled, { ThemeProvider } from 'styled-components';

import Taskbar from '@/desktop/Taskbar';
import ShutdownSequence from '@/desktop/ShutdownSequence';
import DesktopWindow from '@/desktop/DesktopWindow';
import { DesktopProvider, useDesktop } from '@/desktop/DesktopProvider';
import appRegistry from '@/desktop/appRegistry';
import { getDesktopThemeOption } from '@/desktop/themeRegistry';
import useCompactDesktop from '@/desktop/useCompactDesktop';
import { playTestTone } from '@/desktop/audioEngine';
import {
  DEFAULT_DESKTOP_SESSION,
  DEFAULT_DESKTOP_SETTINGS,
  DESKTOP_STORAGE_VERSION,
  loadDesktopData,
  saveDesktopData
} from '@/desktop/desktopStorage';
const CONTEXT_MENU_SIZE = { height: 154, width: 156 };
const DESKTOP_ICON_PIXELS = { large: 40, medium: 32, small: 24 };

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

function DesktopShell({ initialDesktopData, booting }) {
  const compactDesktop = useCompactDesktop();
  const [openStartMenu, setOpenStartMenu] = useState(false);
  const [shutdown, setShutdown] = useState(null);
  const [screenOff, setScreenOff] = useState(false);
  const handleScreenOff = React.useCallback(() => setScreenOff(true), []);
  const [contextMenu, setContextMenu] = useState(null);
  const [bootLogDismissed, setBootLogDismissed] = useState(false);
  const [selectedDesktopAppId, setSelectedDesktopAppId] = useState(null);
  const desktopIconRefs = React.useRef({});
  const [desktopSettings, setDesktopSettings] = useState(
    initialDesktopData.settings
  );
  const [storageNotice, setStorageNotice] = useState(
    initialDesktopData.recoveredFromError
      ? 'Desktop settings were reset after stored data became unreadable.'
      : null
  );
  const {
    apps,
    windows,
    activeWindowId,
    cascadeWindows,
    clampWindows,
    clearSession,
    cycleWindows,
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
  const desktopApps = apps.filter(app => app.showOnDesktop);
  const desktopThemeOption = getDesktopThemeOption(
    desktopSettings.react95Theme
  );
  const desktopTheme = desktopThemeOption.theme;
  const desktopThemeStyle = {
    '--desktop-accent': desktopTheme.borderLightest,
    '--desktop-accent-dark': desktopTheme.borderDark
  };
  const handleCloseWindow = React.useCallback(
    windowId => {
      const launcher =
        desktopIconRefs.current[windowId] ||
        document.querySelector('[data-start-button="true"]');

      closeWindow(windowId);
      launcher?.focus();
    },
    [closeWindow]
  );

  React.useEffect(() => {
    const saved = saveDesktopData({
      session: { activeWindowId, windows },
      settings: desktopSettings,
      version: DESKTOP_STORAGE_VERSION
    });

    if (!saved) {
      setStorageNotice('Desktop settings could not be saved in this browser.');
    }
  }, [activeWindowId, desktopSettings, windows]);

  React.useEffect(() => {
    function keepWindowsInBounds() {
      // 电源过渡期间冻结窗口几何，避免 resize 改动正在展示的桌面。
      if (shutdown || booting) return;
      clampWindows({
        height: window.innerHeight - 47,
        width: window.innerWidth
      });
    }

    window.addEventListener('resize', keepWindowsInBounds);
    return () => window.removeEventListener('resize', keepWindowsInBounds);
  }, [booting, clampWindows, shutdown]);

  React.useEffect(() => {
    function handleSystemShortcut(event) {
      // inert 不会停止 window 上的监听器，因此全局快捷键也需显式锁定。
      if (shutdown || booting) return;
      if (event.ctrlKey && event.key === 'Escape') {
        event.preventDefault();
        setContextMenu(null);
        setOpenStartMenu(currentValue => !currentValue);
        return;
      }

      if (event.altKey && event.key === 'Tab') {
        event.preventDefault();
        cycleWindows(event.shiftKey ? -1 : 1);
        return;
      }

      if (event.altKey && event.key === 'F4' && activeWindowId) {
        event.preventDefault();
        handleCloseWindow(activeWindowId);
        return;
      }

      if (event.key === 'Escape') {
        setContextMenu(null);
        setOpenStartMenu(false);
      }
    }

    window.addEventListener('keydown', handleSystemShortcut);
    return () => window.removeEventListener('keydown', handleSystemShortcut);
  }, [activeWindowId, booting, cycleWindows, handleCloseWindow, shutdown]);

  function updateDesktopSettings(nextSettings) {
    setDesktopSettings(currentSettings => ({
      ...currentSettings,
      ...nextSettings
    }));
  }

  function playAudioTestTone() {
    return playTestTone(desktopSettings);
  }

  function openPersonalization() {
    openApp('settings');
    setContextMenu(null);
  }

  function resetDesktopSettings() {
    setDesktopSettings(DEFAULT_DESKTOP_SETTINGS);
  }

  function resetDesktopAppearance() {
    updateDesktopSettings({
      radioAppearance: DEFAULT_DESKTOP_SETTINGS.radioAppearance,
      react95Theme: DEFAULT_DESKTOP_SETTINGS.react95Theme,
      scanlineIntensity: DEFAULT_DESKTOP_SETTINGS.scanlineIntensity,
      scanlines: DEFAULT_DESKTOP_SETTINGS.scanlines,
      vhsEffects: DEFAULT_DESKTOP_SETTINGS.vhsEffects,
      wallpaper: DEFAULT_DESKTOP_SETTINGS.wallpaper
    });
  }

  function handleDesktopIconKeyDown(event, appId) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openApp(appId);
      return;
    }

    const currentIndex = desktopApps.findIndex(app => app.id === appId);
    const lastIndex = desktopApps.length - 1;
    let nextIndex = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    desktopIconRefs.current[desktopApps[nextIndex].id]?.focus();
  }

  function shutdownDesktop() {
    if (shutdown) return;
    // 在动画和应用卸载前保存会话；保存失败仍允许关机，并将错误传给首页。
    const saved = saveDesktopData({
      session: { activeWindowId, windows },
      settings: desktopSettings,
      version: DESKTOP_STORAGE_VERSION
    });
    setOpenStartMenu(false);
    setContextMenu(null);
    setShutdown({
      reducedMotion:
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
      saveFailed: !saved
    });
  }

  return (
    <ThemeProvider theme={desktopTheme}>
      {/* CRT 收束期间保留真实桌面，让应用完成音频淡出；熄屏后再卸载。 */}
      {!screenOff && (
        <div
          className={`desktop-power-transition${shutdown ? ' desktop-power-transition--shutting-down' : ''}`}
          aria-hidden={shutdown ? true : undefined}
          {...(shutdown ? { inert: '' } : {})}
        >
          <Wrapper
            className="desktop-environment-wrapper"
            data-scanline-intensity={desktopSettings.scanlineIntensity}
            data-scanlines={desktopSettings.scanlines}
            data-vhs-effects={desktopSettings.vhsEffects}
            data-testid="desktop-environment"
            style={desktopThemeStyle}
          >
            <div aria-hidden="true" className="vhs-overlay" />
            <div
              aria-hidden="true"
              className="vhs-scan-error"
              data-testid="vhs-scan-error"
            />
            <div
              className={`desktop desktop-wallpaper-${desktopSettings.wallpaper} desktop-icons-${desktopSettings.iconLayout} desktop-icon-size-${desktopSettings.iconSize}`}
              data-icon-glow={desktopSettings.iconGlowEffect}
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
              {desktopApps.map(app => (
                <Button
                  aria-pressed={selectedDesktopAppId === app.id}
                  className="desktop-application-item"
                  data-selected={selectedDesktopAppId === app.id}
                  onClick={event => {
                    event.stopPropagation();
                    setSelectedDesktopAppId(app.id);
                    if (compactDesktop) {
                      openApp(app.id);
                    }
                  }}
                  onDoubleClick={event => {
                    event.stopPropagation();
                    openApp(app.id);
                  }}
                  onFocus={() => setSelectedDesktopAppId(app.id)}
                  onKeyDown={event => handleDesktopIconKeyDown(event, app.id)}
                  ref={element => {
                    desktopIconRefs.current[app.id] = element;
                  }}
                  key={app.id}
                >
                  <img
                    data-testid={`desktop-icon-${app.id}`}
                    src={app.icon}
                    width={DESKTOP_ICON_PIXELS[desktopSettings.iconSize]}
                    height={DESKTOP_ICON_PIXELS[desktopSettings.iconSize]}
                    alt=""
                  />
                  <span>{app.title}</span>
                </Button>
              ))}
              <div aria-hidden="true" className="desktop-decorative-copy">
                <span lang="ja">仮想世界</span>
                <small>VIRTUAL WORLD // 夜間通信</small>
              </div>
              {windows.map(windowState => {
                const app = apps.find(item => item.id === windowState.appId);

                if (!app) {
                  return null;
                }

                return (
                  <DesktopWindow
                    app={app}
                    compact={compactDesktop}
                    windowState={windowState}
                    active={activeWindowId === windowState.id}
                    interactive={!booting && !shutdown}
                    onClose={handleCloseWindow}
                    onFocus={focusWindow}
                    onMinimize={minimizeWindow}
                    onMove={moveWindow}
                    onResize={resizeWindow}
                    onToggleMaximize={toggleMaximizeWindow}
                    appProps={{
                      desktopSettings,
                      systemShuttingDown: Boolean(shutdown),
                      onOpenApp: openApp,
                      onPlayTestSound: playAudioTestTone,
                      onClearDesktopSession: clearSession,
                      onDesktopSettingsChange: updateDesktopSettings,
                      onResetAppearance: resetDesktopAppearance,
                      onResetDesktopSettings: resetDesktopSettings,
                      windowCount: windows.length
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
              {desktopSettings.showBootLog && !bootLogDismissed && (
                <div className="boot-sequence" aria-label="Boot sequence">
                  <strong>Vintage BIOS 0.95</strong>
                  <p>Memory check: 640K OK</p>
                  <p>Loading desktop shell...</p>
                  <p>Boot sequence complete.</p>
                  <button onClick={() => setBootLogDismissed(true)}>
                    Dismiss boot log
                  </button>
                </div>
              )}
              {storageNotice && (
                <div className="desktop-notice" role="status">
                  <span>{storageNotice}</span>
                  <button onClick={() => setStorageNotice(null)}>Dismiss</button>
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
              onShutdown={shutdownDesktop}
              clockFormat={desktopSettings.clockFormat}
              showSeconds={desktopSettings.showSeconds}
              taskbarButtonMode={desktopSettings.taskbarButtonMode}
            />
          </Wrapper>
        </div>
      )}
      {shutdown && (
        <ShutdownSequence
          reducedMotion={shutdown.reducedMotion}
          saveFailed={shutdown.saveFailed}
          onScreenOff={handleScreenOff}
        />
      )}
    </ThemeProvider>
  );
}

function Home({ initialDesktopData: bootDesktopData, booting = false }) {
  // 开机动画与路由桌面共用此实例，初始数据只读取一次，避免交接时重置会话。
  const [initialDesktopData] = useState(() => bootDesktopData ?? loadDesktopData());
  const initialSession = initialDesktopData.settings.restoreSession
    ? initialDesktopData.session
    : DEFAULT_DESKTOP_SESSION;

  return (
    <DesktopProvider apps={appRegistry} initialSession={initialSession}>
      <DesktopShell initialDesktopData={initialDesktopData} booting={booting} />
    </DesktopProvider>
  );
}

export default Home;
