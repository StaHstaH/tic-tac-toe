let board = document.getElementById("board");
let boardElements = board.getElementsByTagName("div");

let gameBoard = new Array();

const boardWidth = 3;
const boardHeight = 3;


for (let i = 0; i < boardWidth * boardHeight; i++) {
  gameBoard[i] = "";
}

let whoseTurn = "x";



function changeTurn() {
    let turnIndicator = document.getElementById("turn");
    if(whoseTurn === "x") {
        whoseTurn = "o";
        turnIndicator.classList.add("turn_o");
        turnIndicator.classList.remove("turn_x");
    } else {
        whoseTurn = "x";
        turnIndicator.classList.add("turn_x");
        turnIndicator.classList.remove("turn_o");
    }
}

// Add an event listener to each <div> element
        for (var i = 0; i < boardElements.length; i++) {
            let index = i;
            boardElements[i].addEventListener("click", function() {
                if (gameBoard[index] !== "") {
                    return;
                } 
                gameBoard[index] = whoseTurn;
                // Apply a specific class on click
                if(whoseTurn === "x") {
                this.classList.add("clicked_x");
                this.classList.remove('clicked_o')
                } else {
                    this.classList.add("clicked_o")
                    this.classList.remove('clicked_x')
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
            });
        }