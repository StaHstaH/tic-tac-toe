let board = document.getElementById("board");
let boardElements = board.getElementsByTagName("div");

const boardWidth = 3;
const boardHeight = 3;

class TicTacToe {
  constructor() {
    this.gameBoard = new Array();

    this.whoseTurn = "x";
    this.startingSymbol = "x";
    this.isGameOver = false;

    this.playerSymbol = "x";
    this.cpuSymbol = "o";
    this.vsCpu = true;

    this.xScore = 0;
    this.ties = 0;
    this.oScore = 0;
  }

  setPlayerSymbol(playerSymbol) {
    this.playerSymbol = playerSymbol;
    if (playerSymbol === "x") {
      this.cpuSymbol = "o";
    } else {
      this.cpuSymbol = "x";
    }
  }

  isCpuStarting() {
    return this.cpuSymbol === this.startingSymbol;
  }

  enableAiPlayer(vsCpu) {
    this.vsCpu = vsCpu;
  }

  isTheFieldEmpty(index) {
    return this.gameBoard[index] !== "" || this.isGameOver;
  }

  clearBoard() {
    for (let i = 0; i < boardWidth * boardHeight; i++) {
      this.gameBoard[i] = "";
    }
    this.whoseTurn = this.startingSymbol;
    this.isGameOver = false;

    for (var i = 0; i < boardElements.length; i++) {
      boardElements[i].classList.remove("clicked_x", "clicked_o");
    }
  }

  changeTurn() {
    let turnIndicator = document.getElementById("turn");
    if (this.whoseTurn === "x") {
      this.whoseTurn = "o";
      turnIndicator.classList.add("turn_o");
      turnIndicator.classList.remove("turn_x");
    } else {
      this.whoseTurn = "x";
      turnIndicator.classList.add("turn_x");
      turnIndicator.classList.remove("turn_o");
    }

    if (this.vsCpu && this.whoseTurn === this.cpuSymbol) {
      setTimeout(() => {
        this.skyNetTurn();
      }, 500);
    }
  }

  checkValues(i0, i1, i2) {
    let counter = { x: 0, o: 0 };

    counter[this.gameBoard[i0]] += 1;
    counter[this.gameBoard[i1]] += 1;
    counter[this.gameBoard[i2]] += 1;

    if (counter["x"] === 3) {
      return "x";
    } else if (counter["o"] === 3) {
      return "o";
    } else if (counter["x"] > 0 && counter["o"] > 0) {
      return "!";
    } else if (counter["x"] > 0) {
      return "x?";
    } else if (counter["o"] > 0) {
      return "o?";
    } else {
      return "?";
    }
  }

  checkWinner() {
    let lines = this.getLines();
    let tieCount = 0;

    for (const line of lines) {
      let resultO = this.countSymbols(line, "o");
      if (resultO === 3) {
        return "o";
      }
      let resultX = this.countSymbols(line, "x");
      if (resultX === 3) {
        return "x";
      }
      if (resultO > 0 && resultX > 0) {
        tieCount++;
      }
    }

    if (lines.length === tieCount) {
      return "!";
    } else {
      return "?";
    }
  }

  placeCurrentSymbol(index) {
    this.fillField(index, this.whoseTurn);
  }

  fillField(fieldIndex, symbol) {
    this.gameBoard[fieldIndex] = symbol;
    let element = boardElements[fieldIndex];
    // Apply a specific class on click
    if (symbol === "x") {
      element.classList.add("clicked_x");
      element.classList.remove("clicked_o");
    } else {
      element.classList.add("clicked_o");
      element.classList.remove("clicked_x");
    }
    let result = this.checkWinner();
    if (result === "x" || result === "o" || result === "!") {
      handleResult(result);
    }
  }

  getLines() {
    let lines = new Array();
    for (let i = 0; i < boardHeight; i++) {
      let startIndex = i * boardWidth;
      lines.push([startIndex, startIndex + 1, startIndex + 2]);
    }

    for (let i = 0; i < boardWidth; i++) {
      let startIndex = i;
      lines.push([
        startIndex,
        startIndex + boardWidth,
        startIndex + boardWidth * 2,
      ]);
    }

    let startIndex = 0;
    lines.push([
      startIndex,
      startIndex + boardWidth + 1,
      startIndex + boardWidth * 2 + 2,
    ]);

    startIndex = 2;
    lines.push([
      startIndex,
      startIndex + boardWidth - 1,
      startIndex + boardWidth * 2 - 2,
    ]);

    const shuffledLines = lines.sort((_a, _b) => 0.5 - Math.random());

    return shuffledLines;
  }

  findEmpty(indeces) {
    for (let i = 0; i < indeces.length; i++) {
      let index = indeces[i];
      if (this.gameBoard[index] === "") {
        return index;
      }
    }
    return -1;
  }

  countSymbols(indeces, symbol) {
    let howManySymbols = 0;
    for (let i = 0; i < indeces.length; i++) {
      let index = indeces[i];
      if (this.gameBoard[index] === symbol) {
        howManySymbols = howManySymbols + 1;
      }
    }
    return howManySymbols;
  }

  setScore(symbol, value) {
    let span;
    if (symbol === "x") {
      span = document.getElementById("x_score");
      this.xScore = value;
    } else if (symbol === "o") {
      span = document.getElementById("o_score");
      this.oScore = value;
    } else {
      span = document.getElementById("ties");
      this.ties = value;
    }
    span.innerHTML = value;
  }

