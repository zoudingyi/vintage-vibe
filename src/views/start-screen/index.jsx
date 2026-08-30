import '@fontsource/russo-one/latin-400.css';
import { Link } from 'react-router-dom';
import startLogo from '@/assets/images/start-logo.png';
import './index.css';

const mountainStyles = [
  {
    '--mountain-base': '12vw',
    '--mountain-height': '8vw',
    '--mountain-color1': '#8f4cd4',
    '--mountain-color2': '#321260',
    '--mountain-offset': '-39vw',
    '--mountain-tilt': '-12deg'
  },
  {
    '--mountain-base': '18vw',
    '--mountain-height': '13vw',
    '--mountain-color1': '#a44ed2',
    '--mountain-color2': '#170538',
    '--mountain-offset': '-25vw',
    '--mountain-tilt': '8deg'
  },
  {
    '--mountain-base': '13vw',
    '--mountain-height': '8vw',
    '--mountain-color1': '#7b35bd',
    '--mountain-color2': '#260746',
    '--mountain-offset': '-10vw',
    '--mountain-tilt': '-18deg'
  },
  {
    '--mountain-base': '20vw',
    '--mountain-height': '11vw',
    '--mountain-color1': '#8c42c4',
    '--mountain-color2': '#15042f',
    '--mountain-offset': '7vw',
    '--mountain-tilt': '10deg'
  },
  {
    '--mountain-base': '14vw',
    '--mountain-height': '9vw',
    '--mountain-color1': '#b34bca',
    '--mountain-color2': '#341054',
    '--mountain-offset': '24vw',
    '--mountain-tilt': '-8deg'
  },
  {
    '--mountain-base': '10vw',
    '--mountain-height': '7vw',
    '--mountain-color1': '#9b3db7',
    '--mountain-color2': '#24063c',
    '--mountain-offset': '38vw',
    '--mountain-tilt': '14deg'
  }
];

function StartScreen() {
  return (
    <main className="start-screen">
      <div className="start-screen__background" aria-hidden="true">
        <div className="background-80s stars">
          <div className="sun" />
          <div className="mountain-range">
            {mountainStyles.map((itemStyle, index) => (
              <div className="mountain" style={itemStyle} key={index} />
            ))}
          </div>
          <div className="horizon-glow" />
          <div className="grid" />
          <div className="start-screen__scanlines" />
        </div>
      </div>

      <section className="boot-panel" aria-labelledby="start-screen-title">
        <div className="boot-panel__status-bar">
          <span>VAPOROS 0.95</span>
          <span>PORTFOLIO ONLINE</span>
        </div>

        <div className="boot-panel__brand">
          <img className="boot-panel__logo" src={startLogo} alt="" />
          <p className="boot-panel__overline">
            A playable portfolio by Devo Zou
          </p>
          <h1 id="start-screen-title">Vintage Vibe</h1>
          <p className="boot-panel__subtitle">Interactive Portfolio System</p>
          <p className="boot-panel__tagline">
            Vintage visions // lost futures online
          </p>
        </div>

        <div className="boot-panel__action">
          <Link
            to="/home"
            className="entrance"
            aria-describedby="boot-instructions"
          >
            <span aria-hidden="true">▶</span>
            <span>Boot Desktop</span>
            <span aria-hidden="true">↵</span>
          </Link>
          <p id="boot-instructions">Press Enter or tap to start</p>
        </div>

        <div className="boot-panel__footer">
          <span className="system-status">System ready</span>
          <span>Build 0.95</span>
        </div>
      </section>
    </main>
  );
}

export default StartScreen;
