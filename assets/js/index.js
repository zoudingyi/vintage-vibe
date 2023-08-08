let index = 1;
let domArr = [];
let boxIndex = 0;

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
              <img src="/assets/image/me2.jpg" alt="">
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

// 创建弹窗方法
function createWindows({
  top,
  left,
  width,
  height,
  html,
  isfullWindow = false,
}) {
  if (objectPool.length == 0) {
    boxIndex++;
    index++;

    const div = document.createElement("div");
    div.className = "plane-box";
    div.id = "box" + boxIndex;

    div.innerHTML = html;

    mainContainer.appendChild(div);

    const planeDrag = new PlaneDrag({
      id: "box" + boxIndex,
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
  } else {
    // 从对象池中取出来
    let planeDrag = objectPool[0];
    index++;
    planeDrag.setZindex(index);
    planeDrag.reset();
    // planeDrag.show();
    objectPool.shift();
  }
}
// 桌面图标事件
function desktopIconClick(params) {
  if (params === "computer") {
    const objIndex = objectPool.findIndex((item) => item.opt.id === "box1");
    if (objIndex > -1) {
      index++;
      objectPool[objIndex].setZindex(index);
      objectPool[objIndex].show();
      objectPool.splice(objIndex, 1);
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
function createGifPopup({ src, top, left, width, height }) {
  const gifPopup = `
  <div class="aesthetic-windows-95-modal gif-modal">
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
    <!-- Content -->
    <div class="aesthetic-windows-95-modal-content">
      <img src="${src}" alt="">
    </div>
  </div>`;
  createWindows({
    top,
    left,
    width,
    height,
    html: gifPopup,
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
const rangeL = 10;
const rangeR = 1500;
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
];

const imgItems = [
  {
    src: "/assets/image/citypop/1.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 400 + 10, // 10 = padding: 8 + border: 2
    height: 400 + 39, // 39 = padding-top: 5 + bar: 26 + padding: 8
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
    width: 380 + 10,
    height: 380 + 39,
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
    src: "/assets/image/citypop/12.png",
    top: getRandom(rangeT, rangeB),
    left: getRandom(rangeL, rangeR),
    width: 350 + 10,
    height: 279 + 39,
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
];

// 随机生成gif图片流
function createPictures() {
  const promises = [];
  const gifs = gifItems.filter(() => Math.random() > 0.75);
  const imgs = imgItems.filter(() => Math.random() > 0.25);
  const randomImgs = imgs.concat(gifs);
  randomImgs.forEach((item, i) => {
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

window.onload = (event) => {
  // 创建个人卡片弹窗
  createWindows({
    top: 20,
    left: 680,
    width: 728,
    height: 596,
    html: personal,
  });
  const person = document.querySelector("#box1");
  person.style.zIndex = 10;

  // 图片流
  Promise.all(createPictures()).then(() => {
    // 创建err弹窗
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
};
