import React from 'react';
import PageHeader from '../PageHeader';

const nowOnlineItems = [
  ['FEATURED TOPICS', 'Sixties USA'],
  ['ACTIVE SIGNAL', 'Night City / Channel 94.2'],
  ['WALLPAPER', 'Neon Horizon'],
  ["CURATOR'S PICK", 'OH NO, OH YES! - 中森明菜']
];

export default function HomePage({ onNavigate }) {
  const destinations = [
    ['vintage://about', 'About Me', 'Personal signal & interests'],
    // ['vintage://projects', 'Project Archive', 'Interactive frontend systems'],
    ['vintage://radio', 'Radio Station', 'Tune into the desktop broadcast'],
    ['vintage://favorites', 'Favorite Records', 'A playlist-shaped canon'],
    ['vintage://moments', 'Moments', 'Personal timeline & field notes'],
    ['vintage://guestbook', 'Guestbook', 'Leave a local message'],
    // ['vintage://links', 'Cool Links', 'External destinations'],
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
