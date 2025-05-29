let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
};

//physics
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -8; // starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;
let gameStarted = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //board drawinfg

    //load image
    doodlerRightImg = new Image();
    doodlerRightImg.src = "https://github.com/ImKennyYip/doodle-jump/blob/master/doodler-right.png?raw=true";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function () {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "https://github.com/ImKennyYip/doodle-jump/blob/master/doodler-left.png?raw=true";

    platformImg = new Image();
    platformImg.src = "https://github.com/ImKennyYip/doodle-jump/blob/master/platform.png?raw=true";

    document.getElementById("start-button").addEventListener("click", startGame); // Add start button click listener
    document.addEventListener("keydown", moveDoodler);
};

function startGame() {
    if (gameStarted) return; //avoid restarting the game if already running
    gameStarted = true;

    //hide start button started
    document.getElementById("start-button").style.display = "none";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    //clear platforms & add new
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from array
        newPlatform(); //replace w new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px courier";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.font = "courier";
        context.fillStyle = "black";
        context.fillText("GAME OVER: Press 'space' to restart!", boardWidth / 50, boardHeight * 7 / 8);
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();

        //show start button again after game over
        document.getElementById("start-button").style.display = "inline-block";
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); //(0-1) * boardWidth*3/4
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); //(0-1) * boardWidth*3/4
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's
           a.x + a.width > b.x &&   //a's top right corner passes b's
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's
           a.y + a.height > b.y;    //a's bottom left corner passes b's
}

function updateScore() {
    let points = Math.floor(50 * Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}
