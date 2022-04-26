const timeout = async time => await new Promise(resolve => setTimeout(() => resolve() ,time));

function gameInit(size) {
    // const gameWrapper = document.createElement("div");
    // gameWrapper.className = "game-wrapper";

    const gameBoard = new GameBoard(size);
    // gameBoard.boardInit();
    // gameBoard.squareListeners();
    // const alive = "alive"
    // console.log("state of game", gameBoard.stateOfGame);
    // console.log("type of state of game[0]", typeof(gameBoard.stateOfGame[0]));
    // console.log("type of state of game[1]", gameBoard.stateOfGame[1]);
    // gameBoard.stateOfGame[0].classList.add("alive");
    // console.log("isItAlive?:", gameBoard.isCellAlive(gameBoard.stateOfGame[0]));
    const startingSquares = [130, 180, 230, 141, 142, 143, 311, 312, 313];
    startingSquares.forEach(item => gameBoard.stateOfGame[item].classList.add("alive"));
    // const newArr = startingSquares.filter(e => 141 < e < 230);
    // console.log("newArr", newArr);
    gameBoard.lifeGoesOn();

    // console.log("state of game index ", gameBoard.stateOfGame)
}

class GameBoard {
    constructor(gameBoardSize) {
        this.gameBoardSize = gameBoardSize;
        this.stateOfGame = [];
        this.startBtn = document.querySelector(".btn");
        this.boardInit();
        this.squareListeners();
        this.startBtnListener();
        this.addLifeAroundProperty();
    }

    boardInit() {
        console.log("Board initialized.");
        for (let i = 0; i < this.gameBoardSize; i++) {
            const row = document.createElement("div");
            row.className = "row";
            row.setAttribute("id", `row-${i}`);

            for (let j = 0; j < this.gameBoardSize; j++) {
                const cell = document.createElement("div");
                cell.className = "square";
                // cell.setAttribute("id", `column-${j}`);
                row.appendChild(cell);
            }

            document.getElementById("game-wrapper").appendChild(row);
        }
    }

    squareListeners() {
        console.log("Square listeners initialized.")
        const gameSquares = document.querySelectorAll(".square");
        gameSquares.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("alive");
            })
            this.stateOfGame.push(item);
        })
    }

    startBtnListener() {
        console.log("btn listener initialized.")
        this.startBtn.addEventListener("click", () => {
            this.startBtn.classList.toggle("active");
        })
        while (this.startBtn.classList.contains("active")) {
            this.lifeGoesOn();
        }
    }

    addLifeAroundProperty() {
        this.stateOfGame.forEach(item => {
            Object.defineProperty(item, 'lifeAroundCell', {
                value: 0,
                writable: true
            });
        })
    }

    countTheCellsAround() {
        this.stateOfGame.forEach((item) => {
            item.lifeAroundCell = 0;
            let lifeAround = 0;
            const itemsIndex = this.stateOfGame.indexOf(item);
            // console.log("Items index:", itemsIndex);
            const cellsAround = [itemsIndex + 1, itemsIndex - 1, itemsIndex - 51, itemsIndex - 50, itemsIndex - 49, itemsIndex + 49, itemsIndex + 50, itemsIndex + 51];
            // console.log("cellsAround", cellsAround);
            const whereToCheckForLife = cellsAround.filter((num) => {
                return num >= 0 && num <= (50 * 50)-1;
            });
            // console.log("wheretocheckforlife:", whereToCheckForLife);
            for (let j = 0; j < whereToCheckForLife.length; j++) {
                if (this.isCellAlive(this.stateOfGame[whereToCheckForLife[j]])) {
                    lifeAround += 1;
                    // console.log("Life around:", lifeAround);
                }
            }
            item.lifeAroundCell += lifeAround;
            // console.log("item.lifeAroundCell:", item.lifeAroundCell);
        })
    }

    seeWhoDies() {
        this.stateOfGame.forEach((item) => {
            const itemsIndex = this.stateOfGame.indexOf(item);
            if (!this.isCellAlive(item) && item.lifeAroundCell === 3) {
                item.classList.add("alive");
                // console.log(`Cell came alive: ${item} at ${itemsIndex}`);
            } else if (this.isCellAlive(item) && !(item.lifeAroundCell === 2 || item.lifeAroundCell === 3)) {
                item.classList.remove("alive");
                // console.log(`Cell died: ${item} at ${itemsIndex}`);
            } 
    
        })

    }

    
    async lifeGoesOn() {
        // TODO: finish function - first count lifeAround for ALL cells, then evaluate which dies and which survives
        for (let i = 0; i < 4; i++){
            this.countTheCellsAround();
            this.seeWhoDies();

            await timeout(500);
        }
    }

    isCellAlive(cell) {
        return cell.classList.contains("alive");
    }

}



gameInit(50);