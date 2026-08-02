import React from 'react';
import { GroupBox } from 'react95';

export default function RecycleBinApp() {
  return (
    <div>
      <strong>Recycle Bin</strong>
      <GroupBox label="Deleted items">
        <p>The Recycle Bin is empty.</p>
        <p>Virtual file recovery is reserved for Desktop Shell 2.0.</p>
      </GroupBox>
    </div>
  );
}
