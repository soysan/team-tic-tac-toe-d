const config = {
  initialPage: document.getElementById("initial-page"),
  target: document.getElementById("target"),
  secondPage: document.getElementById("second-page"),
  flag: true,
  name: "Sea_Otter"
};
//globalで持つ変数

class Model {
  constructor(name, inputNum) {
    this.name = name;
    this.inputNum = inputNum;
    this.state = this.setAry(inputNum);
    this.clickCnt = inputNum * inputNum;
  }

  setAry = (num) => {
    let innerAry = [];
    for (let i = 0; i < num; i++) {
      innerAry.push(0);
    }
    let ary = [];
    for (let i = 0; i < num; i++) {
      const cp = innerAry.slice();
      ary.push(cp);
    }
    return ary;
  };

  checkWin = (h, v) => {
    if (this.horizontalWin(h)) {
      return true;
    } else if (this.verticalWin(v)) {
      return true;
    } else if (this.crossWin(h, v)) {
      return true;
    }
    return false;
  };

  horizontalWin = (h) => {
    for (let i = 0; i < this.state.length - 1; i++) {
      if (this.state[h][i] !== this.state[h][i + 1]) {
        return false;
      }
    }
    return true;
  };

  verticalWin = (v) => {
    for (let i = 0; i < this.state.length - 1; i++) {
      if (this.state[i][v] !== this.state[i + 1][v]) {
        return false;
      }
    }
    return true;
  };

  crossWin = (h, v) => {
    if (h === v) {
      if (this.crossWinHelper(h, v, this.increment)) {
        return true;
      }
    }
    if (h + v === this.state.length - 1) {
      if (this.crossWinHelper(h, v, this.decrement)) {
        return true;
      }
    }
    return false;
  };

  crossWinHelper = (h, v, fnc) => {
    let a = this.increment(h);
    let b = fnc(v);
    for (let i = 0; i < this.state.length; i++) {
      if (this.state[h][v] !== this.state[a][b]) {
        return false;
      }
      a = this.increment(a);
      b = fnc(b);
    }
    return true;
  };

  increment = (i) => (i + 1) % this.state.length;

  decrement = (i) => {
    if ((i - 1) % this.state.length >= 0) {
      return (i - 1) % this.state.length;
    }
    return this.state.length - 1;
  };
}

class View {
  // initial Pageの中身を生成する関数
  static generateInitialPageContents = () => {
    let container = document.createElement("div");
    container.innerHTML = `
  <div class="h3 text-center text-light text-shadow">
  Tic tac toe Game
  </div>
  <p class="text-center text-light text-shadow">
  <strong>３以上の整数</strong>を入力してください。その数が１列になります。
  </p>
  <div>
  <div class="d-flex justify-content-center">
  <input
  type="number"
  class="type my-3"
      placeholder="3"
      id="inputted-number"
    />
  </div>
  <div class="d-flex justify-content-center">
    <input
      type="text"
      class="type my-3"
      placeholder="Your name is...?"
      id="player-name"
      />
      </div>
      <div class="d-flex justify-content-center">
      <button type="button" id="game-start" class="btn btn-light btn-outline-dark">
      Game Start
      </button>
      </div>
      </div>
      `;
    config.initialPage.append(container);
    const btn = document.getElementById("game-start");
    btn.addEventListener("click", Controller.fire);
  };

  static strToDom = (str) => {
    const temp = document.createElement("div");
    temp.innerHTML = str;
    return temp.firstElementChild;
  };

  static setBoxes = (model) => {
    let container = this.strToDom(`<div class="background d-flex"></div>`);
    let result = "<div class='col-3'>";
    result += `
      <h4 class="text-center">勝敗</h4>
      <div id="resultWinLose"></div>
      <div id="resultLog">
      </div>
    `;

    container.innerHTML = result;

    let boxes_container = View.makeGameGrid(model);
    let gameCells = View.makeGameCells(model, boxes_container);
    container.appendChild(gameCells);
    config.target.appendChild(container);
  };

  static makeGameGrid = (model) => {
    let boxes_container = this.strToDom(
      `<div class="game-grid" id="boxes" style="grid-template-columns: repeat(${
        model.inputNum
      }, 1fr);grid-template-rows:repeat(${model.inputNum}, 1fr);max-width:${
        10 * model.inputNum + (model.inputNum - 1) * 0.9
      }rem;max-height:${
        10 * model.inputNum + (model.inputNum - 1) * 0.9
      }rem"></div>`
    );
    return boxes_container;
  };

