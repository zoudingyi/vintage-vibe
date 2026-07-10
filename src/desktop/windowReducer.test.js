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
