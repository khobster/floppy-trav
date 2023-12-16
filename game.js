const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to detect if the user is on a mobile device
function isMobileDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// Game settings
let gravity = 1.5; // Gravity for desktop
let flapPower = 12; // Flap power for desktop
let flapDecay = 0.95; // Flap decay for desktop

// Adjust settings for mobile
if (isMobileDevice()) {
  gravity = 1.2; // Adjusted gravity for mobile
  flapPower = 10; // Adjusted flap power for mobile
  flapDecay = 0.9; // Adjusted flap decay for mobile
}

// Game variables
let birdX = 50;
let birdY = 100;
let flapVelocity = 0;
let score = 0;
let pipeGap = 300;
let pipeSpeed = 3;
let pipes = [];
let framesSinceLastPipe = 0;
let pipeInterval = 100;
let gameRunning = false; // Set to false initially

// Images
const spriteSheet = new Image();
const pipeImg = new Image();

// Load images
let imagesLoaded = 0;
let totalImages = 2;
spriteSheet.onload = pipeImg.onload = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    document.getElementById('welcomeScreen').style.display = 'block'; // Show welcome screen once images are loaded
  }
};

spriteSheet.src = 'travisbird.png';
pipeImg.src = './pipe.png';

// Sprite animation frames
const spriteFrames = [
  { x: 0, y: 0 },
  { x: 92, y: 0 },
  { x: 184, y: 0 }
];
let currentFrameIndex = 0;
let frameCount = 0;

// Flap function
function flap() {
  if (gameRunning) {
    flapVelocity = flapPower;
  }
}

// Event listeners
canvas.addEventListener('touchstart', flap, false);
canvas.addEventListener('mousedown', flap, false); 
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' || event.code === 'Space') {
    flap();
  }
}, false);

// Function to start the game
function startGame() {
  gameRunning = true;
  document.getElementById('welcomeScreen').style.display = 'none';
  gameLoop();
}

// Add event listeners for the welcome screen
document.getElementById('welcomeScreen').addEventListener('click', startGame);
document.getElementById('welcomeScreen').addEventListener('touchstart', startGame);

// Game functions (updateBirdPosition, drawBird, updateFrame, Pipe, drawPipes, updatePipes, checkCollisions) remain unchanged

// Game over function
function gameOver() {
  gameRunning = false;
  alert('Game Over! Your score is: ' + score);
  document.location.reload();
}

// Game loop function
function gameLoop() {
  if (!gameRunning) return; // Only run if the game has started

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBirdPosition();
  updateFrame();
  drawBird();
  updatePipes();
  drawPipes();
  checkCollisions();

  // Score display
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, canvas.height - 20);

  requestAnimationFrame(gameLoop);
}

// Game will start after welcome screen interaction
