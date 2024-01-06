export class UserInterface {
  constructor() {
    let board = document.getElementById("board");
    this.boardElements = board.getElementsByTagName("div");
  }

  addBoardElementsHandlers(ticTacToe) {
    // Add an event listener to each <div> element
    for (var i = 0; i < this.boardElements.length; i++) {
      let index = i;
      this.boardElements[i].addEventListener("click", function () {
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
  }

  clearBoardElements() {
    for (var i = 0; i < this.boardElements.length; i++) {
      this.boardElements[i].classList.remove("clicked_x", "clicked_o");
    }
  }

  placeBoardElement(fieldIndex, symbol) {
    let element = this.boardElements[fieldIndex];
    // Apply a specific class on click
    if (symbol === "x") {
      element.classList.add("clicked_x");
      element.classList.remove("clicked_o");
    } else if (symbol === "o") {
      element.classList.add("clicked_o");
      element.classList.remove("clicked_x");
    } else {
      element.classList.remove("clicked_x");
      element.classList.remove("clicked_o");
    }
    console.log(symbol);
  }

  startNewGame() {
    let startScreen = document.getElementById("start_screen");
    let gameScreen = document.getElementById("game_screen");

    startScreen.style.display = "none";
    gameScreen.style.display = "unset";
  }

  handleResult(result) {
    console.log(result + " wins!");

    let modal = document.getElementById("roundOverModal");
    modal.style.display = "block";

    let xWinsMessage = document.getElementById("x_wins");
    let oWinsMessage = document.getElementById("o_wins");
    let roundTied = document.getElementById("round_tied");

    if (result === "x") {
      xWinsMessage.style.display = "block";
      oWinsMessage.style.display = "none";
      roundTied.style.display = "none";
    } else if (result === "o") {
      xWinsMessage.style.display = "none";
      oWinsMessage.style.display = "block";
      roundTied.style.display = "none";
    } else if (result === "!") {
      xWinsMessage.style.display = "none";
      oWinsMessage.style.display = "none";
      roundTied.style.display = "block";
    }
  }

  changeTurn(whoseTurn) {
    let turnIndicator = document.getElementById("turn");
    if (whoseTurn === "x") {
      turnIndicator.classList.add("turn_o");
      turnIndicator.classList.remove("turn_x");
    } else {
      turnIndicator.classList.add("turn_x");
      turnIndicator.classList.remove("turn_o");
    }
  }

  updateScore(symbol, value) {
    let span;
    if (symbol === "x") {
      span = document.getElementById("x_score");
    } else if (symbol === "o") {
      span = document.getElementById("o_score");
    } else {
      span = document.getElementById("ties");
    }
    span.innerHTML = value;
  }
}
