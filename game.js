const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = 100;
let gravity = 1.5; // Reduced gravity for smoother descent
let flapPower = 12; // Adjusted flap power for a quicker jump
let flapVelocity = 0; // Velocity of the bird immediately after flapping
let flapDecay = 0.95; // Rate at which flap power decreases
let score = 0;
let pipeGap = 300; // Gap between pipes
let pipeSpeed = 3; // Speed of pipes moving
let pipes = []; // Array to store pipe objects

// Images
const birdImg = new Image();
birdImg.src = './travisImg.png'; // This will be replaced with the sprite sheet
const pipeImg = new Image();
pipeImg.src = './pipe.png';

// Sprite sheet animation setup
const spriteSheet = new Image();
spriteSheet.src = 'travisbird.png'; // The sprite sheet for Travis Kelce riding the eagle
const spriteFrames = [
  { x: 0, y: 0 },    // Frame 1: Wing down
  { x: 92, y: 0 },   // Frame 2: Wing mid
  { x: 184, y: 0 }   // Frame 3: Wing up
];
let currentFrameIndex = 0;
let frameCount = 0;

function flap() {
  flapVelocity = flapPower; // Set initial velocity on flap
}

function updateBirdPosition() {
  birdY -= flapVelocity;
  flapVelocity *= flapDecay; // Decrease velocity each frame
  birdY += gravity; // Apply gravity
}

function drawBird() {
  // Clear the area where the bird will be drawn to prevent smearing
  ctx.clearRect(birdX, birdY, 92, 64);
  
  // Calculate the current frame and its x coordinate on the sprite sheet
  let frameX = currentFrameIndex * 92;
  
  // Draw the current frame
  ctx.drawImage(spriteSheet, frameX, 0, 92, 64, birdX, birdY, 92, 64);
}

function updateFrame() {
  frameCount++;
  if (frameCount > 10) { // Change 10 to slow down or speed up the animation
    frameCount = 0;
    currentFrameIndex = (currentFrameIndex + 1) % spriteFrames.length;
  }
}

// Pipe object constructor
function Pipe(x) {
  this.x = x;
  this.topHeight = Math.random() * (canvas.height - pipeGap - 100) + 100;
  this.bottomHeight = canvas.height - this.topHeight - pipeGap;
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
  updateBirdPosition();
  updateFrame(); // Update the animation frame
  drawBird(); // Draw the bird with the current animation frame
  
  // ... your existing pipe and collision code ...

  requestAnimationFrame(gameLoop);
}

// Check collisions (your existing function)
function checkCollisions() {
  // ... your existing collision detection code ...
}

// Game over function (your existing function)
function gameOver() {
  // ... your existing game over code ...
}

// Event listener for flap (your existing event listener)
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    flap();
  }
});

// Start the game loop
gameLoop();
