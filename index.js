const config = {
  initialPage: document.getElementById("initial-page"),
  target: document.getElementById("target"),
  secondPage: document.getElementById("second-page"),
  flag: true,
};

class Model {
  constructor(name, inputNum ) {
    this.name = name;
    this.state = this.setAry(inputNum)
  }

  setAry = (num) => {
    let innerAry = [];
    for (let i = 0; i < num; i++) {
      innerAry.push(0);
    }
    let ary = [];
    for (let i = 0; i < num; i++) {
      cp = innerAry.slice()
      ary.push(cp);
    }
    return ary;
  };

  //クリックしたマスの位置を渡してbool(勝敗着いたならtrue)を返す
//trueを返す場合、どっちが勝ったかはconfig.flagの値と合わせて判定する。
checkWin = ( h, v ) =>{
  if(horizontalWin( h )){
    return true;
  }else if(verticalWin( v )){
    return true;
  }else if(crossWin( h, v )){
    return true;
  }
  return false;
}



horizontalWin = ( h ) => {
  for(let i=0;i<state.length-1;i++){
    if( state[h][i] !== state[h][i+1]){
      return false;
    }
  }
  return true;
};

verticalWin = (v) => {
  for(let i=0; i<state.length-1; i++){
    if( state[i][v] !== state[i+1][v]){
      return false;
    }
  }
  return true;
};

crossWin = ( h, v ) => {
  if( h === v){
    if(crossWinHelper(h, v, increment)){
      return true;
    }
  }
  if( h + v === state.length-1){
    if(crossWinHelper(h, v, decrement)){
      return true;
    }
  }
  return false;
};

crossWinHelper = (h, v, fnc ) => {
  let a = increment(h)
  let b = fnc(v)
  for(let i=0;i<state.length;i ++){
    if(state[h][v] !== state[a][b]){
      return false
    }
    a = increment(a)
    b = fnc(b)
  }
  return true
}

increment = i => (i+1)%state.length;

decrement = i => {
if( (i-1)%state.length >= 0){
  return (i-1)%state.length;
}
  return state.length-1
} 



}

class View {
  // initial Pageの中身を生成する関数
generateInitialPageContents = () => {
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
};

strToDom = (str) => {
  const temp = document.createElement("div");
  temp.innerHTML = str;
  return temp.firstElementChild;
};

setBoxes = (inputNum) => {
  let state = setAry(inputNum);
  let boxes_container = document.createElement("div");
  boxes_container.classList.add("mainTable", "col-6", "bg-light", "my-3");
  for (let i = 0; i < inputNum; i++) {
    let row_container = document.createElement("div");
    row_container.classList.add("row", "row-2");
    for (let j = 0; j < inputNum; j++) {
      let box = strToDom(`<div class="square col-md-4 col-3"></div>`);
      let inner_box = strToDom(`<div class="border square-in" id="${i}-${j}"></div>`);
      inner_box.addEventListener("click", () => {
        if (config.flag) {
          inner_box.innerHTML = "○";
          state[i][j] = 1;
          console.log("state", state);
          config.flag = false;
        } else {
          inner_box.innerHTML = "×";
          state[i][j] = 2;
          console.log("state", state);
          config.flag = true;

          if(checkWin(j, i)){
            console.log("勝敗が決まりました。")
          }
        }
      });
      box.appendChild(inner_box);
      row_container.appendChild(box);
    }
    boxes_container.appendChild(row_container);
  }
  config.target.appendChild(boxes_container);
};

drawSecondPage = () => {
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
  console.log(div);
}

}

class Controller {

fire = () => {
    const btn = document.querySelector('#game-start');
    btn.addEventListener("click", () => {
      const playerName = document.getElementById('player-name').value;
      if (playerName === "") {
        alert("Please input both!");
      } else {
        config.initialPage.classList.add("display-none");
        config.target.classList.remove("background-image");
        config.secondPage.classList.remove("display-none");
        const inputNum = document.getElementById('inputted-number').value;
        setBoxes(inputNum);
        //------------------------
        drawSecondPage();
        //^^^^^^^^^^^^^^^^^^^^^^
        const model = new Model(playerName, inputNum)
      }
    });
  };

}

Controller.fire();

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
  [0, 1, 2],
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

generateInitialPageContents();
fire();

//ゲーム画面


