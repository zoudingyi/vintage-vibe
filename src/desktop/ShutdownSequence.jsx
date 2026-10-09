import React from 'react';
import { useNavigate } from 'react-router-dom';
import StartScreen from '@/views/start-screen';
import './ShutdownSequence.css';

export default function ShutdownSequence({ reducedMotion, saveFailed, onScreenOff }) {
  const navigate = useNavigate();
  const [retreating, setRetreating] = React.useState(false);
  const statusRef = React.useRef(null);

  React.useEffect(() => {
    // 将焦点交给关机提示，桌面此时已锁定，避免继续操作后台窗口。
    statusRef.current?.focus();
    // 第一阶段 1300ms：先停留 300ms，再用原来的 1000ms 完成 CRT 收束。
    // 收束结束后才卸载桌面应用并开始机身拉远，与 CSS 的动画延迟保持一致。
    const screenTimer = reducedMotion ? null : window.setTimeout(() => {
      onScreenOff();
      setRetreating(true);
    }, 1300);
    // 第二阶段 800ms：显露首页环境；总计 2100ms 后才交接路由。
    // 减少动态效果模式只淡出 180ms，时间须与 ShutdownSequence.css 保持一致。
    const finishTimer = window.setTimeout(() => {
      navigate('/', { replace: true, state: { poweredOff: true, saveFailed } });
    }, reducedMotion ? 180 : 2100);

    return () => {
      window.clearTimeout(screenTimer);
      window.clearTimeout(finishTimer);
    };
  }, [navigate, onScreenOff, reducedMotion, saveFailed]);

  return (
    <div className={`shutdown-sequence${retreating ? ' shutdown-sequence--retreating' : ''}`}>
      {/* 先在关机覆盖层中显示断电首页，再切换路由，避免拉远结束时出现空白帧。
          poweredOff/saveFailed 会随路由 state 延续到正式首页。 */}
      {retreating ? <StartScreen poweredOff retreating saveFailed={saveFailed} /> : (
        <>
          <div className="shutdown-sequence__message" role="status" tabIndex={-1} ref={statusRef}>
            <span className="shutdown-sequence__eyebrow">VIBE SYSTEMS · SESSION END</span>
            <p>VIBE/95 is shutting down…</p>
            {saveFailed && <small>无法保存桌面设置，重新启动可能无法恢复本次更改。</small>}
          </div>
          <div className="shutdown-sequence__afterglow" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
