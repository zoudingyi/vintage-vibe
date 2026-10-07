import React from 'react';
import { browserPages, getAddressKind, getInternalPageId } from './browserModel';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FavoritesPage from './pages/FavoritesPage';
import ProjectsPage from './pages/ProjectsPage';
import RadioPage from './pages/RadioPage';
import GuestbookPage from './pages/GuestbookPage';
import LinksPage from './pages/LinksPage';
import SearchPage from './pages/SearchPage';
import HelpPage from './pages/HelpPage';
import ExternalPage from './pages/ExternalPage';
import NotFoundPage from './pages/NotFoundPage';
import MomentsPage from './pages/MomentsPage';

export default function BrowserPage({ address, onNavigate, onOpenApp }) {
  if (getAddressKind(address) === 'external') {
    return <ExternalPage address={address} />;
  }

  const pageId = getInternalPageId(address);
  const pageProps = { address, onNavigate, onOpenApp };

  switch (pageId) {
    case 'home':
      return <HomePage {...pageProps} />;
    case 'about':
      return <AboutPage {...pageProps} />;
    case 'favorites':
      return <FavoritesPage {...pageProps} />;
    case 'moments':
      return <MomentsPage />;
    case 'projects':
      return <ProjectsPage {...pageProps} />;
    case 'radio':
      return <RadioPage {...pageProps} />;
    case 'guestbook':
      return <GuestbookPage {...pageProps} />;
    case 'links':
      return <LinksPage {...pageProps} />;
    case 'search':
      return <SearchPage {...pageProps} />;
    case 'help':
      return <HelpPage {...pageProps} />;
    default:
      return <NotFoundPage {...pageProps} />;
  }
}

export function getBrowserPageMetadata(address) {
  const pageId = getInternalPageId(address);
  return browserPages[pageId] || null;
}
