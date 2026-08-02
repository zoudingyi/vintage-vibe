import React from 'react';
import { Button, Frame } from 'react95';
import {
  createRadioVisualizer,
  EMPTY_RADIO_VISUALIZATION
} from '@/desktop/radioVisualizer';
import { playRadioCue } from '@/desktop/audioEngine';
import {
  createRadioPlaybackMemory,
  radioStations
} from '@/desktop/radioStations';
import './VaporwaveRadioApp.css';

const stations = radioStations;

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

function buildOscilloscopePoints(samples, baseline) {
  const width = 320;
  const amplitude = 24;

  return samples
    .map((sample, index) => {
      const x = (index * width) / Math.max(samples.length - 1, 1);
      const y = baseline + sample * amplitude;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function compactSpectrumBands(bands) {
  return Array.from({ length: 8 }, (_, index) => {
    const pair = bands.slice(index * 2, index * 2 + 2);
    return pair.reduce((total, band) => total + band, 0) / pair.length;
  });
}

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reducedMotion, setReducedMotion] = React.useState(
    () => window.matchMedia?.(query).matches || false
  );

  React.useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const updatePreference = event => setReducedMotion(event.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
    } else {
      mediaQuery.addListener?.(updatePreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updatePreference);
      } else {
        mediaQuery.removeListener?.(updatePreference);
      }
    };
  }, []);

  return reducedMotion;
}

