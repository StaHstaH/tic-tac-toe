export class UserInterface {
  constructor() {
    let board = document.getElementById("board");
    this.boardElements = board.getElementsByTagName("div");
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
    } else {
      element.classList.add("clicked_o");
      element.classList.remove("clicked_x");
    }
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
}