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
let framesSinceLastPipe = 0;
let pipeInterval = 100; // Frames between pipe generation
let gameRunning = true;

// Images
const spriteSheet = new Image();
const pipeImg = new Image();

// Set a flag to check if all images are loaded
let imagesLoaded = 0;
let totalImages = 2; // Total number of images to load

spriteSheet.onload = pipeImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
};

spriteSheet.src = 'travisbird.png'; // The sprite sheet for Travis Kelce riding the eagle
pipeImg.src = './pipe.png';

// Sprite animation frames coordinates
const spriteFrames = [
  { x: 0, y: 0 },    // Frame 1: Wing down
  { x: 92, y: 0 },   // Frame 2: Wing mid
  { x: 184, y: 0 }   // Frame 3: Wing up
];
let currentFrameIndex = 0;
let frameCount = 0;

function flap() {
  if (gameRunning) {
    flapVelocity = flapPower;
  }
}

function updateBirdPosition() {
  birdY -= flapVelocity;
  flapVelocity *= flapDecay; // Flap decay
  birdY += gravity;

  // Prevent bird from moving above or below the screen
  if (birdY < 0) birdY = 0;
  if (birdY + 64 >= canvas.height) gameOver();
}

function drawBird() {
  // Select and draw the current frame
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

// Pipe object constructor
function Pipe(x) {
  this.x = x;
  this.top = Math.random() * (canvas.height / 2);
  this.bottom = canvas.height - this.top - pipeGap;
  this.width = pipeImg.width;
}

function drawPipes() {
  pipes.forEach(function(pipe) {
    ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top); // Top pipe
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom); // Bottom pipe
  });
}

function updatePipes() {
  if (framesSinceLastPipe === pipeInterval) {
    pipes.push(new Pipe(canvas.width));
    framesSinceLastPipe = 0;
  } else {
    framesSinceLastPipe++;
  }

  pipes.forEach(function(pipe, index) {
    pipe.x -= pipeSpeed;
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1); // Remove the pipe from the array
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
  // This is a basic reset; you might want to make a more sophisticated game over screen
  document.location.reload(); 
}

document.addEventListener('keydown', function(event) {
  if (event.key === ' ') {
    flap();
  }
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBirdPosition();
  updateFrame();
  drawBird();
  updatePipes();
  drawPipes();
  checkCollisions();

  // Increment score and draw it
  if (gameRunning && framesSinceLastPipe % pipeInterval === 0) {
    score++;
  }
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, canvas.height - 20);

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}
