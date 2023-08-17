let index = 1;
let boxIndex = 0;
let computerBox = null;
let audioPlayerBox = null;
let objectPool = []; // 对象池
let renderPool = []; // 渲染池
const mainContainer = document.querySelector(".main-container");

// err弹窗html
const errHtml = `
  <div class="aesthetic-windows-95-modal">
    <div class="aesthetic-windows-95-modal-title-bar">
      <div class="aesthetic-windows-95-modal-title-bar-text">
        Error
      </div>

      <div class="aesthetic-windows-95-modal-title-bar-controls">
        <div class="aesthetic-windows-95-button-title-bar">
          <button>×</button>
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="aesthetic-windows-95-modal-content">
      <div class="aesthetic-effect-text-glitch" data-glitch="Back to 90s ❤" style="margin: 7px auto">
        Back to 90s ❤
      </div>

      <div class="aesthetic-windows-95-button" style="margin: 10px auto">
        <button>
          OK
        </button>
      </div>
    </div>
  </div>
`;
// 个人卡片弹窗html
const personal = `
  <div class="aesthetic-windows-95-modal base-modal">
    <div class="aesthetic-windows-95-modal-title-bar">
      <div class="aesthetic-windows-95-modal-title-bar-text">
        System
      </div>
      <div class="aesthetic-windows-95-modal-title-bar-controls">
        <div class="aesthetic-windows-95-button-title-bar">
          <button>
            ×
          </button>
        </div>
      </div>
    </div>
    <div class="aesthetic-windows-95-modal-content">
      <div id="personalTab" class="aesthetic-windows-95-tabbed-container">
        <div class="aesthetic-windows-95-tabbed-container-tabs">
          <div class="aesthetic-windows-95-tabbed-container-tabs-button is-active">
            <button onclick="tabClick(0)">
              About Me
            </button>
          </div>
          <div class="aesthetic-windows-95-tabbed-container-tabs-button">
            <button onclick="tabClick(1)">
              Motorcycle
            </button>
          </div>
        </div>

        <div id="personalContent" class="aesthetic-windows-95-container">
          <!-- about me  -->
          <div class="introduce-container is-active">
            <div class="aesthetic-effect-crt">
              <img src="/assets/image/me.jpg" alt="">
            </div>
            <div class="introduce-content">
              Hello everyone! I am Dingyi Zou, a frontend intern with 2 and a half years of work experience. I enjoy
              music, gaming, and motorcycle. I am a very stubborn person, and I never care about what others say or
              tell me to do. If you could be like me, I think that would be really cool!
              <div style="margin-top: 50px">- thanks ❤</div>
            </div>
          </div>

          <!-- motorcycle -->
          <div class="motorcycle-container">
            <img src="/assets/image/YAMAHA R3.png" alt="">
            <p>
              I am in possession of a YAMAHA R3 motorcycle, which brings me immense delight! Be it the mundane
              task of daily commuting or the exhilarating weekend jaunts, this marvelous machine bestows upon me an
              abundance of joy and invigoration!
            </p>
            <p>
              If you, too, relish the thrill of traversing landscapes astride motorcycles, then our kinship is
              forged!
            </p>
          </div>

      </div>

      <div class="aesthetic-windows-95-button" style="margin: 10px 0 0 auto">
        <button>
          OK
        </button>
      </div>
    </div>
  </div>
`;
// 音乐播放器html
const audioPlayer = `
  <div class="aesthetic-windows-95-modal music-player-container">
    <div class="aesthetic-windows-95-modal-title-bar">
      <div class="aesthetic-windows-95-modal-title-bar-text">
        <img class="player-icon" src="/assets/image/music.png" alt="">
        CD player
      </div>
      <div class="aesthetic-windows-95-modal-title-bar-controls">
        <div class="aesthetic-windows-95-button-title-bar">
          <button>×</button>
        </div>
      </div>
    </div>
    <div class="aesthetic-windows-95-modal-content">
      <div class="clock-display aesthetic-effect-crt">
        <span id="track-timer" class="text-clock-display">00 : 00</span>
      </div>
      <div id="track-title" class="player-displayer">Please insert a audio compact disc.</div>
      <div class="player-control">
        <div class="player-control-top">
          <button class="play-button" title="play" onclick="playSong()"> &#9658;</button>
          <button class="player-button" title="pause" onclick="pauseSong()"> &#10074;&#10074;</button>
          <button class="player-button" title="stop" onclick="stopSong()"> &#9724;</button>
        </div>
        <div class="player-control-bottom">
          <button class="player-button"> &#x23EE;</button>
          <button class="player-button" title="previous" onclick="lastSong()"> &#x23F4;</button>
          <button class="player-button" title="next" onclick="nextSong()"> &#x23F5;</button>
          <button class="player-button"> &#x23ED;</button>
          <button class="player-button"> &#x23cf;</button>
        </div>
      </div>
    </div>
    <div class="player-bottom">
      <div class="secondary-timer">
        <div class="player-input-of">Total Play: 00:00 m:s</div>
      </div>
      <div class="secondary-timer">
        <div class="player-input-of">Track: 00:00 m:s</div>
      </div>
    </div>
  </div>
`;

