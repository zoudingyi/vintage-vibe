import React from 'react';
import { Button, Fieldset, Panel } from 'react95';
import catCookie from '../../../assets/images/about/cat-cookie.jpg';
import catHana from '../../../assets/images/about/cat-hana.jpg';
import catTaotao from '../../../assets/images/about/cat-taotao.jpg';
import catTuotuo from '../../../assets/images/about/cat-tuotuo.jpg';
import catYangyu from '../../../assets/images/about/cat-yangyu.jpg';
import devoPortrait from '../../../assets/images/about/devo-portrait.jpg';
import marcPortrait from '../../../assets/images/about/marc.jpeg';
import r3Main from '../../../assets/images/about/r3-main.jpg';
import GuestbookContent, {
  archivedGuestbookEntries
} from '../../guestbook/GuestbookContent';
import { radioStations } from '../../radioStations';
import { projects } from '../data';
import {
  browserPages,
  getAddressKind,
  getInternalPageId,
  getSearchQuery,
  searchVaporNet
} from './browserModel';
import { favoriteAlbums, favoriteTracks } from './favoriteRecords';

function PageLink({ address, children, onNavigate }) {
  return (
    <button
      className="vapornet-link"
      onClick={() => onNavigate(address)}
      type="button"
    >
      {children}
    </button>
  );
}

function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="vapornet-page-header">
      <span className="vapornet-page-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children}
    </header>
  );
}

const nowOnlineItems = [
  ['FEATURED TOPICS', 'Sixties USA'],
  ['ACTIVE SIGNAL', 'Night City / Channel 94.2'],
  ['WALLPAPER', 'Neon Horizon'],
  ["CURATOR'S PICK", 'OH NO, OH YES! - 中森明菜']
];

const aboutCats = [
  ['01', 'Hana', 'SUNLIGHT CACHE', catHana],
  ['02', 'Cookie', 'THRONE OCCUPIED', catCookie],
  ['03', '桃桃', 'MOOD BUFFERING', catTaotao],
  ['04', '洋芋', 'HOLIDAY CAMO', catYangyu],
  ['05', '坨坨', 'TREAT RADAR', catTuotuo]
];

