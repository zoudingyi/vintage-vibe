import React, { useState } from 'react';
import {
  Anchor,
  Button,
  Fieldset,
  Panel,
  ProgressBar,
  Tab,
  TabBody,
  Tabs
} from 'react95';
import computerIcon from '@/assets/icons/this_computer.png';
import folderIcon from '@/assets/icons/folder_closed.png';
import musicIcon from '@/assets/icons/music.png';
import moviesIcon from '@/assets/icons/movies.png';
import recycleIcon from '@/assets/icons/recycle_bin_full.png';
import briefcaseIcon from '@/assets/icons/briefcase.png';
import toolsIcon from '@/assets/icons/tools.png';
import programIcon from '@/assets/icons/program.png';
import mailIcon from '@/assets/icons/mail.png';

function MyComputerApp() {
  return (
    <div>
      <strong>System Properties</strong>
      <p>Vintage Vibe Desktop Shell</p>
      <p>React 18, react95, and a slowly booting sense of nostalgia.</p>
    </div>
  );
}

function FolderApp() {
  return (
    <div>
      <strong>My Folder</strong>
      <p>Project files will live here in the next stage.</p>
    </div>
  );
}

const profileTabs = {
  overview: {
    title: 'Overview',
    content: (
      <>
        <p>
          <strong>Frontend System</strong>
        </p>
        <p>
          Building a playful retro desktop portfolio with React, react95, and
          small system-like interactions.
        </p>
      </>
    )
  },
  skills: {
    title: 'Skills',
    content: (
      <>
        <p>React</p>
        <p>Component architecture</p>
        <p>Interactive UI systems</p>
      </>
    )
  },
  contact: {
    title: 'Contact',
    content: (
      <>
        <p>Email: 18483641399@163.com</p>
        <p>GitHub: zoudingyi</p>
      </>
    )
  }
};

const projects = [
  {
    id: 'vintage-vibe',
    name: 'Vintage Vibe',
    summary: 'react95 desktop portfolio',
    status: 'Refactor branch',
    stack: 'React, react95, styled-components',
    github: 'https://github.com/zoudingyi/vintage-vibe',
    demo: 'https://github.com/zoudingyi/vintage-vibe'
  },
  {
    id: 'retro-shell',
    name: 'Retro Shell',
    summary: 'Window manager and desktop interactions',
    status: 'In progress',
    stack: 'React state, draggable windows',
    github: 'https://github.com/zoudingyi/vintage-vibe',
    demo: 'https://github.com/zoudingyi/vintage-vibe'
  }
];

const playlist = [
  {
    title: 'Midnight Boot Sequence',
    artist: 'Vintage Vibe Radio',
    length: '02:48'
  },
  {
    title: 'Neon File Explorer',
    artist: 'Vintage Vibe Radio',
    length: '03:12'
  },
  {
    title: 'Shutdown Chime',
    artist: 'Vintage Vibe Radio',
    length: '01:44'
  }
];

const guestbookStorageKey = 'vintage-vibe-guestbook';

function loadGuestbookEntries() {
  try {
    return JSON.parse(window.localStorage.getItem(guestbookStorageKey)) || [];
  } catch (error) {
    return [];
  }
}

function MediaPlayerApp() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const currentTrack = playlist[currentTrackIndex];

  function nextTrack() {
    setCurrentTrackIndex(index => (index + 1) % playlist.length);
  }

  function previousTrack() {
    setCurrentTrackIndex(index =>
      index === 0 ? playlist.length - 1 : index - 1
    );
  }

  return (
    <div className="media-player-app">
      <Panel variant="well" className="media-player-display">
        <p>Now Playing</p>
        <strong>{currentTrack.title}</strong>
        <p>
          {currentTrack.artist} - {currentTrack.length}
        </p>
        <p>{playing ? 'Playing' : 'Paused'}</p>
      </Panel>
      <ProgressBar value={playing ? 42 : 12} />
      <div className="media-player-controls">
        <Button onClick={previousTrack} aria-label="Previous track">
          Prev
        </Button>
        <Button
          aria-label={playing ? 'Pause track' : 'Play track'}
          onClick={() => setPlaying(value => !value)}
        >
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={nextTrack} aria-label="Next track">
          Next
        </Button>
      </div>
      <Fieldset label="Playlist">
        {playlist.map((track, index) => (
          <button
            className="media-player-track"
            onClick={() => setCurrentTrackIndex(index)}
            key={track.title}
          >
            {index + 1}. {track.title}
          </button>
        ))}
      </Fieldset>
    </div>
  );
}

function VideosApp() {
  return (
    <div>
      <strong>My Videos</strong>
      <p>Retro clips and demos will be indexed here.</p>
    </div>
  );
}

function RecycleBinApp() {
  return (
    <div>
      <strong>Recycle Bin</strong>
      <p>No deleted memories yet.</p>
    </div>
  );
}

function ProfileApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const selectedTab = profileTabs[activeTab];

  return (
    <div className="profile-app">
      <Tabs value={activeTab} onChange={setActiveTab}>
        {Object.entries(profileTabs).map(([value, tab]) => (
          <Tab value={value} key={value}>
            {tab.title}
          </Tab>
        ))}
      </Tabs>
      <TabBody>
        <Fieldset label={selectedTab.title}>{selectedTab.content}</Fieldset>
      </TabBody>
    </div>
  );
}

function ProjectsApp() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const selectedProject = projects.find(item => item.id === selectedProjectId);

  return (
    <div className="projects-app">
      <Panel variant="well" className="projects-sidebar">
        <strong>Projects Explorer</strong>
        {projects.map(project => (
          <Button
            fullWidth
            onClick={() => setSelectedProjectId(project.id)}
            active={selectedProjectId === project.id}
            key={project.id}
          >
            {project.name}
          </Button>
        ))}
      </Panel>
      <Fieldset label={selectedProject.name} className="projects-detail">
        <p>{selectedProject.summary}</p>
        <p>Status: {selectedProject.status}</p>
        <p>Stack: {selectedProject.stack}</p>
        <div className="projects-links">
          <Anchor
            href={selectedProject.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            Project GitHub
          </Anchor>
          <Anchor
            href={selectedProject.demo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo
          </Anchor>
        </div>
      </Fieldset>
    </div>
  );
}

function ChoiceButton({ active, children, onClick }) {
  return (
    <Button active={active ? true : undefined} onClick={onClick}>
      {children}
    </Button>
  );
}

function SettingsApp({
  desktopSettings,
  onArrangeDesktopIcons,
  onDesktopSettingsChange,
  onResetDesktopSettings
}) {
  return (
    <div className="settings-app">
      <strong>Settings</strong>
      <Fieldset label="Wallpaper">
        <div className="settings-choice-row">
          <ChoiceButton
            active={desktopSettings.wallpaper === 'teal'}
            onClick={() => onDesktopSettingsChange({ wallpaper: 'teal' })}
          >
            Teal Grid
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.wallpaper === 'starfield'}
            onClick={() => onDesktopSettingsChange({ wallpaper: 'starfield' })}
          >
            Starfield
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.wallpaper === 'sunset'}
            onClick={() => onDesktopSettingsChange({ wallpaper: 'sunset' })}
          >
            Sunset
          </ChoiceButton>
        </div>
      </Fieldset>
      <Fieldset label="Accent">
        <div className="settings-choice-row">
          <ChoiceButton
            active={desktopSettings.accent === 'purple'}
            onClick={() => onDesktopSettingsChange({ accent: 'purple' })}
          >
            Purple
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.accent === 'green'}
            onClick={() => onDesktopSettingsChange({ accent: 'green' })}
          >
            CRT Green
          </ChoiceButton>
          <ChoiceButton
            active={desktopSettings.accent === 'amber'}
            onClick={() => onDesktopSettingsChange({ accent: 'amber' })}
          >
            Amber
          </ChoiceButton>
        </div>
      </Fieldset>
      <Fieldset label="Desktop">
        <label className="settings-checkbox">
          <input
            checked={desktopSettings.scanlines}
            onChange={event =>
              onDesktopSettingsChange({ scanlines: event.target.checked })
            }
            type="checkbox"
          />
          Scanlines
        </label>
        <div className="settings-choice-row">
          <Button onClick={onArrangeDesktopIcons}>Arrange Icons</Button>
          <Button onClick={onResetDesktopSettings}>Reset</Button>
        </div>
      </Fieldset>
    </div>
  );
}

function TerminalApp({ onDesktopSettingsChange, onOpenApp }) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([
    'Vintage Vibe Terminal [Version 0.95]',
    'Type help for available commands.'
  ]);

  function runCommand(event) {
    event.preventDefault();

    const normalizedCommand = command.trim().toLowerCase();

    if (!normalizedCommand) {
      return;
    }

    if (normalizedCommand === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    }

    const output = getTerminalOutput(normalizedCommand);
    setHistory(currentHistory => [
      ...currentHistory,
      `C:\\VIBE> ${command}`,
      output
    ]);
    setCommand('');
  }

  function getTerminalOutput(normalizedCommand) {
    if (normalizedCommand === 'help') {
      return 'Commands: about, projects, contact, theme green, theme amber, theme purple, clear, rosebud';
    }

    if (normalizedCommand === 'about') {
      return 'Vintage Vibe is a playable retro desktop portfolio shell built with React and react95.';
    }

    if (normalizedCommand === 'projects') {
      onOpenApp('projects');
      return 'Opening Projects Explorer...';
    }

    if (normalizedCommand === 'contact') {
      return 'Email: 18483641399@163.com | GitHub: zoudingyi';
    }

    if (normalizedCommand.startsWith('theme ')) {
      const accent = normalizedCommand.replace('theme ', '');

      if (['green', 'amber', 'purple'].includes(accent)) {
        onDesktopSettingsChange({ accent });
        return `Theme accent set to ${accent}.`;
      }
    }

    if (normalizedCommand === 'rosebud') {
      return 'Secret unlocked: infinite nostalgia credits.';
    }

    return `Bad command or file name: ${command}`;
  }

  return (
    <div className="terminal-app">
      <strong>Terminal</strong>
      <div className="terminal-output" aria-label="Terminal output">
        {history.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form className="terminal-form" onSubmit={runCommand}>
        <span>C:\VIBE&gt;</span>
        <input
          aria-label="Terminal command"
          onChange={event => setCommand(event.target.value)}
          value={command}
        />
        <Button type="submit">Run</Button>
      </form>
    </div>
  );
}

