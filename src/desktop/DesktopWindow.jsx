import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import { Button, Window, WindowContent, WindowHeader } from 'react95';

const WindowFrame = styled.div`
  position: absolute;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
  max-width: calc(100vw - 24px);

  ${({ $maximized }) =>
    $maximized &&
    `
      width: 100%;
      height: 100%;
      max-width: none;
    `}

  .desktop-window {
    min-height: 180px;
    height: ${({ $maximized }) => ($maximized ? '100%' : 'auto')};
  }

  .desktop-window > div:last-child {
    max-height: ${({ $maximized }) =>
      $maximized ? 'calc(100% - 34px)' : 'none'};
    overflow: auto;
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

  .desktop-window-resize-handle {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
  }
`;

function DesktopWindow({
  app,
  windowState,
  active,
  appProps,
  onClose,
  onFocus,
  onMinimize,
  onMove,
  onResize,
  onToggleMaximize
}) {
  const nodeRef = useRef(null);
  const AppComponent = app.component;
  const maximized = windowState.status === 'maximized';

  function startResize(event) {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = windowState.size.width;
    const startHeight =
      windowState.size.height || nodeRef.current?.offsetHeight || 180;

    function resize(moveEvent) {
      onResize(windowState.id, {
        height: startHeight + moveEvent.clientY - startY,
        width: startWidth + moveEvent.clientX - startX
      });
    }

    function stopResize() {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    }

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  }

  return (
    <Draggable
      bounds="parent"
      disabled={maximized}
      handle=".desktop-window-title"
      nodeRef={nodeRef}
      onStop={(event, data) =>
        onMove(windowState.id, { x: data.x, y: data.y })
      }
      position={maximized ? { x: 0, y: 0 } : windowState.position}
    >
      <WindowFrame
        $maximized={maximized}
        $height={windowState.size.height}
        $width={windowState.size.width}
        ref={nodeRef}
        style={{
          display: windowState.status === 'minimized' ? 'none' : undefined,
          zIndex: windowState.zIndex
        }}
        onMouseDown={() => onFocus(windowState.id)}
      >
        <Window className="desktop-window" data-active={active}>
          <WindowHeader
            className="desktop-window-title"
            onDoubleClick={() => onToggleMaximize(windowState.id)}
          >
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
                aria-label={`${maximized ? 'Restore' : 'Maximize'} ${app.title}`}
                onClick={event => {
                  event.stopPropagation();
                  onToggleMaximize(windowState.id);
                }}
              >
                {maximized ? '❐' : '□'}
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
        {!maximized && (
          <div
            aria-label={`Resize ${app.title}`}
            className="desktop-window-resize-handle"
            onMouseDown={startResize}
            role="separator"
          />
        )}
      </WindowFrame>
    </Draggable>
  );
}

export default DesktopWindow;
