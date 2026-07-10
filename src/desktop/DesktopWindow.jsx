import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import { Button, Window, WindowContent, WindowHeader } from 'react95';

const WindowFrame = styled.div`
  position: absolute;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
  max-width: calc(100vw - 24px);

  ${({ $fullScreen }) =>
    $fullScreen &&
    `
      width: 100%;
      height: 100%;
      max-width: none;
    `}

  .desktop-window {
    min-height: 180px;
    height: ${({ $fullScreen }) => ($fullScreen ? '100%' : 'auto')};

    ${({ $fullScreen }) =>
      $fullScreen &&
      `
        display: flex;
        flex-direction: column;
        width: 100%;
      `}
  }

  .desktop-window-content {
    max-height: ${({ $fullScreen }) =>
      $fullScreen ? 'calc(100% - 34px)' : 'none'};
    overflow: auto;

    ${({ $fullScreen }) =>
      $fullScreen &&
      `
        flex: 1 1 auto;
        min-height: 0;
      `}
  }

  .desktop-window-title {
    display: flex;
    flex: 0 0 auto;
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
  compact,
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
  const fullScreen = maximized || compact;
  const titleId = `desktop-window-title-${windowState.id}`;

  useEffect(() => {
    if (active && windowState.status !== 'minimized') {
      nodeRef.current?.focus();
    }
  }, [active, windowState.status]);

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
      disabled={fullScreen}
      handle=".desktop-window-title"
      nodeRef={nodeRef}
      onStop={(event, data) =>
        onMove(windowState.id, { x: data.x, y: data.y })
      }
      position={fullScreen ? { x: 0, y: 0 } : windowState.position}
    >
      <WindowFrame
        aria-hidden={windowState.status === 'minimized'}
        aria-labelledby={titleId}
        aria-modal="false"
        $fullScreen={fullScreen}
        $height={windowState.size.height}
        $width={windowState.size.width}
        data-active={active}
        ref={nodeRef}
        style={{
          display: windowState.status === 'minimized' ? 'none' : undefined,
          zIndex: windowState.zIndex
        }}
        onMouseDown={() => onFocus(windowState.id)}
        role="dialog"
        tabIndex={-1}
      >
        <Window className="desktop-window" data-active={active}>
          <WindowHeader
            className="desktop-window-title"
            onDoubleClick={() => onToggleMaximize(windowState.id)}
          >
            <span className="desktop-window-title-text" id={titleId}>
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
              {!compact && (
                <Button
                  className="desktop-window-control"
                  aria-label={`${
                    maximized ? 'Restore' : 'Maximize'
                  } ${app.title}`}
                  onClick={event => {
                    event.stopPropagation();
                    onToggleMaximize(windowState.id);
                  }}
                >
                  {maximized ? '❐' : '□'}
                </Button>
              )}
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
          <WindowContent
            aria-label={`${app.title} content`}
            className="desktop-window-content"
            role="region"
          >
            <AppComponent {...appProps} />
          </WindowContent>
        </Window>
        {!fullScreen && (
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
