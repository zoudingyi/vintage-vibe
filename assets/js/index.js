window.onload = () => {
  let index = 1;
  let domArr = [];
  let boxIndex = 0;

  let parent = document.querySelector(".main-container");

  let objectPool = []; // 对象池
  let renderPool = []; // 渲染池

  // 创建弹窗
  function createWindows(i) {
    if (objectPool.length == 0) {
      boxIndex++;
      index++;

      let div = document.createElement("div");
      div.className = "plane-box";
      div.id = "box" + boxIndex;

      let html = `
      <div class="aesthetic-windows-95-modal" style="height: 100%">
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
          <div>
            I am the modal content
          </div>
        </div>
      </div>`;
      div.innerHTML = html;

      parent.appendChild(div);

      let planeDrag = new PlaneDrag({
        id: "box" + boxIndex,
        index: index,
        head: ".aesthetic-windows-95-modal-title-bar",
        top: 100 + i * 10,
        left: 200 + i * 10,
        isfullWindow: false,
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
            console.log(this);
            ev.stopPropagation();
            this.hide();
            objectPool.push(this);
          }.bind(planeDrag),
          false
        );
    } else {
      // 从对象池中取出来
      let planeDrag = objectPool[0];
      console.log("planeDrag :>> ", planeDrag);
      index++;
      planeDrag.setZindex(index);
      planeDrag.reset();
      // planeDrag.show();
      objectPool.shift();
    }
  }

  for (let i = 0; i < 1; i++) {
    setTimeout(() => createWindows(i), i * 100);
  }
};
