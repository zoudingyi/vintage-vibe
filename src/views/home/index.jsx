import React, { useState } from 'react';
import './index.css';
import Taskbar from './components/Taskbar';

function Home() {
  const [openToolbar, setOpenToolbar] = useState(false);

  return (
    <div className="desktop-environment-wrapper">
      <div
        className="desktop"
        onClick={() => {
          setOpenToolbar(false);
        }}
      >
        desktop
      </div>
      <Taskbar open={openToolbar} setOpen={setOpenToolbar} />
    </div>
  );
}

export default Home;
