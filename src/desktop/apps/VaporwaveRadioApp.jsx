import React from 'react';
import { Button, Panel } from 'react95';
import './VaporwaveRadioApp.css';

const stations = [
  {
    artist: 'SHAMBARA',
    audioSrc: '/audio/palm-mirage/SHAMBARA - Solid Dance.mp3',
    frequency: '88.7',
    id: 'mirage',
    name: 'Palm Mirage',
    title: 'Solid Dance'
  },
  {
    artist: '松原みき',
    audioSrc:
      '/audio/midnight-plaza/松原みき - 真夜中のドアStay With Me.mp3',
    frequency: '94.2',
    id: 'midnight',
    name: 'Midnight Plaza',
    title: '真夜中のドア Stay With Me'
  },
  {
    artist: '山下達郎',
    audioSrc: '/audio/dream-channel/山下達郎 - Ride On Time.mp3',
    frequency: '101.9',
    id: 'dream',
    name: 'Dream Channel',
    title: 'Ride On Time'
  }
];

function formatPlaybackTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
}

function TransportControls({ playing, onNext, onPrevious, onToggle }) {
  return (
    <div className="radio-mode-transport" aria-label="Playback controls">
      <Button aria-label="Previous station" onClick={onPrevious}>
        ◀◀
      </Button>
      <Button aria-label={playing ? 'Pause music' : 'Play music'} onClick={onToggle}>
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
  timeLabel,
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
          <div
            aria-label="Now playing"
            className="radio-a-label"
            role="region"
          >
            <span>{station.name} · SIDE A</span>
            <strong>{station.title}</strong>
            <span>{station.artist} · STEREO · HIGH BIAS</span>
            <span className="radio-track-time">{timeLabel}</span>
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
  timeLabel,
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
          <div
            aria-label="Now playing"
            className="radio-b-overlay"
            role="region"
          >
            <span>LIVE FROM VIRTUAL BAY</span>
            <strong>{station.title}</strong>
            <span>{station.artist} · {station.frequency} FM</span>
            <span className="radio-track-time">{timeLabel}</span>
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
          <span>{timeLabel}</span>
        </footer>
      </div>
    </section>
  );
}

function BroadcastTerminalRadio({
  station,
  timeLabel,
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
          <div
            aria-label="Now playing"
            className="radio-c-crt"
            role="region"
          >
            <span className="radio-c-scanline" aria-hidden="true" />
            <span>TUNED TO {station.frequency} MHz</span>
            <strong>{station.title.toUpperCase()}</strong>
            <div className="radio-c-wave" aria-hidden="true">
              ▂▃▅▆▃▁▃▇▅▂▁▅▇▃▂▆▅▂▁▃▆▇▅▂
            </div>
            <p>
              {station.artist} · {playing
                ? 'Receiving stereo broadcast…'
                : 'Carrier detected. Awaiting playback.'}
            </p>
            <span className="radio-track-time">{timeLabel}</span>
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
  const audioRef = React.useRef(null);
  const resumeAfterTuneRef = React.useRef(false);
  const [activeStationId, setActiveStationId] = React.useState('midnight');
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackNotice, setPlaybackNotice] = React.useState('');
  const [playing, setPlaying] = React.useState(false);
  const stationIndex = stations.findIndex(station => station.id === activeStationId);
  const station = stations[stationIndex];
  const reportPlaybackError = React.useCallback(() => {
    setPlaying(false);
    setPlaybackNotice(`Could not load ${station.name}. Try another station.`);
  }, [station.name]);
  const reportPlaybackRejection = React.useCallback(
    error => {
      setPlaying(false);
      if (error?.name === 'NotAllowedError') {
        setPlaybackNotice('Browser blocked playback. Click Play again.');
        return;
      }
      if (error?.name === 'NotSupportedError') {
        setPlaybackNotice(`This browser cannot play ${station.name}.`);
        return;
      }
      setPlaybackNotice(`Could not start ${station.name}. Try again.`);
    },
    [station.name]
  );
  const requestPlayback = React.useCallback(
    audio => {
      try {
        const playRequest = audio.play();
        playRequest?.catch(reportPlaybackRejection);
      } catch (error) {
        reportPlaybackRejection(error);
      }
    },
    [reportPlaybackRejection]
  );

  React.useEffect(() => {
    const audio = audioRef.current;

    setCurrentTime(0);
    setDuration(0);
    if (resumeAfterTuneRef.current) {
      resumeAfterTuneRef.current = false;
      requestPlayback(audio);
    }
  }, [requestPlayback, station.audioSrc]);

  React.useEffect(() => {
    const audio = audioRef.current;
    const soundAvailable =
      desktopSettings.soundEnabled && desktopSettings.masterVolume > 0;

    audio.volume = soundAvailable ? desktopSettings.masterVolume / 100 : 0;
    if (!soundAvailable && playing) {
      setPlaybackNotice('Playback paused by the global audio settings.');
      audio.pause();
    }
  }, [
    desktopSettings.masterVolume,
    desktopSettings.soundEnabled,
    playing
  ]);

  function selectStation(stationId) {
    if (stationId === activeStationId) {
      return;
    }

    resumeAfterTuneRef.current = playing;
    setPlaybackNotice('');
    setActiveStationId(stationId);
  }

  function changeStation(direction) {
    const nextIndex = (stationIndex + direction + stations.length) % stations.length;
    selectStation(stations[nextIndex].id);
  }

  function togglePlayback() {
    const audio = audioRef.current;

    if (playing) {
      audio.pause();
      return;
    }

    if (!desktopSettings.soundEnabled || desktopSettings.masterVolume === 0) {
      setPlaybackNotice('Enable sound in Settings to start the broadcast.');
      return;
    }

    setPlaybackNotice('');
    requestPlayback(audio);
  }

  function restartBroadcast() {
    const audio = audioRef.current;

    audio.currentTime = 0;
    setCurrentTime(0);
    requestPlayback(audio);
  }

  const modeProps = {
    onNext: () => changeStation(1),
    onPrevious: () => changeStation(-1),
    onSelect: selectStation,
    onToggle: togglePlayback,
    playing,
    station,
    timeLabel: `${formatPlaybackTime(currentTime)} / ${formatPlaybackTime(
      duration
    )}`
  };

  return (
    <div className="vaporwave-radio-app">
      <audio
        onEnded={restartBroadcast}
        onError={reportPlaybackError}
        onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
        onPause={() => setPlaying(false)}
        onPlay={() => {
          setPlaybackNotice('');
          setPlaying(true);
        }}
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
        src={station.audioSrc}
      />
      {playbackNotice && (
        <p className="radio-playback-notice" role="status">
          {playbackNotice}
        </p>
      )}
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
