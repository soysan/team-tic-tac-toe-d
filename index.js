const config = {
  initialPage: document.getElementById("initial-page"),
  target: document.getElementById("target"),
  secondPage: document.getElementById("second-page"),
  flag: true
};
//globalで持つ変数

class Model {
  constructor(name, inputNum) {
    this.name = name;
    this.state = this.setAry(inputNum);
    this.clickCnt = 0;
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
  <strong>３以上の奇数</strong>を入力ください。その数が１列になります。
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

  static setBoxes = (inputNum, model) => {
    let container = this.strToDom(`<div class="background"></div>`);
    let boxes_container = this.strToDom(
      `<div class="game-grid" style="grid-template-columns: repeat(${inputNum}, 1fr);grid-template-rows:repeat(${inputNum}, 1fr);max-width:${
        10 * inputNum + (inputNum - 1) * 0.9
      }rem"></div>`
    );
    for (let i = 0; i < inputNum; i++) {
      for (let j = 0; j < inputNum; j++) {
        let box = this.strToDom(
          `<div class="game-cell " id="${i}-${j}"></div>`
        );
        box.addEventListener("click", () => {
          if (config.flag) {
            box.innerHTML = "○";
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
            View.winLose();
            View.logOutput();
            //stateをリセット
          }else{
            model.clickCnt ++
            if(model.clickCnt === inputNum*inputNum){
              //draw処理


            }
          }

        //--------draw処理を記述-------

        // const isDraw = () {

        // }

        //-----------------------
        },{ once: true });
        boxes_container.appendChild(box);
      }
    }
    container.appendChild(boxes_container);
    config.target.appendChild(container);
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
    div.classList.add("bg-light", "my-2");
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

    config.secondPage.append(div);
  };

  static winLose = () => {
    let result = "<div>";
    result += `
      <h4 class="text-center">勝敗</h4>
      <div class="d-flex justify-content-around">
    `;

    const player1 = `
      <div>
          <p>Player1</p>
          <p>${Controller.judge(config.flag)}</p>
      </div>
    `;

    const player2 = `
      <div>
          <p>Player2</p>
          <p>${Controller.judge(!config.flag)}</p>
      </div>
    `;

    result += `
              ${player1}
              ${player2}
          </div>
      </div>
    `;
    config.secondPage.innerHTML = result;
  };
}

class Controller {
  static startGame = () => {
    View.generateInitialPageContents();
  };

  static fire = () => {
    const playerName = document.getElementById("player-name").value;
    if (playerName === "") {
      alert("Please input both!");
    } else {
      config.initialPage.classList.add("display-none");
      config.target.classList.remove("background-image");
      config.secondPage.classList.remove("display-none");
      const inputNum = document.getElementById("inputted-number").value;
      const model = new Model(playerName, inputNum);
      View.setBoxes(inputNum, model);
      View.drawSecondPage();
    }
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


  //----------消す？---
  static judge = (flag) => {
    if (flag) {
      return "win";
    } else {
      return "lose";
    }
  };
}
  // ---------------

class Log {
  static array = [];
}

Controller.startGame();
