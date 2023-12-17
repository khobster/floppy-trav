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
let gameRunning = false; // Game starts when welcome screen is interacted with

// Images
const spriteSheet = new Image();
const pipeImg = new Image();

// Load images and show welcome screen
let imagesLoaded = 0;
let totalImages = 2;
spriteSheet.onload = pipeImg.onload = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    adjustWelcomeScreenSize();
    document.getElementById('welcomeScreen').style.display = 'block';
  }
};

spriteSheet.src = 'travisbird.png';
pipeImg.src = './lipstick.png';

// Sprite animation frames coordinates
const spriteFrames = [
  { x: 0, y: 0 },    // Frame 1: Wing down
  { x: 92, y: 0 },   // Frame 2: Wing mid
  { x: 184, y: 0 }   // Frame 3: Wing up
];
let currentFrameIndex = 0;
let frameCount = 0;

// Function to handle user flap (spacebar, click, or tap)
function flap() {
  if (gameRunning) {
    flapVelocity = flapPower;
  }
}

// Start the game when the welcome screen is clicked/tapped
document.getElementById('welcomeScreen').addEventListener('click', startGame);
document.getElementById('welcomeScreen').addEventListener('touchstart', startGame);

// Event listeners for touch and mouse controls
canvas.addEventListener('touchstart', flap, false);
canvas.addEventListener('mousedown', flap, false);

// Event listener for desktop keyboard controls
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' || event.code === 'Space') {
    flap();
  }
}, false);

function startGame() {
  // Hide the welcome screen
  document.getElementById('welcomeScreen').style.display = 'none';

  // Start the game loop
  gameRunning = true;
  gameLoop();
}

function updateBirdPosition() {
  birdY -= flapVelocity;
  flapVelocity *= flapDecay;
  birdY += gravity;

  if (birdY < 0) birdY = 0;
  if (birdY + 64 >= canvas.height) gameOver();
}

function drawBird() {
  const frameX = spriteFrames[currentFrameIndex].x;
  ctx.drawImage(spriteSheet, frameX, 0, 92, 64, birdX, birdY, 92, 64);
}

function updateFrame() {
  frameCount++;
  if (frameCount > 10) {
    frameCount = 0;
    currentFrameIndex = (currentFrameIndex + 1) % spriteFrames.length;
  }
}

function Pipe(x) {
  this.x = x;
  this.top = Math.random() * (canvas.height / 2);
  this.bottom = canvas.height - this.top - pipeGap;
  this.width = pipeImg.width;
}

function drawPipes() {
  pipes.forEach(function(pipe) {
    ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updatePipes() {
  framesSinceLastPipe++;
  if (framesSinceLastPipe >= pipeInterval) {
    pipes.push(new Pipe(canvas.width));
    framesSinceLastPipe = 0;
  }

  pipes.forEach(function(pipe, index) {
    pipe.x -= pipeSpeed;
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      if (index === 0) { // Increment score for the first pipe in the array
        score++;
      }
    }
  });
}

function checkCollisions() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    let hitTopPipe = birdX < pipe.x + pipe.width && birdX + 92 > pipe.x && birdY < pipe.top;
    let hitBottomPipe = birdX < pipe.x + pipe.width && birdX + 92 > pipe.x && birdY + 64 > canvas.height - pipe.bottom;

    if (hitTopPipe || hitBottomPipe) {
      gameOver();
      return;
    }
  }
}

function gameOver() {
  gameRunning = false;
  alert('Game Over! Your score is: ' + score);
  document.location.reload();
}

// Adjust the welcome screen size to match the canvas
function adjustWelcomeScreenSize() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  welcomeScreen.style.width = canvas.width + 'px';
  welcomeScreen.style.height = canvas.height + 'px';
}

// Adjust the welcome screen size on load and window resize
window.addEventListener('resize', adjustWelcomeScreenSize);

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBirdPosition();
  updateFrame();
  drawBird();
  updatePipes();
  drawPipes();
  checkCollisions();

  // Score display in the lower left corner
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.strokeText('Score: ' + score, 10, canvas.height - 20);
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, canvas.height - 20);

  requestAnimationFrame(gameLoop);
}
