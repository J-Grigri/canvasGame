//setting up game Canvas
let canvas;
let ctx;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

let bgReady, heroReady, bananaReady, farmer1Ready, gameOverImageReady;
let bgImage, heroImage, bananaImage, farmer1Image, gameOverImage;

let gameOver=false;
let nameEntered=false;

//user input and output on the screen
let playerInput = document.getElementById("nameInput"); //grabs the user input
let playerOutput = document.getElementById("nameOutput"); //specifies the output location

function startBtn(){
  let name = playerInput.value;
    if (playerInput.value == 0){
    alert("Set a nickname to start playing!")
    } else {
    playerOutput.innerHTML = name;
    timeCountdown = true;
    nameEntered=true;
    elapsedTime=0;
    gameOver=false;
    startTime=Date.now(0);
    gameOverImageReady=false;
    }

};
function resetBtn(){
    timeCountdown = true;
    nameEntered = true;
    elapsedTime = 0;
    gameOver = false;
    startTime = Date.now(0);
    gameOverImageReady = false;
    score = 0;
}

// show the background image
bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/field.jpg";

//setting the time
let timeRemain = document.getElementById("remainingTime");
let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

//Points
let points = document.getElementById("points");//specify the output locations for points
let score = 0;


function loadImages() {

  // show the hero image
  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/monkey.png";
  // show the banana image
  bananaImage = new Image();
  bananaImage.onload = function () {
    bananaReady = true;
  };
  bananaImage.src = "images/banana2.png";
  // show the farmer image
  farmer1Image = new Image();
  farmer1Image.onload = function () {
    farmer1Ready = true;
  };
  farmer1Image.src = "images/farmer.png";

  gameOverImage = new Image();
  gameOverImage.onload = function () {
    gameOverImageReady = false;
  };
  gameOverImage.src = "images/gameOver.png";
}

// Setting up our characters.

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let bananaX = 100;
let bananaY = 100;
let farmer1X = 50;
let farmer1Y = 50;
let farmerCase = 1;

let firstFarmerSpeedX = 3;
let firstFarmerSpeedY = 3;

// This is just to let JavaScript know when the user has pressed a key

let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);
  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}
//when time runs out
function youLose(){
  gameOver=true;
  gameOverImageReady=true;
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the banana has been caught!
 */

let update = function () {
  if(gameOver){
    return;
  }
  if (`${SECONDS_PER_ROUND - elapsedTime}` <= 0) {
    youLose()
  }
  if(nameEntered){
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    if (38 in keysDown) { // Player is holding up key
      heroY -= 5;
    }
    if (40 in keysDown) { // Player is holding down key
      heroY += 5;
    }
    if (37 in keysDown) { // Player is holding left key
      heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
      heroX += 5;
    }
    if (heroX >= canvas.width - 32) {
      heroX = 0;
    }
    if (heroX < 0) {
      heroX = canvas.width - 32;
    }
    if (heroY >= canvas.height - 32) {
      heroY = 0;
    }
    if (heroY < 0) {
      heroY = canvas.height - 32;
    }

    farmer1X = farmer1X + firstFarmerSpeedX;
    farmer1Y = farmer1X + firstFarmerSpeedY;

    if (farmer1X > canvas.width - 32) {
      firstFarmerSpeedX = - firstFarmerSpeedX;
    } else if (farmer1Y > canvas.height - 32) {
      firstFarmerSpeedY = -firstFarmerSpeedY;
    } else if (farmer1X < 1) {
      firstFarmerSpeedX = -firstFarmerSpeedX;
    } else if (farmer1Y < 0) {
      firstFarmerSpeedY = -firstFarmerSpeedY;
    }

    if (farmerCase == 1) {
      farmer1X += 1
      farmer1Y += 1
    } else if (farmerCase == 2) {
      farmer1X -= 1
      farmer1Y += 1
    } else if (farmerCase == 3) {
      farmer1X -= 1
      farmer1Y -= 1
    } else if (farmerCase == 4) {
      farmer1X -= 1
      farmer1Y -= 1
    }

    //calculate and display the remaining time into html

    // Check if player and banana collided
    if (
      heroX <= (bananaX + 32)
      && bananaX <= (heroX + 32)
      && heroY <= (bananaY + 32)
      && bananaY <= (heroY + 32)
    ) {
      score += +1;
      points.innerHTML = `${score}`

      // Pick a new random location for the banana (min, max) values set
      bananaX = getMyRandom(0, 480)
      bananaY = getMyRandom(0, 448)
    }
    if (
      heroX <= (farmer1X + 32)
      && farmer1X <= (heroX + 32)
      && heroY <= (farmer1Y + 32)
      && farmer1Y <= (heroY + 32)
    ) {
      score -= +1;
      points.innerHTML = `${score}`

  }
}
};

function getMyRandom(min, max) {
  return Math.random() * (max - min) + min;
}

//  This function, render, runs as often as possible (60fps)
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (bananaReady) {
    ctx.drawImage(bananaImage, bananaX, bananaY);
  }
  if (farmer1Ready) {
    ctx.drawImage(farmer1Image, farmer1X, farmer1Y);
  }
  timeRemain.innerHTML =`${SECONDS_PER_ROUND - elapsedTime}`;

  if (gameOverImageReady){
    ctx.drawImage(gameOverImage, 120 , 140 , 300, 200)
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and banana)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame (mostly for old browsers)
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

loadImages()
setupKeyboardListeners();
main();