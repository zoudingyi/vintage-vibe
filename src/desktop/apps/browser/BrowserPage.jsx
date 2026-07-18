import React from 'react';
import { Button, Fieldset, Panel } from 'react95';
import { projects } from '../data';
import {
  browserPages,
  getAddressKind,
  getInternalPageId,
  getSearchQuery,
  searchVaporNet
} from './browserModel';

function PageLink({ address, children, onNavigate }) {
  return (
    <button
      className="vapornet-link"
      onClick={() => onNavigate(address)}
      type="button"
    >
      {children}
    </button>
  );
}

function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="vapornet-page-header">
      <span className="vapornet-page-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children}
    </header>
  );
}

function HomePage({ onNavigate }) {
  const destinations = [
    ['vintage://about', 'About Me', 'Profile, skills & contact'],
    ['vintage://projects', 'Project Archive', 'Interactive frontend systems'],
    ['vintage://radio', 'Radio Station', 'Tune into the desktop broadcast'],
    ['vintage://guestbook', 'Guestbook', 'Leave a local message'],
    ['vintage://links', 'Cool Links', 'External destinations'],
    ['vintage://help', 'Browser Help', 'Addresses and safety information']
  ];

  return (
    <article className="vapornet-page vapornet-home-page">
      <div className="vapornet-marquee" aria-label="VaporNet status">
        <span>★ VAPORNET GATEWAY ONLINE ★ LOCAL INTRANET 1999 ★</span>
      </div>
      <PageHeader eyebrow="仮想世界 // NODE 88.7" title="WELCOME TO VAPORNET">
        <p>
          A handcrafted personal homepage transmitted from the Vintage Vibe
          desktop.
        </p>
      </PageHeader>

      <div className="vapornet-home-grid">
        {destinations.map(([address, title, description]) => (
          <button
            className="vapornet-directory-card"
            onClick={() => onNavigate(address)}
            type="button"
            key={address}
          >
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>

      <div className="vapornet-home-footer">
        <span className="vapornet-new-badge">NEW!</span>
        <p>Best viewed at 800 × 600 with 256 colors.</p>
        <p>
          Visitors: <strong className="vapornet-counter">0001999</strong>
        </p>
      </div>
    </article>
  );
}

function AboutPage() {
  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="PERSONAL HOMEPAGE" title="ABOUT ME">
        <p>Frontend systems, playful interfaces, and clear architecture.</p>
      </PageHeader>
      <div className="vapornet-two-column">
        <Fieldset label="Profile">
          <p>
            Building React interfaces that feel like complete environments,
            not isolated pages.
          </p>
          <p>Current station: Vintage Vibe Desktop Shell 1.0</p>
        </Fieldset>
        <Fieldset label="Skills">
          <ul>
            <li>React and component architecture</li>
            <li>Interactive UI systems</li>
            <li>Accessible, behavior-focused testing</li>
          </ul>
        </Fieldset>
      </div>
      <Panel className="vapornet-contact-card" variant="well">
        <strong>CONTACT TERMINAL</strong>
        <p>Email: 18483641399@163.com</p>
        <p>GitHub: zoudingyi</p>
      </Panel>
    </article>
  );
}

function ProjectsPage({ address, onNavigate }) {
  const searchParameters = new URLSearchParams(address.split('?')[1] || '');
  const selectedProjectId = searchParameters.get('project');

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="SOFTWARE DIRECTORY" title="PROJECT ARCHIVE">
        <p>Interactive frontend work recovered from the local intranet.</p>
      </PageHeader>
      <div className="vapornet-project-list">
        {projects.map((project, index) => (
          <Panel
            className={
              selectedProjectId === project.id
                ? 'vapornet-project-card is-selected'
                : 'vapornet-project-card'
            }
            variant="well"
            key={project.id}
          >
            <span className="vapornet-project-number">
              FILE {String(index + 1).padStart(2, '0')}
            </span>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.stack}</dd>
              </div>
            </dl>
            <Button onClick={() => onNavigate(project.github)}>
              Visit project link
            </Button>
          </Panel>
        ))}
      </div>
    </article>
  );
}

function RadioPage({ onOpenApp }) {
  return (
    <article className="vapornet-page vapornet-radio-page">
      <PageHeader eyebrow="FM CYBERCAST" title="VAPORWAVE RADIO">
        <p>Three channels broadcasting city pop and vaporwave memories.</p>
      </PageHeader>
      <div className="vapornet-radio-dial" aria-hidden="true">
        <span>88.7</span>
        <span>94.2</span>
        <span>101.9</span>
      </div>
      <Panel className="vapornet-launch-panel" variant="well">
        <p>The broadcast runs in its own desktop application.</p>
        <Button onClick={() => onOpenApp('vaporwave-radio')}>
          Launch Vaporwave Radio
        </Button>
      </Panel>
    </article>
  );
}