  skyNetTurn() {
    if (this.isGameOver) {
      return;
    }

    let selectedIndex = -1;

    let lines = this.getLines();

    for (const line of lines) {
      let result = this.countSymbols(line, this.playerSymbol);
      if (result === 2) {
        selectedIndex = this.findEmpty(line);
        break;
      }
    }

    if (selectedIndex === -1) {
      for (const line of lines) {
        let result = this.checkValues(line[0], line[1], line[2]);
        if (result === "?" || result === this.cpuSymbol + "?") {
          selectedIndex = this.findEmpty(line);
          break;
        }
      }
    }

    if (selectedIndex === -1) {
      for (let i = 0; i < boardWidth * boardHeight; i++) {
        if (this.gameBoard[i] === "") {
          selectedIndex = i;
          break;
        }
      }
    }

    if (selectedIndex === -1) {
      return;
    }

    this.fillField(selectedIndex, this.cpuSymbol);
    this.changeTurn();
  }
}

let ticTacToe = new TicTacToe();

document
  .getElementById("select_player_x")
  .addEventListener("click", function () {
    ticTacToe.setPlayerSymbol('x');
  });

document
  .getElementById("select_player_o")
  .addEventListener("click", function () {
    ticTacToe.setPlayerSymbol("o");
  });

function startNewGame() {
  let startScreen = document.getElementById("start_screen");
  let gameScreen = document.getElementById("game_screen");

  // startScreen.classList.add("hidden");
  // gameScreen.classList.remove("hidden");

  startScreen.style.display = "none";
  gameScreen.style.display = "unset";

  if (ticTacToe.isCpuStarting()) {
    ticTacToe.skyNetTurn();
  }
}

document.getElementById("new_game_cpu").addEventListener("click", () => {
  startNewGame();
  ticTacToe.enableAiPlayer(true);
});
document.getElementById("new_game_human").addEventListener("click", () => {
  startNewGame();
  ticTacToe.enableAiPlayer(false);
});


ticTacToe.clearBoard();

document.getElementById("reset").addEventListener("click", function () {
  let modal = document.getElementById("resetModal");
  modal.style.display = "block";
});

document.getElementById("cancel").addEventListener("click", function () {
  let modal = document.getElementById("resetModal");
  modal.style.display = "none";
});

document.getElementById("restart").addEventListener("click", function () {
  let modal = document.getElementById("resetModal");
  modal.style.display = "none";
  ticTacToe.clearBoard();
});


// Add an event listener to each <div> element
for (var i = 0; i < boardElements.length; i++) {
  let index = i;
  boardElements[i].addEventListener("click", function () {
    if (ticTacToe.isTheFieldEmpty(index)) {
      return;
    }
    ticTacToe.placeCurrentSymbol(index);

    //TODO: wrap the condition into one function

    // Get the ID of the clicked <div> element
    var itemId = this.getAttribute("id");

    // If the <li> element doesn't have an ID, create one
    if (!itemId) {
      itemId = "item" + (index + 1);
      this.setAttribute("id", itemId);
    }

    ticTacToe.changeTurn();
    // Display the ID in the console
    console.log("Clicked item with ID: " + itemId);
  });
}

let quitButton = document.getElementById("quit_button");
let nextRoundButton = document.getElementById("next_button");

quitButton.addEventListener("click", function () {
  let startScreen = document.getElementById("start_screen");
  let gameScreen = document.getElementById("game_screen");

  // startScreen.classList.remove("hidden");
  // gameScreen.classList.add("hidden");

  startScreen.style.display = "inherit";
  gameScreen.style.display = "none";

  let modal = document.getElementById("roundOverModal");
  modal.style.display = "none";

  ticTacToe.clearBoard();
  ticTacToe.setScore("x", 0);
  ticTacToe.setScore("o", 0);
  ticTacToe.setScore("!", 0);
});

nextRoundButton.addEventListener("click", function () {
  let modal = document.getElementById("roundOverModal");
  modal.style.display = "none";
  if (ticTacToe.startingSymbol === "x") {
    ticTacToe.startingSymbol = "o";
  } else {
    ticTacToe.startingSymbol = "x";
  }
  ticTacToe.clearBoard();
  if (ticTacToe.cpuSymbol === ticTacToe.startingSymbol) {
    ticTacToe.skyNetTurn();
  }
});

function handleResult(result) {
  ticTacToe.isGameOver = true;
  console.log(result + " wins!");

  let modal = document.getElementById("roundOverModal");
  modal.style.display = "block";

  let xWinsMessage = document.getElementById("x_wins");
  let oWinsMessage = document.getElementById("o_wins");
  let roundTied = document.getElementById("round_tied");

  if (result === "x") {
    ticTacToe.setScore("x", ticTacToe.xScore + 1);
    xWinsMessage.style.display = "block";
    oWinsMessage.style.display = "none";
    roundTied.style.display = "none";
  } else if (result === "o") {
    ticTacToe.setScore("o", ticTacToe.oScore + 1);
    xWinsMessage.style.display = "none";
    oWinsMessage.style.display = "block";
    roundTied.style.display = "none";
  } else if (result === "!") {
    ticTacToe.setScore("!", ticTacToe.ties + 1);
    xWinsMessage.style.display = "none";
    oWinsMessage.style.display = "none";
    roundTied.style.display = "block";
  }
}

