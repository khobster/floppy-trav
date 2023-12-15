const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = 100;
let gravity = 0.5;
let flapPower = 5;
let score = 0;
let birdSprite;
let swiftiesUpSprite;
let swiftiesDownSprite;
let backgroundSprite;

// Load Images
function loadImages() {
    birdSprite = new Image();
    swiftiesUpSprite = new Image();
    swiftiesDownSprite = new Image();
    backgroundSprite = new Image();

    birdSprite.src = 'travis_sprite_sheet.png';
    swiftiesUpSprite.src = 'swifties_up_sprite_sheet.png';
    swiftiesDownSprite.src = 'swifties_down_sprite_sheet.png';
    backgroundSprite.src = 'background.png';

    // Only start the game loop when all images are loaded
    let totalImages = 4;
    let imagesLoaded = 0;

    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            gameLoop();
        }
    }

    birdSprite.onload = imageLoaded;
    swiftiesUpSprite.onload = imageLoaded;
    swiftiesDownSprite.onload = imageLoaded;
    backgroundSprite.onload = imageLoaded;
}

// Game loop
function gameLoop() {
    // Update bird position
    birdY += gravity;

    // Draw background
    ctx.drawImage(backgroundSprite, 0, 0, canvas.width, canvas.height);

    // Draw pipes and bird
    // Here you should add your logic to draw the swifties and animate Travis Kelce
    // This part of the code is just a placeholder and should be replaced with your actual drawing code
    ctx.drawImage(birdSprite, birdX, birdY);

    // Check collision (code omitted for brevity)

    // Update score (code omitted for brevity)

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

// Start loading images
loadImages();
