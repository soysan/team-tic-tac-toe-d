const config = {
  initialPage: document.getElementById("initial-page"),
  target: document.getElementById("target"),
  secondPage: document.getElementById("second-page"),
  startBtn: document.querySelector("#game-start"),
  inputNum: document.querySelector("#inputted-number"),
  winAndLose: document.getElementById("winAndLose"),
  playerName: document.querySelector("#player-name"),
  flag: true
};

// initial Pageの中身を生成する関数
const generateInitialPageContents = () => {
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
      <button type="button" class="btn btn-light btn-outline-dark" id="game-start">
      Game Start
      </button>
      </div>
      </div>
      `;
  config.initialPage.append(container);
};
generateInitialPageContents();
console.log("btn", config.startBtn);

const fire = () => {
  const btn = config.startBtn;
  btn.addEventListener("click", () => {
    const playerName = config.playerName.value;
    if (playerName === "") {
      alert("Please input both!");
    } else {
      config.initialPage.classList.add("display-none");
      config.target.classList.remove("backgound-image");
      config.secondPage.classList.remove("display-none");
      let state = setAry(config.inputNum);
      console.log("state:", state);
      setBoxes(config.inputNum.value);
    }
  });
};
fire();

const strToDom = (str) => {
  const temp = document.createElement("div");
  temp.innerHTML = str;
  return temp.firstElementChild;
};

//二次元配列を受け取ってbool(勝敗着いたならtrue)を返す
// const checkWin = () =>{
//   console.log("hogehoge");
//   return false;
// }

const setAry = (num) => {
  let innerAry = [];
  for (let i = 0; i < num; i++) {
    innerAry.push(0);
  }
  let ary = [];
  for (let i = 0; i < num; i++) {
    ary.push(innerAry);
  }
  return ary;
};

const setBoxes = (inputNum) => {
  let boxes_container = document.createElement("div");
  boxes_container.classList.add("mainTable", "col-6", "bg-light", "my-3");
  for (let i = 0; i < inputNum; i++) {
    let row_container = document.createElement("div");
    row_container.classList.add("row", "row-2");
    for (let j = 0; j < inputNum; j++) {
      let box = strToDom(`<div class="square col-md-4 col-3"></div>`);
      let inner_box = strToDom(
        `<div class="border square-in" id="${i}-${j}"></div>`
      );
      inner_box.addEventListener("click", () => {
        if (config.flag) {
          inner_box.innerHTML = "○";
          // state[i][j] = 1;
          config.flag = false;
        } else {
          inner_box.innerHTML = "×";
          // state[i][j] = 2;
          config.flag = true;

          // if(checkWin){
          //   logWrite;
          // }
        }
      });
      box.appendChild(inner_box);
      console.log("hogeeee");
      row_container.appendChild(box);
    }
    boxes_container.appendChild(row_container);
  }
  config.target.appendChild(boxes_container);
};

// const checkWin = (state) => {
//   for (let i = 0; state.length; i++) {}
// };

// const horizontWin = (state) => {};

// const verticalWin = (state) => {};

// const crosWin = (state) => {};

//atsuro担当　　後で
const judge = (bool) => {
  if (bool) return "win";
  else return "lose";
};

// 勝敗結果;
let winAndLose = document.getElementById("winAndLose");
const winLose = (bool) => {
  let result = "<div>";
  result += `
    <h4 class="text-center">勝敗</h4>
    <div class="d-flex justify-content-around">
  `;

  const player1 = `
    <div>
        <p>Player1</p>
        <p>${judge(bool)}</p>
    </div>
  `;

  const player2 = `
    <div>
        <p>Player2</p>
        <p>${judge(bool)}</p>
    </div>
  `;

  result += `
            ${player1}
            ${player2}
        </div>
    </div>
  `;
  config.winAndLose.innerHTML = result;
};

const data = [
  [0, 1, 2],
  [1, 0, 2],
  [0, 1, 2]
];

const drawSymbol = (data) => {
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

const logOutput = (number) => {
  let div = document.createElement("div");
  div.classList.add("bg-light", "my-2");
  for (let i = 0; i < number; i++) {
    let square = document.createElement("div");
    square.classList.add("d-flex", "judtify-content-center", "row-2");
    let square_inner = "";
    for (let j = 0; j < number; j++) {
      // square_inner += renderBox(i, j);
      square_inner += `
            <div class="square col-md-4 col-3">
                <div class="border log-square text-center" id="${i + "-" + j}">
                  ${drawSymbol(data[i][j])}
                </div>
            </div>`;
    }
    square.innerHTML = square_inner;
    div.append(square);
  }

  config.winAndLose.append(div);
};

// const renderBox = (i, j) => {
//   const box = `
//             <div class="square col-md-4 col-3">
//                 <div class="border log-square text-center" id="${i + "-" + j}">
//                   ${drawSymbol(data[i][j])}
//                 </div>
//             </div>`;
//   return box;
// }
