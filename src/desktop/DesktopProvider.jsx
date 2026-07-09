import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

const DesktopContext = createContext(null);

export function DesktopProvider({ apps, children }) {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const zIndexRef = useRef(100);

  const nextZIndex = useCallback(() => {
    zIndexRef.current += 1;
    return zIndexRef.current;
  }, []);

  const openApp = useCallback(appId => {
    const zIndex = nextZIndex();

    setWindows(currentWindows => {
      const existingWindow = currentWindows.find(item => item.appId === appId);

      if (existingWindow) {
        return currentWindows.map(item =>
          item.appId === appId
            ? { ...item, minimized: false, zIndex }
            : item
        );
      }

      return [
        ...currentWindows,
        {
          id: appId,
          appId,
          minimized: false,
          zIndex
        }
      ];
    });
    setActiveWindowId(appId);
  }, [nextZIndex]);

  const closeWindow = useCallback(windowId => {
    setWindows(currentWindows =>
      currentWindows.filter(item => item.id !== windowId)
    );
    setActiveWindowId(currentId => (currentId === windowId ? null : currentId));
  }, []);

  const minimizeWindow = useCallback(windowId => {
    setWindows(currentWindows =>
      currentWindows.map(item =>
        item.id === windowId ? { ...item, minimized: true } : item
      )
    );
    setActiveWindowId(currentId => (currentId === windowId ? null : currentId));
  }, []);

  const restoreWindow = useCallback(windowId => {
    const zIndex = nextZIndex();

    setWindows(currentWindows =>
      currentWindows.map(item =>
        item.id === windowId ? { ...item, minimized: false, zIndex } : item
      )
    );
    setActiveWindowId(windowId);
  }, [nextZIndex]);

  const focusWindow = useCallback(windowId => {
    const zIndex = nextZIndex();

    setWindows(currentWindows =>
      currentWindows.map(item =>
        item.id === windowId ? { ...item, zIndex } : item
      )
    );
    setActiveWindowId(windowId);
  }, [nextZIndex]);

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
