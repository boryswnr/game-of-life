const timeout = async time => await new Promise(resolve => setTimeout(() => resolve() ,time));

function gameInit(size) {
    // const gameWrapper = document.createElement("div");
    // gameWrapper.className = "game-wrapper";

    const gameBoard = new GameBoard(size);
    const startingSquares = [130, 180, 230, 141, 142, 143, 311, 312, 313];
    startingSquares.forEach(item => gameBoard.stateOfGame[item].classList.add("alive"));

    // gameBoard.lifeGoesOn();

   
}

class GameBoard {
    constructor(gameBoardSize) {
        this.gameBoardSize = gameBoardSize;
        this.stateOfGame = [];
        this.startBtn = document.querySelector(".btn");
        this.playOrPause = "pause";
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
            if (this.startBtn.classList.contains("active")) {
                this.startBtn.innerText = "STOP";
                this.playOrPause = "play";
                console.log("play or pause:", this.playOrPause);
                this.lifeGoesOn();
            } else {
                this.startBtn.innerText = "START";
                this.playOrPause = "pause";
                console.log("play or pause:", this.playOrPause);
            }
        })
        
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
            const cellsAround = [itemsIndex + 1, itemsIndex - 1, itemsIndex - 51, itemsIndex - 50, itemsIndex - 49, itemsIndex + 49, itemsIndex + 50, itemsIndex + 51];
            const whereToCheckForLife = cellsAround.filter((num) => {
                return num >= 0 && num <= (50 * 50)-1;
            });
            
            for (let j = 0; j < whereToCheckForLife.length; j++) {
                if (this.isCellAlive(this.stateOfGame[whereToCheckForLife[j]])) {
                    lifeAround += 1;
                }
            }
            item.lifeAroundCell += lifeAround;
        })
    }

    seeWhoDies() {
        this.stateOfGame.forEach((item) => {
            const itemsIndex = this.stateOfGame.indexOf(item);
            if (!this.isCellAlive(item) && item.lifeAroundCell === 3) {
                item.classList.add("alive");
            } else if (this.isCellAlive(item) && !(item.lifeAroundCell === 2 || item.lifeAroundCell === 3)) {
                item.classList.remove("alive");
            } 
    
        })

    }

    
    async lifeGoesOn() {
        // for (let i = 0; i < 4; i++){
        while (this.playOrPause === "play"){
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