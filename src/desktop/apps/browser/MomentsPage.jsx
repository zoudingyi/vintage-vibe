import React from 'react';
import { getMomentsNewestFirst } from './momentsData';

function formatPublishedAt(publishedAt) {
  const [date, time] = publishedAt.split('T');
  return `${date.replace(/-/g, '.')} // ${time.slice(0, 5)}`;
}

function getMediaLabel(media) {
  if (media.some(item => item.type === 'video')) {
    return 'VIDEO COVER';
  }

  return media.length > 1 ? 'GALLERY' : 'PHOTO LOG';
}

function MediaPlaceholder({ media, index }) {
  const isVideo = media.type === 'video';

  return (
    <div
      aria-label={media.alt}
      className={`vapornet-moment-media-item is-${media.type} is-${
        media.variant
      } is-tone-${(index % 3) + 1}`}
      role="img"
    >
      <span aria-hidden="true" className="vapornet-moment-media-grid" />
      <span aria-hidden="true" className="vapornet-moment-media-glyph">
        {isVideo ? '▶' : '▧'}
      </span>
      <span className="vapornet-moment-media-copy">
        <strong>{isVideo ? 'STATIC VIDEO COVER' : 'IMAGE SLOT'}</strong>
        <small>{isVideo ? media.duration : `FRAME ${index + 1}`}</small>
      </span>
      <span className="vapornet-moment-media-state">PREVIEW OFFLINE</span>
    </div>
  );
}

export default function MomentsPage() {
  const timeline = getMomentsNewestFirst();

  return (
    <article className="vapornet-page vapornet-moments-page">
      <header className="vapornet-page-header">
        <span className="vapornet-page-eyebrow">
          PERSONAL CHANNEL // STATIC PREVIEW
        </span>
        <h1>MOMENTS SIGNAL ARCHIVE</h1>
        <p>
          一条从现在回望过去的个人时间轴。当前记录均为界面示例，真实内容将在后续版本接入。
        </p>
      </header>

      <section
        aria-label="Moments archive status"
        className="vapornet-moments-status"
      >
        <div>
          <span>ARCHIVE STATE</span>
          <strong>LOCAL / READ ONLY</strong>
        </div>
        <div>
          <span>RECORDS INDEXED</span>
          <strong>{String(timeline.length).padStart(2, '0')}</strong>
        </div>
        <div>
          <span>MEDIA MODES</span>
          <strong>TEXT · PHOTO · VIDEO</strong>
        </div>
      </section>

      <div className="vapornet-moments-archive">
        <section
          aria-label="Personal moments timeline"
          className="vapornet-moments-timeline"
        >
          <ol>
            {timeline.map((moment, index) => {
              const headingId = `moment-${moment.id}`;

              return (
                <li className="vapornet-moment-row" key={moment.id}>
                  <div className="vapornet-moment-date">
                    <span>
                      {String(timeline.length - index).padStart(2, '0')}
                    </span>
                    <time dateTime={moment.publishedAt}>
                      {formatPublishedAt(moment.publishedAt)}
                    </time>
                  </div>
                  <i aria-hidden="true" className="vapornet-moment-node" />
                  <article
                    aria-labelledby={headingId}
                    className="vapornet-moment-card"
                  >
                    <header>
                      <div>
                        <span>SAMPLE RECORD</span>
                        <h2 id={headingId}>
                          TRANSMISSION {String(index + 1).padStart(2, '0')}
                        </h2>
                      </div>
                      <code>{moment.id}</code>
                    </header>
                    <p>{moment.body}</p>

                    {moment.media.length > 0 && (
                      <section
                        aria-label={`${getMediaLabel(
                          moment.media
                        )} placeholder`}
                        className={`vapornet-moment-media is-${
                          moment.media.length > 1 ? 'gallery' : 'single'
                        }`}
                      >
                        <div className="vapornet-moment-media-heading">
                          <strong>{getMediaLabel(moment.media)}</strong>
                          <span>STATIC MEDIA // NO SOURCE ATTACHED</span>
                        </div>
                        <div className="vapornet-moment-media-grid-layout">
                          {moment.media.map((media, mediaIndex) => (
                            <MediaPlaceholder
                              index={mediaIndex}
                              key={media.id}
                              media={media}
                            />
                          ))}
                        </div>
                      </section>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="vapornet-moments-footer">
          <span>END OF LOCAL ARCHIVE // SIGNAL CONTINUES</span>
          <p>
            More personal transmissions will appear here when the archive is
            ready.
          </p>
        </footer>
      </div>
    </article>
  );
}
