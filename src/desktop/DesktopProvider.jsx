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

  const focusWindow = useCallback(windowId => {
    dispatch({ type: 'FOCUS_WINDOW', windowId });
  }, []);

  const value = useMemo(
    () => ({
      apps,
      windows,
      activeWindowId,
      openApp,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow
    }),
    [
      activeWindowId,
      apps,
      closeWindow,
      focusWindow,
      minimizeWindow,
      openApp,
      restoreWindow,
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
