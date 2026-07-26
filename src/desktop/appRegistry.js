import computerIcon from '@/assets/icons/this_computer.png';
import folderIcon from '@/assets/icons/folder_closed.png';
import internetExplorerIcon from '@/assets/icons/internet_explorer.png';
import musicIcon from '@/assets/icons/music.png';
import moviesIcon from '@/assets/icons/movies.png';
import recycleIcon from '@/assets/icons/recycle_bin_full.png';
import briefcaseIcon from '@/assets/icons/briefcase.png';
import toolsIcon from '@/assets/icons/tools.png';
import programIcon from '@/assets/icons/program.png';
import mailIcon from '@/assets/icons/mail.png';
import {
  FolderApp,
  GuestbookApp,
  InternetExplorerApp,
  MyComputerApp,
  ProfileApp,
  ProjectsApp,
  RecycleBinApp,
  SettingsApp,
  TerminalApp,
  VaporwaveRadioApp,
  VideosApp
} from './apps';

const appRegistry = [
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
    id: 'internet-explorer',
    title: 'Internet Explorer',
    icon: internetExplorerIcon,
    showOnDesktop: true,
    showInStartMenu: true,
    component: InternetExplorerApp,
    defaultPosition: { x: 112, y: 36 },
    windowSize: { height: 540, width: 760 }
  },
  {
    id: 'vaporwave-radio',
    title: 'Vaporwave Radio',
    icon: musicIcon,
    showOnDesktop: true,
    showInStartMenu: true,
    component: VaporwaveRadioApp,
    defaultPosition: { x: 168, y: 96 },
    windowSize: { height: 570, width: 720 }
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
    windowSize: { height: 560, width: 520 }
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
    windowSize: { height: 560, width: 460 }
  }
];

export default appRegistry;
