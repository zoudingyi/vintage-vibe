import React from 'react';
import { Button, Frame } from 'react95';
import PageHeader from '../PageHeader';

export default function NotFoundPage({ address, onNavigate }) {
  return (
    <article className="vapornet-page vapornet-system-page">
      <PageHeader eyebrow="DNS ERROR" title="404 — PAGE NOT FOUND">
        <p>The local server could not locate this VaporNet address.</p>
      </PageHeader>
      <Frame variant="status">
        <code>{address}</code>
        <p>Check the address or return to the home gateway.</p>
        <Button onClick={() => onNavigate('vintage://home')}>
          Return Home
        </Button>
      </Frame>
    </article>
  );
}
