let scoreBlock;
let score = 0;

const config = {
    step: 0,
    maxStep: 6, // Це задає швидкість гри (60 кадрів / 6 кроків = 10 кроків на секунду)
    sizeCell: 16,
    sizeBerry: 16 / 4 // Радіус ягоди
}

let snake = {
    x: 160,
    y: 160,
    dx: config.sizeCell, // Початковий рух вправо
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

// Функція для рандомного цілого числа
function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min) + min );
}

// --------------------- Функції гри ---------------------

function drawScore() {
    // Перевірка, чи scoreBlock вже визначено, щоб уникнути помилок
    if (scoreBlock) {
        scoreBlock.innerHTML = score;
    }
}

function incScore() {
    score++;
    drawScore();
}

function randomPositionBerry() {
    // Генеруємо координати, кратні розміру клітинки (sizeCell)
    berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
    berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034";
    // Центруємо ягоду всередині клітинки
    context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI );
    context.fill();
}

function collisionBorder() {
    // Змійка виходить за лівий край
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    // Змійка виходить за правий край
    } else if ( snake.x >= canvas.width ) {
        snake.x = 0;
    }

    // Змійка виходить за верхній край
    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    // Змійка виходить за нижній край
    } else if ( snake.y >= canvas.height ) {
        snake.y = 0;
    }
}

function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}


function drawSnake() {
    // 1. Рух змійки
    snake.x += snake.dx;
    snake.y += snake.dy;

    // 2. Обробка зіткнення з межами поля (проходження на іншу сторону)
    collisionBorder();
    
    // 3. Додаємо поточну позицію голови змійки в початок масиву хвостів
    snake.tails.unshift( { x: snake.x, y: snake.y } );

    // 4. Якщо довжина хвоста перевищує максимальну, видаляємо останній елемент
    if ( snake.tails.length > snake.maxTails ) {
        snake.tails.pop();
    }

    // 5. Малюємо змійку і перевіряємо зіткнення
    snake.tails.forEach( function(el, index){
        // Голова
        if (index == 0) {
            context.fillStyle = "#FA0556";
        } 
        // Хвіст
        else {
            context.fillStyle = "#A00034";
        }
        context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

        // Перевірка зіткнення з ягодою
        if ( el.x === berry.x && el.y === berry.y ) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }

        // Перевірка зіткнення голови з хвостом
        // Перевіряємо тільки, якщо el - це голова (index == 0), і порівнюємо з іншими частинами хвоста
        if (index === 0) {
             for( let i = 1; i < snake.tails.length; i++ ) {
                if ( el.x === snake.tails[i].x && el.y === snake.tails[i].y ) {
                    refreshGame();
                }
            }
        }
    } );
}

function gameLoop() {
    // Запускаємо наступний кадр
    requestAnimationFrame( gameLoop );
    
    // Обмеження частоти кадрів (рух відбувається кожні config.maxStep кадрів)
    if ( ++config.step < config.maxStep) {
        return;
    }
    config.step = 0;

    // Очищаємо полотно перед малюванням
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBerry();
    drawSnake();
}

// --------------------- Обробник натискання клавіш ---------------------

document.addEventListener("keydown", function (e) {
    // Запобігаємо зворотному руху (наприклад, з W на S)
    if (e.code == "KeyW" && snake.dy === 0) {
        snake.dy = -config.sizeCell;
        snake.dx = 0;
    } else if (e.code == "KeyA" && snake.dx === 0) {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if (e.code == "KeyS" && snake.dy === 0) {
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if (e.code == "KeyD" && snake.dx === 0) {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
});

// --------------------- Ініціалізація ---------------------

function init() {
    scoreBlock = document.querySelector(".game-score .score-count");
    drawScore(); // Малюємо початковий рахунок (0)
    randomPositionBerry(); // Створюємо першу ягоду
    requestAnimationFrame( gameLoop ); // Запускаємо головний цикл гри
}

init();