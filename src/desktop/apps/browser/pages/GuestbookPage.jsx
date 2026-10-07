import React from 'react';
import GuestbookContent, {
  archivedGuestbookEntries
} from '@/desktop/guestbook/GuestbookContent';
import PageHeader from '../PageHeader';

export default function GuestbookPage() {
  return (
    <article className="vapornet-page vapornet-guestbook-page">
      <PageHeader eyebrow="VISITOR SERVICES // NODE 1999" title="GUESTBOOK">
        <p>
          Leave a trace before the connection closes. Messages, memories, and
          late-night transmissions are welcome.
        </p>
      </PageHeader>

      <GuestbookContent
        archivedEntries={archivedGuestbookEntries}
        mode="page"
      />
    </article>
  );
}
