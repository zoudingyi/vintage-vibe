import { initialDesktopState, windowReducer } from './windowReducer';

const projectWindow = {
  appId: 'projects',
  id: 'projects',
  position: { x: 144, y: 72 },
  restoreBounds: null,
  size: { height: null, width: 520 },
  status: 'normal'
};

test('opens an app with standard window state', () => {
  const state = windowReducer(initialDesktopState, {
    type: 'OPEN_APP',
    window: projectWindow
  });

  expect(state.windows).toEqual([
    {
      ...projectWindow,
      zIndex: 101
    }
  ]);
  expect(state.activeWindowId).toBe('projects');
});

test('reopening an app restores its existing single window', () => {
  const openedState = windowReducer(initialDesktopState, {
    type: 'OPEN_APP',
    window: projectWindow
  });
  const minimizedState = windowReducer(openedState, {
    type: 'MINIMIZE_WINDOW',
    windowId: 'projects'
  });
  const reopenedState = windowReducer(minimizedState, {
    type: 'OPEN_APP',
    window: projectWindow
  });

  expect(reopenedState.windows).toHaveLength(1);
  expect(reopenedState.windows[0].status).toBe('normal');
  expect(reopenedState.activeWindowId).toBe('projects');
});

test('closing the active window activates the highest visible window', () => {
  const computerWindow = {
    ...projectWindow,
    appId: 'my-computer',
    id: 'my-computer'
  };
  const computerState = windowReducer(initialDesktopState, {
    type: 'OPEN_APP',
    window: computerWindow
  });
  const projectsState = windowReducer(computerState, {
    type: 'OPEN_APP',
    window: projectWindow
  });
  const closedState = windowReducer(projectsState, {
    type: 'CLOSE_WINDOW',
    windowId: 'projects'
  });

  expect(closedState.activeWindowId).toBe('my-computer');
});

test('resizes a normal window without crossing its minimum size', () => {
  const openedState = windowReducer(initialDesktopState, {
    type: 'OPEN_APP',
    window: projectWindow
  });
  const resizedState = windowReducer(openedState, {
    type: 'RESIZE_WINDOW',
    size: { height: 120, width: 200 },
    windowId: 'projects'
  });

  expect(resizedState.windows[0].size).toEqual({
    height: 180,
    width: 280
  });
});

test('keeps normal windows inside the desktop bounds', () => {
  const openedState = windowReducer(initialDesktopState, {
    type: 'OPEN_APP',
    window: {
      ...projectWindow,
      position: { x: 900, y: 700 }
    }
  });
  const clampedState = windowReducer(openedState, {
    bounds: { height: 721, width: 1024 },
    type: 'CLAMP_WINDOWS'
  });

  expect(clampedState.windows[0].position).toEqual({
    x: 504,
    y: 541
  });
});

test('restores the geometry saved before maximizing a window', () => {
  const openedState = windowReducer(initialDesktopState, {
    type: 'OPEN_APP',
    window: projectWindow
  });
  const maximizedState = windowReducer(openedState, {
    type: 'TOGGLE_MAXIMIZE',
    windowId: 'projects'
  });
  const restoredState = windowReducer(maximizedState, {
    type: 'TOGGLE_MAXIMIZE',
    windowId: 'projects'
  });

  expect(restoredState.windows[0]).toMatchObject({
    position: projectWindow.position,
    restoreBounds: null,
    size: projectWindow.size,
    status: 'normal'
  });
});
