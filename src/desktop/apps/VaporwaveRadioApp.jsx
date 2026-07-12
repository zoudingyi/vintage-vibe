import React from 'react';
import { Button, Panel } from 'react95';
import './VaporwaveRadioApp.css';

const stations = [
  { frequency: '88.7', id: 'mirage', name: 'Palm Mirage' },
  { frequency: '94.2', id: 'midnight', name: 'Midnight Plaza' },
  { frequency: '101.9', id: 'dream', name: 'Dream Channel' }
];

function TransportControls({ playing, onNext, onPrevious, onToggle }) {
  return (
    <div className="radio-mode-transport" aria-label="Playback controls">
      <Button aria-label="Previous station" onClick={onPrevious}>
        ◀◀
      </Button>
      <Button aria-label={playing ? 'Pause preview' : 'Play preview'} onClick={onToggle}>
        {playing ? 'Ⅱ PAUSE' : '▶ PLAY'}
      </Button>
      <Button aria-label="Next station" onClick={onNext}>
        ▶▶
      </Button>
    </div>
  );
}

function StationButtons({ activeStationId, onSelect, vertical = false }) {
  return (
    <div
      className={`radio-mode-stations${vertical ? ' is-vertical' : ''}`}
      aria-label="Station presets"
    >
      {stations.map(station => (
        <Button
          active={activeStationId === station.id ? true : undefined}
          aria-pressed={activeStationId === station.id}
          key={station.id}
          onClick={() => onSelect(station.id)}
        >
          <span>{station.frequency}</span>
          <small>{station.name}</small>
        </Button>
      ))}
    </div>
  );
}

function CassetteDeckRadio({
  station,
  playing,
  onNext,
  onPrevious,
  onSelect,
  onToggle
}) {
  return (
    <section className="radio-mode radio-mode-a" aria-label="Cassette Deck radio mode">
      <header className="radio-a-header">
        <div>
          <span className="radio-kicker">VAPORWAVE STEREO SYSTEM</span>
          <h2>NEON CASSETTE DECK</h2>
        </div>
        <span className="radio-a-frequency">FM {station.frequency}</span>
      </header>

      <Panel className="radio-a-cassette-bay" variant="well">
        <div className="radio-a-cassette">
          <div className="radio-a-label">
            <span>VINTAGE VIBE // SIDE A</span>
            <strong>{station.name}</strong>
            <span>STEREO · HIGH BIAS · 90</span>
          </div>
          <div className="radio-a-tape-window" aria-hidden="true">
            <span className={playing ? 'radio-reel is-spinning' : 'radio-reel'} />
            <i />
            <span className={playing ? 'radio-reel is-spinning' : 'radio-reel'} />
          </div>
          <div className="radio-a-cassette-screws" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </Panel>

      <div className="radio-a-readout">
        <span>{playing ? 'PLAY' : 'STANDBY'}</span>
        <div className="radio-a-levels" aria-hidden="true">
          {[2, 4, 7, 9, 6, 8, 4, 3, 7, 5, 8, 3].map((height, index) => (
            <i key={index} style={{ '--level': height }} />
          ))}
        </div>
        <span>NR ON</span>
      </div>

      <TransportControls
        onNext={onNext}
        onPrevious={onPrevious}
        onToggle={onToggle}
        playing={playing}
      />
      <StationButtons activeStationId={station.id} onSelect={onSelect} />

      <footer className="radio-mode-state">
        <span>DECK A</span>
        <span>{station.name}</span>
        <span>{playing ? 'TAPE RUNNING' : 'TAPE STOPPED'}</span>
      </footer>
    </section>
  );
}

