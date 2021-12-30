// console.log('hello')//check to see if your script is working in console log on devtools
//variables
//this const gets canvas element
const canvas = document.getElementById('game');
//this const gets the context of the canvas and ables you to draw 2d
const ctx = canvas.getContext('2d');

//track the length of the snake
class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//speed
let speed = 7;
//tile count variable by 20/20 or x/y
let tileCount = 20;
//to keep the drawings smaller than the size of the canvas w/o manually defining
let tileSize = canvas.width / tileCount - 2;
//snake 
let headX = 10;
let headY = 10;
//snake parts array
const snakeParts = [];
let tailLength = 2;
//snake movement

let xVelocity = 0;
let yVelocity = 0;

//apple variables
let appleX = 5;
let appleY = 5;

//score
let score = 0;

//audio
let eatSound = new Audio("gulp.mp3")

//create game loops 

function drawGame() {
    // console.log('draw game');
    //snake position must be first, because if you touch yourself or hit a wall none of the other functions can start.
    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    //add functions for game here
    clearScreen();



    checkAppleCollision();
    drawApple();
    drawSnake();

    drawScore();
    //change the difficulty of the game by changing the speed based on the level
    if(score > 2){
        speed = 11;
    }
    if(score > 5){
        speed = 15;
    }

    //use miliseconds 1000ms=1sec//
    setTimeout(drawGame, 1000 / speed)
    //setTimeout(drawGame, 1000) //slower speed
}

///===========FUNCTIONS========////

//---------score-------///

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score" + score, canvas.width - 50, 10)
}

//-----game over---//
function isGameOver() {
    let gameOver = false;
    //velocity check to see if the game has started
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    //walls
    if (headX < 0) {
        gameOver = true;
    }
    else if (headX === tileCount) {
        gameOver = true;
    }
    else if (headY < 0) {
        gameOver = true;
    }
    else if (headY === tileCount) {
        gameOver = true;
    }

    //for loop for keeping snake from intersecting itself
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break; // to stop looping and break out of the forloop
        }
    }


    //create text to let player know game is over
    if (gameOver) {

        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // Fill with gradient
        ctx.fillStyle = gradient;

        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);


return gameOver;
}

//-------------Snake Functions-------------//


//define draw snake function
function drawSnake() {

    //body of snake
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }
    //this will create a new box where the head WAS but now moves it down to make the snake seem like its growing
    snakeParts.push(new SnakePart(headX, headY));
    //while snake is greater than tail length then remove that snake item
    while (snakeParts.length > tailLength) {
        snakeParts.shift(); //remove furthest item
    }

    //take context, sets a fill style, set color for it, represent snake shape
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

//create a function to clear the screen
function clearScreen() {
    //use ctx to draw to screen
    ctx.fillStyle = 'black';
    //location is 0,0/gives canvas properties//
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}


//function to move the snake head left or right
function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

//add and event listener for keyboard movements
document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //up
    if (event.keyCode == 38) {
        //to prevent crashing into itself
        if (yVelocity == 1)
            return;
        yVelocity = -1; //to move 1 tile at a time
        xVelocity = 0;
    }
    //down
    if (event.keyCode == 40) {
        //to prevent crashing into itself
        if (yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    //left
    if (event.keyCode == 37) {
        //to prevent crashing into itself
        if (xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }
    //right
    if (event.keyCode == 39) {
        //to prevent crashing into itself
        if (xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;

    }
}

//-------------Apple Functions-----------///
function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function checkAppleCollision() {
    //if apple x/y = snakes x/y position, create new random apple position  with Math in new spot
    if (appleX === headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        //check tail length to increase if snake eats apple
        tailLength++;
        //score for apple 
        score++;
        //add sound
        eatSound.play();
    }
}


//call drawGame to get game going
drawGame();

//requrestAnimationFrame
//setInterval xtimes per a second
//setTimeOut -- 