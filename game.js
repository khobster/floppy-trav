const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = 100;
let gravity = 5;
let gravityConstant = 1; // Added gravity constant
let flapPower = 150; // Increased flap power
let flapDecay = 0.95; // Flap power decay factor
let score = 0;
let pipeGap = 300; // Gap between pipes
let pipeSpeed = 3; // Speed of pipes moving
let pipes = []; // Array to store pipe objects

// Bar variables
let barWidth = 100;
let barHeight = 20;
let barX = (canvas.width - barWidth) / 2;

// Images (replace with your image paths)
const birdImg = new Image();
birdImg.src = './travisImg.png';

const pipeImg = new Image();
pipeImg.src = './pipe.png';

// Pipe object constructor
function Pipe(x) {
  this.x = x;
  this.topHeight = Math.random() * (canvas.height - pipeGap - 100) + 100;
  this.bottomHeight = canvas.height - this.topHeight - pipeGap;
}

// Flap function
function flap() {
  birdY -= flapPower;
  flapPower *= flapDecay; // Apply decay to flap power
}

// Update gravity
function updateGravity() {
  if (flapPower < 100) {
    flapPower = 100; // Reset flap power if it gets too low
  }
  birdY += gravity * gravityConstant;
  gravityConstant += 0.001; // Increase gravity pull slightly each frame
}

// Draw bar function
function drawBar() {
  ctx.fillStyle = '#FFD700'; // Gold color for the bar
  ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
}

// Handle mouse move event
canvas.addEventListener('mousemove', (event) => {
  barX = event.clientX - canvas.getBoundingClientRect().left - barWidth / 2;
});

// Handle touch move event for mobile
canvas.addEventListener('touchmove', (event) => {
  barX = event.touches[0].clientX - canvas.getBoundingClientRect().left - barWidth / 2;
});

// Game loop
function gameLoop() {
  // Update bird position
  birdY += gravity;
  updateGravity(); // Update gravity

  // Update pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;
    if (pipes[i].x < -pipeImg.width) {
      pipes.shift();
      score++;
    }
  }

  // Create new pipe if needed
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    const pipeX = canvas.width;
    pipes.push(new Pipe(pipeX));
  }

  // Clear and draw background
  ctx.fillStyle = '87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pipes
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    ctx.drawImage(pipeImg, pipe.x, 0, pipeImg.width, pipe.topHeight);
    ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + pipeGap, pipeImg.width, pipe.bottomHeight);
  }

  // Draw bird
  ctx.drawImage(birdImg, birdX, birdY, birdImg.width * 1.5, birdImg.height * 1.5);

  // Check collision
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    if (birdX + birdImg.width > pipe.x && birdX < pipe.x + pipeImg.width) {
      if (birdY < pipe.topHeight || birdY + birdImg.height > pipe.topHeight + pipeGap) {
        gameOver();
        break;
      }
    }
  }

  // Collision with ground
  if (birdY + birdImg.height > canvas.height) {
    gameOver();
  }

  // Draw bar
  drawBar();

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);

  requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
  alert('Game Over! Your score is: ' + score);
  pipes = [];
  birdY = 100;
  score = 0;
}

// Event listener for flap
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    flap();
  }
});

gameLoop();
