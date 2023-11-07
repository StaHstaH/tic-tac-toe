let board = document.getElementById("board");
let boardElements = board.getElementsByTagName("div");

let gameBoard = new Array();

const boardWidth = 3;
const boardHeight = 3;

let whoseTurn = "x";
let isGameOver = false;

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
}

function checkHorizontalLine(lineNumber) {
  let startIndex = lineNumber * boardWidth;
  if (
    gameBoard[startIndex] === gameBoard[startIndex + 1] &&
    gameBoard[startIndex] === gameBoard[startIndex + 2] &&
    gameBoard[startIndex] !== ""
  ) {
    return gameBoard[startIndex];
  }
}

function checkVerticalLine(lineNumber) {
  let startIndex = lineNumber;

  if (
    gameBoard[startIndex] === gameBoard[startIndex + boardWidth] &&
    gameBoard[startIndex] === gameBoard[startIndex + boardWidth * 2] &&
    gameBoard[startIndex] !== ""
  ) {
    return gameBoard[startIndex];
  }
}

function checkLeftDiagonal() {
  let startIndex = 0;

  if (
    gameBoard[startIndex] === gameBoard[startIndex + boardWidth + 1] &&
    gameBoard[startIndex] === gameBoard[startIndex + boardWidth * 2 + 2] &&
    gameBoard[startIndex] !== ""
  ) {
    return gameBoard[startIndex];
  }
}

function checkRightDiagonal() {
  let startIndex = 2;

  if (
    gameBoard[startIndex] === gameBoard[startIndex + boardWidth - 1] &&
    gameBoard[startIndex] === gameBoard[startIndex + boardWidth * 2 - 2] &&
    gameBoard[startIndex] !== ""
  ) {
    return gameBoard[startIndex];
  }
}

function checkWinner() {
  for (let i = 0; i < boardHeight; i++) {
    let result = checkHorizontalLine(i);
    if (result === "x" || result === "o") {
      return result;
    }
  }

  for (let i = 0; i < boardWidth; i++) {
    let result = checkVerticalLine(i);
    if (result === "x" || result === "o") {
      return result;
    }
  }

  let result = checkLeftDiagonal();
  if (result === "x" || result === "o") {
    return result;
  }

  result = checkRightDiagonal();
  if (result === "x" || result === "o") {
    return result;
  }
}

// Add an event listener to each <div> element
for (var i = 0; i < boardElements.length; i++) {
  let index = i;
  boardElements[i].addEventListener("click", function () {
    if (gameBoard[index] !== "" || isGameOver) {
      return;
    }
    gameBoard[index] = whoseTurn;
    // Apply a specific class on click
    if (whoseTurn === "x") {
      this.classList.add("clicked_x");
      this.classList.remove("clicked_o");
    } else {
      this.classList.add("clicked_o");
      this.classList.remove("clicked_x");
    }

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
    if (result === "x" || result === "o") {
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

  if (result === "x") {
    let span = document.getElementById("x_score");
    xScore++;
    span.innerHTML = xScore;
  } else if (result === "o") {
    let span = document.getElementById("o_score");
    oScore++;
    span.innerHTML = oScore;
  }

  let modal = document.getElementById("roundOverModal");
  modal.style.display = "block";
}
