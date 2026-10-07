import React from 'react';
import { Button, GroupBox } from 'react95';
import PageHeader from '../PageHeader';

const helpDestinations = [
  {
    action: 'open',
    description: '收听精选广播，并体验三种播放器外观。',
    id: 'radio',
    label: 'Vaporwave Radio / 蒸汽波电台',
    target: 'vaporwave-radio'
  },
  {
    action: 'navigate',
    description: '浏览塑造个人审美的专辑与歌曲收藏。',
    id: 'records',
    label: 'Favorite Records / 私藏唱片',
    target: 'vintage://favorites'
  },
  {
    action: 'navigate',
    description: '在仅保存在当前浏览器的访客记录中留言。',
    id: 'guestbook',
    label: 'Guestbook / 留言簿',
    target: 'vintage://guestbook'
  },
  {
    action: 'open',
    description: '运行命令、切换主题，并寻找隐藏信号。',
    id: 'terminal',
    label: 'Terminal / 终端',
    target: 'terminal'
  }
];

function ShortcutKeys({ mac, windows }) {
  return (
    <span className="vapornet-help-shortcut-keys">
      <span>
        <small>WIN/LINUX</small>
        <kbd>{windows}</kbd>
      </span>
      {mac && (
        <span>
          <small>MAC</small>
          <kbd>{mac}</kbd>
        </span>
      )}
    </span>
  );
}

