// Game constants and variables
const GRAVITY = 0.5;
let gameRunning = false;
let score = 0;

// Game initialization
function initGame() {
    document.addEventListener('keydown', handleKeyPress);
    window.requestAnimationFrame(gameLoop);
}

// Main game loop
function gameLoop() {
    if (gameRunning) {
        // Update game state
        // TODO: Update Travis's position based on gravity
        // TODO: Move Swiftie obstacles
        // TODO: Check for collisions
        // TODO: Update score
    }
    // Continue the loop
    window.requestAnimationFrame(gameLoop);
}

// Handle key press
function handleKeyPress(e) {
    if (e.code === 'Space') {
        // TODO: Make Travis "flap" and go up
    } else if (e.code === 'Enter' && !gameRunning) {
        startGame();
    }
}

// Start the game
function startGame() {
    gameRunning = true;
    score = 0;
    // TODO: Reset Travis's position
    // TODO: Spawn Swiftie obstacles
}

initGame();

