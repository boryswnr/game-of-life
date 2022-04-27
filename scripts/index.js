const timeout = async time => await new Promise(resolve => setTimeout(() => resolve(), time));

function gameInit(size) {
 const gameBoard = new GameBoard(size);   
    if (size === 50) {
        
        const startingSquares = [130, 180, 230, 141, 142, 143, 311, 312, 313, 401, 452, 500, 501, 502, 520, 521, 522, 569, 570, 571, 343, 342, 392, 443, 394, 0, 1, 50, 51, 102, 103, 152, 153, 8, 9, 58, 59, 2025, 2026, 2027, 2031, 2032, 2033, 2078, 2080, 2128, 2130, 2178, 2180, 1925, 1926, 1927, 1931, 1932, 1933, 1675, 1676, 1677, 1683, 1681, 1682, 1778, 1828, 1878, 1780, 1830, 1880, 1773, 1823, 1873, 2073, 2123, 2173, 2085, 2135, 2185, 2277, 2276, 2275, 2281, 2282, 2283, 1885, 1835, 1785];
        startingSquares.forEach(item => gameBoard.stateOfGame[item].classList.add("alive"));

    }

   
}

class GameBoard {
    constructor(gameBoardSize) {
        this.gameBoardSize = parseInt(gameBoardSize);
        this.stateOfGame = [];
        this.startBtn = document.querySelector(".btn");
        this.playOrPause = "pause";
        this.boardInit();
        this.squareListeners();
        this.startBtnListener();
        this.addLifeAroundProperty();
    }

    boardInit() {
        document.getElementById("game-wrapper").innerHTML = "";
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
        console.log("Board initialized.");
    }

    squareListeners() {
        // add listeners to each div so a player can mark which cells he wants to be alive or dead
        // pushes each field to array which keeps track of state of game
        console.log("Square listeners initialized.")
        const gameSquares = document.querySelectorAll(".square");
        gameSquares.forEach(item => {
            this.stateOfGame.push(item);
            item.addEventListener("click", () => {
                item.classList.toggle("alive");
                console.log("number:", this.stateOfGame.indexOf(item));
            })
        })
    }

    startBtnListener() {
        console.log("btn listener initialized.")
        this.startBtn.addEventListener("click", () => {
            this.startBtn.classList.toggle("active");
            if (this.startBtn.classList.contains("active")) {
                this.startBtn.innerText = "STOP";
                this.playOrPause = "play";
                this.lifeGoesOn();
            } else {
                this.startBtn.innerText = "START";
                this.playOrPause = "pause";
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

    checkWhatIsaround(index) {
        // indexes of 8 cells around a cell that's positioned centrally (not on a boards border)
        let cellsAround = [index + 1, index - 1, index - this.gameBoardSize + 1, index - this.gameBoardSize, index - this.gameBoardSize - 1, index + this.gameBoardSize - 1,
                            index + this.gameBoardSize, index + this.gameBoardSize + 1];
        // check if cell is on the left border of the board
        // if yes, delete cells to the left from it from checking for life there
        if (index % this.gameBoardSize === 0) {
                cellsAround = cellsAround.filter(num => {
                    return num !== index - 1 && num !== index - this.gameBoardSize - 1 && num !== index + this.gameBoardSize - 1;
                })
        // check if cell is on the right border of the board
        // if yes, delete cells to the right from it from checking for life there
        } else if ((index + 1) % this.gameBoardSize === 0) {
                cellsAround = cellsAround.filter(num => {
                    return num !== index + 1 && num !== index - this.gameBoardSize + 1 && num !== index + this.gameBoardSize + 1;
                })                
        }
        // filter out negative numbers and higher than max boardSize index
        cellsAround = cellsAround.filter((num) => {
                return num >= 0 && num <= (this.gameBoardSize * this.gameBoardSize)-1;
        });
        return cellsAround;
    }

    countLifeAround() {
        // clears lifeAroundCell property, evaluates how many alive cells are around each cell, sums it in lifeAroundCell
        this.stateOfGame.forEach((item) => {
            item.lifeAroundCell = 0;
            let lifeAround = 0;
            const itemsIndex = this.stateOfGame.indexOf(item);
            const whereToCheckForLife = this.checkWhatIsaround(itemsIndex);
            
            for (let j = 0; j < whereToCheckForLife.length; j++) {
                if (this.isCellAlive(this.stateOfGame[whereToCheckForLife[j]])) {
                    lifeAround += 1;
                }
            }
            item.lifeAroundCell += lifeAround;
        })
    }

    seeWhoDies() {
        // chcecks each cells lifeAroundCell property and evaluates who dies based on Conway's game rules
        this.stateOfGame.forEach((item) => {
            // const itemsIndex = this.stateOfGame.indexOf(item);
            if (!this.isCellAlive(item) && item.lifeAroundCell === 3) {
                item.classList.add("alive");
            } else if (this.isCellAlive(item) && !(item.lifeAroundCell === 2 || item.lifeAroundCell === 3)) {
                item.classList.remove("alive");
            } 
    
        })

    }

    
    async lifeGoesOn() {
        // while play button is active, the game logic runs
        while (this.playOrPause === "play"){
            this.countLifeAround();
            this.seeWhoDies();

            await timeout(200);
        }
    }

    isCellAlive(cell) {
        return cell.classList.contains("alive");
    }

}



gameInit(50);