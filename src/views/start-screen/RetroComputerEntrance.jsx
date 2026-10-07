import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import computerIcon from '@/assets/icons/this_computer.png';
import folderIcon from '@/assets/icons/folder_closed.png';
import explorerIcon from '@/assets/icons/internet_explorer.png';
import { loadDesktopData } from '@/desktop/desktopStorage';
import { getDesktopThemeOption } from '@/desktop/themeRegistry';
import '@/desktop/DesktopWallpaper.css';
import './RetroComputerEntrance.css';

function DesktopPicture({ desktopPreview }) {
  const { settings, viewportWidth, viewportHeight } = desktopPreview;
  const desktopTheme = getDesktopThemeOption(settings.react95Theme).theme;

  return (
    <svg className="retro-computer__desktop-picture" viewBox="0 0 1280 800" preserveAspectRatio="none" aria-hidden="true">
      <foreignObject x="0" y="0" width="1280" height="800">
        <div className={`retro-computer__wallpaper desktop-wallpaper-${settings.wallpaper}`}
          style={{
            width: viewportWidth,
            height: viewportHeight,
            transform: `scale(${1280 / viewportWidth}, ${800 / viewportHeight})`,
            '--desktop-accent': desktopTheme.borderLightest,
            '--desktop-accent-dark': desktopTheme.borderDark
          }} />
      </foreignObject>
      <image href={computerIcon} x="40" y="36" width="40" height="40" /><text x="60" y="98" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="14">My Computer</text>
      <image href={folderIcon} x="40" y="145" width="40" height="40" /><text x="60" y="207" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="14">My Folder</text>
      <image href={explorerIcon} x="40" y="255" width="40" height="40" /><text x="60" y="317" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="14">Internet Explorer</text>
      <g>
        <path fill="#003c4260" d="M276 156H1096V646H276Z" />
        <path fill="#d8cbd7" stroke="#f5e9f2" strokeWidth="3" d="M260 140H1080V630H260Z" />
        <path fill="#a263ab" d="M266 146H1074V180H266Z" />
        <text x="283" y="170" fill="white" fontFamily="Arial" fontSize="17" fontWeight="bold">Vintage Vibe · Personal World</text>
        <path fill="#ece0e8" d="M1039 152H1065V175H1039Z" /><path d="M1046 158L1058 170M1058 158L1046 170" stroke="#4b334e" strokeWidth="2" />
        <path fill="#f7eddc" d="M272 190H1068V615H272Z" />
        <text x="670" y="292" fill="#916b8e" textAnchor="middle" fontFamily="monospace" fontSize="15" letterSpacing="5">WELCOME TO YOUR PERSONAL WORLD</text>
        <text x="670" y="407" fill="#624068" textAnchor="middle" fontFamily="Georgia" fontSize="76" fontStyle="italic">Vintage Vibe.</text>
        <text x="670" y="465" fill="#896781" textAnchor="middle" fontFamily="Arial" fontSize="20">あの頃の未来へ、ようこそ。</text>
        <path d="M582 514H758" stroke="#c09aa9" /><text x="670" y="551" fill="#9a7a88" textAnchor="middle" fontFamily="monospace" fontSize="13">SYSTEM READY · VIBE/95</text>
      </g>
      <path fill="#ded0dc" stroke="#f8edf5" strokeWidth="3" d="M0 757H1280V800H0Z" />
      <path fill="#e9deeb" stroke="#87738a" d="M8 764H95V793H8Z" /><text x="33" y="785" fill="#4a3550" fontFamily="Arial" fontSize="17" fontWeight="bold">Start</text>
      <path fill="#c5b1c7" stroke="#8e7992" d="M106 764H313V793H106Z" /><text x="119" y="784" fill="#4a3550" fontFamily="Arial" fontSize="14">Vintage Vibe</text>
      <text x="1235" y="784" fill="#4a3550" textAnchor="end" fontFamily="monospace" fontSize="15">12:00</text>
    </svg>
  );
}

