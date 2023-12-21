import { TicTacToe } from "./tictactoe.js";
import { UserInterface } from "./userinterface.js";

let board = document.getElementById("board");
let boardElements = board.getElementsByTagName("div");



function addClickListener(elementId, callback) {
  document.getElementById(elementId).addEventListener("click", callback);
}

let userInterface = new UserInterface();
let ticTacToe = new TicTacToe(userInterface);
ticTacToe.clearBoard();

addClickListener("select_player_x", function () {
  ticTacToe.setPlayerSymbol("x");
});

addClickListener("select_player_o", function () {
  ticTacToe.setPlayerSymbol("o");
});

addClickListener("new_game_cpu", function () {
  startNewGame();
  ticTacToe.enableAiPlayer(true);
});

addClickListener("new_game_human", function () {
  startNewGame();
  ticTacToe.enableAiPlayer(false);
});

addClickListener("reset", function () {
  let modal = document.getElementById("resetModal");
  modal.style.display = "block";
});

addClickListener("cancel", function () {
  let modal = document.getElementById("resetModal");
  modal.style.display = "none";
});

addClickListener("restart", function () {
  let modal = document.getElementById("resetModal");
  modal.style.display = "none";
  ticTacToe.clearBoard();
});

addClickListener("quit_button", function () {
  let startScreen = document.getElementById("start_screen");
  let gameScreen = document.getElementById("game_screen");

  startScreen.style.display = "inherit";
  gameScreen.style.display = "none";

  let modal = document.getElementById("roundOverModal");
  modal.style.display = "none";

  ticTacToe.clearBoard();
  ticTacToe.resetScores();
});

addClickListener("next_button", function () {
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

function startNewGame() {
  let startScreen = document.getElementById("start_screen");
  let gameScreen = document.getElementById("game_screen");

  startScreen.style.display = "none";
  gameScreen.style.display = "unset";

  if (ticTacToe.isCpuStarting()) {
    ticTacToe.skyNetTurn();
  }
}

// Add an event listener to each <div> element
for (var i = 0; i < boardElements.length; i++) {
  let index = i;
  boardElements[i].addEventListener("click", function () {
    ticTacToe.placeCurrentSymbol(index);
    // Get the ID of the clicked <div> element
    var itemId = this.getAttribute("id");
    // If the <li> element doesn't have an ID, create one
    if (!itemId) {
      itemId = "item" + (index + 1);
      this.setAttribute("id", itemId);
    }
    // Display the ID in the console
    console.log("Clicked item with ID: " + itemId);
  });
}