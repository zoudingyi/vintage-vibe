import React from 'react';
import catCookie from '@/assets/images/about/cat-cookie.jpg';
import catHana from '@/assets/images/about/cat-hana.jpg';
import catTaotao from '@/assets/images/about/cat-taotao.jpg';
import catTuotuo from '@/assets/images/about/cat-tuotuo.jpg';
import catYangyu from '@/assets/images/about/cat-yangyu.jpg';
import devoPortrait from '@/assets/images/about/devo-portrait.jpg';
import marcPortrait from '@/assets/images/about/marc.jpeg';
import r3Main from '@/assets/images/about/r3-main.jpg';
import PageHeader from '../PageHeader';

const aboutCats = [
  ['01', 'Hana', 'SUNLIGHT CACHE', catHana],
  ['02', 'Cookie', 'THRONE OCCUPIED', catCookie],
  ['03', '桃桃', 'MOOD BUFFERING', catTaotao],
  ['04', '洋芋', 'HOLIDAY CAMO', catYangyu],
  ['05', '坨坨', 'TREAT RADAR', catTuotuo]
];

export default function AboutPage() {
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
          离开前请确认没有猫猫跟随!
        </p>
      </footer>
    </article>
  );
}
