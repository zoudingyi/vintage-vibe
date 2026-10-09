import React from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import Home from '@/views/home';
import { loadDesktopData } from './desktopStorage';
import './DesktopExperience.css';

export default function DesktopExperience() {
  const navigate = useNavigate();
  const desktopRoute = useMatch('/home') !== null;
  const [desktopData, setDesktopData] = React.useState(() =>
    desktopRoute ? loadDesktopData() : null
  );
  const [screenBounds, setScreenBounds] = React.useState(null);
  const bootActive = React.useRef(false);
  const booting = !desktopRoute && screenBounds !== null;

  const finishBoot = React.useCallback(() => {
    // 动画结束事件与兜底定时器都可能触发，只允许完成一次路由交接。
    if (!bootActive.current) return;
    bootActive.current = false;
    // 此处保留 screenBounds，直到 /home 生效，避免异步导航期间卸载桌面。
    navigate('/home');
  }, [navigate]);

  function startDesktop(bounds) {
    if (bootActive.current) return;
    // 每次开机重新读取保存结果，动画中的桌面与最终桌面使用同一份数据。
    setDesktopData(loadDesktopData());
    if (!bounds) {
      // 减少动态效果模式跳过缩放，直接进入桌面。
      navigate('/home');
      return;
    }
    bootActive.current = true;
    setScreenBounds(bounds);
  }

  React.useEffect(() => {
    // 路由已接管桌面后，才清除动画几何参数并恢复交互。
    if (desktopRoute) setScreenBounds(null);
  }, [desktopRoute]);

  React.useEffect(() => {
    if (!booting) return undefined;
    // 小屏幕启动与停留 2050ms、镜头推进 750ms；事件丢失时多留 200ms 再兜底。
    const timer = window.setTimeout(finishBoot, 3000);
    return () => window.clearTimeout(timer);
  }, [booting, finishBoot]);

  return (
    <>
      <Outlet context={{ startDesktop }} />
      {/* 开机与桌面路由之间保持此分支挂载，保留窗口、应用和 Provider 状态。
          开机期间用 inert 禁止操作，并暂时从辅助技术中隐藏桌面。 */}
      {(desktopRoute || booting) && (
        <div
          className={`desktop-route-surface${booting ? ' retro-computer-portal' : ''}`}
          style={booting ? screenBounds : undefined}
          aria-hidden={booting ? true : undefined}
          {...(booting ? { inert: '' } : {})}
          onAnimationEnd={event => {
            // 忽略子元素冒泡的动画事件，只响应外层显示区域扩展结束。
            if (event.target === event.currentTarget && event.animationName === 'retro-computer-enter') {
              finishBoot();
            }
          }}
        >
          <div className="desktop-route-content">
            <Home initialDesktopData={desktopData} booting={booting} />
          </div>
        </div>
      )}
    </>
  );
}
