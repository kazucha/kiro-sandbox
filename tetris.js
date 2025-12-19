// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000'
};

// Tetromino shapes
const SHAPES = {
    I: [
        [[0, 0, 0, 0],
         [1, 1, 1, 1],
         [0, 0, 0, 0],
         [0, 0, 0, 0]]
    ],
    O: [
        [[1, 1],
         [1, 1]]
    ],
    T: [
        [[0, 1, 0],
         [1, 1, 1],
         [0, 0, 0]],
        [[0, 1, 0],
         [0, 1, 1],
         [0, 1, 0]],
        [[0, 0, 0],
         [1, 1, 1],
         [0, 1, 0]],
        [[0, 1, 0],
         [1, 1, 0],
         [0, 1, 0]]
    ],
    S: [
        [[0, 1, 1],
         [1, 1, 0],
         [0, 0, 0]],
        [[0, 1, 0],
         [0, 1, 1],
         [0, 0, 1]]
    ],
    Z: [
        [[1, 1, 0],
         [0, 1, 1],
         [0, 0, 0]],
        [[0, 0, 1],
         [0, 1, 1],
         [0, 1, 0]]
    ],
    J: [
        [[1, 0, 0],
         [1, 1, 1],
         [0, 0, 0]],
        [[0, 1, 1],
         [0, 1, 0],
         [0, 1, 0]],
        [[0, 0, 0],
         [1, 1, 1],
         [0, 0, 1]],
        [[0, 1, 0],
         [0, 1, 0],
         [1, 1, 0]]
    ],
    L: [
        [[0, 0, 1],
         [1, 1, 1],
         [0, 0, 0]],
        [[0, 1, 0],
         [0, 1, 0],
         [0, 1, 1]],
        [[0, 0, 0],
         [1, 1, 1],
         [1, 0, 0]],
        [[1, 1, 0],
         [0, 1, 0],
         [0, 1, 0]]
    ]
};

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let gameStarted = false;
let dropInterval = null;
let dropSpeed = 1000;

// Canvas elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPieceCanvas');
const nextCtx = nextCanvas.getContext('2d');

// UI elements
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreElement = document.getElementById('finalScore');
const finalLinesElement = document.getElementById('finalLines');

// Initialize game
function init() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    lines = 0;
    level = 1;
    gameOver = false;
    dropSpeed = 1000;
    updateUI();
    clearCanvas();
}

// Create a new piece
function createPiece() {
    const types = Object.keys(SHAPES);
    const type = types[Math.floor(Math.random() * types.length)];
    return {
        type: type,
        shape: SHAPES[type][0],
        rotation: 0,
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0][0].length / 2),
        y: 0,
        color: COLORS[type]
    };
}

// Draw a single block
function drawBlock(ctx, x, y, color, size = BLOCK_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * size, y * size, size, size);
    
    // Add highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x * size, y * size, size / 4, size);
    ctx.fillRect(x * size, y * size, size, size / 4);
}

// Draw the board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(ctx, col, row, board[row][col]);
            } else {
                // Draw subtle grid lines
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Draw the current piece
function drawPiece(piece) {
    if (!piece) return;
    
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(ctx, piece.x + x, piece.y + y, piece.color);
            }
        });
    });
}

// Draw next piece preview
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (!nextPiece) return;
    
    const size = 25;
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * size) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * size) / 2;
    
    nextPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(offsetX + x * size, offsetY + y * size, size, size);
                nextCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                nextCtx.lineWidth = 2;
                nextCtx.strokeRect(offsetX + x * size, offsetY + y * size, size, size);
                
                // Add highlight
                nextCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                nextCtx.fillRect(offsetX + x * size, offsetY + y * size, size / 4, size);
                nextCtx.fillRect(offsetX + x * size, offsetY + y * size, size, size / 4);
            }
        });
    });
}

