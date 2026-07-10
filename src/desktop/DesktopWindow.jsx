import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import { Button, Window, WindowContent, WindowHeader } from 'react95';

const WindowFrame = styled.div`
  position: absolute;
  width: ${({ $width }) => $width}px;
  max-width: calc(100vw - 24px);

  .desktop-window {
    min-height: 180px;
  }

  .desktop-window-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
  }

  .desktop-window-title-text {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    font-weight: bold;
  }

  .desktop-window-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }

  .desktop-window-controls {
    display: inline-flex;
    gap: 2px;
    margin-left: 8px;
  }

  .desktop-window-control {
    min-width: 22px;
    height: 22px;
    padding: 0;
    line-height: 1;
  }
`;

function DesktopWindow({
  app,
  windowState,
  active,
  appProps,
  onClose,
  onFocus,
  onMinimize
}) {
  const AppComponent = app.component;
  const width = app.windowSize?.width || 420;
  const defaultPosition = app.defaultPosition || { x: 96, y: 48 };

  return (
    <Draggable handle=".desktop-window-title" defaultPosition={defaultPosition}>
      <WindowFrame
        $width={width}
        style={{
          display: windowState.status === 'minimized' ? 'none' : undefined,
          zIndex: windowState.zIndex
        }}
        onMouseDown={() => onFocus(windowState.id)}
      >
        <Window className="desktop-window" data-active={active}>
          <WindowHeader className="desktop-window-title">
            <span className="desktop-window-title-text">
              <img className="desktop-window-icon" src={app.icon} alt="" />
              {app.title}
            </span>
            <span className="desktop-window-controls">
              <Button
                className="desktop-window-control"
                aria-label={`Minimize ${app.title}`}
                onClick={event => {
                  event.stopPropagation();
                  onMinimize(windowState.id);
                }}
              >
                _
              </Button>
              <Button
                className="desktop-window-control"
                aria-label={`Close ${app.title}`}
                onClick={event => {
                  event.stopPropagation();
                  onClose(windowState.id);
                }}
              >
                X
              </Button>
            </span>
          </WindowHeader>
          <WindowContent>
            <AppComponent {...appProps} />
          </WindowContent>
        </Window>
      </WindowFrame>
    </Draggable>
  );
}

export default DesktopWindow;
