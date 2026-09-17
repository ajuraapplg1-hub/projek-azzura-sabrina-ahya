const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const WHITE = "#ffffff";
const BLACK = "#413c46";

const PINK = "#f591b4";
const DPINK = "#d74b7d";
const LIGHT = "#ffeff6";

const GREEN = "#69be6e";
const DGREEN = "#419150";
const LGREEN = "#e1f7dc";

const BLUE = "#69b9eb";
const SKY = "#96dcf8";

const PURPLE = "#af7ddc";
const YELLOW = "#ffd255";
const ORANGE = "#fa9b41";

const RED = "#eb4b5a";
const CREAM = "#fff8dc";

const GRASS = "#afe17d";
const GRASS_LIGHT = "#c3eb91";

const BROWN = "#7d5537";

const LEAF = "#5faf5f";
const LEAF_LIGHT = "#87c873";

const GRID = 24;

let halaman = "login";
let gameOver = false;
let running = true;
let nama = "Pemain";

let snake = [];
let foods = [];
let direction = { x: GRID, y: 0 };

let score = 0;
let color = 0;
let speed = 5;
const MAX_SPEED = 10;

let moveTimer = 0;
let lastTime = 0;

const snakeColors = [
    ["#46a0e1", "#69bef0", "#9bd7fa"],
    ["#4bb464", "#73d27d", "#a5ebaA"],
    ["#a064d7", "#be87eb", "#d7aff5"],
    ["#f09637", "#fab455", "#ffd77d"],
    ["#e14664", "#f06e82", "#faa0af"]
];

function resizeCanvas() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    if (halaman === "game") {
        drawGame();
    } else {
        drawLogin();
    }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvas, 150);
});

function roundedRect(x, y, w, h, radius, fill, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }

    if (stroke) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function heart(x, y, s, color = PINK) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x - s / 2, y, s / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + s / 2, y, s / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x, y + s);
    ctx.closePath();
    ctx.fill();
}

