
// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;

let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// pipes
let pipeArray = [];

let pipeWidth = 64;
let pipeHeight = 320;

let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game settings
let velocityX = -7;
let velocityY = 0;
let gravity = 0.4;

let gameOver = true;
let score = 0;

let level = 1;
let openingSpace = 220;

// pipe timer
let pipeInterval = 1000;
let pipeTimer;


window.onload = function () {

    board = document.getElementById("board");

    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // bird image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    birdImg.onload = function () {
        context.drawImage(
            birdImg,
            bird.x,
            bird.y,
            bird.width,
            bird.height
        );
    };

    // pipe images
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // game loop
    requestAnimationFrame(update);

    // keyboard
    document.addEventListener("keydown", moveBird);
};


function update() {

    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY += gravity;

    bird.y = Math.max(
        bird.y + velocityY,
        0
    );

    context.drawImage(
        birdImg,
        bird.x,
        bird.y,
        bird.width,
        bird.height
    );

    // bird falls off screen
    if (bird.y > board.height) {
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {

        let pipe = pipeArray[i];

        pipe.x += velocityX;

        context.drawImage(
            pipe.img,
            pipe.x,
            pipe.y,
            pipe.width,
            pipe.height
        );

        // score
        if (
            !pipe.passed &&
            bird.x > pipe.x + pipe.width
        ) {
            score += 0.5;
            pipe.passed = true;
        }

        // collision
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // remove old pipes
    while (
        pipeArray.length > 0 &&
        pipeArray[0].x < -pipeWidth
    ) {
        pipeArray.shift();
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // game over
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}


function placePipes() {

    if (gameOver) {
        return;
    }

    let randomPipeY =
        pipeY -
        pipeHeight / 4 -
        Math.random() * (pipeHeight / 2);

    // top pipe
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);

    // bottom pipe
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height:
            boardHeight -
            (randomPipeY + pipeHeight + openingSpace),
        passed: false
    };

    pipeArray.push(bottomPipe);
}


function moveBird(e) {

    if (
        e.code == "Space" ||
        e.code == "ArrowUp" ||
        e.code == "KeyX"
    ) {

        velocityY = -6;

        // restart game
        if (gameOver) {

            bird.y = birdY;

            pipeArray = [];

            score = 0;

            gameOver = false;

            // restart pipe timer
            clearInterval(pipeTimer);

            pipeTimer = setInterval(
                placePipes,
                pipeInterval
            );
        }
    }
}


function detectCollision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


function startLevel(selectedLevel) {

    level = selectedLevel;

    if (level == 1) {

        velocityX = -3;
        openingSpace = 220;
        pipeInterval = 1000;

    } else if (level == 2) {

        velocityX = -5;
        openingSpace = 170;
        pipeInterval = 800;

    } else if (level == 3) {

        velocityX = -7;
        openingSpace = 140;
        pipeInterval = 700;

    } else if (level == 4) {

        velocityX = -8;
        openingSpace = 120;
        pipeInterval = 400;
    }

    // reset game
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityY = 0;
    gameOver = false;

    // restart pipe timer using the selected level
    clearInterval(pipeTimer);

    pipeTimer = setInterval(
        placePipes,
        pipeInterval
    );
}