// 创建弹窗方法
function createWindows({
  id,
  top,
  left,
  width,
  height,
  html,
  isfullWindow = false,
}) {
  boxIndex++;
  index++;

  const div = document.createElement("div");
  div.className = "plane-box";
  div.id = id ? id : "box" + boxIndex;
  // 判断是否是dom元素
  if (html instanceof HTMLElement) div.appendChild(html);
  else div.innerHTML = html;

  mainContainer.appendChild(div);

  const planeDrag = new PlaneDrag({
    id: id ? id : "box" + boxIndex,
    index: index,
    head: ".aesthetic-windows-95-modal-title-bar",
    top: top ?? 100,
    left: left ?? 200,
    width,
    height,
    isfullWindow,
  });

  planeDrag.dom.addEventListener(
    "mousedown",
    function () {
      if (this.headClick) {
        this.headClick = false;
        return;
      }
      index++;
      this.setZindex(index);
      this.render1();
    }.bind(planeDrag),
    false
  );

  planeDrag.head.addEventListener(
    "mousedown",
    function (ev) {
      this.headClick = true;
      index++;
      this.setZindex(index);
    }.bind(planeDrag),
    false
  );
  // 关闭icon
  planeDrag.head
    .querySelector(".aesthetic-windows-95-button-title-bar>button")
    .addEventListener(
      "mousedown",
      function (ev) {
        ev.stopPropagation();
        this.hide();
        objectPool.push(this);
      }.bind(planeDrag),
      false
    );

  // close button
  const closeBtn = planeDrag.dom.querySelector(
    ".aesthetic-windows-95-button>button"
  );
  if (closeBtn) {
    closeBtn.addEventListener(
      "click",
      function () {
        this.hide();
        objectPool.push(this);
      }.bind(planeDrag),
      false
    );
  }
  // 存储特殊box
  if (id === "my-computer") computerBox = planeDrag;
  if (id === "audio-player") audioPlayerBox = planeDrag;
}

// 桌面图标事件
function desktopIconClick(params) {
  const objIndex = objectPool.findIndex((item) => item.opt.id === params);
  // 判断该弹窗是否被关闭
  if (objIndex > -1) {
    index++;
    objectPool[objIndex].setZindex(index);
    objectPool[objIndex].show();
    objectPool.splice(objIndex, 1);
  } else {
    // 未关闭 修改index置顶
    index++;
    if (params === "my-computer") {
      computerBox.setZindex(index);
      computerBox.reset();
    }
    if (params === "audio-player") {
      audioPlayerBox.setZindex(index);
      audioPlayerBox.reset();
    }
  }
}
// 个人面板 切换tab
function tabClick(index) {
  const personalTab = document.querySelector("#personalTab");
  const personalContent = document.querySelector("#personalContent");
  const tabs = personalTab.querySelectorAll(
    ".aesthetic-windows-95-tabbed-container-tabs-button"
  );
  tabs.forEach((element, i) => {
    element.classList.remove("is-active");
    personalContent.children[i].classList.remove("is-active");
  });
  tabs[index].classList.add("is-active");
  personalContent.children[index].classList.add("is-active");
}

