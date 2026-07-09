import { Link } from 'react-router-dom';
import { Button, Window, WindowContent, WindowHeader } from 'react95';
import './index.css';

function NotFound() {
  return (
    <div className="not-found-screen">
      <Window className="not-found-window">
        <WindowHeader>System Error</WindowHeader>
        <WindowContent>
          <strong>404 - Shortcut target not found</strong>
          <p>The requested program may have been moved or deleted.</p>
          <Link to="/home">
            <Button>Return to Desktop</Button>
          </Link>
        </WindowContent>
      </Window>
    </div>
  );
}

export default NotFound;
