const boardWidth = 3;
const boardHeight = 3;

export class TicTacToe {
  constructor(userInterface) {
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

    this.userInterface = userInterface;
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

  clearBoard() {
    for (let i = 0; i < boardWidth * boardHeight; i++) {
      this.gameBoard[i] = "";
    }
    this.whoseTurn = this.startingSymbol;
    this.isGameOver = false;

     this.userInterface.clearBoardElements();

  }

  resetScores() {
    this.xScore = 0;
    this.oScore = 0;
    this.ties = 0;
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
    if (this.gameBoard[index] !== "" || this.isGameOver) {
      return false;
    }
    this.fillField(index, this.whoseTurn);
    this.changeTurn();
    return true;
  }

  fillField(fieldIndex, symbol) {
    this.gameBoard[fieldIndex] = symbol;

    this.userInterface.placeBoardElement(fieldIndex, symbol);
    let result = this.checkWinner();
    if (result === "x" || result === "o" || result === "!") {
      this.isGameOver = true;
      this.incrementScore(result);
      this.userInterface.handleResult(result);
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

  incrementScore(symbol) {
    let span;
    let value = 0;
    if (symbol === "x") {
      span = document.getElementById("x_score");
      this.xScore++;
      value = this.xScore;
    } else if (symbol === "o") {
      span = document.getElementById("o_score");
      this.oScore++;
      value = this.oScore;
    } else {
      span = document.getElementById("ties");
      this.ties++;
      value = this.ties;
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
