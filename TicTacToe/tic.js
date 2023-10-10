const gameBoard = document.querySelector('#gameboard')
const gameInfo = document.querySelector('#gameinfo')
const startCells = [
    "", "", "", "", "", "", "", "", ""
]

let go = "circle"
gameInfo.textContent = "Circle goes first"

function createBoard() {
    startCells.forEach((cell, index) => {
        const cellElement = document.createElement('div')
        cellElement.classList.add('square')
        cellElement.id = index
        cellElement.addEventListener('click', addMark)
        gameBoard.append(cellElement)
    })
}
createBoard()

function addMark(i) {
    console.log(i.target)
    const markDisplay = document.createElement('div')
    markDisplay.classList.add(go)
    i.target.append(markDisplay)
    go = go === "circle" ? "cross" : "circle"
    gameInfo.textContent = "it is " + go + "'s go."
    i.target.removeEventListener("click", addMark)
    checkScore()
}

function checkScore() {
    const allSquares = document.querySelectorAll(".square")
    const winningCombo = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]

    winningCombo.forEach(array => {
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circle"))

        if (circleWins) {
            gameInfo.textContent = "Circle wins!"
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)))
            return
        }
    })

    winningCombo.forEach(array => {
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cross"))

        if (crossWins) {
            gameInfo.textContent = "Cross wins!"
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)))
            return
        }
    })
}