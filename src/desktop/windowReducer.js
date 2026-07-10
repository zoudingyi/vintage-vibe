export const initialDesktopState = {
  activeWindowId: null,
  nextZIndex: 100,
  windows: []
};

function findTopVisibleWindowId(windows) {
  return windows
    .filter(windowState => windowState.status !== 'minimized')
    .reduce(
      (topWindow, windowState) =>
        !topWindow || windowState.zIndex > topWindow.zIndex
          ? windowState
          : topWindow,
      null
    )?.id || null;
}

function nextLayer(state) {
  return state.nextZIndex + 1;
}

export function windowReducer(state, action) {
  switch (action.type) {
    case 'OPEN_APP': {
      const zIndex = nextLayer(state);
      const existingWindow = state.windows.find(
        windowState => windowState.appId === action.window.appId
      );

      if (existingWindow) {
        return {
          ...state,
          activeWindowId: existingWindow.id,
          nextZIndex: zIndex,
          windows: state.windows.map(windowState =>
            windowState.id === existingWindow.id
              ? { ...windowState, status: 'normal', zIndex }
              : windowState
          )
        };
      }

      return {
        ...state,
        activeWindowId: action.window.id,
        nextZIndex: zIndex,
        windows: [...state.windows, { ...action.window, zIndex }]
      };
    }

    case 'CLOSE_WINDOW': {
      const windows = state.windows.filter(
        windowState => windowState.id !== action.windowId
      );

      return {
        ...state,
        activeWindowId:
          state.activeWindowId === action.windowId
            ? findTopVisibleWindowId(windows)
            : state.activeWindowId,
        windows
      };
    }

    case 'MINIMIZE_WINDOW': {
      const windows = state.windows.map(windowState =>
        windowState.id === action.windowId
          ? { ...windowState, status: 'minimized' }
          : windowState
      );

      return {
        ...state,
        activeWindowId:
          state.activeWindowId === action.windowId
            ? findTopVisibleWindowId(windows)
            : state.activeWindowId,
        windows
      };
    }

    case 'RESTORE_WINDOW':
    case 'FOCUS_WINDOW': {
      const zIndex = nextLayer(state);

      return {
        ...state,
        activeWindowId: action.windowId,
        nextZIndex: zIndex,
        windows: state.windows.map(windowState =>
          windowState.id === action.windowId
            ? {
                ...windowState,
                status:
                  action.type === 'RESTORE_WINDOW'
                    ? 'normal'
                    : windowState.status,
                zIndex
              }
            : windowState
        )
      };
    }

    default:
      return state;
  }
}
