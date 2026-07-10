import '@fontsource/russo-one/latin-400.css';
import './index.css';
import { Link } from 'react-router-dom';

function StartScreen() {
  const mountainStyles = [
    {
      '--mountain-base': '10vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#b533b3',
      '--mountain-offset': '10vw',
      '--mountain-tilt': '-20deg'
    },
    {
      '--mountain-base': '10vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#681e6b',
      '--mountain-tilt': '59deg',
      '--mountain-offset': '20vw'
    },
    {
      '--mountain-base': '8vw',
      '--mountain-height': '4vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#b533b3',
      '--mountain-offset': '20vw',
      '--mountain-tilt': '-20deg'
    },
    {
      '--mountain-base': '3vw',
      '--mountain-height': '4vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#681e6b',
      '--mountain-tilt': '45deg',
      '--mountain-offset': '28vw'
    },
    {
      '--mountain-base': '5vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#681e6b',
      '--mountain-offset': '-40vw',
      '--mountain-tilt': '-20deg'
    },
    {
      '--mountain-base': '5vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#b533b3',
      '--mountain-tilt': '33deg',
      '--mountain-offset': '-35vw'
    },
    {
      '--mountain-base': '5vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#681e6b',
      '--mountain-tilt': '-62deg',
      '--mountain-offset': '-5vw'
    },
    {
      '--mountain-base': '10vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#2a025d',
      '--mountain-tilt': '-20deg'
    },
    {
      '--mountain-base': '10vw',
      '--mountain-height': '5vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#150030',
      '--mountain-tilt': '59deg',
      '--mountain-offset': '10vw'
    },
    {
      '--mountain-base': '10vw',
      '--mountain-height': '10vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#150030',
      '--mountain-tilt': '-33deg',
      '--mountain-offset': '-30vw'
    },
    {
      '--mountain-base': '10vw',
      '--mountain-height': '10vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#2a025d',
      '--mountain-offset': '-20vw',
      '--mountain-tilt': '20deg'
    },
    {
      '--mountain-base': '3vw',
      '--mountain-height': '10vw',
      '--mountain-color1': '#a684cb',
      '--mountain-color2': '#681e6b',
      '--mountain-tilt': '45.5deg',
      '--mountain-offset': '-10vw'
    }
  ];

  return (
    <div className="start-screen">
      <div className="site-heading">
        <h1>vintage visions</h1>
      </div>
      <div className="sun"></div>
      <Link to="/home" className="entrances">
        Insert coin to continue...
      </Link>
      <div className="outrun-background-container">
        <div className="background-80s stars">
          <div className="grid"></div>
          {mountainStyles.map((itemStyle, index) => (
            <div className="mountain" style={itemStyle} key={index}></div>
          ))}
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