function HomePage({ onNavigate }) {
  const destinations = [
    ['vintage://about', 'About Me', 'Personal signal & interests'],
    ['vintage://projects', 'Project Archive', 'Interactive frontend systems'],
    ['vintage://radio', 'Radio Station', 'Tune into the desktop broadcast'],
    ['vintage://favorites', 'Favorite Records', 'A playlist-shaped canon'],
    ['vintage://guestbook', 'Guestbook', 'Leave a local message'],
    ['vintage://links', 'Cool Links', 'External destinations'],
    ['vintage://help', 'Browser Help', 'Addresses and safety information']
  ];

  return (
    <article className="vapornet-page vapornet-home-page">
      <div className="vapornet-marquee" aria-label="VaporNet status">
        <span>★ VAPORNET GATEWAY ONLINE ★ LOCAL INTRANET 1999 ★</span>
      </div>
      <PageHeader eyebrow="仮想世界 // NODE 88.7" title="WELCOME TO VAPORNET">
        <p>
          A handcrafted personal homepage transmitted from the Vintage Vibe
          desktop.
        </p>
      </PageHeader>

      <section aria-label="Now online" className="vapornet-now-panel">
        <div className="vapornet-now-heading">
          <span aria-hidden="true" />
          <strong>NOW ONLINE</strong>
          <button
            onClick={() => onNavigate('vintage://favorites')}
            type="button"
          >
            Browse record shelf →
          </button>
        </div>
        <dl>
          {nowOnlineItems.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="vapornet-home-grid">
        {destinations.map(([address, title, description]) => (
          <button
            className="vapornet-directory-card"
            onClick={() => onNavigate(address)}
            type="button"
            key={address}
          >
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>

      <div className="vapornet-home-footer">
        <span className="vapornet-new-badge">NEW!</span>
        <p>Best viewed at 800 × 600 with 256 colors.</p>
        <p>
          Visitors: <strong className="vapornet-counter">0001999</strong>
        </p>
      </div>
    </article>
  );
}

function AboutPage() {
  const telemetry = [
    ['SIGNAL ORIGIN', 'CHENGDU'],
    ['REALITY STATUS', 'OFFLINE'],
    ['FUTURE STATUS', 'LOST'],
    ['MEMORY CACHE', 'FRAGMENTED'],
    ['NEON LEVEL', 'MAXIMUM'],
    ['ARCHIVE ACCESS', 'GRANTED'],
    ['LOCAL NETWORK', 'ONLINE'],
    ['TRANSMISSION', 'ETERNAL']
  ];

  return (
    <article className="vapornet-page vapornet-about-page">
      <PageHeader
        eyebrow="VAPORNET PERSONAL CHANNEL // NODE 93"
        title="DEVO CONTROL ROOM"
      >
        <p>「未来は消えても、信号は永遠に」</p>
      </PageHeader>

      <div aria-label="Personal signal ticker" className="vapornet-about-ticker">
        <span>
          WELCOME TO DEVO CONTROL ROOM ◆ 失われた未来へようこそ ◆ ALL
          PERSONAL SIGNALS ONLINE
        </span>
      </div>

      <section
        aria-labelledby="about-operator-heading"
        className="vapornet-about-operator"
      >
        <div className="vapornet-about-portrait">
          <img
            alt="Devo Zou with Yamaha YZF-R3"
            decoding="async"
            src={devoPortrait}
          />
          <div className="vapornet-about-photo-label">
            <span>OPERATOR CAPTURE // CHENGDU</span>
            <strong>DEVO</strong>
          </div>
        </div>

        <div className="vapornet-about-intro">
          <span>OPERATOR SIGNAL // PERSONAL FILE</span>
          <h2 id="about-operator-heading">DEVO ZOU</h2>
          <p className="vapornet-about-handle">
            aka zoudingyi · Chengdu, China
          </p>
          <p>
            Hi ~ 👋 我是 Devo，生活在成都。喜欢会发出引擎声 🏍️、背景音乐 🎧
            或者胜负提示音 🎮 的东西。
          </p>
          <p>
            周末空闲时，我可能正在骑车 、看 MotoGP 、打 DOTA 2
            、进入某个单机游戏的世界，或者告诉自己“看完这一集就睡” 。但你知道的，在成都工作通常意味着没有周末。
          </p>
          <p>打工好累，但我不能哭，因为骑摩托车的时候擦眼泪不安全。</p>
          <p>
            我的理想一天并不复杂：适合骑车的天气，耳机里有好歌 ，比赛准时开始，队友也刚好在线
            。现实通常只能满足其中两项，但问题不大。
          </p>
          <dl>
            <div>
              <dt>RIDE SIGNAL</dt>
              <dd>YZF-R3</dd>
            </div>
            <div>
              <dt>FAVORITE GAME</dt>
              <dd>DOTA 2</dd>
            </div>
            <div>
              <dt>SYNC CHANNEL</dt>
              <dd>EVA-01</dd>
            </div>
            <div>
              <dt>CAT NODES</dt>
              <dd>5 ONLINE</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="vapornet-about-interest-grid">
        <section
          aria-labelledby="about-machine-heading"
          className="vapornet-about-card is-machine"
        >
          <div className="vapornet-r3-photo">
            <img
              alt="Yamaha YZF-R3 parked by a Chengdu street"
              decoding="async"
              src={r3Main}
            />
            <span>R3 // IGNITION READY</span>
          </div>
          <div className="vapornet-about-card-copy">
            <span>MACHINE FILE // IGNITION READY</span>
            <h2 id="about-machine-heading">MACHINE &amp; SPEED</h2>
            <strong>YAMAHA YZF-R3</strong>
            <p>
              只有骑上它的那一刻才是绝对的自由的，目的地可以稍后决定，天气和油量比较重要。
            </p>
            <dl className="vapornet-about-mini-stats">
              <div>
                <dt>TOP SPEED RECORD</dt>
                <dd>DATA REDACTED</dd>
              </div>
              <div>
                <dt>RIDE REASON</dt>
                <dd>DO I NEED ONE?</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="about-racing-heading"
          className="vapornet-about-card is-racing"
        >
          <div className="vapornet-rider-photo">
            <img
              alt="Marc Márquez riding MotoGP bike number 93"
              decoding="async"
              src={marcPortrait}
            />
            <span>RACE CAM // LIVE</span>
            <strong aria-hidden="true">93</strong>
            <small>ATTACK MODE // ENABLED</small>
          </div>
          <div className="vapornet-about-card-copy">
            <span>MOTOGP // FAVORITE RIDER</span>
            <h2 id="about-racing-heading">RACING SIGNAL</h2>
            <strong>MARC MÁRQUEZ</strong>
            <p>
              极致的过弯救车技术、无畏的拼搏冲劲以及永不言弃的坚韧精神。
            </p>
            <dl className="vapornet-about-mini-stats">
              <div>
                <dt>RACE MODE</dt>
                <dd>ATTACK</dd>
              </div>
              <div>
                <dt>PHYSICS</dt>
                <dd>NEGOTIABLE</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="about-dota-heading"
          className="vapornet-about-card is-dota"
        >
          <div className="vapornet-about-card-status is-dota-status">
            <span aria-hidden="true" />
            PLAYER PROFILE // ONLINE
            <strong>SERVER CONNECTED</strong>
          </div>
          <div className="vapornet-dota-client">
            <svg
              aria-label="Dota 2 logo"
              className="vapornet-dota-logo"
              role="img"
              viewBox="0 0 100 100"
            >
              <title>Dota 2 logo</title>
              <path d="M14 10 90 16 84 90 10 84Z" />
              <path
                className="vapornet-dota-logo-cut"
                d="m24 20 54 58M31 19l-11 1 1 24m58-22-1 26M23 79l27 2m28-3-17-2"
              />
            </svg>
            <div className="vapornet-dota-hero">
              <span>AXE</span>
              <small>OFFLANE // POS 3</small>
            </div>
            <small className="vapornet-dota-latency">
              <i aria-hidden="true" /> PING 32 MS
            </small>
          </div>
          <div className="vapornet-about-card-copy">
            <span>PLAYER PROFILE // SONGOKU</span>
            <h2 id="about-dota-heading">DOTA 2 TERMINAL</h2>
            <strong>SONGOKU // AXE MAIN</strong>
            <p>
              我的青春就是 DOTA
              <br />
              抱着 “赢一把就睡的” 信念，然后奋战到天明
            </p>
            <p></p>
            <dl className="vapornet-about-mini-stats">
              <div>
                <dt>NICKNAME</dt>
                <dd>SonGoKu</dd>
              </div>
              <div>
                <dt>POSITION</dt>
                <dd>3号位</dd>
              </div>
              <div>
                <dt>SIGNATURE HERO</dt>
                <dd>斧王</dd>
              </div>
              <div>
                <dt>PEAK RANK</dt>
                <dd>冠绝一世</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="about-eva-heading"
          className="vapornet-about-card is-eva"
        >
          <div className="vapornet-about-card-status is-eva-status">
            <span aria-hidden="true" />
            NERV SYNC LINK // ACTIVE
            <strong>MAGI CONNECTED</strong>
          </div>
          <div
            aria-label="EVA Unit-01 synchronization monitor with deployed A.T. Field"
            className="vapornet-eva-monitor"
            role="img"
          >
            <div aria-hidden="true" className="vapornet-eva-hazard">
              CAUTION // ABSOLUTE TERROR FIELD
            </div>
            <div aria-hidden="true" className="vapornet-eva-at-field">
              <svg viewBox="0 0 120 120">
                <polygon points="60,3 108,31 108,89 60,117 12,89 12,31" />
                <polygon points="60,16 97,38 97,82 60,104 23,82 23,38" />
                <polygon points="60,29 86,44 86,76 60,91 34,76 34,44" />
                <path d="M60 3v26M108 31 86 44M108 89 86 76M60 117V91M12 89l22-13M12 31l22 13" />
              </svg>
              <span>A.T.</span>
            </div>
            <div aria-hidden="true" className="vapornet-eva-core">
              <span>01</span>
              <i />
            </div>
            <div aria-hidden="true" className="vapornet-eva-waveform">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="vapornet-eva-readout">
              <span>PATTERN // BLUE</span>
              <small>A.T. FIELD // DEPLOYED</small>
            </div>
          </div>
          <div className="vapornet-about-card-copy">
            <span>NERV ARCHIVE // PILOT PROFILE</span>
            <h2 id="about-eva-heading">EVA SYNC MONITOR</h2>
            <strong>SHINJI IKARI // EVA-01</strong>
            <p>逃げちゃダメだ、逃げちゃダメだ、逃げちゃダメだ!</p>
            <dl className="vapornet-about-mini-stats">
              <div>
                <dt>PILOT</dt>
                <dd>碇シンジ</dd>
              </div>
              <div>
                <dt>AGE</dt>
                <dd>14</dd>
              </div>
              <div>
                <dt>DESIGNATION</dt>
                <dd>THIRD CHILDREN</dd>
              </div>
              <div>
                <dt>ASSIGNED UNIT</dt>
                <dd>初号机</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <section
        aria-labelledby="about-cats-heading"
        className="vapornet-cat-network"
      >
        <div className="vapornet-cat-network-heading">
          <div>
            <span>HOME NETWORK // 5 NODES ONLINE</span>
            <h2 id="about-cats-heading">CAT SURVEILLANCE WALL</h2>
          </div>
          <strong>HUMAN ADMIN: PERMISSION DENIED</strong>
        </div>
        <p>
          家里运行着五个独立、不可预测、拒绝统一调度的猫咪节点。系统整体稳定，但凌晨可能出现高速移动和不明物体坠落。
        </p>
        <ol className="vapornet-cat-grid">
          {aboutCats.map(([node, name, status, image]) => (
            <li key={node}>
              <div className="vapornet-cat-feed">
                <img
                  alt={`${name} 的照片`}
                  decoding="async"
                  src={image}
                />
                <span>CAM {node}</span>
              </div>
              <div className="vapornet-cat-identity">
                <strong>{name}</strong>
                <small>{`CAT-${node} // ${status}`}</small>
              </div>
            </li>
          ))}
        </ol>
        <dl className="vapornet-cat-stats">
          <div>
            <dt>FOOD REQUESTS</dt>
            <dd>CONTINUOUS</dd>
          </div>
          <div>
            <dt>KEYBOARD ACCESS</dt>
            <dd>UNAUTHORIZED</dd>
          </div>
          <div>
            <dt>NIGHT ACTIVITY</dt>
            <dd>HIGH</dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="about-telemetry-heading"
        className="vapornet-about-telemetry"
      >
        <div className="vapornet-about-telemetry-heading">
          <span aria-hidden="true" />
          <h2 id="about-telemetry-heading">PERSONAL TELEMETRY</h2>
          <small>ALL SYSTEMS OPERATIONAL // MORE OR LESS</small>
        </div>
        <dl>
          {telemetry.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="vapornet-about-closing">
        <strong>THANKS FOR VISITING THE CONTROL ROOM.</strong>
        <p>
          离开前请确认没有猫猫跟随
        </p>
      </footer>
    </article>
  );
}

function FavoritesPage() {
  return (
    <article className="vapornet-page vapornet-records-page">
      <PageHeader eyebrow="PERSONAL RECORD ARCHIVE" title="FAVORITE RECORDS">
        <p>
          A personal shelf of Japanese city pop, AOR, boogie, and urban soul—
          selected for polished grooves, coastal light, and after-dark
          melancholy.
        </p>
      </PageHeader>

      <Panel className="vapornet-record-notice" variant="well">
        <strong>PROFILE: COASTAL LIGHT // CITY NIGHTS</strong>
        <span>
          Female vocals, precise arrangements, deep album cuts, and alternate
          interpretations connect the records and songs collected here.
        </span>
      </Panel>

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

function ProjectsPage({ address, onNavigate }) {
  const searchParameters = new URLSearchParams(address.split('?')[1] || '');
  const selectedProjectId = searchParameters.get('project');

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="SOFTWARE DIRECTORY" title="PROJECT ARCHIVE">
        <p>Interactive frontend work recovered from the local intranet.</p>
      </PageHeader>
      <div className="vapornet-project-list">
        {projects.map((project, index) => (
          <Panel
            className={
              selectedProjectId === project.id
                ? 'vapornet-project-card is-selected'
                : 'vapornet-project-card'
            }
            variant="well"
            key={project.id}
          >
            <span className="vapornet-project-number">
              FILE {String(index + 1).padStart(2, '0')}
            </span>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.stack}</dd>
              </div>
            </dl>
            <Button onClick={() => onNavigate(project.github)}>
              Visit project link
            </Button>
          </Panel>
        ))}
      </div>
    </article>
  );
}

function RadioPage({ onOpenApp }) {
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

      <Panel
        className="vapornet-launch-panel vapornet-radio-launch-panel"
        variant="well"
      >
        <div>
          <strong>LIVE PLAYER // DESKTOP APPLICATION</strong>
          <p>Open the receiver to listen and switch stations.</p>
        </div>
        <Button onClick={() => onOpenApp('vaporwave-radio')}>
          Launch Vaporwave Radio
        </Button>
      </Panel>

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

function GuestbookPage() {
  return (
    <article className="vapornet-page vapornet-guestbook-page">
      <PageHeader eyebrow="VISITOR SERVICES // NODE 1999" title="GUESTBOOK">
        <p>
          Leave a trace before the connection closes. Messages, memories, and
          late-night transmissions are welcome.
        </p>
      </PageHeader>

      <GuestbookContent
        archivedEntries={archivedGuestbookEntries}
        mode="page"
      />
    </article>
  );
}

function LinksPage({ onNavigate }) {
  const linkCollections = [
    {
      address: 'https://www.cameronsworld.net/',
      description:
        'A rough but personal web, assembled from the lost neighborhoods of GeoCities.',
      label: "Cameron's World",
      tag: 'WEB ARCHAEOLOGY'
    },
    {
      address: 'https://www.windows93.net/',
      description:
        'A fictional operating system where the desktop itself becomes the artwork.',
      label: 'WINDOWS93',
      tag: 'PLAYABLE INTERFACE'
    },
    {
      address: 'https://forum.melonland.net/',
      description:
        'A slower corner of the internet for personal sites, web gardens, and webrings.',
      label: 'MelonLand',
      tag: 'INDEPENDENT WEB'
    },
    {
      address: 'https://512kb.club/',
      description: 'A reminder that restraint is also a design choice.',
      label: '512KB Club',
      tag: 'SMALL WEB'
    }
  ];

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="WORLD WIDE WEB" title="COOL LINKS">
        <p>
          Places that still believe a website can carry the personality of its
          maker.
        </p>
      </PageHeader>
      <div className="vapornet-curated-links">
        {linkCollections.map(link => (
          <article className="vapornet-curated-link" key={link.address}>
            <span>{link.tag}</span>
            <PageLink address={link.address} onNavigate={onNavigate}>
              {link.label} ↗
            </PageLink>
            <p>{link.description}</p>
          </article>
        ))}
      </div>
      <Panel className="vapornet-personal-links" variant="well">
        <strong>PERSONAL TERMINALS</strong>
        <PageLink
          address="https://github.com/zoudingyi"
          onNavigate={onNavigate}
        >
          GitHub // zoudingyi
        </PageLink>
        <PageLink
          address="mailto:18483641399@163.com"
          onNavigate={onNavigate}
        >
          Electronic Mail Terminal
        </PageLink>
      </Panel>
      <p className="vapornet-curated-stamp">CURATED BY HAND</p>
    </article>
  );
}

function SearchPage({ address, onNavigate }) {
  const initialQuery = getSearchQuery(address);
  const [query, setQuery] = React.useState(initialQuery);
  const results = searchVaporNet(initialQuery);

  function submitSearch(event) {
    event.preventDefault();
    onNavigate(`vintage://search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="LOCAL INDEX" title="SEARCH RESULTS">
        <p>Search pages and project records stored on VaporNet.</p>
      </PageHeader>
      <form className="vapornet-search-form" onSubmit={submitSearch} role="search">
        <label htmlFor="vapornet-search-input">Search VaporNet</label>
        <div>
          <input
            id="vapornet-search-input"
            onChange={event => setQuery(event.target.value)}
            value={query}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {initialQuery ? (
        <section aria-label="Search results" className="vapornet-search-results">
          <p>
            {results.length} result{results.length === 1 ? '' : 's'} for “
            {initialQuery}”
          </p>
          {results.length > 0 ? (
            results.map(result => (
              <button
                className="vapornet-search-result"
                onClick={() => onNavigate(result.address)}
                type="button"
                key={result.id}
              >
                <strong>{result.title}</strong>
                <span>{result.description}</span>
              </button>
            ))
          ) : (
            <p>No matching documents were found on the local intranet.</p>
          )}
        </section>
      ) : (
        <p>Enter a search term to query the local index.</p>
      )}
    </article>
  );
}

function HelpPage() {
  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="INTERNET EXPLORER HELP" title="VAPORNET HELP">
        <p>This program browses a safe, simulated local internet.</p>
      </PageHeader>
      <Fieldset label="Supported addresses">
        <p>
          Use <code>vintage://home</code> or enter a page name such as{' '}
          <code>projects</code>.
        </p>
        <p>HTTPS and email links are handed to the system browser.</p>
      </Fieldset>
      <Fieldset label="Keyboard shortcuts">
        <p>Ctrl+L — focus the address bar</p>
        <p>Alt+Left / Alt+Right — move through history</p>
        <p>F5 — refresh the current page</p>
      </Fieldset>
    </article>
  );
}

function ExternalPage({ address }) {
  return (
    <article className="vapornet-page vapornet-system-page">
      <PageHeader eyebrow="INTERNET ZONE" title="EXTERNAL LINK">
        <p>VaporNet does not embed arbitrary external websites.</p>
      </PageHeader>
      <Panel variant="well">
        <p className="vapornet-external-address">{address}</p>
        <a href={address} rel="noopener noreferrer" target="_blank">
          Open in a new browser tab
        </a>
      </Panel>
    </article>
  );
}

function NotFoundPage({ address, onNavigate }) {
  return (
    <article className="vapornet-page vapornet-system-page">
      <PageHeader eyebrow="DNS ERROR" title="404 — PAGE NOT FOUND">
        <p>The local server could not locate this VaporNet address.</p>
      </PageHeader>
      <Panel variant="well">
        <code>{address}</code>
        <p>Check the address or return to the home gateway.</p>
        <Button onClick={() => onNavigate('vintage://home')}>
          Return Home
        </Button>
      </Panel>
    </article>
  );
}

export default function BrowserPage({ address, onNavigate, onOpenApp }) {
  if (getAddressKind(address) === 'external') {
    return <ExternalPage address={address} />;
  }

  const pageId = getInternalPageId(address);
  const pageProps = { address, onNavigate, onOpenApp };

  switch (pageId) {
    case 'home':
      return <HomePage {...pageProps} />;
    case 'about':
      return <AboutPage {...pageProps} />;
    case 'favorites':
      return <FavoritesPage {...pageProps} />;
    case 'projects':
      return <ProjectsPage {...pageProps} />;
    case 'radio':
      return <RadioPage {...pageProps} />;
    case 'guestbook':
      return <GuestbookPage {...pageProps} />;
    case 'links':
      return <LinksPage {...pageProps} />;
    case 'search':
      return <SearchPage {...pageProps} />;
    case 'help':
      return <HelpPage {...pageProps} />;
    default:
      return <NotFoundPage {...pageProps} />;
  }
}

export function getBrowserPageMetadata(address) {
  const pageId = getInternalPageId(address);
  return browserPages[pageId] || null;
}
