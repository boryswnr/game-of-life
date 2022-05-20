const timeout = async time => await new Promise(resolve => setTimeout(() => resolve(), time));
const widthForm = document.getElementById('width');
const heightForm = document.getElementById('height');
let cellsOnWidth = 50;
let cellsOnHeight = 50;
let doWePlay = false;

function getTheSize() {
    if (isNaN(parseInt(heightForm.value)) || heightForm.value < 15 || heightForm.value > 200 || isNaN(parseInt(widthForm.value)) || widthForm.value < 15 || widthForm.value > 200) {
        return alert("Wrong value entered. Board size should be a number between 15 and 200");
    }
    
    cellsOnWidth = widthForm.value;
    cellsOnHeight = heightForm.value;
}

const adjustToScreenSize = () => {
    const headerHeight = document.getElementById("header").offsetHeight
    const screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    
    const screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    console.log("width x height", screenWidth, screenHeight);

    cellsOnWidth = Math.floor(screenWidth / 10);
    cellsOnHeight = Math.floor((screenHeight - headerHeight) / 10);
    console.log("cellsOnHeight:", cellsOnHeight);
    console.log("headerHeight:", headerHeight);
    console.log("height", screenHeight);
    console.log("screenHeight - headerHeight:", screenHeight - headerHeight);
    
}

function gameInit(width, height) {
    const adjustBtn = document.getElementById("adjust-btn");
    const submitSizeBtn = document.getElementById("submit-btn");
    const gameUi = new TheGame;
    let gameBoard = new GameBoard(width, height);   
    
    
    const slider = document.getElementById("speed");
    slider.oninput = () => {
        if (slider.value === 11) {
            gameBoard.timeoutRate = 50;
        } else if (slider.value === 12) {
            gameBoard.timeoutRate = 20;
        }
        gameBoard.timeoutRate = slider.value * 100;
    }
    
    adjustBtn.addEventListener("click", () => {
        adjustToScreenSize();
        gameBoard.gameBoardWidth = parseInt(cellsOnWidth);
        gameBoard.gameBoardHeight = parseInt(cellsOnHeight);
        gameBoard.boardInit();
        gameBoard.initListeners();
    })
    
    submitSizeBtn.addEventListener("click", () => {
        getTheSize();
        gameBoard.gameBoardWidth = parseInt(cellsOnWidth);
        gameBoard.gameBoardHeight = parseInt(cellsOnHeight);
        gameBoard.boardInit();
        gameBoard.initListeners();
    })
    
    gameUi.startBtnListener(gameBoard.lifeGoesOn);

    
}

// TODO: move constants to TheGame - btns, listeners, etc.
// TODO: create TheGame once, on windows adjust etc. add new board to TheGame
class TheGame {
    constructor() {
        this.adjustBtn = document.getElementById("adjust-btn");
        this.startBtn = document.getElementById("start-btn");
    }

    startBtnListener(processName) {
        console.log("btn listener initialized.")
        if (this.startBtn.classList.contains("active")) {
            this.startBtn.classList.remove("active");
            this.startBtn.innerText = "START";
            doWePlay = false;
        }
        this.startBtn.addEventListener("click", () => {
            this.startBtn.classList.toggle("active");
            if (this.startBtn.classList.contains("active")) {
                this.startBtn.innerText = "STOP";
                doWePlay = true;
                processName();
            } else {
                this.startBtn.innerText = "START";
                doWePlay = false;
            }
        })
        
    }
    
}
class GameBoard {
    constructor(gameBoardWidth, gameBoardHeight) {
        this.gameBoardWidth = parseInt(gameBoardWidth);
        this.gameBoardHeight = parseInt(gameBoardHeight);
        this.stateOfGame = [];
        this.startBtn = document.getElementById("start-btn");
        this.timeoutRate = 500;
        this.boardInit();
        this.initListeners();
        
    }

    boardInit() {
        const gameWrapper = document.getElementById("game-wrapper");
        gameWrapper.innerHTML = "";
        for (let i = 0; i < this.gameBoardHeight; i++) {
            const row = document.createElement("div");
            row.className = "row";
            row.setAttribute("id", `row-${i}`);
            
            for (let j = 0; j < this.gameBoardWidth; j++) {
                const cell = document.createElement("div");
                cell.className = "square";
                row.appendChild(cell);
            }
            gameWrapper.appendChild(row);
        }
        console.log("Board initialized.");
    }
    