// 创建gif popup
function createGifPopup({ img, top, left, width, height }) {
  // const html = `
  // <div class="aesthetic-windows-95-modal gif-modal">
  //   <div class="aesthetic-windows-95-modal-title-bar">
  //     <div class="aesthetic-windows-95-modal-title-bar-text">
  //     A E S T H E T I C
  //     </div>

  //     <div class="aesthetic-windows-95-modal-title-bar-controls">
  //       <div class="aesthetic-windows-95-button-title-bar">
  //         <button>×</button>
  //       </div>
  //     </div>
  //   </div>
  //   <!-- Content -->
  //   <div class="aesthetic-windows-95-modal-content">
  //     <img src="${src}" alt="">
  //   </div>
  // </div>`;
  const popup = document.createElement("div");
  popup.className = "aesthetic-windows-95-modal gif-modal";
  popup.innerHTML = `
    <div class="aesthetic-windows-95-modal-title-bar">
      <div class="aesthetic-windows-95-modal-title-bar-text">
      A E S T H E T I C
      </div>
      <div class="aesthetic-windows-95-modal-title-bar-controls">
        <div class="aesthetic-windows-95-button-title-bar">
          <button>×</button>
        </div>
      </div>
    </div>
    <div class="aesthetic-windows-95-modal-content">
    </div>
  `;
  popup.querySelector(".aesthetic-windows-95-modal-content").appendChild(img);
  createWindows({
    top,
    left,
    width,
    height,
    html: popup,
  });
}

// 得到一个两数之间的随机整数，包括两个数在内
function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

// 随机定位图片
const rangeT = 10;
const rangeB = 800;
const rangeL = -200;
const rangeR = 1800;
const gifItems = [
  {
    src: "/assets/image/gif/vaporwave-1.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 500 + 10, // 10 = padding: 8 + border: 2
    height: 375 + 39, // 39 = padding-top: 5 + bar: 26 + padding: 8
  },
  {
    src: "/assets/image/gif/vaporwave-2.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 250 + 10,
    height: 250 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-3.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 540 + 10,
    height: 303 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-4.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 540 + 10,
    height: 405 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-5.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 540 + 10,
    height: 304 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-6.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 232 + 10,
    height: 232 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-7.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 499 + 10,
    height: 374 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-8.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 500 + 10,
    height: 375 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-9.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 540 + 10,
    height: 540 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-10.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 470 + 10,
    height: 470 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-11.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 500 + 10,
    height: 281 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-12.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 320 + 10,
    height: 400 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-13.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 540 + 10,
    height: 404 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-14.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 480 + 10,
    height: 360 + 39,
  },
  {
    src: "/assets/image/gif/vaporwave-15.gif",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 500 + 10,
    height: 500 + 39,
  },
];

const imgItems = [
  {
    src: "/assets/image/citypop/1.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 300 + 10, // 10 = padding: 8 + border: 2
    height: 300 + 39, // 39 = padding-top: 5 + bar: 26 + padding: 8
  },
  {
    src: "/assets/image/citypop/2.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 400 + 10,
    height: 400 + 39,
  },
  {
    src: "/assets/image/citypop/3.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 380 + 10,
    height: 380 + 39,
  },
  {
    src: "/assets/image/citypop/4.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 350 + 10,
    height: 350 + 39,
  },
  {
    src: "/assets/image/citypop/5.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 500 + 10,
    height: 500 + 39,
  },
  {
    src: "/assets/image/citypop/6.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 300 + 10,
    height: 300 + 39,
  },
  {
    src: "/assets/image/citypop/7.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 380 + 10,
    height: 380 + 39,
  },
  {
    src: "/assets/image/citypop/8.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 350 + 10,
    height: 350 + 39,
  },
  {
    src: "/assets/image/citypop/9.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 333 + 10,
    height: 333 + 39,
  },
  {
    src: "/assets/image/citypop/10.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 450 + 10,
    height: 450 + 39,
  },
  {
    src: "/assets/image/citypop/11.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 500 + 10,
    height: 499 + 39,
  },
  {
    src: "/assets/image/citypop/12.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 250 + 10,
    height: 250 + 39,
  },
  {
    src: "/assets/image/citypop/13.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 300 + 10,
    height: 300 + 39,
  },
  {
    src: "/assets/image/citypop/14.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 400 + 10,
    height: 380 + 39,
  },
  {
    src: "/assets/image/citypop/15.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 380 + 10,
    height: 570 + 39,
  },
  {
    src: "/assets/image/citypop/16.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 350 + 10,
    height: 438 + 39,
  },
  {
    src: "/assets/image/citypop/17.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 350 + 10,
    height: 411 + 39,
  },
  {
    src: "/assets/image/citypop/18.jpg",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 350 + 10,
    height: 347 + 39,
  },
];

