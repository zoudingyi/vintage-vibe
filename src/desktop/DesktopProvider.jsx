import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';
import { initialDesktopState, windowReducer } from './windowReducer';

const DesktopContext = createContext(null);

export function DesktopProvider({ apps, children }) {
  const [desktopState, dispatch] = useReducer(
    windowReducer,
    initialDesktopState
  );
  const { activeWindowId, windows } = desktopState;

  const openApp = useCallback(appId => {
    const app = apps.find(item => item.id === appId);

    if (!app) {
      throw new Error(`Cannot open unknown desktop app: ${appId}`);
    }

    dispatch({
      type: 'OPEN_APP',
      window: {
        appId,
        id: appId,
        position: app.defaultPosition || { x: 96, y: 48 },
        restoreBounds: null,
        size: {
          height: app.windowSize?.height || null,
          width: app.windowSize?.width || 420
        },
        status: 'normal'
      }
    });
  }, [apps]);

  const closeWindow = useCallback(windowId => {
    dispatch({ type: 'CLOSE_WINDOW', windowId });
  }, []);

  const minimizeWindow = useCallback(windowId => {
    dispatch({ type: 'MINIMIZE_WINDOW', windowId });
  }, []);

  const restoreWindow = useCallback(windowId => {
    dispatch({ type: 'RESTORE_WINDOW', windowId });
  }, []);

  const toggleMaximizeWindow = useCallback(windowId => {
    dispatch({ type: 'TOGGLE_MAXIMIZE', windowId });
  }, []);

  const moveWindow = useCallback((windowId, position) => {
    dispatch({ type: 'MOVE_WINDOW', windowId, position });
  }, []);

  const resizeWindow = useCallback((windowId, size) => {
    dispatch({ type: 'RESIZE_WINDOW', windowId, size });
  }, []);

  const showDesktop = useCallback(() => {
    dispatch({ type: 'SHOW_DESKTOP' });
  }, []);

  const cascadeWindows = useCallback(() => {
    dispatch({ type: 'CASCADE_WINDOWS' });
  }, []);

  const clampWindows = useCallback(bounds => {
    dispatch({ type: 'CLAMP_WINDOWS', bounds });
  }, []);

  const tileWindows = useCallback(bounds => {
    dispatch({ type: 'TILE_WINDOWS', bounds });
  }, []);

  const focusWindow = useCallback(windowId => {
    dispatch({ type: 'FOCUS_WINDOW', windowId });
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
      activeWindowId,
      apps,
      cascadeWindows,
      clampWindows,
      closeWindow,
      focusWindow,
      minimizeWindow,
      moveWindow,
      openApp,
      resizeWindow,
      restoreWindow,
      showDesktop,
      tileWindows,
      toggleMaximizeWindow,
      windows
    ]
  );

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  );
}

export function useDesktop() {
  const desktop = useContext(DesktopContext);

  if (!desktop) {
    throw new Error('useDesktop must be used within DesktopProvider');
  }

  return desktop;
}
