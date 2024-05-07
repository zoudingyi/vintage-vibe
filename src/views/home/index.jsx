import React, { useState } from 'react';
import './index.css';
import styled from 'styled-components';

import computerIcon from '../../assets/icons/this_computer.png';
import musicIcon from '../../assets/icons/music.png';
import moviesIcon from '../../assets/icons/movies.png';
import folderIcon from '../../assets/icons/folder_closed.png';
import recycleIcon from '../../assets/icons/recycle_bin_full.png';

import Taskbar from './components/Taskbar';

const Wrapper = styled.div`
  // background-color: ${({ theme }) => theme.desktopBackground};
`;
const Button = styled.button`
  &:focus {
    & > span {
      outline: black dotted 1px;
      background-color: ${({ theme }) => theme.hoverBackground};
    }
  }
`;

const applications = [
  {
    lable: 'My Computer',
    icon: computerIcon,
    click: () => {}
  },
  {
    lable: 'My Folder',
    icon: folderIcon,
    click: () => {}
  },
  {
    lable: 'Media Player',
    icon: musicIcon,
    click: () => {}
  },
  {
    lable: 'My Videos',
    icon: moviesIcon,
    click: () => {}
  },
  {
    lable: 'Recycle Bin',
    icon: recycleIcon,
    click: () => {}
  }
];

function Home() {
  const [openStartMenu, setOpenStartMenu] = useState(false);

  return (
    <Wrapper className="desktop-environment-wrapper">
      <div className="desktop" onClick={() => setOpenStartMenu(false)}>
        {applications.map(item => (
          <Button className="desktop-application-item" onClick={item.click}>
            <img src={item.icon} width={32} height={32} alt="" />
            <span>{item.lable}</span>
          </Button>
        ))}
      </div>
      <Taskbar open={openStartMenu} setOpen={setOpenStartMenu} />
    </Wrapper>
  );
}

export default Home;