function cloudOld(x, y, s) {
    ctx.fillStyle = "#e1f3fa";

    ctx.beginPath();
    ctx.arc(x, y + 6, s, 0, Math.PI * 2);
    ctx.arc(x + s, y - s / 2 + 6, s + 8, 0, Math.PI * 2);
    ctx.arc(x + s * 2, y + 6, s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = WHITE;

    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.arc(x + s, y - s / 2, s + 8, 0, Math.PI * 2);
    ctx.arc(x + s * 2, y, s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(x, y, s * 2, s);
}

function butterfly(x, y, scale = 1) {
    const wingW = 16 * scale;
    const wingH = 20 * scale;

    ctx.fillStyle = PINK;
    ctx.beginPath();
    ctx.ellipse(
        x - wingW / 2,
        y,
        wingW / 2,
        wingH / 2,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = PURPLE;
    ctx.beginPath();
    ctx.ellipse(
        x + wingW / 2,
        y,
        wingW / 2,
        wingH / 2,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.ellipse(
        x - 11 * scale,
        y - 11 * scale,
        5.5 * scale,
        7 * scale,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.ellipse(
        x + 5.5 * scale,
        y - 11 * scale,
        5.5 * scale,
        7 * scale,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.ellipse(
        x,
        y,
        Math.max(2, 2.5 * scale),
        8 * scale,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function cloudGame(x, y, scale) {
    const w = 175 * scale;
    const h = 65 * scale;

    ctx.fillStyle = "#d7eef8";

    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 12 * scale, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = WHITE;

    ctx.beginPath();
    ctx.ellipse(
        x + 40 * scale,
        y + 30 * scale,
        35 * scale,
        30 * scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.ellipse(
        x + 86 * scale,
        y + 13 * scale,
        41 * scale,
        41 * scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.ellipse(
        x + 135 * scale,
        y + 30 * scale,
        35 * scale,
        30 * scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        x + 20 * scale,
        y + 25 * scale,
        130 * scale,
        38 * scale
    );
}

function sun(x, y, radius) {
    ctx.strokeStyle = YELLOW;
    ctx.lineWidth = 7;

    for (let angle = 0; angle < 360; angle += 45) {
        const rad = angle * Math.PI / 180;

        const x1 = x + Math.cos(rad) * (radius + 12);
        const y1 = y + Math.sin(rad) * (radius + 12);

        const x2 = x + Math.cos(rad) * (radius + 30);
        const y2 = y + Math.sin(rad) * (radius + 30);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    ctx.fillStyle = "#ffcd41";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffe169";
    ctx.beginPath();
    ctx.arc(x - 7, y - 7, Math.max(1, radius - 11), 0, Math.PI * 2);
    ctx.fill();
}

function rainbow(x, y, radius) {
    const colors = [
        "#f064a0",
        "#ffa05a",
        "#ffd750",
        "#69c37d",
        "#50afe1",
        "#966ed7"
    ];

    const thickness = 13;

    colors.forEach((color, index) => {
        const currentRadius = radius - index * thickness;

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();

        for (let i = 0; i <= 100; i++) {
            const angle = Math.PI * i / 100;

            const px = x + Math.cos(angle) * currentRadius;
            const py = y - Math.sin(angle) * currentRadius;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();
    });
}

function mountain(x, baseY, width, height, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x - width / 2, baseY);
    ctx.lineTo(x - width / 4, baseY - height / 2);
    ctx.lineTo(x, baseY - height);
    ctx.lineTo(x + width / 4, baseY - height / 2);
    ctx.lineTo(x + width / 2, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,0,0.12)";

    ctx.beginPath();
    ctx.moveTo(x, baseY - height);
    ctx.lineTo(x - width / 2, baseY);
    ctx.lineTo(x, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = WHITE;

    ctx.beginPath();
    ctx.moveTo(x, baseY - height);
    ctx.lineTo(x - width / 10, baseY - height / 2 + 8);
    ctx.lineTo(x - width / 28, baseY - height / 2 - 5);
    ctx.lineTo(x + width / 14, baseY - height / 2 + 12);
    ctx.lineTo(x + width / 9, baseY - height / 3);
    ctx.closePath();
    ctx.fill();
}

function hill(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(
        x + width / 2,
        y + height / 2,
        width / 2,
        height / 2,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function bush(x, y, width, height, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.ellipse(
        x + width / 2,
        y + height * 5 / 8,
        width / 2,
        height * 3 / 8,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + width / 4, y + height / 3, height / 2, 0, Math.PI * 2);
    ctx.arc(x + width / 2, y + height / 5, height / 2, 0, Math.PI * 2);
    ctx.arc(x + width * 3 / 4, y + height / 3, height / 2, 0, Math.PI * 2);
    ctx.fill();
}

function flower(x, y, radius, color) {
    const positions = [
        [0, -radius],
        [-radius, 0],
        [radius, 0],
        [0, radius]
    ];

    ctx.fillStyle = color;

    positions.forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, radius / 2), 0, Math.PI * 2);
    ctx.fill();
}

function grassPatch(x, y, size = 1) {
    const height = 28 * size;
    const width = 10 * size;

    ctx.lineWidth = Math.max(2, 3 * size);

    ctx.strokeStyle = DGREEN;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - width, y - height);
    ctx.stroke();

    ctx.strokeStyle = GREEN;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - height - 5);
    ctx.stroke();

    ctx.strokeStyle = DGREEN;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y - height + 2);
    ctx.stroke();
}

function cuteSnake() {
    const x = WIDTH / 2;
    const y = HEIGHT / 2 - 65;

    ctx.fillStyle = "#379155";
    ctx.beginPath();
    ctx.arc(x, y + 7, 38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = GREEN;
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(x - 50, y + 20, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PURPLE;
    ctx.beginPath();
    ctx.arc(x - 92, y + 32, 24, 0, Math.PI * 2);
    ctx.fill();

    [-11, 11].forEach(ex => {
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.arc(x + ex, y - 12, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = BLACK;
        ctx.beginPath();
        ctx.arc(x + ex, y - 12, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = PINK;
    ctx.beginPath();
    ctx.arc(x - 21, y + 8, 5, 0, Math.PI * 2);
    ctx.arc(x + 21, y + 8, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = BLACK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y + 1, 13, 0, Math.PI);
    ctx.stroke();
}

function loginBackground() {
    const grassStart = HEIGHT * 0.55;

    ctx.fillStyle = SKY;
    ctx.fillRect(0, 0, WIDTH, grassStart);

    ctx.fillStyle = LGREEN;
    ctx.fillRect(0, grassStart, WIDTH, HEIGHT - grassStart);

    cloudOld(55, 90, 28);
    cloudOld(WIDTH - 235, 105, 25);
    cloudOld(WIDTH / 2 + 205, 58, 17);
    cloudOld(WIDTH / 2 - 300, 165, 15);

    heart(52, 55, 22);
    heart(WIDTH - 52, 62, 22);
    heart(170, 155, 8, LIGHT);
    heart(WIDTH - 170, 165, 8, LIGHT);

    const leftGrass = [20,55,90,125,160,195,230,265,300,335];

    leftGrass.forEach((x, i) => {
        grassPatch(
            x,
            HEIGHT - 95 - (i % 4) * 22,
            0.85
        );
    });

    leftGrass.forEach((x, i) => {
        grassPatch(
            WIDTH - x,
            HEIGHT - 95 - (i % 4) * 22,
            0.85
        );
    });

    const flowers = [
        [45, HEIGHT - 125, 8, PINK],
        [92, HEIGHT - 78, 7, PURPLE],
        [140, HEIGHT - 118, 8, ORANGE],
        [188, HEIGHT - 68, 7, PINK],
        [235, HEIGHT - 110, 8, PURPLE],
        [282, HEIGHT - 72, 7, ORANGE],
        [325, HEIGHT - 120, 7, PINK]
    ];

    flowers.forEach(f => flower(...f));

    flowers.forEach(([x, y, r, c]) => {
        flower(
            WIDTH - x,
            y,
            r,
            c
        );
    });

    butterfly(100, HEIGHT - 170, 0.85);
    butterfly(230, HEIGHT - 195, 0.65);
    butterfly(WIDTH - 100, HEIGHT - 170, 0.85);
    butterfly(WIDTH - 230, HEIGHT - 195, 0.65);
}

function gameBackground() {
    ctx.fillStyle = SKY;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    sun(WIDTH - 120, 105, 55);

    cloudGame(30, 105, 1.15);
    cloudGame(WIDTH / 2 - 120, 65, 0.65);
    cloudGame(WIDTH - 430, 120, 0.70);

    rainbow(WIDTH / 2, 395, 225);

    mountain(
        WIDTH / 2 - 250,
        430,
        530,
        270,
        "#4baacD"
    );

    mountain(
        WIDTH / 2 + 250,
        430,
        530,
        270,
        "#419bc3"
    );

    hill(
        -180,
        370,
        WIDTH / 2 + 210,
        190,
        "#78c36e"
    );

    hill(
        WIDTH / 2 - 30,
        370,
        WIDTH / 2 + 210,
        190,
        "#69b969"
    );

    const fieldTop = Math.min(
        HEIGHT - 150,
        Math.max(495, HEIGHT / 2)
    );

    ctx.fillStyle = GRASS;
    ctx.fillRect(
        0,
        fieldTop,
        WIDTH,
        HEIGHT - fieldTop
    );

    const tile = 80;

    for (let row = 0, y = fieldTop; y < HEIGHT; row++, y += tile) {
        for (let col = 0, x = 0; x < WIDTH; col++, x += tile) {
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = GRASS_LIGHT;
                ctx.fillRect(x, y, tile, tile);
            }
        }
    }

    bush(-80, HEIGHT - 145, 370, 145, "#2d9150");
    bush(170, HEIGHT - 120, 300, 120, "#4baa5a");
    bush(WIDTH - 470, HEIGHT - 120, 300, 120, "#4baa5a");
    bush(WIDTH - 290, HEIGHT - 145, 370, 145, "#2d9150");

    flower(85, HEIGHT - 90, 24, PINK);
    flower(220, HEIGHT - 62, 18, PURPLE);
    flower(WIDTH - 85, HEIGHT - 90, 24, PINK);
    flower(WIDTH - 220, HEIGHT - 62, 18, PURPLE);
}

function getFoodArea() {
    let top = Math.min(
        HEIGHT - 220,
        Math.max(525, HEIGHT / 2 + 20)
    );

    let bottom = HEIGHT - 170;

    if (bottom <= top) {
        top = Math.max(100, HEIGHT / 2);
        bottom = Math.max(top + GRID, HEIGHT - 100);
    }

    return { top, bottom };
}

function newFood() {
    const area = getFoodArea();

    const minY = Math.max(
        1,
        Math.floor(area.top / GRID)
    );

    const maxY = Math.max(
        minY + 1,
        Math.floor(area.bottom / GRID)
    );

    const maxX = Math.max(
        4,
        Math.floor(WIDTH / GRID) - 2
    );

    const x =
        Math.floor(
            Math.random() * (maxX - 1)
        ) * GRID + GRID;

    const y =
        Math.floor(
            Math.random() * (maxY - minY)
        ) * GRID + minY * GRID;

    return {
        x,
        y,
        type: Math.floor(Math.random() * 5)
    };
}

function samePosition(a, b) {
    return a.x === b.x && a.y === b.y;
}

function validFood(food) {
    for (const part of snake) {
        if (samePosition(food, part)) {
            return false;
        }
    }

    for (const oldFood of foods) {
        if (samePosition(food, oldFood)) {
            return false;
        }
    }

    return true;
}

function addFood() {
    let attempts = 0;

    while (foods.length < 5 && attempts < 1000) {
        const food = newFood();

        if (validFood(food)) {
            foods.push(food);
        }

        attempts++;
    }
}

function createFoods() {
    foods = [];
    addFood();
}

function resetGame() {
    let y = Math.floor(
        (HEIGHT / 2 + 70) / GRID
    ) * GRID;

    const startX =
        Math.floor(
            WIDTH / 2 / GRID
        ) * GRID;

    snake = [
        { x: startX, y },
        { x: startX - GRID, y },
        { x: startX - GRID * 2, y }
    ];

    direction = {
        x: GRID,
        y: 0
    };

    score = 0;
    color = 0;
    speed = 5;
    moveTimer = 0;
    gameOver = false;

    createFoods();
}

function drawFood(food) {
    const x = food.x + GRID / 2;
    const y = food.y + GRID / 2;

    if (food.type === 0) {
        ctx.fillStyle = RED;
        ctx.beginPath();
        ctx.arc(x, y + 2, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ff7882";
        ctx.beginPath();
        ctx.arc(x - 3, y - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = BROWN;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x + 2, y - 14);
        ctx.stroke();

        ctx.fillStyle = GREEN;
        ctx.beginPath();
        ctx.ellipse(x + 5, y - 12, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    else if (food.type === 1) {
        const positions = [
            [-6, 3],
            [0, 5],
            [6, 3],
            [-3, -3],
            [3, -3],
            [0, -8]
        ];

        ctx.fillStyle = PURPLE;

        positions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(x + dx, y + dy, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = GREEN;
        ctx.beginPath();
        ctx.ellipse(x + 7, y - 11, 4.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    else if (food.type === 2) {
        ctx.strokeStyle = YELLOW;
        ctx.lineWidth = 7;

        ctx.beginPath();
        ctx.arc(
            x,
            y,
            11,
            0.3,
            3.0
        );
        ctx.stroke();

        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(
            x,
            y,
            8,
            0.4,
            2.8
        );
        ctx.stroke();
    }

    else if (food.type === 3) {
        ctx.fillStyle = RED;

        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x - 9, y - 2);
        ctx.lineTo(x - 6, y - 8);
        ctx.lineTo(x + 6, y - 8);
        ctx.lineTo(x + 9, y - 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = GREEN;

        ctx.beginPath();
        ctx.moveTo(x - 8, y - 8);
        ctx.lineTo(x, y - 14);
        ctx.lineTo(x + 8, y - 8);
        ctx.lineTo(x + 3, y - 5);
        ctx.lineTo(x - 3, y - 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = YELLOW;

        [
            [-4, -2],
            [2, -1],
            [0, 4],
            [5, 3]
        ].forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(x + dx, y + dy, 1, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    else {
        ctx.fillStyle = YELLOW;

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

        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x - 7, y - 3);
        ctx.lineTo(x + 7, y - 3);
        ctx.moveTo(x - 7, y + 3);
        ctx.lineTo(x + 7, y + 3);
        ctx.stroke();

        ctx.fillStyle = GREEN;

        ctx.beginPath();
        ctx.moveTo(x - 6, y - 7);
        ctx.lineTo(x - 4, y - 15);
        ctx.lineTo(x, y - 8);
        ctx.lineTo(x + 4, y - 15);
        ctx.lineTo(x + 6, y - 7);
        ctx.closePath();
        ctx.fill();
    }
}

function getControls() {
    const size = Math.max(
        58,
        Math.min(
            76,
            WIDTH / 6
        )
    );

    const gap = Math.max(
        6,
        Math.min(
            10,
            WIDTH / 70
        )
    );

    const x = WIDTH - size * 2.5;
    const y = HEIGHT - size * 1.25;

    return {
        up: {
            x: x - size / 2,
            y: y - size * 2 - gap,
            w: size,
            h: size
        },

        left: {
            x: x - size - gap - size / 2,
            y: y - size,
            w: size,
            h: size
        },

        down: {
            x: x - size / 2,
            y: y - size,
            w: size,
            h: size
        },

        right: {
            x: x + gap + size / 2,
            y: y - size,
            w: size,
            h: size
        }
    };
}

function drawControlsCanvas() {
    if (window.innerWidth > 900 && "ontouchstart" in window === false) {
        return;
    }

    const controls = getControls();

    const buttons = [
        [controls.up, "▲"],
        [controls.left, "◀"],
        [controls.down, "▼"],
        [controls.right, "▶"]
    ];

    buttons.forEach(([rect, symbol]) => {
        roundedRect(
            rect.x,
            rect.y + 5,
            rect.w,
            rect.h,
            18,
            DPINK
        );

        roundedRect(
            rect.x,
            rect.y,
            rect.w,
            rect.h,
            18,
            PINK,
            WHITE,
            3
        );

        ctx.fillStyle = WHITE;
        ctx.font = "bold 25px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            symbol,
            rect.x + rect.w / 2,
            rect.y + rect.h / 2
        );
    });
}

function changeDirection(newDirection) {
    if (!newDirection) {
        return;
    }

    if (
        newDirection.x === -direction.x &&
        newDirection.y === -direction.y
    ) {
        return;
    }

    direction = newDirection;
}

function handleControl(x, y) {
    const controls = getControls();

    if (pointInRect(x, y, controls.up)) {
        changeDirection({ x: 0, y: -GRID });
        return true;
    }

    if (pointInRect(x, y, controls.down)) {
        changeDirection({ x: 0, y: GRID });
        return true;
    }

    if (pointInRect(x, y, controls.left)) {
        changeDirection({ x: -GRID, y: 0 });
        return true;
    }

    if (pointInRect(x, y, controls.right)) {
        changeDirection({ x: GRID, y: 0 });
        return true;
    }

    return false;
}

function pointInRect(x, y, rect) {
    return (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
    );
}

function drawSnake() {
    const colors = snakeColors[color];

    snake.forEach((part, index) => {
        let currentColor;

        if (index === 0) {
            currentColor = colors[0];
        } else if (index % 2 === 0) {
            currentColor = colors[1];
        } else {
            currentColor = colors[2];
        }

        ctx.fillStyle = currentColor;

        ctx.beginPath();
        ctx.arc(
            part.x + GRID / 2,
            part.y + GRID / 2,
            GRID / 2 + 3,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(
            part.x + GRID / 2,
            part.y + GRID / 2,
            GRID / 2 + 3,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    });

    drawSnakeEyes();
}

function drawSnakeEyes() {
    const head = snake[0];

    let eyes;

    if (direction.x > 0) {
        eyes = [
            [head.x + GRID - 6, head.y + 6],
            [head.x + GRID - 6, head.y + GRID - 6]
        ];
    }

    else if (direction.x < 0) {
        eyes = [
            [head.x + 6, head.y + 6],
            [head.x + 6, head.y + GRID - 6]
        ];
    }

    else if (direction.y < 0) {
        eyes = [
            [head.x + 6, head.y + 6],
            [head.x + GRID - 6, head.y + 6]
        ];
    }

    else {
        eyes = [
            [head.x + 6, head.y + GRID - 6],
            [head.x + GRID - 6, head.y + GRID - 6]
        ];
    }

    eyes.forEach(([x, y]) => {
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = BLACK;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    let eatenIndex = -1;

    foods.forEach((food, index) => {
        if (
            head.x < food.x + GRID &&
            head.x + GRID > food.x &&
            head.y < food.y + GRID &&
            head.y + GRID > food.y
        ) {
            eatenIndex = index;
        }
    });

    snake.unshift(head);

    if (eatenIndex !== -1) {
        foods.splice(eatenIndex, 1);

        score++;

        color =
            (color + 1) %
            snakeColors.length;

        speed = Math.min(
            5 + score * 0.3,
            MAX_SPEED
        );

        addFood();
    } else {
        snake.pop();
    }

    if (
        head.x < 0 ||
        head.x + GRID > WIDTH ||
        head.y < 0 ||
        head.y + GRID > HEIGHT
    ) {
        gameOver = true;
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            gameOver = true;
            return;
        }
    }

    if (foods.length < 5) {
        addFood();
    }
}

function drawText(text, x, y, size, color, align = "center") {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

function drawLogin() {
    loginBackground();

    drawText(
        "SNAKE",
        WIDTH / 2,
        65,
        Math.max(
            40,
            Math.min(70, WIDTH / 17)
        ),
        DPINK
    );

    drawText(
        "Snake of Jura",
        WIDTH / 2,
        130,
        Math.max(
            20,
            Math.min(30, WIDTH / 45)
        ),
        BLACK
    );

    cuteSnake();

    drawText(
        "Ayo bantu ular mencari makanan!",
        WIDTH / 2,
        HEIGHT / 2 - 15,
        Math.max(
            15,
            Math.min(23, WIDTH / 50)
        ),
        DGREEN
    );

    const buttonW = Math.min(
        350,
        WIDTH - 60
    );

    const buttonH = 65;

    const play = {
        x: WIDTH / 2 - buttonW / 2,
        y: HEIGHT / 2 + 45,
        w: buttonW,
        h: buttonH
    };

    const keluar = {
        x: WIDTH / 2 - buttonW / 2,
        y: HEIGHT / 2 + 125,
        w: buttonW,
        h: buttonH
    };

    roundedRect(
        play.x,
        play.y + 6,
        play.w,
        play.h,
        24,
        DGREEN
    );

    roundedRect(
        play.x,
        play.y,
        play.w,
        play.h,
        24,
        GREEN,
        WHITE,
        3
    );

    drawText(
        "MULAI GAME",
        play.x + play.w / 2,
        play.y + play.h / 2,
        Math.max(
            20,
            Math.min(30, WIDTH / 43)
        ),
        WHITE
    );

    roundedRect(
        keluar.x,
        keluar.y + 6,
        keluar.w,
        keluar.h,
        24,
        "#b9416e"
    );

    roundedRect(
        keluar.x,
        keluar.y,
        keluar.w,
        keluar.h,
        24,
        DPINK,
        WHITE,
        3
    );

    drawText(
        "KELUAR",
        keluar.x + keluar.w / 2,
        keluar.y + keluar.h / 2,
        Math.max(
            20,
            Math.min(30, WIDTH / 43)
        ),
        WHITE
    );
}

function drawGame() {
    gameBackground();

    const menu = {
        x: 12,
        y: 8,
        w: Math.min(125, Math.max(105, WIDTH / 6)),
        h: 42
    };

    roundedRect(
        menu.x,
        menu.y + 4,
        menu.w,
        menu.h,
        16,
        DPINK
    );

    roundedRect(
        menu.x,
        menu.y,
        menu.w,
        menu.h,
        16,
        PINK,
        WHITE,
        3
    );

    drawText(
        "MENU",
        menu.x + menu.w / 2,
        menu.y + menu.h / 2,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        WHITE
    );

    drawText(
        nama,
        menu.x + menu.w + 20,
        27,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        DPINK,
        "left"
    );

    const speedBoxW = Math.min(
        185,
        Math.max(145, WIDTH / 7)
    );

    const speedBox = {
        x: WIDTH - speedBoxW - 210,
        y: 7,
        w: speedBoxW,
        h: 37
    };

    roundedRect(
        speedBox.x,
        speedBox.y,
        speedBox.w,
        speedBox.h,
        18,
        WHITE,
        PINK,
        2
    );

    drawText(
        "SPEED " + speed.toFixed(1),
        speedBox.x + speedBox.w / 2,
        speedBox.y + speedBox.h / 2,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        DPINK
    );

    const scoreBoxW = Math.min(
        195,
        Math.max(145, WIDTH / 7)
    );

    const scoreBox = {
        x: WIDTH - scoreBoxW - 15,
        y: 7,
        w: scoreBoxW,
        h: 37
    };

    roundedRect(
        scoreBox.x,
        scoreBox.y,
        scoreBox.w,
        scoreBox.h,
        18,
        WHITE,
        PINK,
        2
    );

    drawText(
        "SKOR " + score,
        scoreBox.x + scoreBox.w / 2,
        scoreBox.y + scoreBox.h / 2,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        DPINK
    );

    foods.forEach(food => drawFood(food));

    drawSnake();

    drawControlsCanvas();

    if (gameOver) {
        drawGameOver();
    }
}

function drawGameOver() {
    ctx.fillStyle = "rgba(65,60,70,0.57)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const panelW = Math.min(
        WIDTH - 30,
        WIDTH <= 700 ? 400 : 480
    );

    const panelH = Math.min(
        HEIGHT - 30,
        WIDTH <= 700 ? 370 : 380
    );

    const panel = {
        x: WIDTH / 2 - panelW / 2,
        y: HEIGHT / 2 - panelH / 2,
        w: panelW,
        h: panelH
    };

    roundedRect(
        panel.x,
        panel.y + 8,
        panel.w,
        panel.h,
        34,
        "#28232d"
    );

    roundedRect(
        panel.x,
        panel.y,
        panel.w,
        panel.h,
        34,
        LIGHT,
        PINK,
        5
    );

    heart(
        panel.x + 48,
        panel.y + 48,
        13
    );

    heart(
        panel.x + panel.w - 48,
        panel.y + 48,
        13
    );

    drawText(
        "GAME OVER",
        WIDTH / 2,
        panel.y + 65,
        Math.max(
            38,
            Math.min(65, WIDTH / 17)
        ),
        DPINK
    );

    const infoW = Math.min(
        panel.w - 50,
        330
    );

    roundedRect(
        WIDTH / 2 - infoW / 2,
        panel.y + 105,
        infoW,
        48,
        18,
        WHITE,
        PINK,
        2
    );

    drawText(
        "SKOR  " + score,
        WIDTH / 2,
        panel.y + 129,
        Math.max(
            20,
            Math.min(30, WIDTH / 45)
        ),
        DPINK
    );

    roundedRect(
        WIDTH / 2 - infoW / 2,
        panel.y + 162,
        infoW,
        45,
        18,
        WHITE,
        GREEN,
        2
    );

    drawText(
        "SPEED  " + speed.toFixed(1),
        WIDTH / 2,
        panel.y + 184,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        DGREEN
    );

    const buttonW = Math.min(
        290,
        WIDTH - 70
    );

    const ulang = {
        x: WIDTH / 2 - buttonW / 2,
        y: panel.y + panel.h - 122,
        w: buttonW,
        h: 50
    };

    const keluar = {
        x: WIDTH / 2 - buttonW / 2,
        y: panel.y + panel.h - 62,
        w: buttonW,
        h: 50
    };

    roundedRect(
        ulang.x,
        ulang.y + 5,
        ulang.w,
        ulang.h,
        20,
        DGREEN
    );

    roundedRect(
        ulang.x,
        ulang.y,
        ulang.w,
        ulang.h,
        20,
        GREEN,
        WHITE,
        3
    );

    drawText(
        "MAIN LAGI",
        ulang.x + ulang.w / 2,
        ulang.y + ulang.h / 2,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        WHITE
    );

    roundedRect(
        keluar.x,
        keluar.y + 5,
        keluar.w,
        keluar.h,
        20,
        "#b9416e"
    );

    roundedRect(
        keluar.x,
        keluar.y,
        keluar.w,
        keluar.h,
        20,
        DPINK,
        WHITE,
        3
    );

    drawText(
        "KEMBALI KE MENU",
        keluar.x + keluar.w / 2,
        keluar.y + keluar.h / 2,
        Math.max(
            17,
            Math.min(25, WIDTH / 60)
        ),
        WHITE
    );
}

function updateGame(delta) {
    if (halaman !== "game" || gameOver) {
        return;
    }

    const moveInterval = Math.max(
        75,
        1000 / speed
    );

    moveTimer += delta;

    if (moveTimer >= moveInterval) {
        moveTimer -= moveInterval;

        if (moveTimer > moveInterval) {
            moveTimer = 0;
        }

        moveSnake();
    }
}

function gameLoop(timestamp) {
    if (!running) {
        return;
    }

    if (!lastTime) {
        lastTime = timestamp;
    }

    let delta = timestamp - lastTime;
    lastTime = timestamp;

    if (delta > 100) {
        delta = 100;
    }

    updateGame(delta);

    if (halaman === "login") {
        drawLogin();
    } else {
        drawGame();
    }

    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetGame();
    halaman = "game";
    gameOver = false;
}

function goMenu() {
    halaman = "login";
    gameOver = false;
}

function exitGame() {
    running = false;

    try {
        window.close();
    } catch (e) {}

    document.body.innerHTML =
        "<div style='display:flex;align-items:center;justify-content:center;width:100vw;height:100vh;font-family:Arial;font-size:24px;background:#e1f7dc;color:#419150;'>Game selesai</div>";
}

function handleCanvasClick(x, y) {
    if (halaman === "login") {
        const buttonW = Math.min(
            350,
            WIDTH - 60
        );

        const play = {
            x: WIDTH / 2 - buttonW / 2,
            y: HEIGHT / 2 + 45,
            w: buttonW,
            h: 65
        };

        const keluar = {
            x: WIDTH / 2 - buttonW / 2,
            y: HEIGHT / 2 + 125,
            w: buttonW,
            h: 65
        };

        if (pointInRect(x, y, play)) {
            startGame();
        }

        else if (pointInRect(x, y, keluar)) {
            exitGame();
        }

        return;
    }

    const menu = {
        x: 12,
        y: 8,
        w: Math.min(125, Math.max(105, WIDTH / 6)),
        h: 42
    };

    if (pointInRect(x, y, menu)) {
        goMenu();
        return;
    }

    if (handleControl(x, y)) {
        return;
    }

    if (gameOver) {
        const panelW = Math.min(
            WIDTH - 30,
            WIDTH <= 700 ? 400 : 480
        );

        const panelH = Math.min(
            HEIGHT - 30,
            WIDTH <= 700 ? 370 : 380
        );

        const panelY =
            HEIGHT / 2 - panelH / 2;

        const buttonW = Math.min(
            290,
            WIDTH - 70
        );

        const ulang = {
            x: WIDTH / 2 - buttonW / 2,
            y: panelY + panelH - 122,
            w: buttonW,
            h: 50
        };

        const keluar = {
            x: WIDTH / 2 - buttonW / 2,
            y: panelY + panelH - 62,
            w: buttonW,
            h: 50
        };

        if (pointInRect(x, y, ulang)) {
            resetGame();
        }

        else if (pointInRect(x, y, keluar)) {
            goMenu();
        }
    }
}

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();

    const x =
        (event.clientX - rect.left) *
        WIDTH / rect.width;

    const y =
        (event.clientY - rect.top) *
        HEIGHT / rect.height;

    handleCanvasClick(x, y);
});

canvas.addEventListener(
    "touchstart",
    event => {
        event.preventDefault();

        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();

        const x =
            (touch.clientX - rect.left) *
            WIDTH / rect.width;

        const y =
            (touch.clientY - rect.top) *
            HEIGHT / rect.height;

        handleCanvasClick(x, y);
    },
    { passive: false }
);

document.getElementById("up").addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
        changeDirection({ x: 0, y: -GRID });
    },
    { passive: false }
);

document.getElementById("down").addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
        changeDirection({ x: 0, y: GRID });
    },
    { passive: false }
);

document.getElementById("left").addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
        changeDirection({ x: -GRID, y: 0 });
    },
    { passive: false }
);

document.getElementById("right").addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
        changeDirection({ x: GRID, y: 0 });
    },
    { passive: false }
);

document.getElementById("up").addEventListener(
    "click",
    () => changeDirection({ x: 0, y: -GRID })
);

document.getElementById("down").addEventListener(
    "click",
    () => changeDirection({ x: 0, y: GRID })
);

document.getElementById("left").addEventListener(
    "click",
    () => changeDirection({ x: -GRID, y: 0 })
);

document.getElementById("right").addEventListener(
    "click",
    () => changeDirection({ x: GRID, y: 0 })
);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (halaman === "game") {
            goMenu();
        } else {
            exitGame();
        }

        return;
    }

    if (halaman === "login") {
        if (event.key === "Enter") {
            startGame();
        }

        return;
    }

    if (gameOver) {
        return;
    }

    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {
        changeDirection({
            x: 0,
            y: -GRID
        });
    }

    else if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {
        changeDirection({
            x: 0,
            y: GRID
        });
    }

    else if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        changeDirection({
            x: -GRID,
            y: 0
        });
    }

    else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        changeDirection({
            x: GRID,
            y: 0
        });
    }
});

resetGame();
requestAnimationFrame(gameLoop);
