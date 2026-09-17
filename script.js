const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const loginScreen = document.getElementById("loginScreen");
const gameUI = document.getElementById("gameUI");
const gameOverScreen = document.getElementById("gameOver");

const playButton = document.getElementById("playButton");
const exitButton = document.getElementById("exitButton");
const menuButton = document.getElementById("menuButton");
const againButton = document.getElementById("againButton");
const backButton = document.getElementById("backButton");

const scoreBox = document.getElementById("scoreBox");
const speedBox = document.getElementById("speedBox");

const finalScore = document.getElementById("finalScore");
const finalSpeed = document.getElementById("finalSpeed");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const GRID = 24;


/* =========================
   WARNA
========================= */

const COLORS = {

    white: "#ffffff",
    black: "#413c46",

    pink: "#f591b4",
    dpink: "#d74b7d",

    light: "#ffeff6",

    green: "#69be6e",
    dgreen: "#419150",
    lgreen: "#e1f7dc",

    blue: "#69b9eb",
    sky: "#96dcf8",

    purple: "#af7ddc",

    yellow: "#ffd255",
    orange: "#fa9b41",

    red: "#eb4b5a",

    cream: "#fff8dc",

    grass: "#afe17d",
    grassLight: "#c3eb91",

    brown: "#7d5537",

    leaf: "#5faf5f"
};


/* =========================
   WARNA ULAR
========================= */

const snakeColors = [

    [
        "#46a0e1",
        "#69bef0",
        "#9bd7fa"
    ],

    [
        "#4bb464",
        "#73d27d",
        "#a5ebaa"
    ],

    [
        "#a064d7",
        "#be87eb",
        "#d7aff5"
    ],

    [
        "#f09637",
        "#fab455",
        "#ffd77d"
    ],

    [
        "#e14664",
        "#f06e82",
        "#faa0af"
    ]

];


/* =========================
   VARIABEL GAME
========================= */

let halaman = "login";

let gameOver = false;

let score = 0;

let speed = 5;

let color = 0;

let direction = {
    x: 1,
    y: 0
};

let snake = [];

let foods = [];


/* =========================
   RESIZE
========================= */

function resizeCanvas() {

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}


/* =========================
   ROUNDED RECT
========================= */

function roundedRect(
    x,
    y,
    w,
    h,
    r,
    fill,
    stroke = null,
    lineWidth = 0
) {

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        w,
        h,
        r
    );

    ctx.fillStyle = fill;

    ctx.fill();

    if (stroke) {

        ctx.strokeStyle = stroke;

        ctx.lineWidth = lineWidth;

        ctx.stroke();
    }
}


/* =========================
   LINGKARAN
========================= */

function circle(
    x,
    y,
    r,
    color
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;

    ctx.fill();
}


/* =========================
   CLOUD
========================= */

function drawCloud(
    x,
    y,
    s
) {

    circle(
        x,
        y + 6,
        s,
        "#e1f3fa"
    );

    circle(
        x + s,
        y - s / 2 + 6,
        s + 8,
        "#e1f3fa"
    );

    circle(
        x + s * 2,
        y + 6,
        s,
        "#e1f3fa"
    );


    circle(
        x,
        y,
        s,
        COLORS.white
    );

    circle(
        x + s,
        y - s / 2,
        s + 8,
        COLORS.white
    );

    circle(
        x + s * 2,
        y,
        s,
        COLORS.white
    );

    ctx.fillStyle = COLORS.white;

    ctx.fillRect(
        x,
        y,
        s * 2,
        s
    );
}


/* =========================
   HEART
========================= */

function drawHeart(
    x,
    y,
    s,
    color = COLORS.pink
) {

    circle(
        x - s / 2,
        y,
        s / 2,
        color
    );

    circle(
        x + s / 2,
        y,
        s / 2,
        color
    );

    ctx.beginPath();

    ctx.moveTo(
        x - s,
        y
    );

    ctx.lineTo(
        x + s,
        y
    );

    ctx.lineTo(
        x,
        y + s
    );

    ctx.fillStyle = color;

    ctx.fill();
}


