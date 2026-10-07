import React from 'react';
import { Frame } from 'react95';
import { favoriteAlbums, favoriteTracks } from '../favoriteRecords';
import PageHeader from '../PageHeader';

export default function FavoritesPage() {
  return (
    <article className="vapornet-page vapornet-records-page">
      <PageHeader eyebrow="PERSONAL RECORD ARCHIVE" title="FAVORITE RECORDS">
        <p>
          A personal shelf of Japanese city pop, AOR, boogie, and urban soul—
          selected for polished grooves, coastal light, and after-dark
          melancholy.
        </p>
      </PageHeader>

      <Frame className="vapornet-record-notice" variant="status">
        <strong>PROFILE: COASTAL LIGHT // CITY NIGHTS</strong>
        <span>
          Female vocals, precise arrangements, deep album cuts, and alternate
          interpretations connect the records and songs collected here.
        </span>
      </Frame>

      <section
        aria-labelledby="core-albums-heading"
        className="vapornet-records-section"
      >
        <div className="vapornet-section-heading">
          <div>
            <span>FIRST-TIER COMPLETE // CORE-ARTIST DEPTH</span>
            <h2 id="core-albums-heading">CORE ALBUMS</h2>
          </div>
          <strong className="vapornet-record-count">
            {favoriteAlbums.length} RELEASES
          </strong>
        </div>

        <div className="vapornet-album-grid">
          {favoriteAlbums.map((record, index) => (
            <article className="vapornet-album-card" key={record.title}>
              <div className="vapornet-album-artwork">
                <span aria-hidden="true" className="vapornet-album-disc">
                  <i />
                </span>
                <img
                  alt={`${record.title} by ${record.artist} album cover`}
                  src={record.cover}
                />
                <span aria-hidden="true" className="vapornet-album-index">
                  A-{String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="vapornet-album-details">
                <span>
                  {record.evidence}
                  {' // '}
                  {record.format}
                </span>
                <h3>{record.title}</h3>
                <strong>{record.artist}</strong>
                <dl>
                  <div>
                    <dt>Released</dt>
                    <dd>{record.released}</dd>
                  </div>
                  <div>
                    <dt>Label</dt>
                    <dd>{record.label}</dd>
                  </div>
                </dl>
                <p className="vapornet-album-highlight">
                  <span>NEEDLE DROP</span>
                  <strong>{record.highlight}</strong>
                </p>
                <p className="vapornet-album-note">{record.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="favorite-tracks-heading"
        className="vapornet-tracks-section"
      >
        <div className="vapornet-section-heading">
          <div>
            <span>20 SONGS // A PERSONAL SIGNAL MAP</span>
            <h2 id="favorite-tracks-heading">FAVORITE TRACKS</h2>
          </div>
          <strong className="vapornet-record-count">
            {favoriteTracks.length} TRACKS
          </strong>
        </div>

        <div className="vapornet-tracks-grid">
          {favoriteTracks.map((record, index) => (
            <article className="vapornet-track-card" key={record.title}>
              <div className="vapornet-track-artwork">
                <img
                  alt={`${record.title} by ${record.artist} artwork`}
                  src={record.cover}
                />
                <span aria-hidden="true">
                  T-{String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="vapornet-track-details">
                <span>{record.signal}</span>
                <h3>{record.title}</h3>
                <strong>{record.artist}</strong>
                <dl>
                  <div>
                    <dt>Released</dt>
                    <dd>{record.released}</dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>{record.source}</dd>
                  </div>
                </dl>
                <p>{record.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
