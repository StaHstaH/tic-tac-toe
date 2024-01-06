const boardWidth = 3;
const boardHeight = 3;

export class TicTacToe {
  constructor(userInterface) {
    this.gameBoard = new Array();

    this.whoseTurn = "x";
    this.startingSymbol = "x";
    this.isGameOver = false;
    this.isGameStarted = false;

    this.playerSymbol = "x";
    this.cpuSymbol = "o";
    this.vsCpu = true;

    this.xScore = 0;
    this.ties = 0;
    this.oScore = 0;

    this.userInterface = userInterface;
  }

  saveState() {
    localStorage.setItem("gameState", JSON.stringify(this));
  }

  restoreState() {
    const gameStateString = localStorage.getItem("gameState");
    if (gameStateString === null) {
      console.log("No game state restore");
      return;
    }
    const gameState = JSON.parse(gameStateString);

    console.log(gameState);
    this.gameBoard = gameState.gameBoard;

    this.whoseTurn = gameState.whoseTurn;
    this.startingSymbol = gameState.startingSymbol;
    this.isGameOver = gameState.isGameOver;
    this.isGameStarted = gameState.isGameStarted;

    this.playerSymbol = gameState.playerSymbol;
    this.cpuSymbol = gameState.cpuSymbol;
    this.vsCpu = gameState.vsCpu;

    this.xScore = gameState.xScore;
    this.ties = gameState.ties;
    this.oScore = gameState.oScore;

    if(this.isGameStarted) {
      this.userInterface.startNewGame();
      for (let i = 0; i < this.gameBoard.length; i++) {
        this.userInterface.placeBoardElement(i, this.gameBoard[i]);
      }

      this.userInterface.updateScore("x", this.xScore);
      this.userInterface.updateScore("o", this.oScore);
      this.userInterface.updateScore("?", this.ties);

      this.userInterface.changeTurn(this.whoseTurn);

      if (this.isGameOver) {
        let result = this.checkWinner();
        this.userInterface.handleResult(result);
      }
    }
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

  startGame(vsCpu) {
    this.vsCpu = vsCpu;
    this.isGameStarted = true;

    this.userInterface.startNewGame();
    if (this.cpuSymbol === this.startingSymbol) {
      this.skyNetTurn();
    }
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
    this.isGameStarted = false;
    this.isGameOver = false;
    this.saveState();
  }

  changeTurn() {
    this.userInterface.changeTurn(this.whoseTurn);
    if (this.whoseTurn === "x") {
      this.whoseTurn = "o";
    } else {
      this.whoseTurn = "x";
    }

    if (this.vsCpu && this.whoseTurn === this.cpuSymbol) {
      setTimeout(() => {
        this.skyNetTurn();
      }, 500);
    }
    this.saveState();
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
    let value = 0;
    if (symbol === "x") {
      this.xScore++;
      value = this.xScore;
    } else if (symbol === "o") {
      this.oScore++;
      value = this.oScore;
    } else {
      this.ties++;
      value = this.ties;
    }
    this.userInterface.updateScore(symbol, value);
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