function ComputerHardware({ entering, onEnter, screenBounds, desktopPreview }) {
  const screen = useRef(null);
  return (
    <div className={`retro-computer${entering ? ' retro-computer--booting' : ''}`} style={screenBounds}>
      <div className="retro-computer__hardware">
        <div className="retro-computer__monitor">
          <span className="retro-computer__color-mark" aria-hidden="true"><i /><i /><i /></span>
          <button className="retro-computer__screen" ref={screen} disabled={entering} onClick={() => onEnter(screen.current)} aria-label="启动复古电脑，进入桌面">
            <span className="retro-computer__picture" aria-hidden="true" />
            {entering && <span className="retro-computer__connected-desktop"><DesktopPicture desktopPreview={desktopPreview} /></span>}
            <span className="retro-computer__static" aria-hidden="true" />
            <span className="retro-computer__scanlines" aria-hidden="true" />
            {entering && <span className="retro-computer__osd" aria-hidden="true">SYSTEM READY</span>}
          </button>
          <div className="retro-computer__monitor-trim">
            <span className="retro-computer__brand" aria-hidden="true">VIBE SYSTEMS<small>VC-88 · COLOR DISPLAY</small></span>
            <div className="retro-computer__controls">
              <span className="retro-computer__monitor-controls" aria-hidden="true"><i /><i /><b /></span>
              <button className="retro-computer__power-button" onClick={() => onEnter(screen.current)} disabled={entering} aria-label="按下电源键，进入桌面"><span aria-hidden="true">⏻</span></button>
            </div>
          </div>
        </div>
        <div className="retro-computer__stand" aria-hidden="true" />
      </div>
      <span className="computer-entrance__instruction" role="status">{entering ? 'VIBE/95 · SYSTEM READY' : <><span lang="ja">起動する <span lang="en">/ START YOUR WORLD</span></span><small>点击屏幕或电源键，启动电脑</small></>}</span>
    </div>
  );
}

export default function RetroComputerEntrance() {
  const [entering, setEntering] = useState(false);
  const [screenBounds, setScreenBounds] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const navigate = useNavigate();
  const timer = useRef(null);
  const started = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function enterDesktop(screenElement) {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/home');
      return;
    }
    setDesktopPreview({
      settings: loadDesktopData().settings,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    });
    const rect = screenElement.getBoundingClientRect();
    const screenStyle = window.getComputedStyle(screenElement);
    const borderX = parseFloat(screenStyle.borderLeftWidth);
    const borderY = parseFloat(screenStyle.borderTopWidth);
    const hardwareRect = screenElement.closest('.retro-computer__hardware').getBoundingClientRect();
    const screenWidth = rect.width - borderX * 2;
    const screenHeight = rect.height - borderY * 2;
    const cameraScale = Math.max(window.innerWidth / screenWidth, window.innerHeight / screenHeight);
    setScreenBounds({
      '--screen-x': `${rect.left + borderX}px`,
      '--screen-y': `${rect.top + borderY}px`,
      '--screen-width': `${screenWidth}px`,
      '--screen-height': `${screenHeight}px`,
      '--camera-origin-x': `${rect.left + rect.width / 2 - hardwareRect.left}px`,
      '--camera-origin-y': `${rect.top + rect.height / 2 - hardwareRect.top}px`,
      '--camera-offset-x': `${window.innerWidth / 2 - rect.left - rect.width / 2}px`,
      '--camera-offset-y': `${window.innerHeight / 2 - rect.top - rect.height / 2}px`,
      '--camera-scale': cameraScale,
      '--portal-end-x': `${(window.innerWidth - screenWidth * cameraScale) / 2}px`,
      '--portal-end-y': `${(window.innerHeight - screenHeight * cameraScale) / 2}px`,
      '--portal-end-width': `${screenWidth * cameraScale}px`,
      '--portal-end-height': `${screenHeight * cameraScale}px`
    });
    setEntering(true);
    timer.current = window.setTimeout(() => navigate('/home'), 1000);
  }

  return (
    <div className={`computer-entrance${entering ? ' computer-entrance--entering' : ''}`}>
      <ComputerHardware entering={entering} onEnter={enterDesktop} screenBounds={screenBounds} desktopPreview={desktopPreview} />
      {entering && createPortal(
        <div className="retro-computer-portal" style={screenBounds} aria-hidden="true"><DesktopPicture desktopPreview={desktopPreview} /></div>,
        document.body
      )}
    </div>
  );
}
