const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const loginPage = document.getElementById("loginPage");
const gamePage = document.getElementById("gamePage");

const startButton = document.getElementById("startButton");
const exitButton = document.getElementById("exitButton");
const menuButton = document.getElementById("menuButton");

const restartButton = document.getElementById("restartButton");
const backButton = document.getElementById("backButton");

const gameOverBox = document.getElementById("gameOver");

const scoreText = document.getElementById("scoreText");
const speedText = document.getElementById("speedText");

const finalScore = document.getElementById("finalScore");
const finalSpeed = document.getElementById("finalSpeed");

const playerName = document.getElementById("playerName");


/* ================= KONFIGURASI ================= */

const GRID = 24;

let WIDTH;
let HEIGHT;

let snake = [];
let food = null;

let direction = {
    x: GRID,
    y: 0
};

let nextDirection = {
    x: GRID,
    y: 0
};

let score = 0;
let speed = 5;

let gameOver = false;
let gameRunning = false;

let moveTimer = 0;
let lastTime = 0;


/* ================= WARNA ================= */

const COLORS = {
    white: "#ffffff",
    black: "#413c46",

    pink: "#f591b4",
    darkPink: "#d74b7d",

    green: "#69be6e",
    darkGreen: "#419150",

    blue: "#69b9eb",
    purple: "#af7ddc",

    sky: "#96dcf8",

    grass: "#afe17d",
    grassLight: "#c3eb91",

    yellow: "#ffd255",
    orange: "#fa9b41",
    red: "#eb4b5a",
    brown: "#7d5537"
};


/* ================= SNAKE COLORS ================= */

const snakeColors = [
    {
        head: "#46a0e1",
        body: "#69bef0",
        light: "#9bd7fa"
    },

    {
        head: "#4bb464",
        body: "#73d27d",
        light: "#a5ebaA"
    },

    {
        head: "#a064d7",
        body: "#be87eb",
        light: "#d7aff5"
    },

    {
        head: "#f09637",
        body: "#fab455",
        light: "#ffd77d"
    },

    {
        head: "#e14664",
        body: "#f06e82",
        light: "#faa0af"
    }
];

let colorIndex = 0;


/* ================= RESIZE ================= */

