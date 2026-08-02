import { projects } from '../data';

export const BROWSER_STORAGE_KEY = 'vintage-vibe-browser-state';
export const BROWSER_STORAGE_VERSION = 1;
export const HOME_ADDRESS = 'vintage://home';

export const browserPages = {
  about: {
    address: 'vintage://about',
    description: 'A personal control room for interests and after-hours life.',
    keywords:
      'about personal interests motorcycle yamaha r3 motogp marquez dota eva cats chengdu',
    title: 'About Me'
  },
  favorites: {
    address: 'vintage://favorites',
    description: 'Core albums and defining tracks from a personal playlist.',
    keywords:
      'favorites records vinyl albums tracks playlist city pop aor boogie collection shelf catalogue',
    title: 'Favorite Records'
  },
  guestbook: {
    address: 'vintage://guestbook',
    description: 'Sign and browse the local VaporNet visitor log.',
    keywords: 'guestbook message sign visitor local transmission log',
    title: 'Guestbook'
  },
  help: {
    address: 'vintage://help',
    description: 'Vintage Vibe 桌面、应用和 VaporNet 使用指南。',
    keywords:
      'help guide quick start desktop apps browser address security privacy shortcuts troubleshooting 帮助 指南 快速开始 桌面 应用 浏览器 地址 安全 隐私 快捷键 故障排查',
    title: 'VaporNet Help / 使用帮助'
  },
  home: {
    address: HOME_ADDRESS,
    description: 'The home gateway for the Vintage Vibe desktop.',
    keywords: 'home portal desktop vapornet internet explorer',
    title: 'VaporNet Home'
  },
  links: {
    address: 'vintage://links',
    description: 'A directory of external destinations.',
    keywords: 'links github email external cool sites',
    title: 'Cool Links'
  },
  projects: {
    address: 'vintage://projects',
    description: 'Interactive frontend projects and system experiments.',
    keywords: 'projects react portfolio code demos archive',
    title: 'Project Archive'
  },
  radio: {
    address: 'vintage://radio',
    description: 'Tune in to the broadcast and browse curated radio selections.',
    keywords:
      'radio music vaporwave audio station broadcast cassette curator city pop future funk',
    title: 'Radio Station'
  },
  search: {
    address: 'vintage://search',
    description: 'Search local VaporNet pages and projects.',
    keywords: 'search find directory',
    title: 'VaporNet Search'
  }
};

export const defaultFavorites = [
  browserPages.home,
  browserPages.projects,
  browserPages.radio,
  browserPages.guestbook
].map(({ address, title }) => ({ address, title }));

const internalAliases = new Set(Object.keys(browserPages));
const maximumHistoryEntries = 50;
const maximumFavorites = 20;

function createSearchAddress(query) {
  return `vintage://search?q=${encodeURIComponent(query.trim())}`;
}

