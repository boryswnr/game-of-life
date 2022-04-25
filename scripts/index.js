function gameInit(size) {
    // const gameWrapper = document.createElement("div");
    // gameWrapper.className = "game-wrapper";

    const gameBoard = new GameBoard(size);
    gameBoard.boardInit();
    gameBoard.squareListeners();
}

class GameBoard {
    constructor(gameBoardSize) {
        this.gameBoardSize = gameBoardSize;
        this.stateOfGame = [];
    }

    boardInit() {
        for (let i = 0; i < this.gameBoardSize; i++) {
            const row = document.createElement("div");
            row.className = "row";
            row.setAttribute("id", `row-${i}`);

            for (let j = 0; j < this.gameBoardSize; j++) {
                const cell = document.createElement("div");
                cell.className = "square";
                cell.setAttribute("id", `column-${j}`);
                row.appendChild(cell);
            }

            document.getElementById("game-wrapper").appendChild(row);
        }
    }

    squareListeners() {
        const gameSquares = document.querySelectorAll(".square");
        gameSquares.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("alive");
            })
        })
        
    }

}



gameInit(50);