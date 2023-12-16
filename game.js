const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = 100;
let gravity = 5;
let flapPower = 100;
let score = 0;
let pipeGap = 300; // Gap between pipes
let pipeSpeed = 3; // Speed of pipes moving
let pipes = []; // Array to store pipe objects

// Images
const birdImg = new Image();
birdImg.src = './travisImg.png';

const pipeImg = new Image();
pipeImg.src = './pipe.png';

// Pipe object constructor
function Pipe(x) {
  this.x = x;
  this.topHeight = Math.random() * (canvas.height - pipeGap - 100) + 100; // Random height for top pipe
  this.bottomHeight = canvas.height - this.topHeight - pipeGap; // Calculate height for bottom pipe
}

function flap() {
  birdY -= flapPower;
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
  ctx.drawImage(birdImg, birdX, birdY, birdImg.width * 1.5, birdImg.height * 1.5);

  // Check collision with pipes
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    const pipeLeftEdge = pipe.x;
    const pipeRightEdge = pipe.x + pipeImg.width;
    const pipeTopHeight = pipe.topHeight;
    const pipeBottomHeight = canvas.height - pipe.bottomHeight;
    
    const birdLeftEdge = birdX;
    const birdRightEdge = birdX + birdImg.width * 1.5; // Adjusted for the bird's size
    const birdTopEdge = birdY;
    const birdBottomEdge = birdY + birdImg.height * 1.5; // Adjusted for the bird's size

    // Check if bird collides with top or bottom pipe
    if (birdRightEdge > pipeLeftEdge && birdLeftEdge < pipeRightEdge) {
      if (birdTopEdge < pipeTopHeight || birdBottomEdge > pipeBottomHeight) {
        // Collision detected
        gameOver();
        break;
      }
    }
  }

  // Check collision with ground
  if (birdY + birdImg.height * 1.5 > canvas.height) {
    // Collision! Game over
    gameOver();
  }

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);

  requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
  alert('Game Over! Your score is: ' + score);
  pipes = []; // Reset pipes
  birdY = 100; // Reset bird position
  score = 0; // Reset score
}

// Event listener for flap
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    birdY -= flapPower;
  }
});

gameLoop();
