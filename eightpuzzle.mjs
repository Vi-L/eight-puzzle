/* 
queue
visual version thats playable?
*/

import Heap from './heap.mjs'
import Queue from './queue.mjs'

const goal = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
const board = [ [ 5, 6, 7 ], [ 4, 0, 8 ], [ 1, 2, 3 ] ]//generateBoard()
console.log(board)

// console.log(countInversions([
//     5, 2, 8,
//     4, 1, 7,
//     0, 3, 6
// ])) //should return 14

console.log(aStar(board, goal, controlHeuristic)) // see if manhattan dist would get time down?
//breadthFirstQueue(board, goal).map(el => el.map(a => a.join("")).join("\n")).forEach(el => console.log(el, "\n"))
//breadthFirstArray(board, goal).map(el => el.map(a => a.join("")).join("\n")).forEach(el => console.log(el, "\n"))
//console.log(breadthFirst(board, goal))

/* 
check boards visually?
check with "off the shelf" function that works (SO post with upvotes, package, etc.)

see comment at generateBoard()

measure-command {}
*/

function manhattanDist(board, goal) {

}

function misplacedTiles(board, goal) {
    let count = 0
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] !== goal[y][x]) {
                count++
            }
        }
    }
    return count
}

function controlHeuristic(board, goal) {
    return 1
}

function aStar(start, goal, heuristic) { 
    const goalStr = JSON.stringify(goal)
    let count = 0 // safety check, prevent infinite loop
    const maxCount = Infinity
    const openSet = new Heap((a,b) => a.priority < b.priority)
    const startNode = {board: start, priority: heuristic(start, goal), bestScore: 0}
    openSet.insert(startNode)
    const visited = {[JSON.stringify(start)]: startNode}
    const cameFrom = {[JSON.stringify(start)]: null}
    while (count < maxCount && openSet.length() > 0) {
        count++
        const current = openSet.pop()
        //console.log(JSON.stringify(current.board), goalStr, JSON.stringify(current.board) === goalStr)
        if (JSON.stringify(current.board) === goalStr) {
            console.log("Visited:", Object.keys(cameFrom).length)
            //reconstruct path
            const path = []
            let sq = current.board
            while (cameFrom[JSON.stringify(sq)] !== null) {
                path.push(sq)
                sq = cameFrom[JSON.stringify(sq)]
            }
            return path.reverse()
        }
        for (const move of generateMoves(current.board)) {
            const newScore = current.bestScore + 1 // +1 because unweighted rect grid
            let newBoard = current.board.map(arr => arr.slice())
            applyMove(newBoard, move)
            const key = JSON.stringify(newBoard)
            if (visited[key] === undefined) {
                visited[key] = {board: newBoard, priority: Infinity, bestScore: Infinity}
            }
            if (newScore < visited[key].bestScore) {
                //console.log("insert ", JSON.stringify(current.coords), JSON.stringify(neighbor))
                cameFrom[key] = current.board
                visited[key].bestScore = newScore
                visited[key].priority = newScore + heuristic(newBoard, goal)
                openSet.insert({board: newBoard, priority: visited[key].priority, bestScore: visited[key].bestScore})
            }
        }
    }
    if (count === maxCount) {console.log("infinite loop")}
}


function breadthFirstQueue(start, goal) { 
    const goalStr = JSON.stringify(goal)
    const queue = new Queue()
    queue.enqueue(start)
    const cameFrom = {[JSON.stringify(start)]: null}
    while (!queue.isEmpty()) {
        const currBoard = queue.dequeue()
        if (JSON.stringify(currBoard) === goalStr) {
            //console.log(Object.keys(cameFrom).length)
            const path = []
            let sq = currBoard
            while (cameFrom[JSON.stringify(sq)] !== null) {
                path.push(sq)
                sq = cameFrom[JSON.stringify(sq)]
            }
            return path.reverse()
        }
        for (const move of generateMoves(currBoard)) {
            let newBoard = currBoard.map(arr => arr.slice())
            applyMove(newBoard, move)
            if (!(JSON.stringify(newBoard) in cameFrom)) {
                cameFrom[JSON.stringify(newBoard)] = currBoard
                queue.enqueue(newBoard)
            }
        }
    }
    console.log("Failed", Object.keys(cameFrom).length)
}

