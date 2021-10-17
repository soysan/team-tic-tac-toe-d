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

  //クリックしたマスの位置を渡してbool(勝敗着いたならtrue)を返す
  //trueを返す場合、どっちが勝ったかはconfig.flagの値と合わせて判定する。
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
    let gameCells = View.makeGameCells(model);
    boxes_container.appendChild(gameCells);
    container.appendChild(boxes_container);
    config.target.appendChild(container);
  };

  static makeGameGrid = (model) => {
    let boxes_container = this.strToDom(
      `<div class="game-grid" id="boxes" style="grid-template-columns: repeat(${
        model.inputNum
      }, 1fr);grid-template-rows:repeat(${model.inputNum}, 1fr);max-width:${
        10 * model.inputNum + (model.inputNum - 1) * 0.9
      }rem"></div>`
    );
    return boxes_container;
  };

  static makeGameCells = (model) => {
    let boxes_container = document.createElement("div");
    for (let i = 0; i < model.inputNum; i++) {
      for (let j = 0; j < model.inputNum; j++) {
        let box = this.strToDom(
          `<div class="game-cell " id="${i}-${j}"></div>`
        );
        box.addEventListener(
          "click",
          () => {
            if (config.flag) {
              box.innerHTML = "○";
              box.classList.add("red");
              model.state[i][j] = 1;
              config.flag = false;
            } else {
              box.innerHTML = "×";
              model.state[i][j] = 2;
              config.flag = true;
            }
            if (model.checkWin(i, j)) {
              console.log("勝敗が決まりました。");
              //ログ書き出し
              Log.array.push(model.state);
              View.winLoseLog(model.state, model.clickCnt);
              //stateをリセット
              Controller.resetGame(model);
            } else {
              model.clickCnt--;
              if (model.clickCnt === 0) {
                //draw処理
                alert("どろー");
                Log.array.push(model.state);
                View.winLoseLog(model.state, model.clickCnt);
                Controller.resetGame(model);
              }
            }
          },
          { once: true }
        );
        console.log("hoge");
        boxes_container.appendChild(box);
      }
    }
    return boxes_container;
  };

  static drawSecondPage = () => {
    let div = document.createElement("div");
    div.classList.add("pb-5");

    let title = `
    <div class="py-4">
      <h1 class="d-flex justify-content-center py-3">Tic-tac-toe</h1>

      <div class="d-flex justify-content-around player">
          <button type="button" class="btn btn-warning rounded-pill" disabled>
            Player1
          </button>
          <button type="button" class="btn btn-light rounded-pill" disabled>
            Player2/AI?
          </button>
      </div>
    </div>
  `;

    div.innerHTML = title;
    config.secondPage.append(div);
  };

  static logOutput = () => {
    let div = document.createElement("div");
    div.classList.add("bg-light", "my-5", "log");
    const currState = Log.array[Log.array.length - 1];

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
        Log.array.push(currState[i]);
      }

      square.innerHTML = square_inner;
      div.append(square);
    }

    document.querySelector("#resultLog").append(div);
  };

  static winLose = (modelCnt) => {
    const parent = document.querySelector("#resultWinLose");

    console.log("parent", parent);

    let container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-around");

    if (modelCnt === 0) {
      const drawGame = `
        <div>
          <p>draw</p>
        </div>
      `;
      container.innerHTML = drawGame;
    } else {
      const player1 = `
        <div>
            <p>Player1</p>
            <p>${Controller.judge(!config.flag)}</p>
        </div>
      `;

      container.innerHTML = player1;
    }
    parent.append(container);
  };

  static winLoseLog = (modelState, modelCnt) => {
    for (let i = 0; i < Controller.logArray(modelState).length; i++) {
      View.winLose(modelCnt);
      View.logOutput();
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
    let gamegrid = View.makeGameGrid(newModel);
    boxes.innerHTML = "";
    boxes.appendChild(gamegrid);
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

  static logArray = (data) => {
    if (Log.array.length > 3) {
      Log.array.splice(0);
      Log.array.push(data);
      return Log.array;
    } else {
      Log.array.push(data);
      return Log.array;
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
}

Controller.startGame();
