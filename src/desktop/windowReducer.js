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

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
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

    case 'TOGGLE_MAXIMIZE': {
      const zIndex = nextLayer(state);

      return {
        ...state,
        activeWindowId: action.windowId,
        nextZIndex: zIndex,
        windows: state.windows.map(windowState => {
          if (windowState.id !== action.windowId) {
            return windowState;
          }

          if (windowState.status === 'maximized') {
            return {
              ...windowState,
              position: windowState.restoreBounds.position,
              restoreBounds: null,
              size: windowState.restoreBounds.size,
              status: 'normal',
              zIndex
            };
          }

          return {
            ...windowState,
            restoreBounds: {
              position: windowState.position,
              size: windowState.size
            },
            status: 'maximized',
            zIndex
          };
        })
      };
    }

    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(windowState =>
          windowState.id === action.windowId &&
          windowState.status === 'normal'
            ? { ...windowState, position: action.position }
            : windowState
        )
      };

    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(windowState =>
          windowState.id === action.windowId &&
          windowState.status === 'normal'
            ? {
                ...windowState,
                size: {
                  height: Math.max(180, action.size.height),
                  width: Math.max(280, action.size.width)
                }
              }
            : windowState
        )
      };

    case 'CLAMP_WINDOWS':
      return {
        ...state,
        windows: state.windows.map(windowState => {
          if (windowState.status !== 'normal') {
            return windowState;
          }

          const height = windowState.size.height || 180;

          return {
            ...windowState,
            position: {
              x: clamp(
                windowState.position.x,
                0,
                action.bounds.width - windowState.size.width
              ),
              y: clamp(
                windowState.position.y,
                0,
                action.bounds.height - height
              )
            }
          };
        })
      };

    case 'SHOW_DESKTOP':
      return {
        ...state,
        activeWindowId: null,
        windows: state.windows.map(windowState => ({
          ...windowState,
          status: 'minimized'
        }))
      };

    case 'CASCADE_WINDOWS': {
      let visibleIndex = 0;
      let activeWindowId = null;

      const windows = state.windows.map(windowState => {
        if (windowState.status === 'minimized') {
          return windowState;
        }

        const zIndex = state.nextZIndex + visibleIndex + 1;
        const offset = 24 + visibleIndex * 28;
        visibleIndex += 1;
        activeWindowId = windowState.id;

        return {
          ...windowState,
          position: { x: offset, y: offset },
          restoreBounds: null,
          status: 'normal',
          zIndex
        };
      });

      return {
        ...state,
        activeWindowId,
        nextZIndex: state.nextZIndex + visibleIndex,
        windows
      };
    }

    case 'TILE_WINDOWS': {
      const visibleWindows = state.windows.filter(
        windowState => windowState.status !== 'minimized'
      );

      if (visibleWindows.length === 0) {
        return state;
      }

      const gap = 8;
      const columns = Math.ceil(Math.sqrt(visibleWindows.length));
      const rows = Math.ceil(visibleWindows.length / columns);
      const width = Math.max(
        280,
        Math.floor(
          (action.bounds.width - gap * (columns + 1)) / columns
        )
      );
      const height = Math.max(
        180,
        Math.floor((action.bounds.height - gap * (rows + 1)) / rows)
      );
      let visibleIndex = 0;

      const windows = state.windows.map(windowState => {
        if (windowState.status === 'minimized') {
          return windowState;
        }

        const column = visibleIndex % columns;
        const row = Math.floor(visibleIndex / columns);
        const zIndex = state.nextZIndex + visibleIndex + 1;
        visibleIndex += 1;

        return {
          ...windowState,
          position: {
            x: gap + column * (width + gap),
            y: gap + row * (height + gap)
          },
          restoreBounds: null,
          size: { height, width },
          status: 'normal',
          zIndex
        };
      });

      return {
        ...state,
        activeWindowId: visibleWindows[visibleWindows.length - 1].id,
        nextZIndex: state.nextZIndex + visibleWindows.length,
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
