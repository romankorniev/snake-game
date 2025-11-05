let scoreBlock;
let score = 0;
let gameStatus = 'paused'; 
let gameLoopRef; 
let overlay;
let startButton;
let overlayMessage;

const config = {
    step: 0,
    maxStep: 8, 
    sizeCell: 16,
    sizeBerry: 16 / 4 
}

let snake = {
    x: 208, 
    y: 208,
    dx: config.sizeCell, 
    dy: 0,
    tails: [],
    maxTails: 3
}

let berry = {
    x: 0,
    y: 0
} 

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");

function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min) + min );
}

function drawScore() {
    if (scoreBlock) {
        scoreBlock.innerHTML = score;
    }
}

function incScore() {
    score++;
    drawScore();
}

function randomPositionBerry() {
    berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
    berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034";
    context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI );
    context.fill();
}

function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if ( snake.x >= canvas.width ) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if ( snake.y >= canvas.height ) {
        snake.y = 0;
    }
}

function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 208; 
    snake.y = 208;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

function gameOver() {
    gameStatus = 'gameover';
    
    document.querySelector('#overlayTitle').textContent = 'Гру Завершено!';
    
    overlayMessage.innerHTML = `Ваш фінальний рахунок: ${score}`;

    startButton.textContent = 'Почати знову';
    overlay.style.display = 'flex'; 
}


function drawSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();
    
    snake.tails.unshift( { x: snake.x, y: snake.y } );

    if ( snake.tails.length > snake.maxTails ) {
        snake.tails.pop();
    }

    snake.tails.forEach( function(el, index){
        if (index == 0) {
            context.fillStyle = "#FA0556";
        } else {
            context.fillStyle = "#A00034";
        }
        context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

        if ( el.x === berry.x && el.y === berry.y ) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }

        if (index === 0) {
             for( let i = 1; i < snake.tails.length; i++ ) {
                if ( el.x === snake.tails[i].x && el.y === snake.tails[i].y ) {
                    gameOver(); 
                }
            }
        }
    } );
}


function gameLoop() {
    gameLoopRef = requestAnimationFrame( gameLoop );
    
    if (gameStatus !== 'running') {
        return;
    }
    
    if ( ++config.step < config.maxStep) {
        return;
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBerry();
    drawSnake();
}


function startGame() {
    if (gameStatus === 'running') return;
    
    refreshGame(); 
    
    gameStatus = 'running';
    overlay.style.display = 'none'; 
    
    overlayMessage.textContent = '';
}


document.addEventListener("keydown", function (e) {
    if (gameStatus !== 'running') {
        const movementKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        if (movementKeys.includes(e.code)) {
            startGame();
            if (gameStatus === 'running') {
                handleMovement(e.code);
            }
        }
        return;
    }
    handleMovement(e.code);
});


function handleMovement(keyCode) {
    if ((keyCode == "KeyW" || keyCode == "ArrowUp") && snake.dy === 0) {
        snake.dy = -config.sizeCell;
        snake.dx = 0;
        
    } else if ((keyCode == "KeyA" || keyCode == "ArrowLeft") && snake.dx === 0) {
        snake.dx = -config.sizeCell;
        snake.dy = 0;

    } else if ((keyCode == "KeyS" || keyCode == "ArrowDown") && snake.dy === 0) {
        snake.dy = config.sizeCell;
        snake.dx = 0;

    } else if ((keyCode == "KeyD" || keyCode == "ArrowRight") && snake.dx === 0) {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
}

function init() {
    scoreBlock = document.querySelector(".game-score .score-count");
    overlay = document.querySelector(".game-overlay");
    startButton = document.querySelector("#startButton");
    

    overlayMessage = document.querySelector(".game-overlay p"); 

    startButton.addEventListener('click', startGame);
    
    drawScore();
    randomPositionBerry();
    
    gameLoopRef = requestAnimationFrame( gameLoop );
    
    document.querySelector('#overlayTitle').textContent = 'Змійка'
}

init();