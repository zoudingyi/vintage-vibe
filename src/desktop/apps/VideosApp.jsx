import React from 'react';
import { Anchor, Fieldset } from 'react95';

export default function VideosApp() {
  return (
    <div>
      <strong>My Videos</strong>
      <p>Project demonstrations and interface recordings.</p>
      <Fieldset label="Available media">
        <p>Vintage Vibe desktop shell walkthrough</p>
        <Anchor
          href="https://github.com/zoudingyi/vintage-vibe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open project repository
        </Anchor>
      </Fieldset>
    </div>
  );
}
