// Add a log statement to verify JavaScript execution
console.log('JavaScript code is running');

// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const captureButton = document.getElementById('capture-button');

// DO DO DO OD DOO DO
let bgMusic = new Audio('MySong.m4a')
bgMusic.loop = true;
bgMusic.play()

// Set the canvas dimensions to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the background image
const background = new Image();
background.src = 'Sprites/Background.png';

// Load the frame image
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

function getRandomItem(arr) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
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

// Define the number of capybaras
const numCapybaras = 30;

// Define the image objects
const images = [];

let tries = 3;
let flash = false;
let flashTimeout = 0;

let gameRunning = false;

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
      vx = Math.random() * 8 - 4;
      vy = Math.random() * 8 - 4;
    } while (Math.abs(vx) < 2 || Math.abs(vy) < 2); // Ensure vx and vy are not 0

    images.push({ x, y, vx, vy, image });
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

    // Draw the image with flipping effect
    if (image.vx < 0) {
      ctx.save();
      ctx.translate(image.x + image.image.width, image.y);
      ctx.scale(-1, 1);
      ctx.drawImage(image.image, 0, 0);
      ctx.restore();
    } else {
      ctx.drawImage(image.image, image.x, image.y);
    }
  });

  // Flash white if an image has been captured
  if (flash && Date.now() < flashTimeout) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    flash = false;
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    if (tries > 0) {
      // Clear the frame from the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
      // Update and draw each image
      images.forEach((image) => {
        // Draw the image with flipping effect
        if (image.vx < 0) {
          ctx.save();
          ctx.translate(image.x + image.image.width, image.y);
          ctx.scale(-1, 1);
          ctx.drawImage(image.image, 0, 0);
          ctx.restore();
        } else {
          ctx.drawImage(image.image, image.x, image.y);
        }
      });

      const frameWidth = canvas.width / 3;
      const frameHeight = canvas.height / 3;
      const frameX = (canvas.width - frameWidth) / 2;
      const frameY = (canvas.height - frameHeight) / 2;

      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = frameWidth;
      frameCanvas.height = frameHeight;
      const frameCtx = frameCanvas.getContext('2d');
      frameCtx.drawImage(canvas, frameX, frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
      
      let capybarasInFrame = 0;
      images.forEach((image) => {
        if (image.x + image.image.width > frameX && image.x < frameX + frameWidth && image.y + image.image.height > frameY && image.y < frameY + frameHeight) {
          capybarasInFrame++;
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
          // Do something with the image URL...
        })
        .catch((error) => {
          console.error('Error uploading image to Imgur:', error);
        });
      });

      // Save the high score
      const highScore = localStorage.getItem('highScore');
      if (highScore === null || capybarasInFrame > highScore) {
        console.log(capybarasInFrame);
        localStorage.setItem('highScore', capybarasInFrame);
      }

      // Redraw the frame
      ctx.drawImage(frame, 0, 0, frame.width, frame.height, frameX, frameY, frameWidth, frameHeight);

      tries--;
      console.log(`Tries remaining: ${tries}`);
      flash = true;
      flashTimeout = Date.now() + 200;
    } else {
      console.log('No tries remaining. Application ending.');
      // End the application
      window.open('', '_self').close();
    }
  }
});