  static makeGameCells = (model, boxes_container) => {
    for (let i = 0; i < model.inputNum; i++) {
      for (let j = 0; j < model.inputNum; j++) {
        let box = this.strToDom(
          `<div class="game-cell " id="${i}-${j}"></div>`
        );                
        box.addEventListener(
          "click",
          () => {
            if (config.flag) {
              View.toggleBtnColor();
              box.innerHTML = "○";
              box.classList.add("red");
              model.state[i][j] = 1;
              config.flag = false;
            } else {
              View.toggleBtnColor();
              box.innerHTML = "×";
              model.state[i][j] = 2;
              config.flag = true;
            }
            if (model.checkWin(i, j)) {
              //ログ書き出し
              if(config.flag){
              alert("×の勝ちです。")
              Controller.queArray(Log.array_2, 0);
              }else{
              alert("○の勝ちです。");
              Controller.queArray(Log.array_2, 1);
              }
              // Log.array.push(model.state);
              Controller.queArray(Log.array, model.state);
              View.winLoseLog(model);
              //stateをリセット
              Controller.resetGame(model);
            } else {
              model.clickCnt--;
              if (model.clickCnt === 0) {
                //draw処理
                alert("引き分けです。");
                // Log.array.push(model.state);
                Controller.queArray(Log.array, model.state);
                Controller.queArray(Log.array_2, 2);
                View.winLoseLog(model);
                Controller.resetGame(model);
              }
            }
          },
          { once: true }
        );
        boxes_container.appendChild(box);
      }
    }
    return boxes_container;
  };

  static toggleBtnColor = () => {
    let btn_1 = document.getElementById("button_1")
    let btn_2 = document.getElementById("button_2")
    if(config.flag){
    btn_1.classList.remove("btn-warning")
    btn_1.classList.add("btn-light")
    btn_2.classList.remove("btn-light")
    btn_2.classList.add("btn-warning")
    }else{
    btn_2.classList.remove("btn-warning")
    btn_2.classList.add("btn-light")
    btn_1.classList.remove("btn-light")
    btn_1.classList.add("btn-warning")
    }
  }

  static drawSecondPage = () => {
    let div = document.createElement("div");
    div.classList.add("pb-5");

    let title = `
    <div class="py-4">
      <h1 class="d-flex justify-content-center py-3">Tic-tac-toe</h1>

      <div class="d-flex justify-content-around player">
          <button type="button" id="button_1" class="btn btn-warning rounded-pill" disabled>
            ${config.name}
          </button>
          <button type="button" id="button_2" class="btn btn-light rounded-pill" disabled>
            Player2
          </button>
      </div>
    </div>
  `;

    div.innerHTML = title;
    config.secondPage.append(div);
  };

  static logOutput = (currState, model, result ) => {
    let div = document.createElement("div");
    let container = View.winLose(model, result)
    div.appendChild(container);
    div.classList.add("bg-light", "my-5", "log");
    for (let i = 0; i < currState.length; i++) {
      let square = document.createElement("div");
      square.classList.add("d-flex", "judtify-content-center", "row-2");
      let square_inner = "";
      for (let j = 0; j < currState.length; j++) {
        square_inner += `
                <div class="square col-md-4 col-3">
                    <div class="border log-square text-center" id="${
                      i + "-" + j
                    }">
                      ${Controller.drawSymbol(currState[i][j])}
                    </div>
                </div>`;
      }

      square.innerHTML = square_inner;
      div.append(square);
    }

    document.querySelector("#resultLog").append(div);
  };

  static winLose = (model, result) => {
    let container = document.createElement("p");
    container.classList.add("d-flex", "justify-content-around");
    if (result === 2) {
      container.innerHTML="Draw"
    } else {
      container.innerHTML=`${config.name}の${result===1 ? "Win":"Lose"}`;
    }
    return container;
  };

  static winLoseLog = (model) => {
    document.querySelector("#resultWinLose").innerHTML = "";
    document.querySelector("#resultLog").innerHTML="";
    for (let i = 0; i < Log.array.length; i++) {
      View.logOutput(Log.array[i], model, Log.array_2[i]);
    }
  };
}

class Controller {
  static startGame = () => {
    View.generateInitialPageContents();
  };

  static fire = () => {
    const playerName = document.getElementById("player-name").value;
    const inputNum = document.getElementById("inputted-number").value;
    if (playerName === "") {
      return alert("名前を入力してください!");
    } else if (!(inputNum >= 3)) {
      return alert("3以上の整数を入力してください!");
    } else {
      config.initialPage.classList.add("display-none");
      config.target.classList.remove("background-image");
      config.secondPage.classList.remove("display-none");
      config.name = playerName;
      const model = new Model(playerName, inputNum);
      View.setBoxes(model);
      View.drawSecondPage();
    }
  };

  static resetGame = (model) => {
    const newModel = new Model(model.playerName, model.inputNum);
    let boxes = document.getElementById("boxes");
    boxes.innerHTML = "";
    View.makeGameCells(newModel, boxes);
    config.flag = true;
  };

  static drawSymbol = (data) => {
    switch (data) {
      case 0:
        return "";
      case 1:
        return "〇";
      case 2:
        return "✕";
      default:
        break;
    }
  };

  static queArray = (ary, data) => {
    if (ary.length >= 3) {
      ary.splice(0, 1);
      ary.push(data);
    } else {
      ary.push(data);
    }
  };

  static judge = (flag) => {
    if (flag) {
      return "win";
    } else {
      return "lose";
    }
  };
}

class Log {
  static array = [];
  static array_2 = [];
}

Controller.startGame();
