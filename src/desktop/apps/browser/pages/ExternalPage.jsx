import React from 'react';
import { Anchor, Frame } from 'react95';
import PageHeader from '../PageHeader';

export default function ExternalPage({ address }) {
  return (
    <article className="vapornet-page vapornet-system-page">
      <PageHeader eyebrow="INTERNET ZONE" title="EXTERNAL LINK">
        <p>VaporNet does not embed arbitrary external websites.</p>
      </PageHeader>
      <Frame variant="status">
        <p className="vapornet-external-address">{address}</p>
        <Anchor href={address} rel="noopener noreferrer" target="_blank">
          Open in a new browser tab
        </Anchor>
      </Frame>
    </article>
  );
}