function resizeCanvas() {

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* ================= BACKGROUND GAME ================= */

function drawGameBackground() {

    ctx.fillStyle = COLORS.sky;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /* matahari */

    ctx.fillStyle = COLORS.yellow;

    ctx.beginPath();

    ctx.arc(
        WIDTH - 100,
        90,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* awan */

    drawCloud(
        40,
        100,
        1
    );

    drawCloud(
        WIDTH / 2 - 100,
        65,
        0.6
    );

    drawCloud(
        WIDTH - 400,
        120,
        0.7
    );


    /* pelangi */

    drawRainbow(
        WIDTH / 2,
        390,
        220
    );


    /* gunung */

    drawMountain(
        WIDTH / 2 - 230,
        430,
        500,
        250,
        "#4baacb"
    );

    drawMountain(
        WIDTH / 2 + 230,
        430,
        500,
        250,
        "#419bbd"
    );


    /* bukit */

    ctx.fillStyle = "#78c36e";

    ctx.beginPath();

    ctx.ellipse(
        -100,
        430,
        WIDTH / 2 + 150,
        100,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "#69b969";

    ctx.beginPath();

    ctx.ellipse(
        WIDTH,
        430,
        WIDTH / 2 + 150,
        100,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* rumput */

    const fieldTop = Math.min(
        495,
        HEIGHT * 0.65
    );

    ctx.fillStyle = COLORS.grass;

    ctx.fillRect(
        0,
        fieldTop,
        WIDTH,
        HEIGHT - fieldTop
    );


    /* pola rumput */

    const tile = 80;

    ctx.fillStyle = COLORS.grassLight;

    for (
        let y = fieldTop, row = 0;
        y < HEIGHT;
        y += tile, row++
    ) {

        for (
            let x = 0, col = 0;
            x < WIDTH;
            x += tile, col++
        ) {

            if ((row + col) % 2 === 0) {

                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }
    }


    /* bunga */

    drawFlower(
        80,
        HEIGHT - 80,
        18,
        COLORS.pink
    );

    drawFlower(
        220,
        HEIGHT - 55,
        14,
        COLORS.purple
    );

    drawFlower(
        WIDTH - 80,
        HEIGHT - 80,
        18,
        COLORS.pink
    );

    drawFlower(
        WIDTH - 220,
        HEIGHT - 55,
        14,
        COLORS.purple
    );
}


/* ================= AWAN ================= */

function drawCloud(x, y, scale) {

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.ellipse(
        x + 50 * scale,
        y + 25 * scale,
        70 * scale,
        25 * scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x + 55 * scale,
        y,
        35 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x + 105 * scale,
        y + 10 * scale,
        30 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* ================= PELANGI ================= */

function drawRainbow(x, y, radius) {

    const colors = [
        "#f064a0",
        "#ffa05a",
        "#ffd750",
        "#69c37d",
        "#50afe1",
        "#966ed7"
    ];

    for (
        let i = 0;
        i < colors.length;
        i++
    ) {

        ctx.strokeStyle = colors[i];

        ctx.lineWidth = 13;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius - i * 13,
            Math.PI,
            Math.PI * 2
        );

        ctx.stroke();
    }
}


/* ================= GUNUNG ================= */

function drawMountain(
    x,
    baseY,
    width,
    height,
    color
) {

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.moveTo(
        x - width / 2,
        baseY
    );

    ctx.lineTo(
        x,
        baseY - height
    );

    ctx.lineTo(
        x + width / 2,
        baseY
    );

    ctx.closePath();

    ctx.fill();


    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.moveTo(
        x,
        baseY - height
    );

    ctx.lineTo(
        x - 50,
        baseY - height / 2
    );

    ctx.lineTo(
        x + 45,
        baseY - height / 2
    );

    ctx.closePath();

    ctx.fill();
}


/* ================= BUNGA ================= */

function drawFlower(
    x,
    y,
    radius,
    color
) {

    ctx.fillStyle = color;

    const positions = [
        [0, -radius],
        [-radius, 0],
        [radius, 0],
        [0, radius]
    ];

    positions.forEach(
        ([dx, dy]) => {

            ctx.beginPath();

            ctx.arc(
                x + dx,
                y + dy,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    );


    ctx.fillStyle = COLORS.yellow;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* ================= MAKANAN ================= */

function createFood() {

    let newFood;

    let valid = false;

    let attempts = 0;

    while (!valid && attempts < 300) {

        const maxX =
            Math.floor(WIDTH / GRID) - 2;

        const minY =
            Math.floor(
                Math.min(525, HEIGHT * 0.65) / GRID
            );

        const maxY =
            Math.floor(
                (HEIGHT - 170) / GRID
            );

        const x =
            Math.floor(
                Math.random() *
                (maxX - 2)
            ) + 2;

        const y =
            Math.floor(
                Math.random() *
                Math.max(1, maxY - minY)
            ) + minY;

        newFood = {
            x: x * GRID,
            y: y * GRID
        };


        valid = true;


        for (const part of snake) {

            if (
                newFood.x === part.x &&
                newFood.y === part.y
            ) {

                valid = false;

                break;
            }
        }


        attempts++;
    }


    if (valid) {

        food = newFood;

    } else {

        /* posisi cadangan */

        food = {
            x: GRID * 3,
            y: GRID * 23
        };
    }
}


/* ================= GAMBAR MAKANAN ================= */

function drawFood() {

    if (!food) {
        return;
    }

    const x = food.x + GRID / 2;
    const y = food.y + GRID / 2;


    /* apel */

    ctx.fillStyle = COLORS.red;

    ctx.beginPath();

    ctx.arc(
        x,
        y + 2,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* kilau */

    ctx.fillStyle = "#ff7885";

    ctx.beginPath();

    ctx.arc(
        x - 3,
        y - 2,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* batang */

    ctx.strokeStyle = COLORS.brown;

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 7
    );

    ctx.lineTo(
        x + 2,
        y - 14
    );

    ctx.stroke();


    /* daun */

    ctx.fillStyle = COLORS.green;

    ctx.beginPath();

    ctx.ellipse(
        x + 5,
        y - 13,
        6,
        3,
        0.2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* ================= RESET GAME ================= */

function resetGame() {

    const startY =
        Math.floor(
            (HEIGHT / 2 + 70) / GRID
        ) * GRID;


    snake = [

        {
            x: Math.floor(WIDTH / 2 / GRID) * GRID,
            y: startY
        },

        {
            x:
                Math.floor(WIDTH / 2 / GRID) * GRID
                - GRID,

            y: startY
        },

        {
            x:
                Math.floor(WIDTH / 2 / GRID) * GRID
                - GRID * 2,

            y: startY
        }
    ];


    direction = {
        x: GRID,
        y: 0
    };


    nextDirection = {
        x: GRID,
        y: 0
    };


    score = 0;

    speed = 5;

    colorIndex = 0;

    moveTimer = 0;

    gameOver = false;


    createFood();

    updateInfo();
}


/* ================= UPDATE SCORE ================= */

function updateInfo() {

    scoreText.textContent =
        score;

    speedText.textContent =
        speed.toFixed(1);

    finalScore.textContent =
        score;

    finalSpeed.textContent =
        speed.toFixed(1);
}


/* ================= ARAH ================= */

function changeDirection(x, y) {

    if (
        x === -direction.x &&
        y === -direction.y
    ) {
        return;
    }


    nextDirection = {
        x: x,
        y: y
    };
}


/* ================= GERAK ULAR ================= */

function updateGame(deltaTime) {

    if (
        !gameRunning ||
        gameOver
    ) {
        return;
    }


    const moveInterval =
        Math.max(
            70,
            1000 / speed
        );


    moveTimer += deltaTime;


    if (
        moveTimer < moveInterval
    ) {
        return;
    }


    moveTimer = 0;


    direction = {
        x: nextDirection.x,
        y: nextDirection.y
    };


    const head = snake[0];


    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };


    /* tabrak dinding */

    if (
        newHead.x < 0 ||
        newHead.x + GRID > WIDTH ||
        newHead.y < 0 ||
        newHead.y + GRID > HEIGHT
    ) {

        endGame();

        return;
    }


    /* tabrak badan */

    for (
        let i = 1;
        i < snake.length;
        i++
    ) {

        if (
            newHead.x === snake[i].x &&
            newHead.y === snake[i].y
        ) {

            endGame();

            return;
        }
    }


    snake.unshift(newHead);


    /* makanan */

    if (
        food &&
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        score++;


        /* kecepatan naik */

        speed = Math.min(
            10,
            5 + score * 0.3
        );


        colorIndex =
            (colorIndex + 1)
            % snakeColors.length;


        createFood();


        updateInfo();

    } else {

        snake.pop();
    }
}


/* ================= GAMBAR ULAR ================= */

function drawSnake() {

    const colors =
        snakeColors[colorIndex];


    snake.forEach(
        (part, index) => {

            let color;


            if (index === 0) {

                color =
                    colors.head;

            } else if (
                index % 2 === 0
            ) {

                color =
                    colors.body;

            } else {

                color =
                    colors.light;
            }


            ctx.fillStyle = color;

            ctx.beginPath();

            ctx.arc(
                part.x + GRID / 2,
                part.y + GRID / 2,
                GRID / 2 + 3,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.strokeStyle = "white";

            ctx.lineWidth = 2;

            ctx.stroke();
        }
    );


    drawEyes();
}


/* ================= MATA ULAR ================= */

function drawEyes() {

    if (!snake.length) {
        return;
    }


    const head = snake[0];

    let eyes;


    if (direction.x > 0) {

        eyes = [
            {
                x: head.x + GRID - 6,
                y: head.y + 6
            },

            {
                x: head.x + GRID - 6,
                y: head.y + GRID - 6
            }
        ];

    } else if (direction.x < 0) {

        eyes = [
            {
                x: head.x + 6,
                y: head.y + 6
            },

            {
                x: head.x + 6,
                y: head.y + GRID - 6
            }
        ];

    } else if (direction.y < 0) {

        eyes = [
            {
                x: head.x + 6,
                y: head.y + 6
            },

            {
                x: head.x + GRID - 6,
                y: head.y + 6
            }
        ];

    } else {

        eyes = [
            {
                x: head.x + 6,
                y: head.y + GRID - 6
            },

            {
                x: head.x + GRID - 6,
                y: head.y + GRID - 6
            }
        ];
    }


    eyes.forEach(
        eye => {

            ctx.fillStyle =
                "white";

            ctx.beginPath();

            ctx.arc(
                eye.x,
                eye.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                COLORS.black;

            ctx.beginPath();

            ctx.arc(
                eye.x,
                eye.y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    );
}


/* ================= GAMBAR GAME ================= */

function drawGame() {

    drawGameBackground();

    drawFood();

    drawSnake();
}


/* ================= GAME LOOP ================= */

function gameLoop(timestamp) {

    if (!lastTime) {
        lastTime = timestamp;
    }


    let deltaTime =
        timestamp - lastTime;


    lastTime = timestamp;


    /*
       Jika HP lag atau tab berpindah,
       waktu tidak dibuat terlalu besar.
    */

    deltaTime =
        Math.min(deltaTime, 100);


    updateGame(deltaTime);

    drawGame();


    requestAnimationFrame(
        gameLoop
    );
}


/* ================= GAME OVER ================= */

function endGame() {

    gameOver = true;

    gameRunning = false;

    updateInfo();

    gameOverBox.classList.remove(
        "hidden"
    );
}


/* ================= MULAI GAME ================= */

function startGame() {

    loginPage.classList.add(
        "hidden"
    );

    gamePage.classList.remove(
        "hidden"
    );


    resetGame();


    gameRunning = true;

    gameOver = false;


    gameOverBox.classList.add(
        "hidden"
    );


    lastTime =
        performance.now();
}


/* ================= KEMBALI MENU ================= */

function backToMenu() {

    gameRunning = false;

    gameOver = false;


    gameOverBox.classList.add(
        "hidden"
    );


    gamePage.classList.add(
        "hidden"
    );

    loginPage.classList.remove(
        "hidden"
    );
}


/* ================= TOMBOL START ================= */

startButton.addEventListener(
    "click",
    startGame
);


/* ================= TOMBOL KELUAR ================= */

exitButton.addEventListener(
    "click",
    function () {

        /*
           Browser tidak mengizinkan
           JavaScript menutup tab biasa.

           Jadi kita kembali ke halaman awal.
        */

        alert(
            "Game selesai. Kamu bisa menutup tab ini."
        );
    }
);


/* ================= TOMBOL MENU ================= */

menuButton.addEventListener(
    "click",
    backToMenu
);


/* ================= MAIN LAGI ================= */

restartButton.addEventListener(
    "click",
    function () {

        resetGame();

        gameRunning = true;

        gameOver = false;

        gameOverBox.classList.add(
            "hidden"
        );
    }
);


/* ================= KEMBALI MENU ================= */

backButton.addEventListener(
    "click",
    backToMenu
);


/* ================= KEYBOARD ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !gameRunning ||
            gameOver
        ) {
            return;
        }


        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {

            changeDirection(
                0,
                -GRID
            );

        } else if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            changeDirection(
                0,
                GRID
            );

        } else if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            changeDirection(
                -GRID,
                0
            );

        } else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            changeDirection(
                GRID,
                0
            );
        }
    }
);


/* ================= TOMBOL HP ================= */

function buttonControl(
    button,
    x,
    y
) {

    button.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            if (
                gameRunning &&
                !gameOver
            ) {

                changeDirection(
                    x,
                    y
                );
            }
        }
    );
}


buttonControl(
    document.getElementById(
        "upButton"
    ),
    0,
    -GRID
);


buttonControl(
    document.getElementById(
        "downButton"
    ),
    0,
    GRID
);


buttonControl(
    document.getElementById(
        "leftButton"
    ),
    -GRID,
    0
);


buttonControl(
    document.getElementById(
        "rightButton"
    ),
    GRID,
    0
);


/* ================= MENCEGAH SCROLL HP ================= */

document.addEventListener(
    "touchmove",
    function (event) {

        event.preventDefault();

    },
    {
        passive: false
    }
);


/* ================= LOOP ================= */

requestAnimationFrame(
    gameLoop
);