function GuestbookApp() {
  const [entries, setEntries] = useState(loadGuestbookEntries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function saveEntries(nextEntries) {
    setEntries(nextEntries);
    window.localStorage.setItem(
      guestbookStorageKey,
      JSON.stringify(nextEntries)
    );
  }

  function submitEntry(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      return;
    }

    saveEntries([
      {
        id: Date.now(),
        name: trimmedName,
        message: trimmedMessage
      },
      ...entries
    ]);
    setName('');
    setMessage('');
  }

  return (
    <div className="guestbook-app">
      <strong>Guestbook</strong>
      <form className="guestbook-form" onSubmit={submitEntry}>
        <label>
          Name
          <input
            aria-label="Guestbook name"
            onChange={event => setName(event.target.value)}
            value={name}
          />
        </label>
        <label>
          Message
          <textarea
            aria-label="Guestbook message"
            onChange={event => setMessage(event.target.value)}
            value={message}
          />
        </label>
        <Button type="submit">Sign Guestbook</Button>
      </form>
      <div className="guestbook-entries">
        {entries.length === 0 ? (
          <p>No signatures yet.</p>
        ) : (
          entries.map(entry => (
            <Panel variant="well" key={entry.id}>
              <strong>{entry.name}</strong>
              <p>{entry.message}</p>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}

const desktopApps = [
  {
    id: 'my-computer',
    title: 'My Computer',
    icon: computerIcon,
    showOnDesktop: true,
    showInStartMenu: false,
    component: MyComputerApp,
    defaultPosition: { x: 96, y: 32 },
    windowSize: { width: 420 }
  },
  {
    id: 'my-folder',
    title: 'My Folder',
    icon: folderIcon,
    showOnDesktop: true,
    showInStartMenu: false,
    component: FolderApp,
    defaultPosition: { x: 132, y: 64 },
    windowSize: { width: 420 }
  },
  {
    id: 'media-player',
    title: 'Media Player',
    icon: musicIcon,
    showOnDesktop: true,
    showInStartMenu: true,
    component: MediaPlayerApp,
    defaultPosition: { x: 168, y: 96 },
    windowSize: { width: 420 }
  },
  {
    id: 'my-videos',
    title: 'My Videos',
    icon: moviesIcon,
    showOnDesktop: true,
    showInStartMenu: false,
    component: VideosApp,
    defaultPosition: { x: 204, y: 128 },
    windowSize: { width: 420 }
  },
  {
    id: 'recycle-bin',
    title: 'Recycle Bin',
    icon: recycleIcon,
    showOnDesktop: true,
    showInStartMenu: false,
    component: RecycleBinApp,
    defaultPosition: { x: 240, y: 160 },
    windowSize: { width: 360 }
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: briefcaseIcon,
    showOnDesktop: false,
    showInStartMenu: true,
    component: ProfileApp,
    defaultPosition: { x: 120, y: 48 },
    windowSize: { width: 460 }
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: folderIcon,
    showOnDesktop: false,
    showInStartMenu: true,
    component: ProjectsApp,
    defaultPosition: { x: 144, y: 72 },
    windowSize: { width: 520 }
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: toolsIcon,
    showOnDesktop: false,
    showInStartMenu: true,
    component: SettingsApp,
    defaultPosition: { x: 168, y: 96 },
    windowSize: { width: 420 }
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: programIcon,
    showOnDesktop: false,
    showInStartMenu: true,
    component: TerminalApp,
    defaultPosition: { x: 192, y: 120 },
    windowSize: { width: 520 }
  },
  {
    id: 'guestbook',
    title: 'Guestbook',
    icon: mailIcon,
    showOnDesktop: false,
    showInStartMenu: true,
    component: GuestbookApp,
    defaultPosition: { x: 216, y: 144 },
    windowSize: { width: 460 }
  }
];

export default desktopApps;
