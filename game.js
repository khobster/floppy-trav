const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = 100;
let gravity = 1.5;
let flapPower = 12;
let flapVelocity = 0;
let score = 0;
let pipeGap = 300;
let pipeSpeed = 3;
let pipes = [];
let gameRunning = true;

// Images
const spriteSheet = new Image();
spriteSheet.src = 'travisbird.png'; // The sprite sheet for Travis Kelce riding the eagle

// Sprite animation frames coordinates
const spriteFrames = [
  { x: 0, y: 0 },    // Frame 1: Wing down
  { x: 92, y: 0 },   // Frame 2: Wing mid
  { x: 184, y: 0 }   // Frame 3: Wing up
];
let currentFrameIndex = 0;
let frameCount = 0;

const pipeImg = new Image();
pipeImg.src = './pipe.png';

function flap() {
  if (gameRunning) {
    flapVelocity = flapPower;
  }
}

function updateBirdPosition() {
  birdY -= flapVelocity;
  flapVelocity *= 0.95; // Flap decay
  birdY += gravity;

  // Prevent bird from moving above the screen
  if (birdY < 0) {
    birdY = 0;
    flapVelocity = 0;
  }
}

function drawBird() {
  // Select and draw the current frame
  const frameX = spriteFrames[currentFrameIndex].x;
  ctx.drawImage(spriteSheet, frameX, 0, 92, 64, birdX, birdY, 92, 64);
}

function updateFrame() {
  if (gameRunning) {
    frameCount++;
    if (frameCount > 10) {
      frameCount = 0;
      currentFrameIndex = (currentFrameIndex + 1) % spriteFrames.length;
    }
  }
}

// Pipe object constructor
function Pipe() {
  this.top = Math.random() * (canvas.height / 2);
  this.bottom = canvas.height - this.top - pipeGap;
  this.x = canvas.width;
  this.width = pipeImg.width;

  this.show = function() {
    ctx.drawImage(pipeImg, this.x, 0, this.width, this.top); // Top pipe
    ctx.drawImage(pipeImg, this.x, canvas.height - this.bottom, this.width, this.bottom); // Bottom pipe
  };

  this.update = function() {
    this.x -= pipeSpeed;
  };

  this.offscreen = function() {
    return this.x < -this.width;
  };
}

// Check for collisions
function checkCollisions() {
  for (let i = pipes.length - 1; i >= 0; i--) {
    if (birdX < pipes[i].x + pipes[i].width &&
      birdX + 92 > pipes[i].x &&
      (birdY < pipes[i].top || birdY + 64 > canvas.height - pipes[i].bottom)) {
      // Collision detected
      gameOver();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }
}

function gameOver() {
  gameRunning = false;
  alert('Game Over! Your score is: ' + score);
  document.location.reload(); // Restart the game
}

function drawPipes() {
  pipes.forEach(function(pipe) {
    pipe.show();
  });
}

function updatePipes() {
  if (frameCount % 100 === 0) { // Every 100 frames add a new pipe
    pipes.push(new Pipe());
  }

  pipes.forEach(function(pipe) {
    pipe.update();
  });
}

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 32) { // Space key
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

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game loop once the sprite sheet is loaded
spriteSheet.onload = function() {
  gameLoop();
};
