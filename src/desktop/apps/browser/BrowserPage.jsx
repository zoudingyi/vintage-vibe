import React from 'react';
import { Button, Fieldset, Panel } from 'react95';
import { radioStations } from '../../radioStations';
import { projects } from '../data';
import {
  browserPages,
  getAddressKind,
  getInternalPageId,
  getSearchQuery,
  searchVaporNet
} from './browserModel';
import { favoriteAlbums, favoriteTracks } from './favoriteRecords';

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

const nowOnlineItems = [
  ['FEATURED TOPICS', 'Sixties USA'],
  ['ACTIVE SIGNAL', 'Night City / Channel 94.2'],
  ['WALLPAPER', 'Neon Horizon'],
  ["CURATOR'S PICK", 'OH NO, OH YES! - 中森明菜']
];

function HomePage({ onNavigate }) {
  const destinations = [
    ['vintage://about', 'About Me', 'Profile, skills & contact'],
    ['vintage://projects', 'Project Archive', 'Interactive frontend systems'],
    ['vintage://radio', 'Radio Station', 'Tune into the desktop broadcast'],
    ['vintage://favorites', 'Favorite Records', 'A playlist-shaped canon'],
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

      <section aria-label="Now online" className="vapornet-now-panel">
        <div className="vapornet-now-heading">
          <span aria-hidden="true" />
          <strong>NOW ONLINE</strong>
          <button
            onClick={() => onNavigate('vintage://favorites')}
            type="button"
          >
            Browse record shelf →
          </button>
        </div>
        <dl>
          {nowOnlineItems.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

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
      <Fieldset className="vapornet-manifesto" label="Interface Manifesto">
        <ul>
          <li>Interfaces should be explored, not merely viewed.</li>
          <li>Nostalgia is not an excuse for poor usability.</li>
          <li>
            Every state change deserves visible, audible, or tactile feedback.
          </li>
          <li>Motion should build atmosphere without demanding attention.</li>
          <li>Good software remembers carefully and recovers clearly.</li>
          <li>A website can feel like a place instead of a stack of pages.</li>
        </ul>
      </Fieldset>
      <Panel className="vapornet-contact-card" variant="well">
        <strong>CONTACT TERMINAL</strong>
        <p>Email: 18483641399@163.com</p>
        <p>GitHub: zoudingyi</p>
      </Panel>
    </article>
  );
}

function FavoritesPage() {
  return (
    <article className="vapornet-page vapornet-records-page">
      <PageHeader eyebrow="PERSONAL RECORD ARCHIVE" title="FAVORITE RECORDS">
        <p>
          A personal shelf of Japanese city pop, AOR, boogie, and urban soul—
          selected for polished grooves, coastal light, and after-dark
          melancholy.
        </p>
      </PageHeader>

      <Panel className="vapornet-record-notice" variant="well">
        <strong>PROFILE: COASTAL LIGHT // CITY NIGHTS</strong>
        <span>
          Female vocals, precise arrangements, deep album cuts, and alternate
          interpretations connect the records and songs collected here.
        </span>
      </Panel>

      <section
        aria-labelledby="core-albums-heading"
        className="vapornet-records-section"
      >
        <div className="vapornet-section-heading">
          <div>
            <span>FIRST-TIER COMPLETE // CORE-ARTIST DEPTH</span>
            <h2 id="core-albums-heading">CORE ALBUMS</h2>
          </div>
          <strong className="vapornet-record-count">
            {favoriteAlbums.length} RELEASES
          </strong>
        </div>

        <div className="vapornet-album-grid">
          {favoriteAlbums.map((record, index) => (
            <article className="vapornet-album-card" key={record.title}>
              <div className="vapornet-album-artwork">
                <span aria-hidden="true" className="vapornet-album-disc">
                  <i />
                </span>
                <img
                  alt={`${record.title} by ${record.artist} album cover`}
                  src={record.cover}
                />
                <span aria-hidden="true" className="vapornet-album-index">
                  A-{String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="vapornet-album-details">
                <span>
                  {record.evidence}
                  {' // '}
                  {record.format}
                </span>
                <h3>{record.title}</h3>
                <strong>{record.artist}</strong>
                <dl>
                  <div>
                    <dt>Released</dt>
                    <dd>{record.released}</dd>
                  </div>
                  <div>
                    <dt>Label</dt>
                    <dd>{record.label}</dd>
                  </div>
                </dl>
                <p className="vapornet-album-highlight">
                  <span>NEEDLE DROP</span>
                  <strong>{record.highlight}</strong>
                </p>
                <p className="vapornet-album-note">{record.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="favorite-tracks-heading"
        className="vapornet-tracks-section"
      >
        <div className="vapornet-section-heading">
          <div>
            <span>20 SONGS // A PERSONAL SIGNAL MAP</span>
            <h2 id="favorite-tracks-heading">FAVORITE TRACKS</h2>
          </div>
          <strong className="vapornet-record-count">
            {favoriteTracks.length} TRACKS
          </strong>
        </div>

        <div className="vapornet-tracks-grid">
          {favoriteTracks.map((record, index) => (
            <article className="vapornet-track-card" key={record.title}>
              <div className="vapornet-track-artwork">
                <img
                  alt={`${record.title} by ${record.artist} artwork`}
                  src={record.cover}
                />
                <span aria-hidden="true">
                  T-{String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="vapornet-track-details">
                <span>{record.signal}</span>
                <h3>{record.title}</h3>
                <strong>{record.artist}</strong>
                <dl>
                  <div>
                    <dt>Released</dt>
                    <dd>{record.released}</dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>{record.source}</dd>
                  </div>
                </dl>
                <p>{record.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
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
  const trackCount = radioStations.reduce(
    (total, station) => total + station.tracks.length,
    0
  );

  return (
    <article className="vapornet-page vapornet-radio-page">
      <PageHeader eyebrow="FM CYBERCAST" title="VAPORWAVE RADIO">
        <p>
          Three channels and {trackCount} tracks broadcasting city pop and
          vaporwave memories.
        </p>
      </PageHeader>
      <div className="vapornet-radio-dial" aria-hidden="true">
        {radioStations.map(station => (
          <span key={station.id}>{station.frequency}</span>
        ))}
      </div>

      <Panel
        className="vapornet-launch-panel vapornet-radio-launch-panel"
        variant="well"
      >
        <div>
          <strong>LIVE PLAYER // DESKTOP APPLICATION</strong>
          <p>Open the receiver to listen and switch stations.</p>
        </div>
        <Button onClick={() => onOpenApp('vaporwave-radio')}>
          Launch Vaporwave Radio
        </Button>
      </Panel>

      <section
        aria-labelledby="station-directory-heading"
        className="vapornet-station-directory"
      >
        <div className="vapornet-station-directory-heading">
          <div>
            <span>ON-AIR CATALOGUE // ALL CHANNELS</span>
            <h2 id="station-directory-heading">FULL STATION DIRECTORY</h2>
          </div>
          <strong>{trackCount} TRACKS INDEXED</strong>
        </div>

        <div className="vapornet-station-list">
          {radioStations.map((station, stationIndex) => (
            <section
              aria-labelledby={`station-${station.id}-frequency station-${station.id}-heading`}
              className={`vapornet-station-card is-${station.id}`}
              key={station.id}
            >
              <header className="vapornet-station-header">
                <span
                  className="vapornet-station-frequency"
                  id={`station-${station.id}-frequency`}
                >
                  {station.frequency} FM
                </span>
                <div>
                  <span>
                    CHANNEL {String(stationIndex + 1).padStart(2, '0')}
                  </span>
                  <h3 id={`station-${station.id}-heading`}>{station.name}</h3>
                </div>
                <strong>{station.tracks.length} TRACKS</strong>
              </header>

              <ol className="vapornet-station-tracks">
                {station.tracks.map((track, trackIndex) => (
                  <li key={`${track.artist}-${track.title}`}>
                    <span aria-hidden="true">
                      {String(trackIndex + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <strong>{track.title}</strong>
                      <span>{track.artist}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
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
  const linkCollections = [
    {
      address: 'https://www.cameronsworld.net/',
      description:
        'A rough but personal web, assembled from the lost neighborhoods of GeoCities.',
      label: "Cameron's World",
      tag: 'WEB ARCHAEOLOGY'
    },
    {
      address: 'https://www.windows93.net/',
      description:
        'A fictional operating system where the desktop itself becomes the artwork.',
      label: 'WINDOWS93',
      tag: 'PLAYABLE INTERFACE'
    },
    {
      address: 'https://forum.melonland.net/',
      description:
        'A slower corner of the internet for personal sites, web gardens, and webrings.',
      label: 'MelonLand',
      tag: 'INDEPENDENT WEB'
    },
    {
      address: 'https://512kb.club/',
      description: 'A reminder that restraint is also a design choice.',
      label: '512KB Club',
      tag: 'SMALL WEB'
    }
  ];

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="WORLD WIDE WEB" title="COOL LINKS">
        <p>
          Places that still believe a website can carry the personality of its
          maker.
        </p>
      </PageHeader>
      <div className="vapornet-curated-links">
        {linkCollections.map(link => (
          <article className="vapornet-curated-link" key={link.address}>
            <span>{link.tag}</span>
            <PageLink address={link.address} onNavigate={onNavigate}>
              {link.label} ↗
            </PageLink>
            <p>{link.description}</p>
          </article>
        ))}
      </div>
      <Panel className="vapornet-personal-links" variant="well">
        <strong>PERSONAL TERMINALS</strong>
        <PageLink
          address="https://github.com/zoudingyi"
          onNavigate={onNavigate}
        >
          GitHub // zoudingyi
        </PageLink>
        <PageLink
          address="mailto:18483641399@163.com"
          onNavigate={onNavigate}
        >
          Electronic Mail Terminal
        </PageLink>
      </Panel>
      <p className="vapornet-curated-stamp">CURATED BY HAND</p>
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
    case 'favorites':
      return <FavoritesPage {...pageProps} />;
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
