import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  MenuList,
  MenuListItem,
  Separator,
  Handle,
  Tooltip
} from 'react95';
import './Taskbar.css';
import logoIMG from '@/assets/images/start-logo.png';
import folderIcon from '@/assets/icons/folder_open.png';
import { ReactComponent as GitHub } from '@/assets/svg/github.svg';

function Taskbar(props) {
  const [time, setTime] = useState('');
  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => {
      // 在组件销毁时执行清理操作
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(now);
  }

  function updateTime() {
    const currentTime = getCurrentTime();
    setTime(currentTime);
  }

  return (
    <AppBar style={{ top: 'auto', bottom: 0, zIndex: 9999 }}>
      <Toolbar>
        <div className="tool-container">
          <Button
            onClick={() => props.setOpen(!props.open)}
            active={props.open}
            style={{ fontWeight: 'bold' }}
          >
            <img
              src={logoIMG}
              alt="logo"
              style={{ height: '20px', marginRight: 4 }}
            />
            Start
          </Button>
          {props.open && (
            <MenuList
              className="vertical-MenuList"
              style={{
                position: 'absolute',
                left: '0',
                bottom: '100%'
              }}
              onClick={() => props.setOpen(false)}
            >
              <MenuListItem className="ListItem">
                <img className="ListItem-icon" src={folderIcon} alt="" />
                Profile
              </MenuListItem>
              <MenuListItem className="ListItem">
                <img className="ListItem-icon" src={folderIcon} alt="" />
                My account
              </MenuListItem>
              <Separator />
              <MenuListItem className="ListItem" disabled>
                <img className="ListItem-icon" src={folderIcon} alt="" />
                Logout
              </MenuListItem>
            </MenuList>
          )}

          <Handle size={28} style={{ margin: 'auto 4px auto 7px' }} />

          <Tooltip text="E-mail" enterDelay={100} leaveDelay={300}>
            <a className="social-link" href="mailto:18483641399@163.com">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJFBMVEUAAADAwMAA//8AgIAAAIAAAP+AgIAAAAD/////AAD//wCAAACXnOBPAAAAAXRSTlMAQObYZgAAAAFiS0dECIbelXoAAAAHdElNRQfiBhoALTQmIvwoAAAA7UlEQVQoz22RQYqDMBiF/wG7H3uE6AGKmr1gWmZZmvwHmI09QfEEhZgTtMx64O8NpHO5+bWJjaVvIbyPRxLfA3ivjzRd+rUQnzEohFA68qssy1Fugt2DLooamjoAsyrLCiDxoG2x0XrXeh3hO0WUVRrEwCLilw0agUHjXX+9TGDrE9RfhxEo1iNx+7mPIIhs/zfEwFlyLgLExFIAyss+EzR93GuCloe+JPgXTJygsxB5SLjp1oPInwmy9PtItLMODLigLujETedd52vnPsem1bxDBdx0Ccm8TCO1LjfRVEahlPGWCb9yv5hbKb/TP70gkrkDfyfnAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA2LTI2VDAwOjQ1OjUyLTA0OjAwCf9YPgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNi0yNlQwMDo0NTo1Mi0wNDowMHii4IIAAAAASUVORK5CYII="
                height="20"
                alt="Outlook Express Icon"
              />
            </a>
          </Tooltip>
          <Tooltip text="Twitter" enterDelay={100} leaveDelay={300}>
            <a
              className="social-link"
              href="https://twitter.com/zoudingyi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAX1QTFRFAAAAOKz0IaPyHqHyHqLyIqPyJ6XzLKfzM6rzPK70RrL0MKnzKabzNKvzIaPyHaHyHaHyHqHyIqPyLajzPK70R7L0LajzIqPyJ6XzL6nzN6z0K6fzHqHyJaTyManzQLD0SLP0ManzIqPyH6LyKabzLqjzJaTyKKbzN6z0RrL0SrT1I6PyIKLyJKTyJ6XzJKTyIaPyLKfzO670SrT1ManzI6PyHqHyLqjzPa70SrT1MqrzJKTyHqHyManzQLD0LajzI6PyHqLyJ6XzNqvzRbH0NKvzJqXyIaPyLajzPK70SLP0LKfzIaLyHaHyNavzQ7H0SrT1NavzKqfzI6TyJKTyMKnzP6/0SLP0Pq/0MqrzJqXzIKLyL6jzRrL0SrT1MKnzJqXzIKLyHaHyJqXzRbL0SrT1LqjzJqXzIaLyHqHyPq/0RrL0SrT1P6/0N6z0ManzLqjzLafzQrH0R7P0SrT1Q7H0P6/0Pa70PK70O670PK70Pa70P6/0RLH0SLP0502XGgAAAH90Uk5TABpX2fj300YMSkgE405V+f//9ObNGhr/7GoCA+L//MKCDf3/tjAh//+nA7n+z4pMPv//Eg9V5P/7BBH58P/gvv////+sH9z///9jSb7+/9oWav3/////ageU/v//wAgBM477/9YTByZ46f27Gj+aw/H/6n8PHIbM7Pn89+jEd0RjWk4AAADnSURBVHicY2AgHjDCWUzMLKxs7BycXAzcPLxQMT5+AQEBQSFhEVEGMXEJSSmQmLSMAAjIyskrMCgqKYurqAIF1cBiAuoamloMDNqCAoI6unr6BmAxQUMjYwYGE1MzASSgbG5hycBgZW2DLChuaweywN7BESEm6OTsAhJ0dUMSdPfw9AK7z9vHFybm6OTnHwAWDAwKVoZqDgkNC4f4JCIyKhqiLiTGMzYO6r/4hMQkoFh0cqhnSipULC09I1NQ2T3Z0C8rOwcilJuXX1Bo6GEe6mdUVFwCC7DSsvKKyqrqmto6YxICHAoArdIrC0TTYsIAAAAASUVORK5CYII="
                height="20"
                alt="Twitter"
              />
            </a>
          </Tooltip>
          <Tooltip text="GitHub" enterDelay={100} leaveDelay={300}>
            <a
              className="social-link"
              href="https://github.com/zoudingyi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub width={20} height={20} />
            </a>
          </Tooltip>

          <div style={{ marginRight: 'auto' }}></div>

          <Tooltip text="08/24/1995" enterDelay={100} leaveDelay={300}>
            <div className="taskbar-date">{time}</div>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Taskbar;