/* =========================
   BUTTERFLY
========================= */

function drawButterfly(
    x,
    y,
    scale = 1
) {

    const wingW = 16 * scale;
    const wingH = 20 * scale;


    ctx.fillStyle = COLORS.pink;

    ctx.beginPath();

    ctx.ellipse(
        x - wingW / 2,
        y,
        wingW,
        wingH,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = COLORS.purple;

    ctx.beginPath();

    ctx.ellipse(
        x + wingW / 2,
        y,
        wingW,
        wingH,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = COLORS.black;

    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        4 * scale,
        9 * scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================
   FLOWER
========================= */

function drawFlower(
    x,
    y,
    radius,
    color
) {

    const positions = [

        [0, -radius],
        [-radius, 0],
        [radius, 0],
        [0, radius]

    ];


    positions.forEach(
        ([dx, dy]) => {

            circle(
                x + dx,
                y + dy,
                radius,
                color
            );

        }
    );


    circle(
        x,
        y,
        Math.max(
            2,
            radius / 2
        ),
        COLORS.yellow
    );
}


/* =========================
   GRASS
========================= */

function drawGrass(
    x,
    y,
    size = 1
) {

    const height = 28 * size;
    const width = 10 * size;


    ctx.lineWidth =
        Math.max(
            2,
            3 * size
        );


    ctx.strokeStyle =
        COLORS.dgreen;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x - width,
        y - height
    );

    ctx.stroke();


    ctx.strokeStyle =
        COLORS.green;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x,
        y - height - 5
    );

    ctx.stroke();


    ctx.strokeStyle =
        COLORS.dgreen;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x + width,
        y - height + 2
    );

    ctx.stroke();
}


/* =========================
   LOGIN BACKGROUND
========================= */

function loginBackground() {

    const grassStart =
        HEIGHT * .55;


    ctx.fillStyle =
        COLORS.sky;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        grassStart
    );


    ctx.fillStyle =
        COLORS.lgreen;

    ctx.fillRect(
        0,
        grassStart,
        WIDTH,
        HEIGHT - grassStart
    );


    drawCloud(
        55,
        90,
        28
    );

    drawCloud(
        WIDTH - 235,
        105,
        25
    );

    drawCloud(
        WIDTH / 2 + 205,
        58,
        17
    );

    drawCloud(
        WIDTH / 2 - 300,
        165,
        15
    );


    drawHeart(
        52,
        55,
        22
    );

    drawHeart(
        WIDTH - 52,
        62,
        22
    );


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        drawGrass(
            20 + i * 35,
            HEIGHT - 95 -
            (i % 4) * 22,
            .85
        );

        drawGrass(
            WIDTH - 20 - i * 35,
            HEIGHT - 95 -
            (i % 4) * 22,
            .85
        );
    }


    const flowers = [

        [45, -125, 8, COLORS.pink],
        [92, -78, 7, COLORS.purple],
        [140, -118, 8, COLORS.orange],
        [188, -68, 7, COLORS.pink],
        [235, -110, 8, COLORS.purple],
        [282, -72, 7, COLORS.orange],
        [325, -120, 7, COLORS.pink]

    ];


    flowers.forEach(
        ([x, y, r, c]) => {

            drawFlower(
                x,
                HEIGHT + y,
                r,
                c
            );

            drawFlower(
                WIDTH - x,
                HEIGHT + y,
                r,
                c
            );

        }
    );


    drawButterfly(
        100,
        HEIGHT - 170,
        .85
    );

    drawButterfly(
        230,
        HEIGHT - 195,
        .65
    );

    drawButterfly(
        WIDTH - 100,
        HEIGHT - 170,
        .85
    );

    drawButterfly(
        WIDTH - 230,
        HEIGHT - 195,
        .65
    );
}


