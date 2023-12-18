const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to detect if the user is on a mobile device
function isMobileDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// Game settings
let gravity = 1.5; // Gravity for desktop
let flapPower = 9; // Flap power for desktop
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
let finalPipeReached = false;
let finalPipeImg = new Image();
finalPipeImg.src = 'lastpipe.png'; // The path to your final pipe image

// Images
const spriteSheet = new Image();
const pipeImg = new Image();

// Load images and show welcome screen
let imagesLoaded = 0;
let totalImages = 3; // Include the final pipe image in the total images count
spriteSheet.onload = pipeImg.onload = finalPipeImg.onload = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    adjustWelcomeScreenSize();
    document.getElementById('welcomeScreen').style.display = 'block';
  }
};

spriteSheet.src = 'travisbird.png';
pipeImg.src = './pipe.png';

// ... Rest of your code for spriteFrames, flap, startGame, drawBird, updateFrame, etc. ...

function adjustWelcomeScreenSize() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  welcomeScreen.style.width = canvas.width + 'px';
  welcomeScreen.style.height = canvas.height + 'px';
}

// Adjust the welcome screen size on load and window resize
window.addEventListener('resize', adjustWelcomeScreenSize);

// ... Rest of your code ...

function drawPipes() {
  if (!finalPipeReached) {
    pipes.forEach(function(pipe) {
      ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
      ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
  } else {
    // Draw the final pipe
    ctx.drawImage(finalPipeImg, pipes[pipes.length - 1].x, 0, finalPipeImg.width, canvas.height);
  }
}

function updatePipes() {
  if (!finalPipeReached) {
    framesSinceLastPipe++;
    if (framesSinceLastPipe >= pipeInterval) {
      pipes.push(new Pipe(canvas.width));
      framesSinceLastPipe = 0;
    }
  }

  pipes.forEach(function(pipe, index) {
    pipe.x -= pipeSpeed;
    if (pipe.x + pipe.width < 0 && index === 0) { // Increment score for the first pipe in the array
      score++;
      pipes.splice(index, 1);
      // Check if we've reached the score to show the final pipe
      if (score === 5) {
        finalPipeReached = true;
        // Set up the final pipe to appear after a delay equivalent to 3 pipes
        pipes.push(new Pipe(canvas.width * 4)); // Push the final pipe to the end of the array
      }
    }
  });
}

function checkCollisions() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    let hitTopPipe = birdX < pipe.x + pipe.width && birdX + 92 > pipe.x && birdY < pipe.top;
    let hitBottomPipe = birdX < pipe.x + pipe.width && birdX + 92 > pipe.x && birdY + 64 > canvas.height - pipe.bottom;

    if ((hitTopPipe || hitBottomPipe) && !finalPipeReached) {
      gameOver();
      return;
    }
    // If we hit the final pipe, trigger win condition
    if (finalPipeReached && (hitTopPipe || hitBottomPipe)) {
      gameWin();
      return;
    }
  }
}

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

  if (!finalPipeReached || score < 5) {
    requestAnimationFrame(gameLoop);
  }
}

function gameWin() {
  // Display a win message or image
  gameRunning = false;
  // Additional code for win condition...
  alert('Congratulations, you won!');
  // Restart the game or navigate to a win screen
}

// Call this function when the page loads to set the welcome screen size
adjustWelcomeScreenSize();
