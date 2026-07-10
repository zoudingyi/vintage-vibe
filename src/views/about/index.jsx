import { Link } from 'react-router-dom';
import { Fieldset, Window, WindowContent, WindowHeader } from 'react95';
import './index.css';

function About() {
  return (
    <main className="about-screen">
      <Window className="about-window">
        <WindowHeader>ABOUT.TXT</WindowHeader>
        <WindowContent>
          <p>
            <strong>Frontend System</strong>
          </p>
          <p>
            Vintage Vibe is a playable retro portfolio built around clear
            React architecture, accessible controls, and system-like details.
          </p>
          <Fieldset label="Contact">
            <p>Email: 18483641399@163.com</p>
            <p>GitHub: zoudingyi</p>
          </Fieldset>
          <Link className="about-desktop-link" to="/home">
            Open Desktop
          </Link>
        </WindowContent>
      </Window>
    </main>
  );
}

export default About;
