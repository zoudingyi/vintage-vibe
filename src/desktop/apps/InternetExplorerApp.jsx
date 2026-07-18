import React from 'react';
import { Button, Panel } from 'react95';
import { useTheme } from 'styled-components';
import browserIcon from '@/assets/icons/internet_explorer.png';
import searchIcon from '@/assets/icons/search.png';
import folderIcon from '@/assets/icons/folder_closed.png';
import BrowserPage from './browser/BrowserPage';
import {
  HOME_ADDRESS,
  browserReducer,
  getAddressKind,
  getAddressTitle,
  loadBrowserState,
  resolveBrowserAddress,
  saveBrowserState
} from './browser/browserModel';
import './InternetExplorerApp.css';

function MenuButton({ active, children, label, onClick }) {
  return (
    <button
      aria-expanded={active}
      aria-label={`${label} menu`}
      className={active ? 'ie-menu-button is-active' : 'ie-menu-button'}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ToolbarButton({ children, disabled, icon, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="ie-toolbar-button"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="ie-toolbar-glyph">
        {icon ? <img alt="" src={icon} /> : children}
      </span>
      <span className="ie-toolbar-label">{label}</span>
    </button>
  );
}

export default function InternetExplorerApp({ onOpenApp = () => {} }) {
  const theme = useTheme();
  const [browserState, dispatch] = React.useReducer(
    browserReducer,
    undefined,
    () => loadBrowserState()
  );
  const currentAddress = browserState.entries[browserState.index];
  const [addressDraft, setAddressDraft] = React.useState(currentAddress);
  const [activeMenu, setActiveMenu] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState(
    browserState.recoveredFromError
      ? 'Browser data was reset after a storage error.'
      : 'Done'
  );
  const addressRef = React.useRef(null);
  const menuBarRef = React.useRef(null);

  React.useEffect(() => {
    saveBrowserState(browserState);
  }, [browserState]);

  React.useEffect(() => {
    setAddressDraft(currentAddress);
  }, [currentAddress]);

  React.useEffect(() => {
    if (!activeMenu) {
      return undefined;
    }

    function dismissMenu(event) {
      if (!menuBarRef.current?.contains(event.target)) {
        setActiveMenu(null);
      }
    }

    document.addEventListener('pointerdown', dismissMenu);
    return () => document.removeEventListener('pointerdown', dismissMenu);
  }, [activeMenu]);

  function navigate(rawAddress) {
    const resolvedAddress = resolveBrowserAddress(rawAddress);

    if (resolvedAddress.kind === 'blocked') {
      setStatusMessage(resolvedAddress.reason);
      return;
    }

    dispatch({ type: 'NAVIGATE', address: resolvedAddress.address });
    setAddressDraft(resolvedAddress.address);
    setActiveMenu(null);
    setStatusMessage(
      resolvedAddress.kind === 'external'
        ? 'External address ready for confirmation.'
        : 'Done'
    );
  }

  function navigateHistory(direction) {
    dispatch({ type: direction });
    setActiveMenu(null);
    setStatusMessage('Done');
  }

  function refreshPage() {
    dispatch({ type: 'REFRESH' });
    setActiveMenu(null);
    setStatusMessage('Page refreshed.');
  }

  function addCurrentFavorite() {
    if (getAddressKind(currentAddress) !== 'internal') {
      setStatusMessage('Only local VaporNet pages can be saved as favorites.');
      setActiveMenu(null);
      return;
    }

    dispatch({
      type: 'ADD_FAVORITE',
      favorite: {
        address: currentAddress,
        title: getAddressTitle(currentAddress)
      }
    });
    setStatusMessage('Page added to Favorites.');
    setActiveMenu(null);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard?.writeText(currentAddress);
      setStatusMessage('Address copied to the clipboard.');
    } catch (error) {
      setStatusMessage('The address could not be copied in this browser.');
    }
    setActiveMenu(null);
  }

  function toggleMenu(menuId) {
    setActiveMenu(currentMenu => (currentMenu === menuId ? null : menuId));
  }

  function handleKeyboardShortcut(event) {
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      addressRef.current?.focus();
      addressRef.current?.select();
      return;
    }

    if (event.altKey && event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateHistory('BACK');
      return;
    }

    if (event.altKey && event.key === 'ArrowRight') {
      event.preventDefault();
      navigateHistory('FORWARD');
      return;
    }

    if (event.key === 'F5') {
      event.preventDefault();
      refreshPage();
      return;
    }

    if (event.key === 'Escape') {
      setActiveMenu(null);
    }
  }

  const currentPageTitle = getAddressTitle(currentAddress);
  const canGoBack = browserState.index > 0;
  const canGoForward = browserState.index < browserState.entries.length - 1;
  const browserThemeStyle = {
    '--ie-border-dark': theme.borderDark,
    '--ie-border-darkest': theme.borderDarkest,
    '--ie-border-light': theme.borderLight,
    '--ie-border-lightest': theme.borderLightest,
    '--ie-canvas': theme.canvas,
    '--ie-canvas-text': theme.canvasText,
    '--ie-disabled': theme.materialTextDisabled,
    '--ie-disabled-shadow': theme.materialTextDisabledShadow,
    '--ie-hover': theme.hoverBackground,
    '--ie-hover-text': theme.materialTextInvert,
    '--ie-material': theme.material,
    '--ie-material-text': theme.materialText,
    '--ie-progress': theme.progress
  };

  return (
    <div
      className="internet-explorer-app"
      onKeyDown={handleKeyboardShortcut}
      style={browserThemeStyle}
    >
      <nav
        aria-label="Internet Explorer menu"
        className="ie-menu-bar"
        ref={menuBarRef}
      >
        <div className="ie-menu-item">
          <MenuButton
            active={activeMenu === 'file'}
            label="File"
            onClick={() => toggleMenu('file')}
          >
            <u>F</u>ile
          </MenuButton>
          {activeMenu === 'file' && (
            <Panel className="ie-menu-popup" role="menu">
              <button
                onClick={() => {
                  addressRef.current?.focus();
                  addressRef.current?.select();
                  setActiveMenu(null);
                }}
                role="menuitem"
                type="button"
              >
                Open Location… <span>Ctrl+L</span>
              </button>
              <button disabled role="menuitem" type="button">
                New Window
              </button>
            </Panel>
          )}
        </div>

        <div className="ie-menu-item">
          <MenuButton
            active={activeMenu === 'edit'}
            label="Edit"
            onClick={() => toggleMenu('edit')}
          >
            <u>E</u>dit
          </MenuButton>
          {activeMenu === 'edit' && (
            <Panel className="ie-menu-popup" role="menu">
              <button onClick={copyAddress} role="menuitem" type="button">
                Copy Address
              </button>
              <button
                onClick={() => {
                  addressRef.current?.focus();
                  addressRef.current?.select();
                  setActiveMenu(null);
                }}
                role="menuitem"
                type="button"
              >
                Select Address
              </button>
            </Panel>
          )}
        </div>

        <div className="ie-menu-item">
          <MenuButton
            active={activeMenu === 'view'}
            label="View"
            onClick={() => toggleMenu('view')}
          >
            <u>V</u>iew
          </MenuButton>
          {activeMenu === 'view' && (
            <Panel className="ie-menu-popup" role="menu">
              <button onClick={refreshPage} role="menuitem" type="button">
                Refresh <span>F5</span>
              </button>
              <button
                onClick={() => navigate(HOME_ADDRESS)}
                role="menuitem"
                type="button"
              >
                Home
              </button>
            </Panel>
          )}
        </div>

        <div className="ie-menu-item">
          <MenuButton
            active={activeMenu === 'favorites'}
            label="Favorites"
            onClick={() => toggleMenu('favorites')}
          >
            F<u>a</u>vorites
          </MenuButton>
          {activeMenu === 'favorites' && (
            <Panel className="ie-menu-popup ie-favorites-popup" role="menu">
              <button
                onClick={addCurrentFavorite}
                role="menuitem"
                type="button"
              >
                Add Current Page
              </button>
              <div className="ie-menu-separator" />
              {browserState.favorites.map(favorite => (
                <div className="ie-favorite-row" key={favorite.address}>
                  <button
                    aria-label={`Open favorite ${favorite.title}`}
                    onClick={() => navigate(favorite.address)}
                    role="menuitem"
                    type="button"
                  >
                    <img alt="" src={folderIcon} />
                    {favorite.title}
                  </button>
                  {!['vintage://home', 'vintage://projects', 'vintage://radio', 'vintage://guestbook'].includes(
                    favorite.address
                  ) && (
                    <button
                      aria-label={`Remove favorite ${favorite.title}`}
                      className="ie-remove-favorite"
                      onClick={() => {
                        dispatch({
                          type: 'REMOVE_FAVORITE',
                          address: favorite.address
                        });
                        setStatusMessage('Favorite removed.');
                      }}
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </Panel>
          )}
        </div>

        <div className="ie-menu-item">
          <MenuButton
            active={activeMenu === 'help'}
            label="Help"
            onClick={() => toggleMenu('help')}
          >
            <u>H</u>elp
          </MenuButton>
          {activeMenu === 'help' && (
            <Panel className="ie-menu-popup" role="menu">
              <button
                onClick={() => navigate('vintage://help')}
                role="menuitem"
                type="button"
              >
                VaporNet Help
              </button>
              <button
                onClick={() => navigate('vintage://about')}
                role="menuitem"
                type="button"
              >
                About VaporNet Explorer
              </button>
            </Panel>
          )}
        </div>
      </nav>

      <div className="ie-toolbar" role="toolbar" aria-label="Navigation">
        <ToolbarButton
          disabled={!canGoBack}
          label="Back"
          onClick={() => navigateHistory('BACK')}
        >
          ←
        </ToolbarButton>
        <ToolbarButton
          disabled={!canGoForward}
          label="Forward"
          onClick={() => navigateHistory('FORWARD')}
        >
          →
        </ToolbarButton>
        <ToolbarButton disabled label="Stop">
          ■
        </ToolbarButton>
        <ToolbarButton label="Refresh" onClick={refreshPage}>
          ↻
        </ToolbarButton>
        <ToolbarButton
          icon={browserIcon}
          label="Home"
          onClick={() => navigate(HOME_ADDRESS)}
        />
        <span className="ie-toolbar-divider" />
        <ToolbarButton
          icon={searchIcon}
          label="Search"
          onClick={() => navigate('vintage://search')}
        />
        <ToolbarButton
          icon={folderIcon}
          label="Show favorites"
          onClick={() => toggleMenu('favorites')}
        />
      </div>

      <form
        className="ie-address-bar"
        onSubmit={event => {
          event.preventDefault();
          navigate(addressDraft);
        }}
      >
        <label htmlFor="ie-address-input">A<u>d</u>dress</label>
        <div className="ie-address-field">
          <img alt="" src={browserIcon} />
          <input
            aria-label="Address"
            id="ie-address-input"
            onChange={event => setAddressDraft(event.target.value)}
            ref={addressRef}
            spellCheck="false"
            value={addressDraft}
          />
        </div>
        <Button type="submit">Go</Button>
      </form>

      <main
        aria-label={`${currentPageTitle} web page`}
        className="ie-browser-viewport"
      >
        <BrowserPage
          address={currentAddress}
          key={`${currentAddress}-${browserState.revision}`}
          onNavigate={navigate}
          onOpenApp={onOpenApp}
        />
      </main>

      <footer className="ie-status-bar">
        <span aria-live="polite" role="status">
          {statusMessage}
        </span>
        <span className="ie-security-zone">
          {getAddressKind(currentAddress) === 'internal'
            ? 'Local intranet'
            : 'Internet zone'}
        </span>
        <span className="ie-status-address">{currentAddress}</span>
      </footer>
    </div>
  );
}