export default function HelpPage({ onNavigate, onOpenApp }) {
  return (
    <article className="vapornet-page vapornet-help-page">
      <PageHeader
        eyebrow="VISITOR GUIDE / 訪客指南 // NODE 88.7"
        title="WELCOME TO VINTAGE VIBE / 歡迎光臨"
      >
        <p>
          这是一个交互式复古桌面作品集。打开应用、探索项目、收听电台、定制系统，
          也别忘了寻找隐藏信号。
        </p>
      </PageHeader>

      <div className="vapornet-help-layout">
        <GroupBox
          className="vapornet-help-section is-wide"
          label="Quick Start / 快速開始"
        >
          <ol className="vapornet-help-steps">
            <li>
              <strong>打开应用。</strong>双击桌面图标；在紧凑窗口或触控设备上，
              单击即可打开。
            </li>
            <li>
              <strong>管理窗口。</strong>拖动标题栏移动窗口，拖动边缘调整尺寸，
              也可以使用最小化、最大化和关闭按钮。
            </li>
            <li>
              <strong>寻找更多工具。</strong>打开 <strong>Start</strong> 菜单即可找到{' '}
              <strong>Profile</strong>、<strong>Projects</strong>、
              <strong>Settings</strong>、<strong>Terminal</strong> 和{' '}
              <strong>Guestbook</strong>。
            </li>
            <li>
              <strong>整理桌面。</strong>右键单击桌面，可以层叠或平铺窗口、
              显示桌面，或者打开 <strong>Personalize</strong>。
            </li>
          </ol>
          <div className="vapornet-help-actions">
            <Button onClick={() => onOpenApp('settings')}>
              Open Settings / 打开设置
            </Button>
          </div>
        </GroupBox>

        <GroupBox
          className="vapornet-help-section is-wide"
          label="Things to Explore / 值得探索"
        >
          <div className="vapornet-help-destinations">
            {helpDestinations.map(destination => (
              <button
                className="vapornet-directory-card"
                key={destination.id}
                onClick={() => {
                  if (destination.action === 'navigate') {
                    onNavigate(destination.target);
                    return;
                  }

                  onOpenApp(destination.target);
                }}
                type="button"
              >
                <strong>{destination.label}</strong>
                <span>{destination.description}</span>
              </button>
            ))}
          </div>
        </GroupBox>

        <GroupBox
          className="vapornet-help-section"
          label="Using VaporNet / 使用 VaporNet"
        >
          <ul>
            <li>
              输入 <code>vintage://projects</code> 等完整地址，或直接输入{' '}
              <code>projects</code> 等页面简称。
            </li>
            <li>
              输入普通关键词会打开 <strong>VaporNet Search</strong>。{' '}
              <strong>Back</strong>、<strong>Forward</strong>、
              <strong>Home</strong> 和 <strong>Refresh</strong>{' '}
              的用法与普通浏览器相同。
            </li>
            <li>
              使用 <strong>Favorites → Add Current Page</strong>{' '}
              收藏当前内部页面。
            </li>
            <li>
              HTTPS 和邮件链接会先显示确认页，再交给系统浏览器打开；
              不支持的协议会被拦截。
            </li>
          </ul>
          <p className="vapornet-help-addresses">
            <strong>Local Pages / 本地页面：</strong>{' '}
            <code>
              home · about · projects · radio · favorites · guestbook · links ·
              search · help
            </code>
          </p>
        </GroupBox>

        <GroupBox
          className="vapornet-help-section"
          label="Keyboard Shortcuts / 鍵盤快速鍵"
        >
          <div className="vapornet-help-shortcuts">
            <section aria-labelledby="desktop-shortcuts-heading">
              <h2 id="desktop-shortcuts-heading">Desktop / 桌面</h2>
              <dl>
                <div>
                  <dt>
                    <ShortcutKeys mac="⌃ Esc" windows="Ctrl + Esc" />
                  </dt>
                  <dd>打开或关闭 Start 菜单</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys windows="Alt + Tab" />
                  </dt>
                  <dd>切换可见窗口</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys windows="Shift + Alt + Tab" />
                  </dt>
                  <dd>反向切换窗口</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys windows="Alt + F4" />
                  </dt>
                  <dd>关闭活动窗口</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys
                      mac="Return / Space"
                      windows="Enter / Space"
                    />
                  </dt>
                  <dd>打开当前聚焦的图标</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys mac="← ↑ ↓ →" windows="Arrow keys" />
                  </dt>
                  <dd>在图标或菜单项之间移动</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys mac="Esc" windows="Esc" />
                  </dt>
                  <dd>关闭已打开的菜单</dd>
                </div>
              </dl>
            </section>
            <section aria-labelledby="browser-shortcuts-heading">
              <h2 id="browser-shortcuts-heading">VaporNet / 瀏覽器</h2>
              <dl>
                <div>
                  <dt>
                    <ShortcutKeys windows="Ctrl + L" />
                  </dt>
                  <dd>聚焦并选中地址栏</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys windows="Alt + Left" />
                  </dt>
                  <dd>返回上一页</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys windows="Alt + Right" />
                  </dt>
                  <dd>前往下一页</dd>
                </div>
                <div>
                  <dt>
                    <ShortcutKeys windows="F5" />
                  </dt>
                  <dd>刷新当前页面</dd>
                </div>
              </dl>
            </section>
            <p className="vapornet-help-shortcut-note">
              这里只显示当前可确认有效的 Mac 键位。未显示 <strong>MAC</strong>{' '}
              行的组合键可能被 macOS 或浏览器接管，因此不作为可用快捷键提供。
            </p>
          </div>
        </GroupBox>

        <GroupBox
          className="vapornet-help-section"
          label="Local Data & Privacy / 本機資料與隱私"
        >
          <ul>
            <li>
              桌面设置、可恢复的窗口会话、浏览历史和收藏夹都保存在当前浏览器中。
            </li>
            <li>
              <strong>Guestbook</strong>{' '}
              留言使用独立的本地访客记录，不会提交到远程服务。
            </li>
            <li>
              在 <strong>Settings → System</strong>{' '}
              中可以清除已保存的窗口会话或重置偏好设置。
            </li>
            <li>
              外部网站不会嵌入 VaporNet；确认后的链接将在新标签页中打开。
            </li>
          </ul>
        </GroupBox>

        <GroupBox
          className="vapornet-help-section"
          label="Troubleshooting / 故障排除"
        >
          <ul className="vapornet-help-troubleshooting">
            <li>
              <strong>没有声音？</strong>先与桌面交互，再检查{' '}
              <strong>Settings → Audio</strong> 和系统音量。
            </li>
            <li>
              <strong>找不到窗口？</strong>使用对应的任务栏按钮、{' '}
              <strong>Alt + Tab</strong>，或桌面菜单中的{' '}
              <strong>Show Desktop</strong>。
            </li>
            <li>
              <strong>界面太拥挤？</strong>最大化活动窗口；在紧凑屏幕上，
              桌面会自动切换为单窗口导航。
            </li>
            <li>
              <strong>设置出现异常？</strong>前往{' '}
              <strong>Settings → System</strong>，仅重置受影响的偏好设置。
            </li>
          </ul>
        </GroupBox>
      </div>

      <footer className="vapornet-help-footer">
        <strong>VaporNet Help System 1999</strong>
        <span>本機網路連線中</span>
        <span>文件版本 1.0</span>
      </footer>
    </article>
  );
}
