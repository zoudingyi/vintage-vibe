import React from 'react';
import { Anchor, GroupBox } from 'react95';

export default function VideosApp() {
  return (
    <div>
      <strong>My Videos</strong>
      <p>Project demonstrations and interface recordings.</p>
      <GroupBox label="Available media">
        <p>Vintage Vibe desktop shell walkthrough</p>
        <Anchor
          href="https://github.com/zoudingyi/vintage-vibe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open project repository
        </Anchor>
      </GroupBox>
    </div>
  );
}
