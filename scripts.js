let board = document.getElementById("board");
let boardElements = board.getElementsByTagName("div");

let gameBoard = new Array();

const boardWidth = 3;
const boardHeight = 3;

let whoseTurn = "x";
let isGameOver = false;

let playerSymbol = "x";
let cpuSymbol = "o";
let vsCpu = true;

document
  .getElementById("select_player_x")
  .addEventListener("click", function () {
    playerSymbol = "x";
    cpuSymbol = "o";
  });

document
  .getElementById("select_player_o")
  .addEventListener("click", function () {
    playerSymbol = "o";
    cpuSymbol = "x";
  });

function startNewGame() {
  let startScreen = document.getElementById("start_screen");
  let gameScreen = document.getElementById("game_screen");

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

document.getElementById("new_game_cpu").addEventListener("click", startNewGame);
document
  .getElementById("new_game_human")
  .addEventListener("click", startNewGame);

function reset() {
  for (let i = 0; i < boardWidth * boardHeight; i++) {
    gameBoard[i] = "";
  }
  whoseTurn = "x";
  isGameOver = false;

  for (var i = 0; i < boardElements.length; i++) {
    boardElements[i].classList.remove("clicked_x", "clicked_o");
  }
}

reset();

function changeTurn() {
  let turnIndicator = document.getElementById("turn");
  if (whoseTurn === "x") {
    whoseTurn = "o";
    turnIndicator.classList.add("turn_o");
    turnIndicator.classList.remove("turn_x");
  } else {
    whoseTurn = "x";
    turnIndicator.classList.add("turn_x");
    turnIndicator.classList.remove("turn_o");
  }

  if (vsCpu && whoseTurn === cpuSymbol) {
    setTimeout(skyNetTurn, 500);
  }
}

// o o o _> o
// o x o -> !
// o _ x -> !
// o _ o -> ?

function checkValues(i0, i1, i2) {
  // if (
  //   gameBoard[i0] === gameBoard[i1] &&
  //   gameBoard[i0] === gameBoard[i2] &&
  //   gameBoard[i0] !== ""
  // ){
  //   return gameBoard[i0];
  // }

  let counter = { x: 0, o: 0 };

  //if (gameBoard[i0] === "x") {
  //  counter.x += 1;
  //} else if (gameBoard[i0] == "o") {
  //  counter.o += 1;
  //}
  counter[gameBoard[i0]] += 1;

  counter[gameBoard[i1]] += 1;
  counter[gameBoard[i2]] += 1;

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

function checkHorizontalLine(lineNumber) {
  let startIndex = lineNumber * boardWidth;
  return checkValues(startIndex, startIndex + 1, startIndex + 2);
}

function checkVerticalLine(lineNumber) {
  let startIndex = lineNumber;
  return checkValues(
    startIndex,
    startIndex + boardWidth,
    startIndex + boardWidth * 2
  );
}

function checkLeftDiagonal() {
  let startIndex = 0;
  return checkValues(
    startIndex,
    startIndex + boardWidth + 1,
    startIndex + boardWidth * 2 + 2
  );
}

function checkRightDiagonal() {
  let startIndex = 2;
  return checkValues(
    startIndex,
    startIndex + boardWidth - 1,
    startIndex + boardWidth * 2 - 2
  );
}

function checkWinner() {
  let counter = { x: 0, o: 0, "!": 0, "?": 0 };
  for (let i = 0; i < boardHeight; i++) {
    let result = checkHorizontalLine(i);
    counter[result] += 1;
  }

  for (let i = 0; i < boardWidth; i++) {
    let result = checkVerticalLine(i);
    counter[result] += 1;
  }

  let result = checkLeftDiagonal();
  counter[result] += 1;

  result = checkRightDiagonal();
  counter[result] += 1;

  if (counter["x"] > 0) {
    return "x";
  }

  if (counter["o"] > 0) {
    return "o";
  }

  if (counter["!"] === 8) {
    return "!";
  } else {
    return "?";
  }
}

function fillField(fieldIndex, symbol) {
  gameBoard[fieldIndex] = symbol;
  let element = boardElements[fieldIndex];
  // Apply a specific class on click
  if (symbol === "x") {
    element.classList.add("clicked_x");
    element.classList.remove("clicked_o");
  } else {
    element.classList.add("clicked_o");
    element.classList.remove("clicked_x");
  }
  let result = checkWinner();
  if (result === "x" || result === "o" || result === "!") {
    handleResult(result);
  }
}
// Add an event listener to each <div> element
for (var i = 0; i < boardElements.length; i++) {
  let index = i;
  boardElements[i].addEventListener("click", function () {
    if (gameBoard[index] !== "" || isGameOver) {
      return;
    }
    fillField(index, whoseTurn);

    // Get the ID of the clicked <div> element
    var itemId = this.getAttribute("id");

    // If the <li> element doesn't have an ID, create one
    if (!itemId) {
      itemId = "item" + (index + 1);
      this.setAttribute("id", itemId);
    }

    changeTurn();
    // Display the ID in the console
    console.log("Clicked item with ID: " + itemId);
    let result = checkWinner();
    if (result === "x" || result === "o" || result === "!") {
      handleResult(result);
    }
  });
}

let quitButton = document.getElementById("quit_button");
let nextRoundButton = document.getElementById("next_button");

quitButton.addEventListener("click", function () {});

nextRoundButton.addEventListener("click", function () {
  let modal = document.getElementById("roundOverModal");
  modal.style.display = "none";
  reset();
});

let xScore = 0;
let ties = 0;
let oScore = 0;

function handleResult(result) {
  isGameOver = true;
  console.log(result + " wins!");

  let modal = document.getElementById("roundOverModal");
  modal.style.display = "block";

  let xWinsMessage = document.getElementById("x_wins");
  let oWinsMessage = document.getElementById("o_wins");
  let roundTied = document.getElementById("round_tied");

  if (result === "x") {
    let span = document.getElementById("x_score");
    xScore++;
    span.innerHTML = xScore;
    xWinsMessage.style.display = "block";
    oWinsMessage.style.display = "none";
    roundTied.style.display = "none";
  } else if (result === "o") {
    let span = document.getElementById("o_score");
    oScore++;
    span.innerHTML = oScore;
    xWinsMessage.style.display = "none";
    oWinsMessage.style.display = "block";
    roundTied.style.display = "none";
  } else if (result === "!") {
    let span = document.getElementById("ties");
    ties++;
    span.innerHTML = ties;
    xWinsMessage.style.display = "none";
    oWinsMessage.style.display = "none";
    roundTied.style.display = "block";
  }
}

function getLines() {
  let lines = new Array();
  for (let i = 0; i < boardHeight; i++) {
    let startIndex = i * boardWidth;
    lines.push([startIndex, startIndex + 1, startIndex + 2]);
  }

  for (let i = 0; i < boardWidth; i++) {
    let startIndex = i;
    lines.push([startIndex, startIndex + boardWidth, startIndex + boardWidth * 2]);
  }

  return lines;
}

function findEmpty(indeces) {
  for (let i = 0; i < indeces.length; i++) {
    let index = indeces[i];
    if (gameBoard[index] === "") {
      return index;
    }
  }
  return -1;
}


function skyNetTurn() {
  if (isGameOver) {
    return;
  }

  let selectedIndex = -1;

  // for (let i = 0; i < boardHeight; i++) {
  //   let result = checkHorizontalLine(i);
  //   if (result === "?" || result === "o?") {
  //     let startIndex = i * boardWidth;
  //     selectedIndex = findEmpty([startIndex, startIndex + 1, startIndex + 2]);
  //     break;
  //   }
  // }

  // for (let i = 0; i < boardWidth; i++) {
  //   let result = checkVerticalLine(i);
  //   if (result === "?" || result === "o?") {
  //     let startIndex = i * boardWidth;
  //     selectedIndex = findEmpty([startIndex, startIndex + boardWidth, startIndex + boardWidth * 2,
  //     ]);
  //     break;
  //   }
  // }

  let lines = getLines();

  for (const line of lines) {
    let result = checkValues(line[0], line[1], line[2]);
    if (result === "?" || result === "o?") {
      selectedIndex = findEmpty(line);
      break;
    }
  }

  if (selectedIndex === -1) {
    for (let i = 0; i < boardWidth * boardHeight; i++) {
      if (gameBoard[i] === "") {
        selectedIndex = i;
        break;
      }
    }
  }

  if (selectedIndex === -1) {
    return;
  }

  fillField(selectedIndex, cpuSymbol);
  changeTurn();
}