function GuestbookPage({ onOpenApp }) {
  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="VISITOR SERVICES" title="GUESTBOOK">
        <p>Sign the local guestbook and leave a message for the next visitor.</p>
      </PageHeader>
      <Panel className="vapornet-launch-panel" variant="well">
        <p>Guestbook entries are stored only in this browser.</p>
        <Button onClick={() => onOpenApp('guestbook')}>
          Open Guestbook Program
        </Button>
      </Panel>
    </article>
  );
}

function LinksPage({ onNavigate }) {
  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="WORLD WIDE WEB" title="COOL LINKS">
        <p>External destinations open safely in a new browser tab.</p>
      </PageHeader>
      <ul className="vapornet-links-list">
        <li>
          <PageLink
            address="https://github.com/zoudingyi"
            onNavigate={onNavigate}
          >
            GitHub // zoudingyi
          </PageLink>
        </li>
        <li>
          <PageLink
            address="mailto:18483641399@163.com"
            onNavigate={onNavigate}
          >
            Electronic Mail Terminal
          </PageLink>
        </li>
      </ul>
      <p className="vapornet-under-construction">UNDER CONSTRUCTION</p>
    </article>
  );
}

function SearchPage({ address, onNavigate }) {
  const initialQuery = getSearchQuery(address);
  const [query, setQuery] = React.useState(initialQuery);
  const results = searchVaporNet(initialQuery);

  function submitSearch(event) {
    event.preventDefault();
    onNavigate(`vintage://search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="LOCAL INDEX" title="SEARCH RESULTS">
        <p>Search pages and project records stored on VaporNet.</p>
      </PageHeader>
      <form className="vapornet-search-form" onSubmit={submitSearch} role="search">
        <label htmlFor="vapornet-search-input">Search VaporNet</label>
        <div>
          <input
            id="vapornet-search-input"
            onChange={event => setQuery(event.target.value)}
            value={query}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {initialQuery ? (
        <section aria-label="Search results" className="vapornet-search-results">
          <p>
            {results.length} result{results.length === 1 ? '' : 's'} for “
            {initialQuery}”
          </p>
          {results.length > 0 ? (
            results.map(result => (
              <button
                className="vapornet-search-result"
                onClick={() => onNavigate(result.address)}
                type="button"
                key={result.id}
              >
                <strong>{result.title}</strong>
                <span>{result.description}</span>
              </button>
            ))
          ) : (
            <p>No matching documents were found on the local intranet.</p>
          )}
        </section>
      ) : (
        <p>Enter a search term to query the local index.</p>
      )}
    </article>
  );
}

function HelpPage() {
  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="INTERNET EXPLORER HELP" title="VAPORNET HELP">
        <p>This program browses a safe, simulated local internet.</p>
      </PageHeader>
      <Fieldset label="Supported addresses">
        <p>
          Use <code>vintage://home</code> or enter a page name such as{' '}
          <code>projects</code>.
        </p>
        <p>HTTPS and email links are handed to the system browser.</p>
      </Fieldset>
      <Fieldset label="Keyboard shortcuts">
        <p>Ctrl+L — focus the address bar</p>
        <p>Alt+Left / Alt+Right — move through history</p>
        <p>F5 — refresh the current page</p>
      </Fieldset>
    </article>
  );
}

function ExternalPage({ address }) {
  return (
    <article className="vapornet-page vapornet-system-page">
      <PageHeader eyebrow="INTERNET ZONE" title="EXTERNAL LINK">
        <p>VaporNet does not embed arbitrary external websites.</p>
      </PageHeader>
      <Panel variant="well">
        <p className="vapornet-external-address">{address}</p>
        <a href={address} rel="noopener noreferrer" target="_blank">
          Open in a new browser tab
        </a>
      </Panel>
    </article>
  );
}

function NotFoundPage({ address, onNavigate }) {
  return (
    <article className="vapornet-page vapornet-system-page">
      <PageHeader eyebrow="DNS ERROR" title="404 — PAGE NOT FOUND">
        <p>The local server could not locate this VaporNet address.</p>
      </PageHeader>
      <Panel variant="well">
        <code>{address}</code>
        <p>Check the address or return to the home gateway.</p>
        <Button onClick={() => onNavigate('vintage://home')}>
          Return Home
        </Button>
      </Panel>
    </article>
  );
}

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