    squareListeners() {
        // add listeners to each div so a player can mark which cells he wants to be alive or dead
        // pushes each field to array which keeps track of state of game
        console.log("Square listeners initialized.")
        const gameSquares = document.querySelectorAll(".square");
        this.stateOfGame = [];
        gameSquares.forEach(item => {
            this.stateOfGame.push(item);
            item.addEventListener("click", () => {
                item.classList.toggle("alive");
                console.log("number:", this.stateOfGame.indexOf(item));
            })
        })
        // below will add a sample life that evolves into Pulsar to demonstrate that game works
        // it must be entered below squareListeners() method, so it will load on each reload
        // in case of 50x50 board, sample life will be much more complex
        if (this.gameBoardWidth === 50 && this.gameBoardHeight === 50) {
            const startingSquares = [130, 180, 230, 141, 142, 143, 311, 312, 313, 401, 452, 500, 501, 502, 520, 521, 522, 569, 570, 571, 343, 342, 392, 443, 394, 0, 1, 50, 51, 102, 103, 152, 153, 8, 9, 58, 59, 2025, 2026, 2027, 2031, 2032, 2033, 2078, 2080, 2128, 2130, 2178, 2180, 1925, 1926, 1927, 1931, 1932, 1933, 1675, 1676, 1677, 1683, 1681, 1682, 1778, 1828, 1878, 1780, 1830, 1880, 1773, 1823, 1873, 2073, 2123, 2173, 2085, 2135, 2185, 2277, 2276, 2275, 2281, 2282, 2283, 1885, 1835, 1785];
            startingSquares.forEach(item => this.stateOfGame[item].classList.add("alive"));
        } else {
            const firstSquare = Math.floor(this.gameBoardWidth / 2) + this.gameBoardWidth * 3;
            const firstOfHorizontals = firstSquare + 4 * this.gameBoardWidth-3
            const startingSquares = [firstSquare, firstSquare + this.gameBoardWidth, firstSquare + 2 * (this.gameBoardWidth), firstOfHorizontals, firstOfHorizontals+1, firstOfHorizontals+2, firstOfHorizontals+4, firstOfHorizontals+5, firstOfHorizontals+6, firstSquare + 6 * (this.gameBoardWidth), firstSquare + 7 * (this.gameBoardWidth),firstSquare + 8 * (this.gameBoardWidth)]
            startingSquares.forEach(item => this.stateOfGame[item].classList.add("alive"));
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

    initListeners() {
        this.squareListeners();
        this.addLifeAroundProperty();
    }

    checkWhatIsaround(index) {
        // indexes of 8 cells around a cell that's positioned centrally (not on a boards border)
        let cellsAround = [index + 1, index - 1, index - this.gameBoardWidth + 1, index - this.gameBoardWidth, index - this.gameBoardWidth - 1, index + this.gameBoardWidth - 1,
                            index + this.gameBoardWidth, index + this.gameBoardWidth + 1];
        // check if cell is on the left border of the board
        // if yes, delete cells to the left from it from checking for life there
        if (index % this.gameBoardWidth === 0 || index === 0) {
                cellsAround = cellsAround.filter(num => {
                    return num !== index - 1 && num !== index - this.gameBoardWidth - 1 && num !== index + this.gameBoardWidth - 1;
                })
        // check if cell is on the right border of the board
        // if yes, delete cells to the right from it from checking for life there
        } else if ((index + 1) % this.gameBoardWidth === 0) {
                cellsAround = cellsAround.filter(num => {
                    return num !== index + 1 && num !== index - this.gameBoardWidth + 1 && num !== index + this.gameBoardWidth + 1;
                })                
        }
        // filter out negative numbers and higher than max boardSize index
        cellsAround = cellsAround.filter((num) => {
                return num >= 0 && num <= (this.gameBoardWidth * this.gameBoardHeight)-1;
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

    
    lifeGoesOn = async () => {
        // while play button is active, the game logic runs
        while (doWePlay){
            this.countLifeAround();
            this.seeWhoDies();

            await timeout(this.timeoutRate);
        }
    }

    isCellAlive(cell) {
        return cell.classList.contains("alive");
    }

}



gameInit(50, 50);