function breadthFirstArray(start, goal) { 
    const goalStr = JSON.stringify(goal)
    const queue = [start]
    const cameFrom = {[JSON.stringify(start)]: null}
    while (queue.length >= 1) {
        const currBoard = queue.shift()
        if (JSON.stringify(currBoard) === goalStr) {
            //console.log(Object.keys(cameFrom).length)
            const path = []
            let sq = currBoard
            while (cameFrom[JSON.stringify(sq)] !== null) {
                path.push(sq)
                sq = cameFrom[JSON.stringify(sq)]
            }
            return path.reverse()
        }
        for (const move of generateMoves(currBoard)) {
            let newBoard = currBoard.map(arr => arr.slice())
            applyMove(newBoard, move)
            if (!(JSON.stringify(newBoard) in cameFrom)) {
                cameFrom[JSON.stringify(newBoard)] = currBoard
                queue.push(newBoard)
            }
        }
    }
    console.log("Failed", Object.keys(cameFrom).length)
}

function applyMove(board, move) {
    const {x, y} = findEmptySquareCoords(board);
    [ board[y][x], board[y+move.y][x+move.x] ] = [ board[y+move.y][x+move.x], board[y][x] ]
}

function generateMoves(board) {
    const emptyCoords = findEmptySquareCoords(board)
    const legalDeltas = [ //left, right, up, down
        {x: -1, y: 0},
        {x: 1, y: 0},
        {x: 0, y: -1},
        {x: 0, y: 1}
    ]
    return legalDeltas.filter(({x, y}) => {
        x += emptyCoords.x
        y += emptyCoords.y
        return y >= 0 && y < board.length && x >= 0 && x < board[y].length
    })
    // equivalent to this code:
    // for (let i = 0; i < legalDeltas.length; i++) {
    //     let x = emptyCoords.x + legalDeltas[i].x
    //     let y = emptyCoords.y + legalDeltas[i].y
    //     if (x < 0 || x >= board.length || y < 0 || y >= board.length) {
    //         legalDeltas.splice(i, 1)
    //         i--
    //     }
    // }
    // return legalDeltas
}

function findEmptySquareCoords(board) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 0) {
                return {x, y}
            }
        }
    }
}

function generateBoard() {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    shuffleArray(nums)
    while (countInversions(nums) % 2 === 0) { // works with === 0 but should be === 1 ?
        shuffleArray(nums)
    }
    return make2Dgrid(nums)
}

function simpleGenerateBoard(n) {
    const board = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
    for (let i = 0; i < n; i++) {
        const moves = generateMoves(board)
        applyMove(board, moves[Math.floor(Math.random()*moves.length)])
        //console.log(board.map(arr => arr.join(" ")).join("\n"))
    }
    return board
}

function countInversions(arr) {
    let total = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) continue;
        for (let j = i+1; j < arr.length; j++) {
            if (arr[i] < arr[j]) {
                total++
            }
        }
    }
    return total
}

// precondition: arr.length is a perfect square
function make2Dgrid(arr) {
    const grid = []
    const width = Math.sqrt(arr.length)
    for (let i = 0; i < width; i++) {
        const row = []
        for (let j = 0; j < width; j++) {
            row.push(arr[i + width * j])
        }
        grid.push(row)
    }
    return grid
}

function shuffleArray(arr) {
    for (let i = 0; i < arr.length - 2; i++) {
    let j = Math.floor(Math.random() * (arr.length - i)) + i
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

function testShuffleArrayBias() {
    const timesSeen = {}
    for (let i = 0; i < 10000000; i++) {
        const nums = [1, 2, 3, 4]
        shuffleArray(nums)
        const str = nums.join(",")
        if (timesSeen[str]) {
            timesSeen[str]++
        } else {
            timesSeen[str] = 1
        }
    }
    console.log(timesSeen)
}