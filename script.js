const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID = 24;

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

let W = 0;
let H = 0;
let dpr = 1;

let nama = "Pemain";
let halaman = "login";
let gameOver = false;

let snake = [];
let direction = "right";
let nextDirection = "right";

let foods = [];
let score = 0;
let speed = 5;

let lastTime = 0;
let moveTimer = 0;

let snakeColorIndex = 0;

const snakeColors = [
    {
        body: "#69be6e",
        dark: "#419150",
        light: "#b8e8b2"
    },
    {
        body: "#f591b4",
        dark: "#d74b7d",
        light: "#ffd0df"
    },
    {
        body: "#69b9eb",
        dark: "#408fc0",
        light: "#c5ebff"
    },
    {
        body: "#af7ddc",
        dark: "#8052aa",
        light: "#e2ccf4"
    },
    {
        body: "#ffd255",
        dark: "#e0a92d",
        light: "#fff0a8"
    }
];

const foodTypes = [
    "apple",
    "grapes",
    "banana",
    "strawberry",
    "yellow"
];

function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (halaman === "game") {
        ensureFoods();
    }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvas, 150);
});

resizeCanvas();

function roundRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function text(text, x, y, size, color = BLACK, align = "center", bold = false) {
    ctx.fillStyle = color;
    ctx.font = `${bold ? "bold " : ""}${size}px Arial`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

function button(x, y, w, h, label, color = PINK) {
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    roundRect(x + 3, y + 5, w, h, 18);
    ctx.fill();

    ctx.fillStyle = color;
    roundRect(x, y, w, h, 18);
    ctx.fill();

    text(label, x + w / 2, y + h / 2, Math.max(14, Math.min(22, w / 15)), WHITE, "center", true);
}

function drawCloud(x, y, scale = 1) {
    ctx.fillStyle = WHITE;

    ctx.beginPath();
    ctx.arc(x, y, 24 * scale, 0, Math.PI * 2);
    ctx.arc(x + 28 * scale, y - 13 * scale, 31 * scale, 0, Math.PI * 2);
    ctx.arc(x + 65 * scale, y, 24 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(
        x - 5 * scale,
        y,
        75 * scale,
        25 * scale
    );
}

function drawSun() {
    const x = W - 80;
    const y = 70;
    const r = Math.min(42, W * 0.09);

    ctx.fillStyle = YELLOW;

    for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(
            x + Math.cos(a) * (r + 8),
            y + Math.sin(a) * (r + 8)
        );
        ctx.lineTo(
            x + Math.cos(a) * (r + 20),
            y + Math.sin(a) * (r + 20)
        );
        ctx.lineWidth = 5;
        ctx.strokeStyle = YELLOW;
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawRainbow() {
    const cx = W * 0.48;
    const cy = Math.min(H * 0.42, 300);
    const r = Math.min(W * 0.38, 230);

    const colors = [
        "#f06a7a",
        "#f6b94a",
        "#f8e05f",
        "#70c96e",
        "#68b9e8",
        "#aa7bd1"
    ];

    for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 10;
        ctx.arc(
            cx,
            cy,
            r - i * 10,
            Math.PI,
            Math.PI * 2
        );
        ctx.stroke();
    }
}

function drawMountain(x, y, w, h, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.37, y + h * 0.28);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w * 0.63, y + h * 0.28);
    ctx.lineTo(x + w * 0.55, y + h * 0.23);
    ctx.lineTo(x + w / 2, y + h * 0.4);
    ctx.lineTo(x + w * 0.45, y + h * 0.23);
    ctx.closePath();
    ctx.fill();
}

function drawHill(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, Math.PI, Math.PI * 2);
    ctx.fill();
}

