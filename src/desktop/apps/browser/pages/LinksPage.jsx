import React from 'react';
import { Frame } from 'react95';
import PageHeader from '../PageHeader';

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

export default function LinksPage({ onNavigate }) {
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
      <Frame className="vapornet-personal-links" variant="status">
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
      </Frame>
      <p className="vapornet-curated-stamp">CURATED BY HAND</p>
    </article>
  );
}