/* =========================
   CUTE SNAKE
========================= */

function cuteSnake() {

    const x =
        WIDTH / 2;

    const y =
        HEIGHT / 2 - 65;


    circle(
        x,
        y + 7,
        38,
        "#379155"
    );

    circle(
        x,
        y,
        35,
        COLORS.green
    );

    circle(
        x - 50,
        y + 20,
        28,
        COLORS.blue
    );

    circle(
        x - 92,
        y + 32,
        24,
        COLORS.purple
    );


    [-11, 11].forEach(
        ex => {

            circle(
                x + ex,
                y - 12,
                9,
                COLORS.white
            );

            circle(
                x + ex,
                y - 12,
                4,
                COLORS.black
            );

        }
    );


    circle(
        x - 21,
        y + 8,
        5,
        COLORS.pink
    );

    circle(
        x + 21,
        y + 8,
        5,
        COLORS.pink
    );


    ctx.strokeStyle =
        COLORS.black;

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
        x,
        y + 1,
        13,
        0,
        Math.PI
    );

    ctx.stroke();
}


/* =========================
   GAME BACKGROUND
========================= */

function gameBackground() {

    ctx.fillStyle =
        COLORS.sky;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    circle(
        WIDTH - 120,
        105,
        55,
        COLORS.yellow
    );


    drawCloud(
        30,
        105,
        28
    );

    drawCloud(
        WIDTH / 2 - 120,
        65,
        16
    );

    drawCloud(
        WIDTH - 430,
        120,
        18
    );


    /* GUNUNG */

    ctx.fillStyle =
        "#4baacb";

    ctx.beginPath();

    ctx.moveTo(
        WIDTH / 2 - 515,
        430
    );

    ctx.lineTo(
        WIDTH / 2 - 382,
        295
    );

    ctx.lineTo(
        WIDTH / 2 - 250,
        430
    );

    ctx.fill();


    ctx.fillStyle =
        "#419bc3";

    ctx.beginPath();

    ctx.moveTo(
        WIDTH / 2 - 10,
        430
    );

    ctx.lineTo(
        WIDTH / 2 + 125,
        295
    );

    ctx.lineTo(
        WIDTH / 2 + 390,
        430
    );

    ctx.fill();


    /* RUMPUT */

    ctx.fillStyle =
        COLORS.grass;

    ctx.fillRect(
        0,
        495,
        WIDTH,
        HEIGHT - 495
    );


    const tile = 80;

    for (
        let row = 0;
        row < HEIGHT;
        row += tile
    ) {

        for (
            let col = 0;
            col < WIDTH;
            col += tile
        ) {

            if (
                (row / tile +
                 col / tile) % 2 === 0
            ) {

                ctx.fillStyle =
                    COLORS.grassLight;

                ctx.fillRect(
                    col,
                    495 +
                    row %
                    Math.max(
                        1,
                        HEIGHT - 495
                    ),
                    tile,
                    tile
                );
            }
        }
    }


    circle(
        85,
        HEIGHT - 90,
        24,
        COLORS.pink
    );

    circle(
        220,
        HEIGHT - 62,
        18,
        COLORS.purple
    );

    circle(
        WIDTH - 85,
        HEIGHT - 90,
        24,
        COLORS.pink
    );

    circle(
        WIDTH - 220,
        HEIGHT - 62,
        18,
        COLORS.purple
    );
}


/* =========================
   MAKANAN
========================= */

function newFood() {

    const fieldTop = 525;

    const bottom =
        HEIGHT - 170;


    const minY =
        Math.floor(
            fieldTop / GRID
        );

    const maxY =
        Math.max(
            minY + 1,
            Math.floor(
                bottom / GRID
            )
        );


    const x =
        Math.floor(
            2 +
            Math.random() *
            Math.max(
                1,
                WIDTH / GRID - 4
            )
        ) * GRID;


    const y =
        Math.floor(
            minY +
            Math.random() *
            Math.max(
                1,
                maxY - minY
            )
        ) * GRID;


    return {

        x: x,
        y: y,

        type:
            Math.floor(
                Math.random() * 5
            )

    };
}