function drawFlower(x, y, size) {
    ctx.strokeStyle = DGREEN;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size * 2);
    ctx.stroke();

    ctx.fillStyle = LEAF;
    ctx.beginPath();
    ctx.ellipse(
        x - size * 0.45,
        y + size,
        size * 0.65,
        size * 0.3,
        -0.4,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
        x + size * 0.45,
        y + size * 1.3,
        size * 0.65,
        size * 0.3,
        0.4,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = PINK;
    for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        ctx.beginPath();
        ctx.arc(
            x + Math.cos(a) * size * 0.7,
            y + Math.sin(a) * size * 0.7,
            size * 0.45,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawBush(x, y, size) {
    ctx.fillStyle = DGREEN;

    ctx.beginPath();
    ctx.arc(x, y, size * 0.65, 0, Math.PI * 2);
    ctx.arc(x + size * 0.65, y - size * 0.15, size * 0.55, 0, Math.PI * 2);
    ctx.arc(x - size * 0.65, y - size * 0.1, size * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = LEAF_LIGHT;
    ctx.beginPath();
    ctx.arc(x - size * 0.25, y - size * 0.25, size * 0.2, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.3, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
}

function drawGameBackground() {
    const fieldTop = getFieldTop();

    ctx.fillStyle = SKY;
    ctx.fillRect(0, 0, W, fieldTop);

    ctx.fillStyle = LGREEN;
    ctx.fillRect(0, fieldTop, W, H - fieldTop);

    drawSun();

    drawCloud(W * 0.08, 95, 0.7);
    drawCloud(W * 0.43, 120, 0.55);

    if (W > 500) {
        drawCloud(W * 0.68, 75, 0.45);
    }

    drawRainbow();

    drawMountain(
        W * 0.02,
        fieldTop - 150,
        W * 0.35,
        150,
        "#91c8c9"
    );

    drawMountain(
        W * 0.38,
        fieldTop - 180,
        W * 0.38,
        180,
        "#7fb8c0"
    );

    drawMountain(
        W * 0.70,
        fieldTop - 135,
        W * 0.35,
        135,
        "#8dc5c6"
    );

    drawHill(
        W * 0.18,
        fieldTop,
        W * 0.35,
        65,
        GRASS
    );

    drawHill(
        W * 0.75,
        fieldTop,
        W * 0.4,
        75,
        GRASS
    );

    ctx.fillStyle = GRASS_LIGHT;

    const tileSize = 48;

    for (let y = fieldTop; y < H; y += tileSize) {
        for (let x = 0; x < W; x += tileSize) {
            if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
                ctx.fillRect(x, y, tileSize, tileSize);
            }
        }
    }

    drawBush(45, fieldTop + 30, 35);

    if (W > 500) {
        drawBush(W - 50, fieldTop + 35, 38);
    }

    drawFlower(
        Math.min(W * 0.16, 120),
        fieldTop + 55,
        8
    );

    if (W > 400) {
        drawFlower(
            W * 0.48,
            fieldTop + 50,
            7
        );
    }

    if (W > 600) {
        drawFlower(
            W * 0.82,
            fieldTop + 70,
            8
        );
    }
}

function getFieldTop() {
    return Math.min(
        H - 165,
        Math.max(230, H * 0.55)
    );
}

function drawHeader() {
    const small = Math.min(1, W / 700);

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(15, 15, 115 * small + 30, 48, 15);
    ctx.fill();

    text(
        "MENU",
        30 + 57 * small,
        39,
        Math.max(14, 18 * small),
        DPINK,
        "center",
        true
    );

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(
        W - 185,
        15,
        170,
        48,
        15
    );
    ctx.fill();

    text(
        nama,
        W - 100,
        39,
        16,
        BLACK,
        "center",
        true
    );

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(
        W / 2 - 80,
        15,
        75,
        48,
        15
    );
    ctx.fill();

    text(
        `⚡ ${speed.toFixed(1)}`,
        W / 2 - 42,
        39,
        15,
        DPINK,
        "center",
        true
    );

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(
        W / 2 + 5,
        15,
        75,
        48,
        15
    );
    ctx.fill();

    text(
        `★ ${score}`,
        W / 2 + 42,
        39,
        15,
        DGREEN,
        "center",
        true
    );
}

function drawFood(food) {
    const x = food.x + GRID / 2;
    const y = food.y + GRID / 2;
    const s = GRID / 24;

    ctx.save();
    ctx.translate(x, y);

    if (food.type === "apple") {
        ctx.fillStyle = RED;
        ctx.beginPath();
        ctx.arc(-5 * s, 3 * s, 9 * s, 0, Math.PI * 2);
        ctx.arc(5 * s, 3 * s, 9 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = BROWN;
        ctx.fillRect(-1 * s, -10 * s, 3 * s, 6 * s);

        ctx.fillStyle = LEAF;
        ctx.beginPath();
        ctx.ellipse(
            5 * s,
            -9 * s,
            6 * s,
            3 * s,
            -0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    if (food.type === "grapes") {
        ctx.fillStyle = PURPLE;

        const points = [
            [0, -7],
            [-6, -2],
            [6, -2],
            [-7, 5],
            [0, 5],
            [7, 5],
            [-4, 11],
            [4, 11]
        ];

        for (const p of points) {
            ctx.beginPath();
            ctx.arc(
                p[0] * s,
                p[1] * s,
                5 * s,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        ctx.fillStyle = LEAF;
        ctx.beginPath();
        ctx.ellipse(
            -3 * s,
            -10 * s,
            7 * s,
            3 * s,
            -0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    if (food.type === "banana") {
        ctx.strokeStyle = YELLOW;
        ctx.lineWidth = 8 * s;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.arc(
            0,
            0,
            11 * s,
            0.15,
            Math.PI * 0.95
        );
        ctx.stroke();

        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 2 * s;

        ctx.beginPath();
        ctx.arc(
            0,
            0,
            11 * s,
            0.15,
            Math.PI * 0.95
        );
        ctx.stroke();
    }

    if (food.type === "strawberry") {
        ctx.fillStyle = RED;

        ctx.beginPath();
        ctx.moveTo(0, 11 * s);
        ctx.bezierCurveTo(
            -15 * s,
            2 * s,
            -10 * s,
            -9 * s,
            0,
            -4 * s
        );
        ctx.bezierCurveTo(
            10 * s,
            -9 * s,
            15 * s,
            2 * s,
            0,
            11 * s
        );
        ctx.fill();

        ctx.fillStyle = GREEN;
        ctx.beginPath();
        ctx.moveTo(0, -4 * s);
        ctx.lineTo(-8 * s, -10 * s);
        ctx.lineTo(-3 * s, -10 * s);
        ctx.lineTo(0, -15 * s);
        ctx.lineTo(3 * s, -10 * s);
        ctx.lineTo(8 * s, -10 * s);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = YELLOW;

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
                (i - 2) * 4 * s,
                1 * s + Math.abs(i - 2) * 2 * s,
                1.2 * s,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    if (food.type === "yellow") {
        ctx.fillStyle = ORANGE;
        ctx.beginPath();
        ctx.arc(0, 0, 10 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = YELLOW;
        ctx.beginPath();
        ctx.arc(-3 * s, -3 * s, 6 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = LEAF;
        ctx.beginPath();
        ctx.ellipse(
            7 * s,
            -9 * s,
            6 * s,
            3 * s,
            -0.5,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}

function drawSnake() {
    const colors = snakeColors[snakeColorIndex];

    for (let i = snake.length - 1; i >= 0; i--) {
        const part = snake[i];

        const x = part.x + GRID / 2;
        const y = part.y + GRID / 2;

        ctx.fillStyle = i === 0 ? colors.body : colors.light;

        ctx.beginPath();
        ctx.arc(
            x,
            y,
            GRID / 2 + 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (i !== 0) {
            ctx.fillStyle = colors.body;
            ctx.beginPath();
            ctx.arc(
                x - 2,
                y - 2,
                5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    if (snake.length > 0) {
        drawSnakeFace(snake[0]);
    }
}

function drawSnakeFace(head) {
    const x = head.x + GRID / 2;
    const y = head.y + GRID / 2;

    let eye1 = [x - 5, y - 6];
    let eye2 = [x + 5, y - 6];

    if (direction === "left") {
        eye1 = [x - 6, y - 5];
        eye2 = [x - 6, y + 5];
    }

    if (direction === "right") {
        eye1 = [x + 6, y - 5];
        eye2 = [x + 6, y + 5];
    }

    if (direction === "down") {
        eye1 = [x - 5, y + 6];
        eye2 = [x + 5, y + 6];
    }

    ctx.fillStyle = WHITE;

    ctx.beginPath();
    ctx.arc(eye1[0], eye1[1], 4, 0, Math.PI * 2);
    ctx.arc(eye2[0], eye2[1], 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = BLACK;

    ctx.beginPath();
    ctx.arc(eye1[0], eye1[1], 2, 0, Math.PI * 2);
    ctx.arc(eye2[0], eye2[1], 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = DPINK;
    ctx.lineWidth = 2;

    ctx.beginPath();

    if (direction === "right") {
        ctx.moveTo(x + 10, y);
        ctx.lineTo(x + 17, y);
    } else if (direction === "left") {
        ctx.moveTo(x - 10, y);
        ctx.lineTo(x - 17, y);
    } else if (direction === "up") {
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y - 17);
    } else {
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x, y + 17);
    }

    ctx.stroke();
}

function getControlSize() {
    if (W < 500) {
        return Math.max(56, Math.min(72, W * 0.17));
    }

    return Math.max(65, Math.min(82, W * 0.065));
}

function getControls() {
    const size = getControlSize();

    const gap = Math.max(7, size * 0.13);

    const centerX = W - size * 1.45;
    const centerY = H - size * 1.45;

    return {
        up: {
            x: centerX - size / 2,
            y: centerY - size - gap,
            w: size,
            h: size
        },
        left: {
            x: centerX - size - gap,
            y: centerY,
            w: size,
            h: size
        },
        down: {
            x: centerX - size / 2,
            y: centerY,
            w: size,
            h: size
        },
        right: {
            x: centerX + gap,
            y: centerY,
            w: size,
            h: size
        }
    };
}

function drawControlBox(box, symbol) {
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    roundRect(box.x, box.y, box.w, box.h, 15);
    ctx.fill();

    ctx.strokeStyle = "rgba(65,60,70,0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    text(
        symbol,
        box.x + box.w / 2,
        box.y + box.h / 2,
        Math.max(22, box.w * 0.4),
        DPINK,
        "center",
        true
    );
}

function drawControls() {
    const c = getControls();

    drawControlBox(c.up, "▲");
    drawControlBox(c.left, "◀");
    drawControlBox(c.down, "▼");
    drawControlBox(c.right, "▶");
}

function drawGame() {
    drawGameBackground();
    drawHeader();

    for (const food of foods) {
        drawFood(food);
    }

    drawSnake();
    drawControls();

    if (gameOver) {
        drawGameOver();
    }
}

function drawLogin() {
    ctx.fillStyle = SKY;
    ctx.fillRect(0, 0, W, H * 0.58);

    ctx.fillStyle = LIGHT;
    ctx.fillRect(0, H * 0.58, W, H * 0.42);

    drawCloud(W * 0.10, H * 0.13, 0.7);
    drawCloud(W * 0.75, H * 0.18, 0.55);

    drawSun();

    drawHill(
        W * 0.18,
        H * 0.63,
        W * 0.45,
        H * 0.12,
        GRASS
    );

    drawHill(
        W * 0.82,
        H * 0.65,
        W * 0.45,
        H * 0.12,
        GRASS_LIGHT
    );

    text(
        "SNAKE",
        W / 2,
        H * 0.16,
        Math.max(36, Math.min(72, W * 0.14)),
        DPINK,
        "center",
        true
    );

    text(
        "Snake of Jura",
        W / 2,
        H * 0.23,
        Math.max(18, Math.min(30, W * 0.06)),
        BLACK,
        "center",
        true
    );

    drawCuteSnake(
        W / 2,
        H * 0.38
    );

    text(
        "Ayo bantu ular mencari makanan!",
        W / 2,
        H * 0.49,
        Math.max(14, Math.min(21, W * 0.045)),
        BLACK,
        "center",
        false
    );

    const bw = Math.min(310, W - 50);
    const bh = 58;

    button(
        W / 2 - bw / 2,
        H * 0.57,
        bw,
        bh,
        "MULAI GAME",
        PINK
    );

    button(
        W / 2 - bw / 2,
        H * 0.57 + 78,
        bw,
        bh,
        "KELUAR",
        DPINK
    );

    drawFlower(
        W * 0.15,
        H * 0.77,
        7
    );

    drawFlower(
        W * 0.85,
        H * 0.79,
        7
    );
}

function drawCuteSnake(cx, cy) {
    const s = Math.min(1.2, Math.max(0.75, W / 500));

    ctx.fillStyle = GREEN;

    ctx.beginPath();
    ctx.arc(cx, cy, 42 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = DGREEN;
    ctx.lineWidth = 4 * s;
    ctx.stroke();

    ctx.fillStyle = WHITE;

    ctx.beginPath();
    ctx.arc(cx - 15 * s, cy - 8 * s, 9 * s, 0, Math.PI * 2);
    ctx.arc(cx + 15 * s, cy - 8 * s, 9 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = BLACK;

    ctx.beginPath();
    ctx.arc(cx - 15 * s, cy - 8 * s, 4 * s, 0, Math.PI * 2);
    ctx.arc(cx + 15 * s, cy - 8 * s, 4 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = DPINK;
    ctx.lineWidth = 3 * s;

    ctx.beginPath();
    ctx.arc(
        cx,
        cy + 8 * s,
        13 * s,
        0.15,
        Math.PI - 0.15
    );
    ctx.stroke();

    ctx.fillStyle = PINK;
    ctx.beginPath();
    ctx.arc(cx - 32 * s, cy + 18 * s, 7 * s, 0, Math.PI * 2);
    ctx.arc(cx + 32 * s, cy + 18 * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();
}

function drawGameOver() {
    ctx.fillStyle = "rgba(40,35,45,0.55)";
    ctx.fillRect(0, 0, W, H);

    const panelW = Math.min(420, W - 30);
    const panelH = Math.min(410, H - 30);

    const px = W / 2 - panelW / 2;
    const py = H / 2 - panelH / 2;

    ctx.fillStyle = LIGHT;
    roundRect(px, py, panelW, panelH, 25);
    ctx.fill();

    text(
        "GAME OVER",
        W / 2,
        py + 55,
        Math.max(27, Math.min(42, panelW * 0.10)),
        DPINK,
        "center",
        true
    );

    text(
        `Skor: ${score}`,
        W / 2,
        py + 105,
        20,
        BLACK,
        "center",
        true
    );

    text(
        `Speed: ${speed.toFixed(1)}`,
        W / 2,
        py + 138,
        17,
        DGREEN,
        "center",
        true
    );

    const bw = Math.min(300, panelW - 50);
    const bh = 55;

    button(
        W / 2 - bw / 2,
        py + 175,
        bw,
        bh,
        "MAIN LAGI",
        GREEN
    );

    button(
        W / 2 - bw / 2,
        py + 245,
        bw,
        bh,
        "KEMBALI KE MENU",
        DPINK
    );
}

function resetGame() {
    score = 0;
    speed = 5;
    gameOver = false;
    direction = "right";
    nextDirection = "right";
    snakeColorIndex = 0;
    moveTimer = 0;

    const startX = Math.floor(
        (W / 2 - GRID / 2) / GRID
    ) * GRID;

    const startY = Math.floor(
        (H / 2 + 50) / GRID
    ) * GRID;

    snake = [
        { x: startX, y: startY },
        { x: startX - GRID, y: startY },
        { x: startX - GRID * 2, y: startY }
    ];

    foods = [];
    ensureFoods();
}

function randomFoodPosition() {
    const top = Math.floor(
        (getFieldTop() + 30) / GRID
    ) * GRID;

    const bottom = Math.floor(
        (H - 190) / GRID
    ) * GRID;

    const maxX = Math.floor(
        (W - GRID) / GRID
    ) * GRID;

    const candidates = [];

    if (bottom <= top) {
        return null;
    }

    for (let y = top; y <= bottom; y += GRID) {
        for (let x = 0; x <= maxX; x += GRID) {
            const blockedBySnake = snake.some(
                part => part.x === x && part.y === y
            );

            const blockedByFood = foods.some(
                food => food.x === x && food.y === y
            );

            if (!blockedBySnake && !blockedByFood) {
                candidates.push({ x, y });
            }
        }
    }

    if (candidates.length === 0) {
        return null;
    }

    return candidates[
        Math.floor(Math.random() * candidates.length)
    ];
}

function ensureFoods() {
    while (foods.length < 5) {
        const position = randomFoodPosition();

        if (!position) {
            break;
        }

        foods.push({
            x: position.x,
            y: position.y,
            type: foodTypes[
                Math.floor(Math.random() * foodTypes.length)
            ]
        });
    }
}

function changeDirection(newDirection) {
    if (gameOver) {
        return;
    }

    if (newDirection === "up" && direction !== "down") {
        nextDirection = "up";
    }

    if (newDirection === "down" && direction !== "up") {
        nextDirection = "down";
    }

    if (newDirection === "left" && direction !== "right") {
        nextDirection = "left";
    }

    if (newDirection === "right" && direction !== "left") {
        nextDirection = "right";
    }
}

function moveSnake() {
    direction = nextDirection;

    const head = snake[0];

    const newHead = {
        x: head.x,
        y: head.y
    };

    if (direction === "up") {
        newHead.y -= GRID;
    }

    if (direction === "down") {
        newHead.y += GRID;
    }

    if (direction === "left") {
        newHead.x -= GRID;
    }

    if (direction === "right") {
        newHead.x += GRID;
    }

    if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x + GRID > W ||
        newHead.y + GRID > H
    ) {
        gameOver = true;
        return;
    }

    const hitSelf = snake.some(
        part =>
            part.x === newHead.x &&
            part.y === newHead.y
    );

    if (hitSelf) {
        gameOver = true;
        return;
    }

    snake.unshift(newHead);

    let ate = false;

    for (let i = foods.length - 1; i >= 0; i--) {
        if (
            foods[i].x === newHead.x &&
            foods[i].y === newHead.y
        ) {
            foods.splice(i, 1);

            score++;

            speed = Math.min(
                10,
                5 + score * 0.3
            );

            snakeColorIndex =
                (snakeColorIndex + 1) %
                snakeColors.length;

            ate = true;
            break;
        }
    }

    if (!ate) {
        snake.pop();
    }

    ensureFoods();
}

function getLoginButtons() {
    const bw = Math.min(310, W - 50);
    const bh = 58;

    return {
        start: {
            x: W / 2 - bw / 2,
            y: H * 0.57,
            w: bw,
            h: bh
        },
        exit: {
            x: W / 2 - bw / 2,
            y: H * 0.57 + 78,
            w: bw,
            h: bh
        }
    };
}

function getGameOverButtons() {
    const panelW = Math.min(420, W - 30);
    const panelH = Math.min(410, H - 30);

    const py = H / 2 - panelH / 2;
    const bw = Math.min(300, panelW - 50);
    const bh = 55;

    return {
        again: {
            x: W / 2 - bw / 2,
            y: py + 175,
            w: bw,
            h: bh
        },
        menu: {
            x: W / 2 - bw / 2,
            y: py + 245,
            w: bw,
            h: bh
        }
    };
}

function pointInside(x, y, rect) {
    return (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
    );
}

function handlePointer(x, y) {
    if (halaman === "login") {
        const buttons = getLoginButtons();

        if (pointInside(x, y, buttons.start)) {
            halaman = "game";
            resetGame();
            return;
        }

        if (pointInside(x, y, buttons.exit)) {
            window.close();

            setTimeout(() => {
                if (!document.hidden) {
                    text(
                        "Silakan tutup halaman ini.",
                        W / 2,
                        H * 0.9,
                        16,
                        BLACK
                    );
                }
            }, 100);

            return;
        }
    }

    if (halaman === "game" && !gameOver) {
        const controls = getControls();

        if (pointInside(x, y, controls.up)) {
            changeDirection("up");
        } else if (pointInside(x, y, controls.down)) {
            changeDirection("down");
        } else if (pointInside(x, y, controls.left)) {
            changeDirection("left");
        } else if (pointInside(x, y, controls.right)) {
            changeDirection("right");
        } else if (
            x <= 145 &&
            y <= 75
        ) {
            halaman = "login";
        }
    }

    if (halaman === "game" && gameOver) {
        const buttons = getGameOverButtons();

        if (pointInside(x, y, buttons.again)) {
            resetGame();
        } else if (pointInside(x, y, buttons.menu)) {
            halaman = "login";
            gameOver = false;
        }
    }
}

canvas.addEventListener(
    "pointerdown",
    event => {
        event.preventDefault();

        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        handlePointer(x, y);
    },
    { passive: false }
);

document.addEventListener(
    "keydown",
    event => {
        const key = event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) {
            event.preventDefault();
            changeDirection("up");
        }

        if (
            key === "arrowdown" ||
            key === "s"
        ) {
            event.preventDefault();
            changeDirection("down");
        }

        if (
            key === "arrowleft" ||
            key === "a"
        ) {
            event.preventDefault();
            changeDirection("left");
        }

        if (
            key === "arrowright" ||
            key === "d"
        ) {
            event.preventDefault();
            changeDirection("right");
        }

        if (
            key === "enter" &&
            halaman === "login"
        ) {
            halaman = "game";
            resetGame();
        }

        if (
            key === "escape" &&
            halaman === "login"
        ) {
            window.close();
        }

        if (
            key === "escape" &&
            halaman === "game"
        ) {
            halaman = "login";
            gameOver = false;
        }

        if (
            key === "r" &&
            gameOver
        ) {
            resetGame();
        }
    }
);

function gameLoop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (halaman === "game" && !gameOver) {
        moveTimer += delta;

        const interval = Math.max(
            75,
            1000 / speed
        );

        if (moveTimer >= interval) {
            moveTimer = 0;
            moveSnake();
        }
    }

    ctx.clearRect(0, 0, W, H);

    if (halaman === "login") {
        drawLogin();
    } else {
        drawGame();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
