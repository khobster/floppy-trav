const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = 100;
let gravity = 2;
let flapPower = 100;
let score = 0;
let pipeGap = 400; // Gap between pipes
let pipeSpeed = 1; // Speed of pipes moving
let pipes = []; // Array to store pipe objects

// Images (omitted for brevity, replace with your image paths)
const birdImg = new Image();
birdImg.src = './travisImg.png';

const pipeImg = new Image();
pipeImg.src = './swifties2.png';

// Pipe object constructor
function Pipe(x) {
  this.x = x;
  this.topHeight = Math.random() * (canvas.height - pipeGap - 100) + 100; // Random height for top pipe
  this.bottomHeight = canvas.height - this.topHeight - pipeGap; // Calculate height for bottom pipe
}

function flap() {
  bird.y -= flapPower;
  flapPower += 0.1; // Increase flap power slightly each time
}

function updateGravity() {
  bird.y += gravity * gravityConstant;
  gravityConstant += 0.001; // Increase gravity pull slightly each frame
}

// Game loop
function gameLoop() {
  // Update bird position
  birdY += gravity;

  // Update pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;
    if (pipes[i].x < -pipeImg.width) {
      pipes.shift(); // Remove pipe if it goes off screen
      score++; // Increase score for passing a pipe
    }
  }

  // Create new pipe if needed
  if (pipes.length === 0) {
    const pipeX = canvas.width;
    pipes.push(new Pipe(pipeX));
  }

  // Draw background
  ctx.fillStyle = '87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pipes
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    ctx.drawImage(pipeImg, pipe.x, 0, pipeImg.width, pipe.topHeight); // Draw top pipe
    ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + pipeGap, pipeImg.width, pipe.bottomHeight); // Draw bottom pipe
  }

  // Draw bird
  ctx.drawImage(birdImg, birdX, birdY);

  // Check collision with pipes
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    if (birdX + birdImg.width > pipe.x && birdX < pipe.x + pipeImg.width) {
      if (birdY < pipe.topHeight || birdY > pipe.topHeight + pipeGap) { // Check if bird collides with top or bottom pipe
        // Collision! Game over
        alert('Game Over! Your score is: ' + score);
        pipes = []; // Reset pipes
        birdY = 100; // Reset bird position
        score = 0; // Reset score
        break; // Exit loop
      }
    }
  }

  // Check collision with ground
  if (birdY + birdImg.height > canvas.height) {
    // Collision! Game over
    alert('Game Over! Your score is: ' + score);
    pipes = []; // Reset pipes
    birdY = 100; // Reset bird position
    score = 0; // Reset score
  }

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);

  requestAnimationFrame(gameLoop);
}

// Event listener
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    birdY -= flapPower;
  }
});

gameLoop();
