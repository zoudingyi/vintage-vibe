import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import '@/desktop/DesktopWallpaper.css';
import './RetroComputerEntrance.css';

function ComputerHardware({ entering, onEnter, screenBounds, screen, powerButton, poweredOff, retreating, saveFailed }) {
  const busy = entering || retreating;
  return (
    <div className={`retro-computer${entering ? ' retro-computer--booting' : ''}${poweredOff && !entering ? ' retro-computer--off' : ''}${retreating && screenBounds ? ' retro-computer--retreating' : ''}`} style={screenBounds}>
      <div className="retro-computer__hardware">
        <div className="retro-computer__monitor">
          <span className="retro-computer__color-mark" aria-hidden="true"><i /><i /><i /></span>
          <button className="retro-computer__screen" ref={screen} disabled={busy} onClick={() => onEnter(screen.current)} aria-label="启动复古电脑，进入桌面">
            <span className="retro-computer__picture" aria-hidden="true" />
            <span className="retro-computer__static" aria-hidden="true" />
            <span className="retro-computer__scanlines" aria-hidden="true" />
            {entering && (
              <span className="retro-computer__boot-screen" aria-hidden="true">
                <span className="retro-computer__boot-beam" />
                <span className="retro-computer__boot-signal">
                  <span className="retro-computer__boot-noise" />
                  <span className="retro-computer__boot-band" />
                </span>
                <span className="retro-computer__boot-content">
                  <span className="retro-computer__boot-logo">VIBE/95</span>
                  <span className="retro-computer__boot-blocks"><i /><i /><i /></span>
                </span>
              </span>
            )}
          </button>
          <div className="retro-computer__monitor-trim">
            <span className="retro-computer__brand" aria-hidden="true">VIBE SYSTEMS<small>VC-88 · COLOR DISPLAY</small></span>
            <div className="retro-computer__controls">
              <span className="retro-computer__monitor-controls" aria-hidden="true"><i /><i /><b /></span>
              <button className="retro-computer__power-button" ref={powerButton} onClick={() => onEnter(screen.current)} disabled={busy} aria-label="按下电源键，进入桌面"><span aria-hidden="true">⏻</span></button>
            </div>
          </div>
        </div>
        <div className="retro-computer__stand" aria-hidden="true" />
      </div>
      <span className="computer-entrance__instruction" role="status">{entering ? 'VIBE/95 · BOOTING' : poweredOff ? <><span>VIBE/95 · SYSTEM OFF</span><small>{retreating ? '正在关闭显示器…' : '点击电源键，重新启动'}</small>{saveFailed && <small className="computer-entrance__save-error">无法保存桌面设置，重新启动可能无法恢复本次更改。</small>}</> : <><span lang="ja">起動する <span lang="en">/ START YOUR WORLD</span></span><small>点击屏幕或电源键，启动电脑</small></>}</span>
    </div>
  );
}

function getScreenTransition(screenElement) {
  // 以屏幕内部作为真实桌面的起点，扣除边框，避免画面盖住显示器外壳。
  const rect = screenElement.getBoundingClientRect();
  const screenStyle = window.getComputedStyle(screenElement);
  const borderX = parseFloat(screenStyle.borderLeftWidth) || 0;
  const borderY = parseFloat(screenStyle.borderTopWidth) || 0;
  const hardwareRect = screenElement.closest('.retro-computer__hardware').getBoundingClientRect();
  const screenWidth = Math.max(1, rect.width - borderX * 2);
  const screenHeight = Math.max(1, rect.height - borderY * 2);
  // 镜头围绕屏幕中心推进，选择可覆盖整个视口的机身放大倍数。
  const cameraScale = Math.max(window.innerWidth / screenWidth, window.innerHeight / screenHeight);
  return {
    '--screen-x': `${rect.left + borderX}px`,
    '--screen-y': `${rect.top + borderY}px`,
    '--screen-width': `${screenWidth}px`,
    '--screen-height': `${screenHeight}px`,
    '--camera-origin-x': `${rect.left + rect.width / 2 - hardwareRect.left}px`,
    '--camera-origin-y': `${rect.top + rect.height / 2 - hardwareRect.top}px`,
    '--camera-offset-x': `${window.innerWidth / 2 - rect.left - rect.width / 2}px`,
    '--camera-offset-y': `${window.innerHeight / 2 - rect.top - rect.height / 2}px`,
    '--camera-scale': cameraScale,
    // 桌面保留全屏布局，用独立的横纵缩放比例贴合初始屏幕区域。
    '--desktop-start-scale-x': screenWidth / window.innerWidth,
    '--desktop-start-scale-y': screenHeight / window.innerHeight,
    '--portal-end-x': '0px',
    '--portal-end-y': '0px',
    '--portal-end-width': `${window.innerWidth}px`,
    '--portal-end-height': `${window.innerHeight}px`
  };
}

export default function RetroComputerEntrance({ poweredOff = false, retreating = false, saveFailed = false }) {
  const [entering, setEntering] = useState(false);
  const [screenBounds, setScreenBounds] = useState(null);
  const desktopExperience = useOutletContext();
  const started = useRef(false);
  const screen = useRef(null);
  const powerButton = useRef(null);

  useLayoutEffect(() => {
    // 关机拉远前同步测量，让第一帧就处于镜头推进后的近景，避免机身跳动。
    if (retreating) setScreenBounds(getScreenTransition(screen.current));
  }, [retreating]);
  useEffect(() => {
    if (poweredOff && !retreating) powerButton.current?.focus();
  }, [poweredOff, retreating]);

  function enterDesktop(screenElement) {
    // 防止连点重复启动；关机拉远期间也不能再次开机。
    if (started.current || retreating) return;
    started.current = true;
    if (!desktopExperience?.startDesktop) {
      throw new Error('Computer startup requires the DesktopExperience route.');
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      // 跳过镜头动画，仍通过共享容器加载真实桌面与恢复设置。
      desktopExperience.startDesktop(null);
      return;
    }
    const bounds = getScreenTransition(screenElement);
    setScreenBounds(bounds);
    setEntering(true);
    // 入口负责机身动画，共享父组件负责真实桌面的缩放和路由交接。
    desktopExperience.startDesktop(bounds);
  }

  return (
    <div className={`computer-entrance${entering ? ' computer-entrance--entering' : ''}`}>
      <ComputerHardware entering={entering} onEnter={enterDesktop} screenBounds={screenBounds} screen={screen} powerButton={powerButton} poweredOff={poweredOff} retreating={retreating} saveFailed={saveFailed} />
    </div>
  );
}
