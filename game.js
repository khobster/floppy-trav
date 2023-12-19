const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to detect if the user is on a mobile device
function isMobileDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// Game settings
let gravity = 1.7; // Gravity for desktop
let flapPower = 9; // Flap power for desktop
let flapDecay = 0.95; // Flap decay for desktop

// Adjust settings for mobile
if (isMobileDevice()) {
    gravity = 1.3; // Adjusted gravity for mobile
    flapPower = 9; // Adjusted flap power for mobile
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
let gameRunning = false;
let finalPipeAppeared = false;

// Images
const spriteSheet = new Image();
const pipeImg = new Image();
const finalPipeImg = new Image();

// Load images and show welcome screen
let imagesLoaded = 0;
let totalImages = 3;
spriteSheet.onload = pipeImg.onload = finalPipeImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        adjustWelcomeScreenSize();
        document.getElementById('welcomeScreen').style.display = 'block';
    }
};

spriteSheet.src = 'travisbird.png';
pipeImg.src = 'purplebeam2.png'; // Path to the beam image
finalPipeImg.src = 'lastpipe4.png'; // Path to the final goal image

// Sprite animation frames coordinates
const spriteFrames = [
    { x: 0, y: 0 },
    { x: 92, y: 0 },
    { x: 184, y: 0 }
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
    document.getElementById('welcomeScreen').style.display = 'none';
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

function Pipe(x, isFinal = false) {
    this.x = x;
    this.top = isFinal ? 0 : Math.random() * (canvas.height / 2);
    this.bottom = isFinal ? canvas.height : canvas.height - this.top - pipeGap;
    this.width = isFinal ? finalPipeImg.width * 0.8 : pipeImg.width;
    this.isFinal = isFinal;
}

function drawPipes() {
    pipes.forEach(function(pipe) {
        if (pipe.isFinal) {
            ctx.drawImage(finalPipeImg, pipe.x, 0, pipe.width, canvas.height);
        } else {
            ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
            ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
        }
    });
}

function updatePipes() {
    if (score < 6) {
        framesSinceLastPipe++;
        if (framesSinceLastPipe >= pipeInterval) {
            pipes.push(new Pipe(canvas.width));
            framesSinceLastPipe = 0;
        }
    } else if (!finalPipeAppeared) {
        finalPipeAppeared = true;
        setTimeout(() => {
            pipes.push(new Pipe(canvas.width, true)); // Add the final pipe after a delay
        }, 3000); // Delay equivalent to three pipes time
    }

    pipes.forEach(function(pipe, index) {
        pipe.x -= pipeSpeed;
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            if (!finalPipeAppeared && index === 0) {
                score++;
            }
        }
    });
}

function checkCollisions() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let hitPipe = birdX < pipe.x + pipe.width && birdX + 92 > pipe.x &&
                      (birdY < pipe.top || birdY + 64 > canvas.height - pipe.bottom);

        if (hitPipe) {
            if (pipe.isFinal) {
                gameRunning = false;
                alert('You win!');
                document.location.reload();
                return;
            }
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

function adjustWelcomeScreenSize() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    welcomeScreen.style.width = canvas.width + 'px';
    welcomeScreen.style.height = canvas.height + 'px';
}

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

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText('Score: ' + score, 10, canvas.height - 20);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 20);

    requestAnimationFrame(gameLoop);
}

adjustWelcomeScreenSize();