// Check collision
function checkCollision(piece, offsetX = 0, offsetY = 0) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;
                
                // Check boundaries
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                
                // Check board collision (only if within bounds)
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge piece to board
function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        });
    });
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        
        // Score calculation: 100 for 1 line, 300 for 2, 500 for 3, 800 for 4
        const lineScores = [0, 100, 300, 500, 800];
        score += lineScores[linesCleared] * level;
        
        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        dropSpeed = Math.max(100, 1000 - (level - 1) * 100);
        
        updateUI();
        
        // Restart drop interval with new speed
        if (dropInterval) {
            clearInterval(dropInterval);
            startDropInterval();
        }
    }
}

// Move piece down
function moveDown() {
    if (checkCollision(currentPiece, 0, 1)) {
        mergePiece();
        clearLines();
        
        currentPiece = nextPiece;
        nextPiece = createPiece();
        drawNextPiece();
        
        // Check game over
        if (checkCollision(currentPiece)) {
            endGame();
        }
    } else {
        currentPiece.y++;
    }
    
    render();
}

// Move piece left
function moveLeft() {
    if (!checkCollision(currentPiece, -1, 0)) {
        currentPiece.x--;
        render();
    }
}

// Move piece right
function moveRight() {
    if (!checkCollision(currentPiece, 1, 0)) {
        currentPiece.x++;
        render();
    }
}

// Rotate piece
function rotate() {
    const type = currentPiece.type;
    const rotations = SHAPES[type];
    const nextRotation = (currentPiece.rotation + 1) % rotations.length;
    const previousShape = currentPiece.shape;
    
    currentPiece.shape = rotations[nextRotation];
    currentPiece.rotation = nextRotation;
    
    // Wall kick: try to adjust position if rotation causes collision
    if (checkCollision(currentPiece)) {
        // Try moving left or right
        if (!checkCollision(currentPiece, 1, 0)) {
            currentPiece.x++;
        } else if (!checkCollision(currentPiece, -1, 0)) {
            currentPiece.x--;
        } else if (!checkCollision(currentPiece, 2, 0)) {
            currentPiece.x += 2;
        } else if (!checkCollision(currentPiece, -2, 0)) {
            currentPiece.x -= 2;
        } else {
            // Rotation not possible, revert
            currentPiece.shape = previousShape;
            currentPiece.rotation = (currentPiece.rotation - 1 + rotations.length) % rotations.length;
            return;
        }
    }
    
    render();
}

// Hard drop
function hardDrop() {
    while (!checkCollision(currentPiece, 0, 1)) {
        currentPiece.y++;
        score += 2; // Bonus points for hard drop
    }
    updateUI();
    moveDown();
}

// Render the game
function render() {
    drawBoard();
    drawPiece(currentPiece);
}

// Update UI
function updateUI() {
    scoreElement.textContent = score;
    linesElement.textContent = lines;
    levelElement.textContent = level;
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
}

// Start drop interval
function startDropInterval() {
    dropInterval = setInterval(() => {
        if (gameStarted && !gameOver) {
            moveDown();
        }
    }, dropSpeed);
}

// Start game
function startGame() {
    init();
    gameStarted = true;
    gameOver = false;
    
    currentPiece = createPiece();
    nextPiece = createPiece();
    
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    
    drawNextPiece();
    render();
    startDropInterval();
}

// End game
function endGame() {
    gameOver = true;
    gameStarted = false;
    
    if (dropInterval) {
        clearInterval(dropInterval);
    }
    
    finalScoreElement.textContent = score;
    finalLinesElement.textContent = lines;
    gameOverOverlay.style.display = 'flex';
    restartButton.style.display = 'block';
}

// Restart game
function restartGame() {
    if (dropInterval) {
        clearInterval(dropInterval);
    }
    startGame();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameStarted || gameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            moveLeft();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveRight();
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveDown();
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotate();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
    }
});

// Button event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Initialize on load
init();
