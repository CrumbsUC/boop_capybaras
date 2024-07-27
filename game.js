// Add a log statement to verify JavaScript execution
console.log('JavaScript code is running');

// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the background image
const background = new Image();
background.src = 'background.png';

// Load the frame image
const frame = new Image();
frame.src = 'Frame.png';

function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

// Define the list of capybara images
const capybaraImages = [
    'Witch-Capybara.png',
    'Wizard-Capybara.png',
    'Base-Capybara.png',
    'TopHat-Capybara.png',
];

// Define the number of capybaras
const numCapybaras = 10;

// Define the image objects
const images = [];

let imagesLoaded = 0;
// Load the images and set random positions, speeds, and directions
for (let i = 0; i < numCapybaras; i++) {
    const image = new Image();
    image.src = getRandomItem(capybaraImages);
  
    // Wait for the image to load
    image.onload = () => {
      // Random position
      const x = Math.random() * (canvas.width - image.width);
      const y = Math.random() * (canvas.height - image.height);
  
      // Random speed and direction
      let vx, vy;
      do {
        vx = Math.random() * 4 - 2; // Random value between -2 and 2
        vy = Math.random() * 4 - 2; // Random value between -2 and 2
      } while (vx === 0 || vy === 0); // Ensure vx and vy are not 0
  
      images.push({ x, y, vx, vy, image });
  
      imagesLoaded++;
  
      if (imagesLoaded === numCapybaras) {
        gameLoop(); // Start the game loop when all images have loaded
      }
    };
}

// Define the game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the background image
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
    // Draw the frame image, scaled to half the width and height of the canvas
    const frameWidth = canvas.width / 3;
    const frameHeight = canvas.height / 3;
    const frameX = (canvas.width - frameWidth) / 2;
    const frameY = (canvas.height - frameHeight) / 2;
    ctx.drawImage(frame, 0, 0, frame.width, frame.height, frameX, frameY, frameWidth, frameHeight);
  
    // Update and draw each image
    images.forEach((image) => {
      // Update the image position
      image.x += image.vx;
      image.y += image.vy;
  
      // Bounce off the edges
      if (image.x + image.image.width > canvas.width) {
        image.x = canvas.width - image.image.width;
        image.vx = -image.vx;
      } else if (image.x < 0) {
        image.x = 0;
        image.vx = -image.vx;
      }
      if (image.y + image.image.height > canvas.height) {
        image.y = canvas.height - image.image.height;
        image.vy = -image.vy;
      } else if (image.y < 0) {
        image.y = 0;
        image.vy = -image.vy;
      }
  
      // Draw the image
      ctx.drawImage(image.image, image.x, image.y);
    });
  
    // Request the next frame
    requestAnimationFrame(gameLoop);
}

gameLoop();