/* =========================
   COLLISION MAKANAN
========================= */

function foodCollision(
    food,
    part
) {

    return (

        food.x <
        part.x + GRID &&

        food.x + GRID >
        part.x &&

        food.y <
        part.y + GRID &&

        food.y + GRID >
        part.y

    );
}


/* =========================
   CEK MAKANAN
========================= */

function validFood(food) {

    if (
        snake.some(
            part =>
                foodCollision(
                    food,
                    part
                )
        )
    ) {

        return false;
    }


    if (
        foods.some(
            oldFood =>
                foodCollision(
                    food,
                    oldFood
                )
        )
    ) {

        return false;
    }


    return true;
}


/* =========================
   BUAT 5 MAKANAN
========================= */

function createFoods() {

    foods = [];


    while (
        foods.length < 5
    ) {

        const food =
            newFood();


        if (
            validFood(food)
        ) {

            foods.push(food);
        }
    }
}


/* =========================
   GAMBAR MAKANAN
========================= */

function drawFood(food) {

    const x =
        food.x + GRID / 2;

    const y =
        food.y + GRID / 2;


    /* APPLE */

    if (food.type === 0) {

        circle(
            x,
            y + 2,
            9,
            COLORS.red
        );

        circle(
            x - 3,
            y - 2,
            3,
            "#ff7882"
        );

        ctx.strokeStyle =
            COLORS.brown;

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y - 8
        );

        ctx.lineTo(
            x + 2,
            y - 14
        );

        ctx.stroke();
    }


    /* GRAPE */

    else if (
        food.type === 1
    ) {

        [

            [-6, 3],
            [0, 5],
            [6, 3],
            [-3, -3],
            [3, -3],
            [0, -8]

        ].forEach(
            ([dx, dy]) => {

                circle(
                    x + dx,
                    y + dy,
                    4,
                    COLORS.purple
                );

            }
        );
    }


    /* BANANA */

    else if (
        food.type === 2
    ) {

        ctx.strokeStyle =
            COLORS.yellow;

        ctx.lineWidth = 7;

        ctx.beginPath();

        ctx.arc(
            x,
            y + 1,
            10,
            .3,
            3
        );

        ctx.stroke();
    }


    /* STRAWBERRY */

    else if (
        food.type === 3
    ) {

        ctx.fillStyle =
            COLORS.red;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y + 10
        );

        ctx.lineTo(
            x - 9,
            y - 2
        );

        ctx.lineTo(
            x - 6,
            y - 8
        );

        ctx.lineTo(
            x + 6,
            y - 8
        );

        ctx.lineTo(
            x + 9,
            y - 2
        );

        ctx.fill();
    }


    /* PINEAPPLE */

    else {

        ctx.fillStyle =
            COLORS.yellow;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            8,
            9,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            COLORS.orange;

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(
            x - 7,
            y - 3
        );

        ctx.lineTo(
            x + 7,
            y - 3
        );

        ctx.moveTo(
            x - 7,
            y + 3
        );

        ctx.lineTo(
            x + 7,
            y + 3
        );

        ctx.stroke();
    }
}


/* =========================
   RESET GAME
========================= */

function resetGame() {

    const y =
        Math.floor(
            HEIGHT / 2 + 70
        );


    snake = [

        {
            x:
                Math.floor(
                    WIDTH / 2
                ),

            y: y
        },

        {
            x:
                Math.floor(
                    WIDTH / 2
                ) - GRID,

            y: y
        },

        {
            x:
                Math.floor(
                    WIDTH / 2
                ) - GRID * 2,

            y: y
        }

    ];


    direction = {
        x: 1,
        y: 0
    };


    score = 0;

    color = 0;

    speed = 5;

    gameOver = false;


    createFoods();

    updateUI();
}


