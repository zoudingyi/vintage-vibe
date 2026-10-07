import './index.css';
import RetroComputerEntrance from './RetroComputerEntrance';
import MountainRange from './MountainRange';

function StartScreen() {
  return (
    <main className="start-screen start-screen--computer">
      <div className="start-screen__background" aria-hidden="true">
        <div className="background-80s stars">
          <div className="sun" />
          <MountainRange />
          <div className="horizon-glow" />
          <div className="grid" />
          <div className="start-screen__scanlines" />
        </div>
      </div>

      <section className="boot-panel cinema-title" aria-labelledby="start-screen-title">
        <p className="cinema-title__eyebrow">A PERSONAL WORLD BY DEVO ZOU</p>
        <h1 id="start-screen-title">Vintage <em>Vibe.</em></h1>
        <p className="cinema-title__tagline" lang="ja">
          あの頃の未来へ、ようこそ。
        </p>
        <RetroComputerEntrance />
        <p className="cinema-title__note">
          Take your time. There’s a whole world inside.
        </p>
      </section>
    </main>
  );
}

export default StartScreen;
