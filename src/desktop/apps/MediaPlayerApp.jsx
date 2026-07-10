import React, { useState } from 'react';
import { Button, Fieldset, Panel, ProgressBar } from 'react95';
import { playlist } from './data';

export default function MediaPlayerApp() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const currentTrack = playlist[currentTrackIndex];

  function nextTrack() {
    setCurrentTrackIndex(index => (index + 1) % playlist.length);
  }

  function previousTrack() {
    setCurrentTrackIndex(index =>
      index === 0 ? playlist.length - 1 : index - 1
    );
  }

  return (
    <div className="media-player-app">
      <Panel
        aria-label="Now playing"
        className="media-player-display"
        role="region"
        variant="well"
      >
        <p>Now Playing</p>
        <strong>{currentTrack.title}</strong>
        <p>
          {currentTrack.artist} - {currentTrack.length}
        </p>
        <p>{playing ? 'Playing' : 'Paused'}</p>
      </Panel>
      <ProgressBar value={playing ? 42 : 12} />
      <div className="media-player-controls">
        <Button onClick={previousTrack} aria-label="Previous track">
          Prev
        </Button>
        <Button
          aria-label={playing ? 'Pause track' : 'Play track'}
          onClick={() => setPlaying(value => !value)}
        >
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={nextTrack} aria-label="Next track">
          Next
        </Button>
      </div>
      <Fieldset label="Playlist">
        {playlist.map((track, index) => (
          <button
            className="media-player-track"
            onClick={() => setCurrentTrackIndex(index)}
            key={track.title}
          >
            {index + 1}. {track.title}
          </button>
        ))}
      </Fieldset>
    </div>
  );
}
