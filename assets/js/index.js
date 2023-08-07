let index = 1;
let domArr = [];
let boxIndex = 0;

let objectPool = []; // 对象池
let renderPool = []; // 渲染池

const mainContainer = document.querySelector(".main-container");

// 创建弹窗
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

// 创建err弹窗
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
</div>`;
for (let i = 0; i < 0; i++) {
  setTimeout(
    () =>
      createWindows({
        top: 100 + i * 15,
        left: 200 + i * 15,
        html: errHtml,
      }),
    i * 100
  );
}

// 创建个人卡片弹窗
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
            <div class="introduce-container ">
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
            <div class="motorcycle-container is-active">
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
createWindows({
  top: 60,
  left: 135,
  width: 728,
  height: 596,
  html: personal,
});

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

const gifItems = [
  {
    src: "/assets/image/KIDMOGRAPH.gif",
    top: 200,
    left: 800,
    width: 250 + 10, // 10 = padding: 8 + border: 2
    height: 250 + 39, // 39 = padding-top: 5 + bar: 26 + padding: 8
  },
];

gifItems.forEach((item) => createGifPopup(item));