/* =========================
   UPDATE UI
========================= */

function updateUI() {

    scoreBox.textContent =
        "SKOR " + score;


    speedBox.textContent =
        "SPEED " +
        speed.toFixed(1);


    finalScore.textContent =
        score;


    finalSpeed.textContent =
        speed.toFixed(1);
}


/* =========================
   GERAK ULAR
========================= */

function moveSnake() {

    if (
        halaman !== "game" ||
        gameOver
    ) {

        return;
    }


    const head = {

        x:
            snake[0].x +
            direction.x * GRID,

        y:
            snake[0].y +
            direction.y * GRID

    };


    snake.unshift(head);


    let eaten = -1;


    for (
        let i = 0;
        i < foods.length;
        i++
    ) {

        if (
            foodCollision(
                foods[i],
                head
            )
        ) {

            eaten = i;

            break;
        }
    }


    if (
        eaten !== -1
    ) {

        foods.splice(
            eaten,
            1
        );


        score++;


        color =
            (color + 1) %
            snakeColors.length;


        speed =
            Math.min(
                5 + score * .3,
                10
            );


        while (true) {

            const food =
                newFood();


            if (
                validFood(food)
            ) {

                foods.push(food);

                break;
            }
        }

    } else {

        snake.pop();
    }


    /* BATAS LAYAR */

    if (

        head.x < 0 ||

        head.x + GRID >
            WIDTH ||

        head.y < 0 ||

        head.y + GRID >
            HEIGHT

    ) {

        gameOver = true;
    }


    /* TABRAKAN BADAN */

    for (
        let i = 1;
        i < snake.length;
        i++
    ) {

        if (
            foodCollision(
                head,
                snake[i]
            )
        ) {

            gameOver = true;

            break;
        }
    }


    updateUI();


    if (
        gameOver
    ) {

        gameOverScreen.classList.remove(
            "hidden"
        );
    }
}


/* =========================
   GAMBAR ULAR
========================= */

function drawSnake() {

    const colors =
        snakeColors[color];


    snake.forEach(
        (part, index) => {

            let currentColor;


            if (
                index === 0
            ) {

                currentColor =
                    colors[0];

            } else if (
                index % 2 === 0
            ) {

                currentColor =
                    colors[1];

            } else {

                currentColor =
                    colors[2];
            }


            circle(

                part.x +
                    GRID / 2,

                part.y +
                    GRID / 2,

                GRID / 2 + 3,

                currentColor

            );


            ctx.strokeStyle =
                COLORS.white;

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.arc(

                part.x +
                    GRID / 2,

                part.y +
                    GRID / 2,

                GRID / 2 + 3,

                0,
                Math.PI * 2

            );

            ctx.stroke();

        }
    );


    /* MATA */

    const head =
        snake[0];

    let eyes;


    if (
        direction.x === 1
    ) {

        eyes = [

            [
                head.x + GRID - 6,
                head.y + 6
            ],

            [
                head.x + GRID - 6,
                head.y + GRID - 6
            ]

        ];

    } else if (
        direction.x === -1
    ) {

        eyes = [

            [
                head.x + 6,
                head.y + 6
            ],

            [
                head.x + 6,
                head.y + GRID - 6
            ]

        ];

    } else if (
        direction.y === -1
    ) {

        eyes = [

            [
                head.x + 6,
                head.y + 6
            ],

            [
                head.x + GRID - 6,
                head.y + 6
            ]

        ];

    } else {

        eyes = [

            [
                head.x + 6,
                head.y + GRID - 6
            ],

            [
                head.x + GRID - 6,
                head.y + GRID - 6
            ]

        ];
    }


    eyes.forEach(
        ([x, y]) => {

            circle(
                x,
                y,
                5,
                COLORS.white
            );

            circle(
                x,
                y,
                2,
                COLORS.black
            );

        }
    );
}


