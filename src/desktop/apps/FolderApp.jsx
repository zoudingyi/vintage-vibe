import React from 'react';
import { Button, Fieldset } from 'react95';

export default function FolderApp({ onOpenApp }) {
  return (
    <div>
      <strong>My Documents</strong>
      <p>Shortcuts to the useful parts of this portfolio.</p>
      <Fieldset label="Documents">
        <div className="settings-choice-row">
          <Button onClick={() => onOpenApp('profile')}>ABOUT.TXT</Button>
          <Button onClick={() => onOpenApp('projects')}>PROJECTS.DIR</Button>
          <Button onClick={() => onOpenApp('guestbook')}>GUESTBOOK.MSG</Button>
        </div>
      </Fieldset>
    </div>
  );
}