function normalizeInternalAddress(address) {
  const match = address.match(/^vintage:\/\/([^/?#]*)(.*)$/i);

  if (!match) {
    return null;
  }

  const pageId = (match[1] || 'home').toLowerCase();
  return `vintage://${pageId}${match[2] || ''}`;
}

export function resolveBrowserAddress(value) {
  const address = String(value || '').trim();

  if (!address) {
    return { address: HOME_ADDRESS, kind: 'internal' };
  }

  const internalAddress = normalizeInternalAddress(address);
  if (internalAddress) {
    return { address: internalAddress, kind: 'internal' };
  }

  if (/^https:\/\//i.test(address) || /^mailto:/i.test(address)) {
    try {
      const parsedAddress = new URL(address);

      if (!['https:', 'mailto:'].includes(parsedAddress.protocol)) {
        throw new TypeError('Unsupported external protocol.');
      }

      return { address, kind: 'external' };
    } catch (error) {
      return {
        kind: 'blocked',
        reason: 'VaporNet could not understand that address.'
      };
    }
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(address) || /^http:\/\//i.test(address)) {
    return {
      kind: 'blocked',
      reason: 'VaporNet blocked an unsafe or unsupported address.'
    };
  }

  const alias = address.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (internalAliases.has(alias)) {
    return { address: `vintage://${alias}`, kind: 'internal' };
  }

  return { address: createSearchAddress(address), kind: 'internal' };
}

export function getAddressKind(address) {
  return normalizeInternalAddress(address) ? 'internal' : 'external';
}

export function getInternalPageId(address) {
  return normalizeInternalAddress(address)?.match(/^vintage:\/\/([^/?#]+)/)?.[1] || null;
}

export function getAddressTitle(address) {
  const pageId = getInternalPageId(address);

  if (pageId) {
    return browserPages[pageId]?.title || 'VaporNet 404';
  }

  return 'External Link';
}

export function getSearchQuery(address) {
  if (getInternalPageId(address) !== 'search') {
    return '';
  }

  const queryIndex = address.indexOf('?');
  if (queryIndex === -1) {
    return '';
  }

  return new URLSearchParams(address.slice(queryIndex + 1)).get('q') || '';
}

export function searchVaporNet(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const pageResults = Object.values(browserPages)
    .filter(page => page.address !== 'vintage://search')
    .filter(page =>
      `${page.title} ${page.description} ${page.keywords}`
        .toLowerCase()
        .includes(normalizedQuery)
    )
    .map(page => ({
      address: page.address,
      description: page.description,
      id: `page-${page.address}`,
      kind: 'page',
      title: page.title
    }));

  const projectResults = projects
    .filter(project =>
      `${project.name} ${project.summary} ${project.status} ${project.stack}`
        .toLowerCase()
        .includes(normalizedQuery)
    )
    .map(project => ({
      address: `vintage://projects?project=${encodeURIComponent(project.id)}`,
      description: `${project.summary} · ${project.stack}`,
      id: `project-${project.id}`,
      kind: 'project',
      title: project.name
    }));

  return [...pageResults, ...projectResults];
}

function sanitizeEntries(entries) {
  if (!Array.isArray(entries)) {
    return [HOME_ADDRESS];
  }

  const validEntries = entries
    .filter(address => typeof address === 'string')
    .filter(address => {
      const resolvedAddress = resolveBrowserAddress(address);
      return (
        resolvedAddress.kind !== 'blocked' &&
        resolvedAddress.address === address
      );
    })
    .slice(-maximumHistoryEntries);

  return validEntries.length > 0 ? validEntries : [HOME_ADDRESS];
}

function sanitizeFavorites(favorites) {
  if (!Array.isArray(favorites)) {
    return defaultFavorites;
  }

  const seenAddresses = new Set();

  return favorites
    .filter(
      favorite =>
        favorite &&
        typeof favorite.address === 'string' &&
        typeof favorite.title === 'string' &&
        getAddressKind(favorite.address) === 'internal'
    )
    .filter(favorite => {
      if (seenAddresses.has(favorite.address)) {
        return false;
      }

      seenAddresses.add(favorite.address);
      return true;
    })
    .slice(0, maximumFavorites);
}

export function createBrowserState(storedState = {}) {
  const entries = sanitizeEntries(storedState.entries);
  const requestedIndex = Number.isInteger(storedState.index)
    ? storedState.index
    : entries.length - 1;

  return {
    entries,
    favorites: sanitizeFavorites(storedState.favorites),
    index: Math.min(Math.max(requestedIndex, 0), entries.length - 1),
    revision: 0
  };
}

export function browserReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': {
      if (state.entries[state.index] === action.address) {
        return { ...state, revision: state.revision + 1 };
      }

      const entries = [
        ...state.entries.slice(0, state.index + 1),
        action.address
      ].slice(-maximumHistoryEntries);

      return { ...state, entries, index: entries.length - 1, revision: 0 };
    }

    case 'BACK':
      return state.index > 0
        ? { ...state, index: state.index - 1, revision: 0 }
        : state;

    case 'FORWARD':
      return state.index < state.entries.length - 1
        ? { ...state, index: state.index + 1, revision: 0 }
        : state;

    case 'REFRESH':
      return { ...state, revision: state.revision + 1 };

    case 'ADD_FAVORITE':
      if (
        getAddressKind(action.favorite.address) !== 'internal' ||
        state.favorites.some(
          favorite => favorite.address === action.favorite.address
        )
      ) {
        return state;
      }

      return {
        ...state,
        favorites: [...state.favorites, action.favorite].slice(
          -maximumFavorites
        )
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(
          favorite => favorite.address !== action.address
        )
      };

    default:
      return state;
  }
}

export function loadBrowserState(storage = window.localStorage) {
  try {
    const storedValue = storage.getItem(BROWSER_STORAGE_KEY);

    if (!storedValue) {
      return createBrowserState();
    }

    const parsedValue = JSON.parse(storedValue);
    if (parsedValue.version !== BROWSER_STORAGE_VERSION) {
      throw new TypeError('Unsupported VaporNet browser state version.');
    }

    return createBrowserState(parsedValue);
  } catch (error) {
    return { ...createBrowserState(), recoveredFromError: true };
  }
}

export function saveBrowserState(state, storage = window.localStorage) {
  try {
    storage.setItem(
      BROWSER_STORAGE_KEY,
      JSON.stringify({
        entries: state.entries,
        favorites: state.favorites,
        index: state.index,
        version: BROWSER_STORAGE_VERSION
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}
