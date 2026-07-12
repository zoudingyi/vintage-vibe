import React from 'react';
import { createPortal } from 'react-dom';
import { Button, Panel } from 'react95';
import { useSearchParams } from 'react-router-dom';
import './VaporwaveRadioPrototype.css';

// PROTOTYPE: Three Vaporwave Radio directions, switchable via ?variant= on /home.
const variants = [
  { id: 'A', name: 'Cassette Deck' },
  { id: 'B', name: 'Night Drive' },
  { id: 'C', name: 'Broadcast Terminal' }
];

const stations = [
  { frequency: '88.7', id: 'mirage', name: 'Palm Mirage' },
  { frequency: '94.2', id: 'midnight', name: 'Midnight Plaza' },
  { frequency: '101.9', id: 'dream', name: 'Dream Channel' }
];

function TransportControls({ playing, onNext, onPrevious, onToggle }) {
  return (
    <div className="radio-prototype-transport" aria-label="Playback controls">
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
      className={`radio-prototype-stations${vertical ? ' is-vertical' : ''}`}
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

function VariantA({ station, playing, onNext, onPrevious, onSelect, onToggle }) {
  return (
    <section className="radio-prototype radio-prototype-a" aria-label="Cassette Deck variant">
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

      <footer className="radio-prototype-state">
        <span>DECK A</span>
        <span>{station.name}</span>
        <span>{playing ? 'TAPE RUNNING' : 'TAPE STOPPED'}</span>
      </footer>
    </section>
  );
}

function VariantB({ station, playing, onNext, onPrevious, onSelect, onToggle }) {
  return (
    <section className="radio-prototype radio-prototype-b" aria-label="Night Drive variant">
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
        <footer className="radio-prototype-state">
          <span>CRUISE MODE</span>
          <span>{playing ? 'BROADCAST ONLINE' : 'PARKED'}</span>
          <span>00:{playing ? '42' : '00'} / ∞</span>
        </footer>
      </div>
    </section>
  );
}

function VariantC({ station, playing, onNext, onPrevious, onSelect, onToggle }) {
  return (
    <section className="radio-prototype radio-prototype-c" aria-label="Broadcast Terminal variant">
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

      <footer className="radio-prototype-state">
        <span>CH {station.frequency}</span>
        <span>LOCAL MEMORY ONLY</span>
        <span>{station.name}</span>
      </footer>
    </section>
  );
}

function PrototypeSwitcher({ currentVariant, onChange }) {
  const currentIndex = variants.findIndex(variant => variant.id === currentVariant);

  React.useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const editing =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) ||
        target?.isContentEditable;

      if (editing || !['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const nextIndex =
        (currentIndex + direction + variants.length) % variants.length;
      onChange(variants[nextIndex].id);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onChange]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const current = variants[currentIndex];

  return createPortal(
    <div className="prototype-switcher" aria-label="Radio prototype variants">
      <button
        aria-label="Previous radio design"
        onClick={() => onChange(variants[(currentIndex + 2) % variants.length].id)}
      >
        ←
      </button>
      <span>{current.id} — {current.name}</span>
      <button
        aria-label="Next radio design"
        onClick={() => onChange(variants[(currentIndex + 1) % variants.length].id)}
      >
        →
      </button>
    </div>,
    document.body
  );
}

export default function VaporwaveRadioPrototype() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedVariant = searchParams.get('variant')?.toUpperCase();
  const currentVariant = variants.some(variant => variant.id === requestedVariant)
    ? requestedVariant
    : 'A';
  const [activeStationId, setActiveStationId] = React.useState('midnight');
  const [playing, setPlaying] = React.useState(false);
  const stationIndex = stations.findIndex(station => station.id === activeStationId);
  const station = stations[stationIndex];

  const changeVariant = React.useCallback(
    nextVariant => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set('variant', nextVariant);
      setSearchParams(nextSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  function changeStation(direction) {
    const nextIndex = (stationIndex + direction + stations.length) % stations.length;
    setActiveStationId(stations[nextIndex].id);
  }

  const variantProps = {
    onNext: () => changeStation(1),
    onPrevious: () => changeStation(-1),
    onSelect: setActiveStationId,
    onToggle: () => setPlaying(current => !current),
    playing,
    station
  };

  return (
    <div className="vaporwave-radio-prototype">
      {currentVariant === 'A' && <VariantA {...variantProps} />}
      {currentVariant === 'B' && <VariantB {...variantProps} />}
      {currentVariant === 'C' && <VariantC {...variantProps} />}
      <PrototypeSwitcher currentVariant={currentVariant} onChange={changeVariant} />
    </div>
  );
}
