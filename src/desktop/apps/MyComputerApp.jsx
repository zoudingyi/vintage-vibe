import React from 'react';
import { Fieldset } from 'react95';

export default function MyComputerApp() {
  return (
    <div>
      <strong>System Properties</strong>
      <p>Vintage Vibe Desktop Shell 1.0</p>
      <Fieldset label="System">
        <p>React 18 with a react95 interface</p>
        <p>Window manager: active</p>
        <p>Session restore: available</p>
        <p>Memory: 640K of nostalgia should be enough</p>
      </Fieldset>
    </div>
  );
}