// 随机生成gif图片流
function getPictures() {
  const gifs = gifItems.filter(() => Math.random() > 0.75);
  const imgs = imgItems.filter(() => Math.random() > 0.25);
  return imgs.concat(gifs);
}

// 判断图片是否加载完成
function isImageLoaded(url) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片加载失败: " + url));
  });
}
// 预加载图片
function loadImage(fn) {
  const imgs = getPictures();
  const imagePaths = imgs.map((item) => item.src); // 预加载图片地址
  const promises = imagePaths.map((path) => isImageLoaded(path));

  Promise.all(promises)
    .then((res) => {
      console.log("所有图片加载完成");
      imgs.forEach((img, i) => (img.img = res[i]));
      fn(imgs);
    })
    .catch((err) => {
      console.log(err);
    });
}
// 延时生成图片弹窗
function createPicPopup(pictures) {
  const promises = [];
  pictures.forEach((item, i) => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        createGifPopup(item);
        resolve();
      }, i * 100);
    });
    promises.push(promise);
  });
  return promises;
}

// 生成播放器 （必须提前渲染）
createWindows({
  id: "audio-player",
  top: 20,
  left: window.innerWidth - 325,
  width: 310,
  height: 296,
  html: audioPlayer,
});

// 置顶audio computer窗口
function topMost() {
  const computer = document.querySelector("#my-computer");
  const audio = document.querySelector("#audio-player");
  const planes = document.querySelectorAll(".plane-box");
  computer.style.zIndex = planes.length + 2;
  audio.style.zIndex = planes.length + 2;
}

function hideLoading() {
  const loading = document.querySelector(".loading");
  loading.style.opacity = 0;
}

// init
window.onload = (event) => {
  const loadingImg = "/assets/image/windows95.jpg"; // 加载图片
  const minimumLoadingTime = 4000; // 最少加载时间
  const startTime = new Date().getTime();
  // 预加载loading图
  isImageLoaded(loadingImg)
    .then(() => {
      // 给loading图添加动效 同时开始预加载其他图片
      const windowsBg = document.querySelector(".windows-bg");
      windowsBg.innerHTML = `
      <div class="crt"></div>
      <div class="aesthetic-windows-95-boot-loader">
        <div></div>
      </div>
      `;
      // 预加载图片流 -> 检查是否满足最少加载时间(防止闪屏)
      loadImage((imgs) => checkLoadingTime(imgs));
    })
    .catch((err) => console.error(err));

  function checkLoadingTime(params) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    if (elapsedTime >= minimumLoadingTime) {
      // 如果加载时间已达到最少加载时间，继续执行
      hideLoading(); // 取消loading
      generatePopups(params);
    } else {
      // 如果加载时间还未达到最少加载时间，继续检查
      setTimeout(() => {
        checkLoadingTime(params);
      }, minimumLoadingTime - elapsedTime);
    }
  }

  // 生成弹窗
  function generatePopups(imgs) {
    // 创建个人卡片弹窗
    createWindows({
      id: "my-computer",
      top: 20,
      left: 680,
      width: 728,
      height: 596,
      html: personal,
    });

    // 生成图片流
    const promises = createPicPopup(imgs);
    Promise.all(promises).then(() => {
      topMost();
      // 所有gif图片完成后再 生成err弹窗
      for (let i = 0; i < 10; i++) {
        setTimeout(
          () =>
            createWindows({
              top: 50 + i * 15,
              left: 100 + i * 15,
              html: errHtml,
            }),
          i * 100
        );
      }
    });
  }
};