function TransportControls({ playing, onNext, onPrevious, onToggle }) {
  return (
    <div className="radio-mode-transport" aria-label="Playback controls">
      <Button aria-label="Previous track" onClick={onPrevious}>
        ◀◀
      </Button>
      <Button aria-label={playing ? 'Pause music' : 'Play music'} onClick={onToggle}>
        {playing ? 'Ⅱ PAUSE' : '▶ PLAY'}
      </Button>
      <Button aria-label="Next track" onClick={onNext}>
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
  visualization,
  visualizationActive,
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

      <Frame className="radio-a-cassette-bay" variant="status">
        <div className="radio-a-cassette">
          <div
            aria-label="Now playing"
            className="radio-a-label"
            role="region"
          >
            <span>{station.name} · SIDE A</span>
            <strong>{station.title}</strong>
            <span>
              {station.artist} · TRACK {station.trackPosition} · STEREO
            </span>
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
      </Frame>

      <div className="radio-a-readout">
        <span>{playing ? 'PLAY' : 'STANDBY'}</span>
        <div
          aria-label="Dual VU meters"
          className="radio-a-levels"
          data-active={visualizationActive}
          role="img"
        >
          {visualization.levels.map((level, index) => (
            <span key={index}>
              <b>{index === 0 ? 'L' : 'R'}</b>
              <i style={{ '--level': `${Math.round(level * 100)}%` }} />
            </span>
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
  visualization,
  visualizationActive,
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
            <span>
              {station.artist} · {station.frequency} FM · {station.trackPosition}
            </span>
            <span className="radio-track-time">{timeLabel}</span>
          </div>
        </div>

        <div
          aria-label="Live frequency spectrum"
          className="radio-b-spectrum"
          data-active={visualizationActive}
          role="img"
        >
          {visualization.bands.map((band, index) => (
            <i
              key={index}
              style={{ '--bar': `${Math.round(3 + band * 29)}px` }}
            />
          ))}
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
  visualization,
  visualizationActive,
  onNext,
  onPrevious,
  onSelect,
  onToggle
}) {
  const spectrumBands = compactSpectrumBands(visualization.bands);

  return (
    <section className="radio-mode radio-mode-c" aria-label="Broadcast Terminal radio mode">
      <header className="radio-c-header">
        <span>VVR-95 NETWORK CONSOLE</span>
        <span className="radio-c-on-air">● {playing ? 'ON AIR' : 'STANDBY'}</span>
      </header>

      <div className="radio-c-layout">
        <Frame className="radio-c-directory" variant="status">
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
        </Frame>

        <div className="radio-c-console">
          <div
            aria-label="Now playing"
            className="radio-c-crt"
            role="region"
          >
            <span className="radio-c-scanline" aria-hidden="true" />
            <span>TUNED TO {station.frequency} MHz</span>
            <strong>{station.title.toUpperCase()}</strong>
            <div
              aria-label="Dual channel CRT oscilloscope"
              className="radio-c-oscilloscope"
              data-active={visualizationActive}
              role="img"
            >
              <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 320 120">
                <defs>
                  <pattern
                    height="20"
                    id="radio-crt-grid"
                    patternUnits="userSpaceOnUse"
                    width="32"
                  >
                    <path className="radio-c-grid-line" d="M 32 0 L 0 0 0 20" />
                  </pattern>
                </defs>
                <rect className="radio-c-grid" height="120" width="320" />
                <line
                  className="radio-c-divider"
                  x1="0"
                  x2="320"
                  y1="60"
                  y2="60"
                />
                <polyline
                  className="radio-c-trace is-channel-one"
                  points={buildOscilloscopePoints(visualization.waveforms[0], 30)}
                />
                <polyline
                  className="radio-c-trace is-channel-two"
                  points={buildOscilloscopePoints(visualization.waveforms[1], 90)}
                />
              </svg>
              <span className="radio-c-channel-label is-channel-one">CH1</span>
              <span className="radio-c-channel-label is-channel-two">CH2</span>
              <span className="radio-c-timebase">TIME/DIV 10ms</span>
            </div>
            <div
              aria-label="8-band spectrum"
              className="radio-c-spectrum"
              data-active={visualizationActive}
              role="img"
            >
              {spectrumBands.map((band, index) => (
                <span key={index}>
                  <i style={{ '--band': `${Math.round(band * 100)}%` }} />
                  <small>{index + 1}</small>
                </span>
              ))}
            </div>
            <p>
              {station.artist} · {playing
                ? 'Receiving stereo broadcast…'
                : 'Carrier detected. Awaiting playback.'}
            </p>
            <span>
              PROGRAM {String(station.trackNumber).padStart(2, '0')} OF{' '}
              {String(station.trackCount).padStart(2, '0')}
            </span>
            <span className="radio-track-time">{timeLabel}</span>
          </div>

          <TransportControls
            onNext={onNext}
            onPrevious={onPrevious}
            onToggle={onToggle}
            playing={playing}
          />

          <Frame className="radio-c-log" variant="status">
            <span>22:41:08  CONNECT {station.frequency}</span>
            <span>22:41:09  SIGNAL LOCKED</span>
            <span>22:41:10  {playing ? 'STREAM ACTIVE' : 'STREAM PAUSED'}</span>
          </Frame>
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
  const reducedMotion = usePrefersReducedMotion();
  const audioRef = React.useRef(null);
  const pendingSeekRef = React.useRef(0);
  const playbackMemoryRef = React.useRef(createRadioPlaybackMemory());
  const resumeAfterLoadRef = React.useRef(false);
  const visualizerRef = React.useRef(null);
  const [activeStationId, setActiveStationId] = React.useState('midnight');
  const [activeTrackIndex, setActiveTrackIndex] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackNotice, setPlaybackNotice] = React.useState('');
  const [playing, setPlaying] = React.useState(false);
  const [visualization, setVisualization] = React.useState(
    EMPTY_RADIO_VISUALIZATION
  );
  const station = stations.find(item => item.id === activeStationId);
  const track = station.tracks[activeTrackIndex];
  const stationDisplay = {
    ...station,
    ...track,
    trackCount: station.tracks.length,
    trackNumber: activeTrackIndex + 1,
    trackPosition: `${String(activeTrackIndex + 1).padStart(2, '0')} / ${String(
      station.tracks.length
    ).padStart(2, '0')}`
  };
  const reportPlaybackError = React.useCallback(() => {
    visualizerRef.current?.stop();
    setPlaying(false);
    setPlaybackNotice(`Could not load ${station.name}. Try another station.`);
  }, [station.name]);
  const reportPlaybackRejection = React.useCallback(
    error => {
      visualizerRef.current?.stop();
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

  React.useEffect(() => {
    visualizerRef.current = createRadioVisualizer({
      AudioContextClass: window.AudioContext || window.webkitAudioContext,
      audio: audioRef.current,
      cancelFrame: window.cancelAnimationFrame,
      onFrame: setVisualization,
      requestFrame: window.requestAnimationFrame
    });

    return () => visualizerRef.current?.destroy();
  }, []);

  React.useEffect(() => {
    if (reducedMotion) {
      visualizerRef.current?.stop();
    } else if (playing) {
      visualizerRef.current?.start();
    }
  }, [playing, reducedMotion]);
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
    setDuration(0);
    setCurrentTime(pendingSeekRef.current);
  }, [track.audioSrc]);

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

    const audio = audioRef.current;
    const targetMemory = playbackMemoryRef.current[stationId];

    playbackMemoryRef.current[activeStationId] = {
      currentTime: audio.currentTime,
      trackIndex: activeTrackIndex
    };
    resumeAfterLoadRef.current = playing;
    pendingSeekRef.current = targetMemory.currentTime;
    setPlaybackNotice('');
    playRadioCue('tuning', desktopSettings);
    visualizerRef.current?.stop();
    setPlaying(false);
    setActiveStationId(stationId);
    setActiveTrackIndex(targetMemory.trackIndex);
  }

  function selectTrack(trackIndex, forcePlayback = false) {
    resumeAfterLoadRef.current = forcePlayback || playing;
    pendingSeekRef.current = 0;
    playbackMemoryRef.current[activeStationId] = {
      currentTime: 0,
      trackIndex
    };
    setPlaybackNotice('');
    visualizerRef.current?.stop();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setActiveTrackIndex(trackIndex);
  }

  function changeTrack(direction, forcePlayback = false) {
    const nextIndex =
      (activeTrackIndex + direction + station.tracks.length) %
      station.tracks.length;

    if (direction > 0 && nextIndex === 0) {
      playRadioCue('tape-flip', desktopSettings);
    }
    selectTrack(nextIndex, forcePlayback);
  }

  function playPreviousTrack() {
    const audio = audioRef.current;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      playbackMemoryRef.current[activeStationId] = {
        currentTime: 0,
        trackIndex: activeTrackIndex
      };
      setCurrentTime(0);
      return;
    }
    changeTrack(-1);
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
    if (!reducedMotion) {
      visualizerRef.current?.start();
    }
    requestPlayback(audio);
  }

  function handleLoadedMetadata(event) {
    const audio = event.currentTarget;
    const restoredTime = pendingSeekRef.current;
    const safeTime =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? Math.min(restoredTime, audio.duration)
        : restoredTime;

    audio.currentTime = safeTime;
    playbackMemoryRef.current[activeStationId] = {
      currentTime: safeTime,
      trackIndex: activeTrackIndex
    };
    pendingSeekRef.current = 0;
    setCurrentTime(safeTime);
    setDuration(audio.duration);
    if (resumeAfterLoadRef.current) {
      resumeAfterLoadRef.current = false;
      requestPlayback(audio);
    }
  }

  function handleTimeUpdate(event) {
    const nextTime = event.currentTarget.currentTime;

    playbackMemoryRef.current[activeStationId] = {
      currentTime: nextTime,
      trackIndex: activeTrackIndex
    };
    setCurrentTime(nextTime);
  }

  const modeProps = {
    onNext: () => changeTrack(1),
    onPrevious: playPreviousTrack,
    onSelect: selectStation,
    onToggle: togglePlayback,
    playing,
    station: stationDisplay,
    timeLabel: `${formatPlaybackTime(currentTime)} / ${formatPlaybackTime(
      duration
    )}`,
    visualization,
    visualizationActive: playing && !reducedMotion
  };

  return (
    <div className="vaporwave-radio-app">
      <audio
        onEnded={() => changeTrack(1, true)}
        onError={reportPlaybackError}
        onLoadedMetadata={handleLoadedMetadata}
        onPause={() => {
          visualizerRef.current?.stop();
          setPlaying(false);
        }}
        onPlay={() => {
          setPlaybackNotice('');
          setPlaying(true);
          if (!reducedMotion) {
            visualizerRef.current?.start();
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
        ref={audioRef}
        src={track.audioSrc}
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
