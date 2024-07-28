// Add a log statement to verify JavaScript execution
console.log('JavaScript code is running');

// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const captureButton = document.getElementById('capture-button');

// Play background music
let song = new Audio('MySong.m4a');
song.loop = true;
song.play();

// Set the canvas dimensions to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the background and frame images
const background = new Image();
background.src = 'Sprites/Background.png';

const frame = new Image();
frame.src = 'Sprites/Frame.png';

let backgroundLoaded = false;
let frameLoaded = false;

background.onload = () => {
  backgroundLoaded = true;
  if (backgroundLoaded && frameLoaded) {
    gameLoop();
  }
};

frame.onload = () => {
  frameLoaded = true;
  if (backgroundLoaded && frameLoaded) {
    gameLoop();
  }
};

// Variables for frame position and speed
let frameX = (canvas.width - frame.width) / 2;
let frameY = (canvas.height - frame.height) / 2;
const frameSpeed = 5;

// Object to track which keys are pressed
const keysPressed = {};

// Function to handle keydown events
document.addEventListener('keydown', (event) => {
  keysPressed[event.key.toLowerCase()] = true;
});

// Function to handle keyup events
document.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});

// Function to get a random item from an array
function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Define the list of capybara images
const capybaraImages = [
  '/Sprites/Witch-Capybara.png',
  '/Sprites/Wizard-Capybara.png',
  '/Sprites/Base-Capybara.png',
  '/Sprites/TopHat-Capybara.png',
  '/Sprites/Fly-Capybara.png',
  '/Sprites/Long-Capybara.png'
];

// Define the number of capybaras and create image objects
const numCapybaras = 30;
const images = [];

let tries = 3;
let flash = false;
let flashTimeout = 0;

// Load images and set random positions, speeds, and directions
for (let i = 0; i < numCapybaras; i++) {
  const image = new Image();
  image.src = getRandomItem(capybaraImages);

  image.onload = () => {
    const x = Math.random() * (canvas.width - image.width);
    const y = Math.random() * (canvas.height - image.height);

    let vx, vy;
    do {
      vx = Math.random() * 6 - 3;
      vy = Math.random() * 6 - 3;
    } while (Math.abs(vx) < 0.3 || Math.abs(vy) < 0.3);

    images.push({ x, y, vx, vy, image });
  };
}

// Game loop function
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Update and draw each image
  images.forEach((image) => {
    image.x += image.vx;
    image.y += image.vy;
    image.y += Math.sin(Date.now() / 50) * 2;

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

    // Check if the image should fade out
    if (image.fadeOut) {
      const fadeOutTime = image.fadeOut;
      const currentTime = Date.now();
      const fadeDuration = 1000; // 2 seconds
      const opacity = 1 - (currentTime - fadeOutTime) / fadeDuration;

      if (opacity <= 0) {
        // Remove the image from the array
        images.splice(images.indexOf(image), 1);
      } else {
        ctx.save();
        ctx.globalAlpha = opacity;
        if (image.vx < 0) {
          ctx.translate(image.x + image.image.width, image.y);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(image.image, image.vx < 0 ? 0 : image.x, image.vy < 0 ? 0 : image.y);
        ctx.restore();
      }
    } else {
      if (image.vx < 0) {
        ctx.save();
        ctx.translate(image.x + image.image.width, image.y);
        ctx.scale(-1, 1);
        ctx.drawImage(image.image, 0, 0);
        ctx.restore();
      } else {
        ctx.drawImage(image.image, image.x, image.y);
      }
    }
  });

  // Update frame position based on key presses
  if (keysPressed['w']) frameY = Math.max(0, frameY - frameSpeed);
  if (keysPressed['s']) frameY = Math.min(canvas.height - frame.height, frameY + frameSpeed);
  if (keysPressed['a']) frameX = Math.max(0, frameX - frameSpeed);
  if (keysPressed['d']) frameX = Math.min(canvas.width - frame.width, frameX + frameSpeed);

  // Draw the frame
  ctx.drawImage(frame, frameX, frameY);

  // Flash effect when capturing
  if (flash && Date.now() < flashTimeout) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let camera = new Audio('camera-shutter-199580.mp3');
    camera.play();
  } else {
    flash = false;
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Function to handle space key for capturing
document.addEventListener('keydown', (event) => {
  if (event.key === ' ' && tries > 0) {
    captureImage();
  }
});

let imgurImageUrl = null;

export function setImgurImageUrl(url) {
  imgurImageUrl = url;
}

function captureImage() {
  // Capture the current view
  const frameWidth = canvas.width / 3;
  const frameHeight = canvas.height / 3;
  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = frameWidth;
  frameCanvas.height = frameHeight;
  const frameCtx = frameCanvas.getContext('2d');
  frameCtx.drawImage(canvas, frameX, frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
  
  let capybarasInFrame = 0;
  images.forEach((image) => {
    if (image.x + image.image.width > frameX && image.x < frameX + frameWidth &&
        image.y + image.image.height > frameY && image.y < frameY + frameHeight) {
      capybarasInFrame++;
      // Stop the capybara from moving
      image.vx = 0;
      image.vy = 0;
      // Set a fade-out timer
      image.fadeOut = Date.now();
    }
  });

  frameCanvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('image', blob);

    const apiKey = '52a191d08556a82';
    const apiEndpoint = 'https://api.imgur.com/3/image';

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
      },
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      const imageUrl = data.data.link;
      console.log(`Image uploaded to Imgur: ${imageUrl}`);
      setImgurImageUrl(imageUrl);
    })
    .catch((error) => {
      console.error('Error uploading image to Imgur:', error);
    });
  });

  // Update high score
  const highScore = localStorage.getItem('highScore');
  if (highScore === null || capybarasInFrame > highScore) {
    console.log(capybarasInFrame);
    localStorage.setItem('highScore', capybarasInFrame);
  }
  
  // Redraw the frame
  ctx.drawImage(frame, frameX, frameY, frame.width, frame.height);

  tries--;
  console.log(`Tries remaining: ${tries}`);
  flash = true;
  flashTimeout = Date.now() + 200;
}
