import React from 'react';
import { Fieldset } from 'react95';

export default function RecycleBinApp() {
  return (
    <div>
      <strong>Recycle Bin</strong>
      <Fieldset label="Deleted items">
        <p>The Recycle Bin is empty.</p>
        <p>Virtual file recovery is reserved for Desktop Shell 2.0.</p>
      </Fieldset>
    </div>
  );
}
