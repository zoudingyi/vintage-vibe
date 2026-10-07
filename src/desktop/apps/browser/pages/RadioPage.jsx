import React from 'react';
import { Button, Frame } from 'react95';
import { radioStations } from '@/desktop/apps/radio/radioStations';
import PageHeader from '../PageHeader';

export default function RadioPage({ onOpenApp }) {
  const trackCount = radioStations.reduce(
    (total, station) => total + station.tracks.length,
    0
  );

  return (
    <article className="vapornet-page vapornet-radio-page">
      <PageHeader eyebrow="FM CYBERCAST" title="VAPORWAVE RADIO">
        <p>
          Three channels and {trackCount} tracks broadcasting city pop and
          vaporwave memories.
        </p>
      </PageHeader>
      <div className="vapornet-radio-dial" aria-hidden="true">
        {radioStations.map(station => (
          <span key={station.id}>{station.frequency}</span>
        ))}
      </div>

      <Frame
        className="vapornet-launch-panel vapornet-radio-launch-panel"
        variant="status"
      >
        <div>
          <strong>LIVE PLAYER // DESKTOP APPLICATION</strong>
          <p>Open the receiver to listen and switch stations.</p>
        </div>
        <Button onClick={() => onOpenApp('vaporwave-radio')}>
          Launch Vaporwave Radio
        </Button>
      </Frame>

      <section
        aria-labelledby="station-directory-heading"
        className="vapornet-station-directory"
      >
        <div className="vapornet-station-directory-heading">
          <div>
            <span>ON-AIR CATALOGUE // ALL CHANNELS</span>
            <h2 id="station-directory-heading">FULL STATION DIRECTORY</h2>
          </div>
          <strong>{trackCount} TRACKS INDEXED</strong>
        </div>

        <div className="vapornet-station-list">
          {radioStations.map((station, stationIndex) => (
            <section
              aria-labelledby={`station-${station.id}-frequency station-${station.id}-heading`}
              className={`vapornet-station-card is-${station.id}`}
              key={station.id}
            >
              <header className="vapornet-station-header">
                <span
                  className="vapornet-station-frequency"
                  id={`station-${station.id}-frequency`}
                >
                  {station.frequency} FM
                </span>
                <div>
                  <span>
                    CHANNEL {String(stationIndex + 1).padStart(2, '0')}
                  </span>
                  <h3 id={`station-${station.id}-heading`}>{station.name}</h3>
                </div>
                <strong>{station.tracks.length} TRACKS</strong>
              </header>

              <ol className="vapornet-station-tracks">
                {station.tracks.map((track, trackIndex) => (
                  <li key={`${track.artist}-${track.title}`}>
                    <span aria-hidden="true">
                      {String(trackIndex + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <strong>{track.title}</strong>
                      <span>{track.artist}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
