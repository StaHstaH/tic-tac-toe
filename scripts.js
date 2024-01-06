import { TicTacToe } from "./tictactoe.js";
import { UserInterface } from "./userinterface.js";

function addClickListener(elementId, callback) {
  document.getElementById(elementId).addEventListener("click", callback);
}

let userInterface = new UserInterface();
let ticTacToe = new TicTacToe(userInterface);
ticTacToe.clearBoard();

ticTacToe.restoreState();

userInterface.addBoardElementsHandlers(ticTacToe);

addClickListener("select_player_x", function () {
  ticTacToe.setPlayerSymbol("x");
});

addClickListener("select_player_o", function () {
  ticTacToe.setPlayerSymbol("o");
});

addClickListener("new_game_cpu", function () {
  ticTacToe.startGame(true);
});

addClickListener("new_game_human", function () {
  ticTacToe.startGame(false);
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