function NightDriveRadio({
  station,
  playing,
  onNext,
  onPrevious,
  onSelect,
  onToggle
}) {
  return (
    <section className="radio-mode radio-mode-b" aria-label="Night Drive radio mode">
      <aside className="radio-b-tuner">
        <span className="radio-kicker">CITY BAND</span>
        <h2>夜間通信</h2>
        <StationButtons
          activeStationId={station.id}
          onSelect={onSelect}
          vertical
        />
        <div className="radio-b-signal">
          <span>SIGNAL</span>
          <strong>▮▮▮▮▯</strong>
        </div>
      </aside>

      <div className="radio-b-main">
        <div className="radio-b-scene" aria-label="Neon night drive display">
          <div className="radio-b-stars" aria-hidden="true" />
          <div className="radio-b-sun" aria-hidden="true" />
          <div className="radio-b-skyline" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className="radio-b-grid" aria-hidden="true" />
          <div className="radio-b-overlay">
            <span>LIVE FROM VIRTUAL BAY</span>
            <strong>{station.name}</strong>
            <span>{station.frequency} FM · NIGHT LOOP</span>
          </div>
        </div>

        <div className={`radio-b-spectrum${playing ? ' is-playing' : ''}`} aria-hidden="true">
          {[5, 11, 7, 16, 10, 20, 14, 8, 18, 12, 7, 15, 10, 5].map(
            (height, index) => <i key={index} style={{ '--bar': `${height}px` }} />
          )}
        </div>
        <TransportControls
          onNext={onNext}
          onPrevious={onPrevious}
          onToggle={onToggle}
          playing={playing}
        />
        <footer className="radio-mode-state">
          <span>CRUISE MODE</span>
          <span>{playing ? 'BROADCAST ONLINE' : 'PARKED'}</span>
          <span>00:{playing ? '42' : '00'} / ∞</span>
        </footer>
      </div>
    </section>
  );
}

function BroadcastTerminalRadio({
  station,
  playing,
  onNext,
  onPrevious,
  onSelect,
  onToggle
}) {
  return (
    <section className="radio-mode radio-mode-c" aria-label="Broadcast Terminal radio mode">
      <header className="radio-c-header">
        <span>VVR-95 NETWORK CONSOLE</span>
        <span className="radio-c-on-air">● {playing ? 'ON AIR' : 'STANDBY'}</span>
      </header>

      <div className="radio-c-layout">
        <Panel className="radio-c-directory" variant="well">
          <span className="radio-kicker">CHANNEL DIRECTORY</span>
          <StationButtons
            activeStationId={station.id}
            onSelect={onSelect}
            vertical
          />
          <dl>
            <div><dt>REGION</dt><dd>VIRTUAL BAY</dd></div>
            <div><dt>FORMAT</dt><dd>VAPOR / FM</dd></div>
            <div><dt>BITRATE</dt><dd>320 DREAMS</dd></div>
          </dl>
        </Panel>

        <div className="radio-c-console">
          <div className="radio-c-crt">
            <span className="radio-c-scanline" aria-hidden="true" />
            <span>TUNED TO {station.frequency} MHz</span>
            <strong>{station.name.toUpperCase()}</strong>
            <div className="radio-c-wave" aria-hidden="true">
              ▂▃▅▆▃▁▃▇▅▂▁▅▇▃▂▆▅▂▁▃▆▇▅▂
            </div>
            <p>{playing ? 'Receiving stereo broadcast…' : 'Carrier detected. Awaiting playback.'}</p>
          </div>

          <TransportControls
            onNext={onNext}
            onPrevious={onPrevious}
            onToggle={onToggle}
            playing={playing}
          />

          <Panel className="radio-c-log" variant="well">
            <span>22:41:08  CONNECT {station.frequency}</span>
            <span>22:41:09  SIGNAL LOCKED</span>
            <span>22:41:10  {playing ? 'STREAM ACTIVE' : 'STREAM PAUSED'}</span>
          </Panel>
        </div>
      </div>

      <footer className="radio-mode-state">
        <span>CH {station.frequency}</span>
        <span>LOCAL MEMORY ONLY</span>
        <span>{station.name}</span>
      </footer>
    </section>
  );
}

export default function VaporwaveRadioApp({ desktopSettings }) {
  const radioAppearance = desktopSettings.radioAppearance;
  const [activeStationId, setActiveStationId] = React.useState('midnight');
  const [playing, setPlaying] = React.useState(false);
  const stationIndex = stations.findIndex(station => station.id === activeStationId);
  const station = stations[stationIndex];

  function changeStation(direction) {
    const nextIndex = (stationIndex + direction + stations.length) % stations.length;
    setActiveStationId(stations[nextIndex].id);
  }

  const modeProps = {
    onNext: () => changeStation(1),
    onPrevious: () => changeStation(-1),
    onSelect: setActiveStationId,
    onToggle: () => setPlaying(current => !current),
    playing,
    station
  };

  return (
    <div className="vaporwave-radio-app">
      {radioAppearance === 'cassette' && (
        <CassetteDeckRadio {...modeProps} />
      )}
      {radioAppearance === 'night-drive' && (
        <NightDriveRadio {...modeProps} />
      )}
      {radioAppearance === 'broadcast' && (
        <BroadcastTerminalRadio {...modeProps} />
      )}
    </div>
  );
}