/* =========================
   GAMBAR GAME
========================= */

function drawGame() {

    gameBackground();

    foods.forEach(
        drawFood
    );

    drawSnake();
}


/* =========================
   GAMBAR LOGIN
========================= */

function drawLogin() {

    loginBackground();
}


/* =========================
   MULAI GAME
========================= */

function startGame() {

    resetGame();


    halaman = "game";


    loginScreen.classList.add(
        "hidden"
    );

    gameUI.classList.remove(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );
}


/* =========================
   KEMBALI MENU
========================= */

function backToMenu() {

    halaman = "login";

    gameOver = false;


    loginScreen.classList.remove(
        "hidden"
    );

    gameUI.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );
}


/* =========================
   TOMBOL
========================= */

playButton.addEventListener(
    "click",
    startGame
);


exitButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "about:blank";

    }
);


menuButton.addEventListener(
    "click",
    backToMenu
);


againButton.addEventListener(
    "click",
    () => {

        resetGame();

        gameOverScreen.classList.add(
            "hidden"
        );

    }
);


backButton.addEventListener(
    "click",
    backToMenu
);


/* =========================
   JOYSTICK
========================= */

document
    .querySelectorAll(
        "#controls button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();


                    const dir =
                        button.dataset.direction;


                    if (
                        dir === "up" &&
                        direction.y !== 1
                    ) {

                        direction = {
                            x: 0,
                            y: -1
                        };

                    } else if (
                        dir === "down" &&
                        direction.y !== -1
                    ) {

                        direction = {
                            x: 0,
                            y: 1
                        };

                    } else if (
                        dir === "left" &&
                        direction.x !== 1
                    ) {

                        direction = {
                            x: -1,
                            y: 0
                        };

                    } else if (
                        dir === "right" &&
                        direction.x !== -1
                    ) {

                        direction = {
                            x: 1,
                            y: 0
                        };
                    }

                }
            );

        }
    );


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            if (
                halaman === "game"
            ) {

                backToMenu();

            } else {

                window.location.href =
                    "about:blank";
            }
        }


        if (
            halaman !== "game" ||
            gameOver
        ) {

            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            (
                event.key === "ArrowUp" ||
                key === "w"
            ) &&
            direction.y !== 1
        ) {

            direction = {
                x: 0,
                y: -1
            };

        } else if (
            (
                event.key === "ArrowDown" ||
                key === "s"
            ) &&
            direction.y !== -1
        ) {

            direction = {
                x: 0,
                y: 1
            };

        } else if (
            (
                event.key === "ArrowLeft" ||
                key === "a"
            ) &&
            direction.x !== 1
        ) {

            direction = {
                x: -1,
                y: 0
            };

        } else if (
            (
                event.key === "ArrowRight" ||
                key === "d"
            ) &&
            direction.x !== -1
        ) {

            direction = {
                x: 1,
                y: 0
            };
        }

    }
);


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    () => {

        resizeCanvas();


        if (
            halaman === "login"
        ) {

            drawLogin();

        } else {

            drawGame();
        }

    }
);


/* =========================
   START
========================= */

resizeCanvas();

drawLogin();


let lastMove = 0;


/* =========================
   GAME LOOP
========================= */

function gameLoop(time) {

    if (
        halaman === "game" &&
        !gameOver
    ) {

        const interval =
            1000 / speed;


        if (
            time - lastMove >=
            interval
        ) {

            moveSnake();

            lastMove = time;
        }
    }


    if (
        halaman === "login"
    ) {

        drawLogin();

    } else {

        drawGame();
    }


    requestAnimationFrame(
        gameLoop
    );
}


requestAnimationFrame(
    gameLoop
);
