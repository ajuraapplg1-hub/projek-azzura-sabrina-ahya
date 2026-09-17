const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const C = {
    white:"#ffffff", black:"#413c46", pink:"#f591b4", dpink:"#d74b7d",
    light:"#ffeff6", green:"#69be6e", dgreen:"#419150", lgreen:"#e1f7dc",
    blue:"#69b9eb", sky:"#96dcf8", purple:"#af7ddc", yellow:"#ffd255",
    orange:"#fa9b41", red:"#eb4b5a", cream:"#fff8dc", grass:"#afe17d",
    grassLight:"#c3eb91", brown:"#7d5537", leaf:"#5faf5f", leafLight:"#87c873"
};

let W = 0, H = 0, mobile = false;
let page = "login";
let gameOver = false;
let snake = [];
let foods = [];
let direction = {x:1,y:0};
let score = 0;
let speed = 5;
let colorIndex = 0;
let moveTimer = 0;
let lastTime = 0;
const GRID = 24;

const snakeColors = [
    ["#46a0e1","#69bef0","#9bd7fa"],
    ["#4bb464","#73d27d","#a5ebaA"],
    ["#a064d7","#be87eb","#d7aff5"],
    ["#f09637","#fab455","#ffd77d"],
    ["#e14664","#f06e82","#faa0af"]
];

function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    mobile = W < 700;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}

window.addEventListener("resize", resize);
resize();

function roundedRect(x,y,w,h,r,fill,stroke=null,lw=1) {
    ctx.beginPath();
    ctx.roundRect(x,y,w,h,r);
    if (fill) {
        ctx.fillStyle=fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle=stroke;
        ctx.lineWidth=lw;
        ctx.stroke();
    }
}

function text(t,x,y,size,color,align="center",weight="bold") {
    ctx.font = `${weight} ${size}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(t,x,y);
}

function heart(x,y,s,color=C.pink) {
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x-s/2,y,s/2,0,Math.PI*2);
    ctx.arc(x+s/2,y,s/2,0,Math.PI*2);
    ctx.moveTo(x-s,y);
    ctx.lineTo(x+s,y);
    ctx.lineTo(x,y+s);
    ctx.closePath();
    ctx.fill();
}

function cloud(x,y,s) {
    ctx.fillStyle="#e1f3fa";
    ctx.beginPath();
    ctx.arc(x,y+6,s,0,Math.PI*2);
    ctx.arc(x+s,y-s/2+6,s+8,0,Math.PI*2);
    ctx.arc(x+s*2,y+6,s,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.white;
    ctx.beginPath();
    ctx.arc(x,y,s,0,Math.PI*2);
    ctx.arc(x+s,y-s/2,s+8,0,Math.PI*2);
    ctx.arc(x+s*2,y,s,0,Math.PI*2);
    ctx.rect(x,y,s*2,s);
    ctx.fill();
}

function butterfly(x,y,s=1) {
    ctx.fillStyle=C.pink;
    ctx.beginPath();
    ctx.ellipse(x-16*s,y,16*s,20*s,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.purple;
    ctx.beginPath();
    ctx.ellipse(x+16*s,y,16*s,20*s,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.yellow;
    ctx.beginPath();
    ctx.ellipse(x-11*s,y-18*s,11*s,14*s,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.orange;
    ctx.beginPath();
    ctx.ellipse(x+11*s,y-18*s,11*s,14*s,0,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.black;
    ctx.beginPath();
    ctx.ellipse(x,y,5*s,16*s,0,0,Math.PI*2);
    ctx.fill();
}

function sun(x,y,r) {
    ctx.strokeStyle=C.yellow;
    ctx.lineWidth=7;

    for(let a=0;a<Math.PI*2;a+=Math.PI/4) {
        ctx.beginPath();
        ctx.moveTo(
            x+Math.cos(a)*(r+12),
            y+Math.sin(a)*(r+12)
        );
        ctx.lineTo(
            x+Math.cos(a)*(r+30),
            y+Math.sin(a)*(r+30)
        );
        ctx.stroke();
    }

    ctx.fillStyle="#ffcd41";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#ffe169";
    ctx.beginPath();
    ctx.arc(x-7,y-7,Math.max(1,r-11),0,Math.PI*2);
    ctx.fill();
}

function rainbow(x,y,r) {
    const colors=[
        "#f064a0",
        "#ffa05a",
        "#ffd750",
        "#69c37d",
        "#50afe1",
        "#966ed7"
    ];

    const thick=13;

    colors.forEach((co,i)=>{
        ctx.strokeStyle=co;
        ctx.lineWidth=thick;
        ctx.beginPath();

        const rr=r-i*thick;

        for(let j=0;j<=100;j++){
            const a=Math.PI*j/100;
            const px=x+Math.cos(a)*rr;
            const py=y-Math.sin(a)*rr;

            if(j===0) {
                ctx.moveTo(px,py);
            } else {
                ctx.lineTo(px,py);
            }
        }

        ctx.stroke();
    });
}

function mountain(x,base,w,h,color) {
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(x-w/2,base);
    ctx.lineTo(x-w/4,base-h/2);
    ctx.lineTo(x,base-h);
    ctx.lineTo(x+w/4,base-h/2);
    ctx.lineTo(x+w/2,base);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle=`rgb(
        ${Math.max(0,parseInt(color.slice(1,3),16)-18)},
        ${Math.max(0,parseInt(color.slice(3,5),16)-18)},
        ${Math.max(0,parseInt(color.slice(5,7),16)-18)}
    )`;

    ctx.beginPath();
    ctx.moveTo(x,base-h);
    ctx.lineTo(x-w/2,base);
    ctx.lineTo(x,base);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle=C.white;
    ctx.beginPath();
    ctx.moveTo(x,base-h);
    ctx.lineTo(x-w/10,base-h/2+8);
    ctx.lineTo(x-w/28,base-h/2-5);
    ctx.lineTo(x+w/14,base-h/2+12);
    ctx.lineTo(x+w/9,base-h/3);
    ctx.closePath();
    ctx.fill();
}

function bush(x,y,w,h,color) {
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.ellipse(
        x+w/2,
        y+h*0.62,
        w/2,
        h*0.38,
        0,
        0,
        Math.PI*2
    );
    ctx.fill();

    [0.25,0.5,0.75].forEach((p,i)=>{
        ctx.beginPath();
        ctx.arc(
            x+w*p,
            y+h*(i===1?.2:.33),
            h/2,
            0,
            Math.PI*2
        );
        ctx.fill();
    });
}

function flower(x,y,r,color) {
    ctx.fillStyle=color;

    [[0,-r],[-r,0],[r,0],[0,r]].forEach(([dx,dy])=>{
        ctx.beginPath();
        ctx.arc(x+dx,y+dy,r,0,Math.PI*2);
        ctx.fill();
    });

    ctx.fillStyle=C.yellow;
    ctx.beginPath();
    ctx.arc(x,y,Math.max(2,r/2),0,Math.PI*2);
    ctx.fill();
}

function grass(x,y,s=1) {
    ctx.strokeStyle=C.dgreen;
    ctx.lineWidth=Math.max(2,3*s);
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x-10*s,y-28*s);
    ctx.stroke();

    ctx.strokeStyle=C.green;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x,y-33*s);
    ctx.stroke();

    ctx.strokeStyle=C.dgreen;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+10*s,y-26*s);
    ctx.stroke();
}

function loginBackground() {
    const gs=H*.55;

    ctx.fillStyle=C.sky;
    ctx.fillRect(0,0,W,gs);

    ctx.fillStyle=C.lgreen;
    ctx.fillRect(0,gs,W,H-gs);

    cloud(55,90,28);
    cloud(W-235,105,25);
    cloud(W/2+205,58,17);
    cloud(W/2-300,165,15);

    heart(52,55,22);
    heart(W-52,62,22);

    for(let i=0;i<10;i++) {
        grass(
            20+i*35,
            H-95-(i%4)*22,
            .85
        );
    }

    for(let i=0;i<10;i++) {
        grass(
            W-20-i*35,
            H-95-(i%4)*22,
            .85
        );
    }

    const flowers=[
        [45,H-125,8,C.pink],
        [92,H-78,7,C.purple],
        [140,H-118,8,C.orange],
        [188,H-68,7,C.pink],
        [235,H-110,8,C.purple],
        [282,H-72,7,C.orange],
        [325,H-120,7,C.pink]
    ];

    flowers.forEach(f=>flower(...f));
    flowers.forEach(([x,y,r,c])=>flower(W-x,y,r,c));

    butterfly(100,H-170,.85);
    butterfly(230,H-195,.65);
    butterfly(W-100,H-170,.85);
    butterfly(W-230,H-195,.65);
}

function cuteSnake() {
    const x=W/2;
    const y=H/2-65;

    ctx.fillStyle="#379155";
    ctx.beginPath();
    ctx.arc(x,y+7,38,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.green;
    ctx.beginPath();
    ctx.arc(x,y,35,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.blue;
    ctx.beginPath();
    ctx.arc(x-50,y+20,28,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=C.purple;
    ctx.beginPath();
    ctx.arc(x-92,y+32,24,0,Math.PI*2);
    ctx.fill();

    [-11,11].forEach(ex=>{
        ctx.fillStyle=C.white;
        ctx.beginPath();
        ctx.arc(x+ex,y-12,9,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle=C.black;
        ctx.beginPath();
        ctx.arc(x+ex,y-12,4,0,Math.PI*2);
        ctx.fill();
    });

    ctx.fillStyle=C.pink;
    ctx.beginPath();
    ctx.arc(x-21,y+8,5,0,Math.PI*2);
    ctx.arc(x+21,y+8,5,0,Math.PI*2);
    ctx.fill();

    ctx.strokeStyle=C.black;
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.arc(x,y+2,13,0,Math.PI);
    ctx.stroke();
}

function gameBackground() {
    ctx.fillStyle=C.sky;
    ctx.fillRect(0,0,W,H);

    sun(W-120,105,55);

    cloud(30,105,35);
    cloud(W/2-120,65,20);
    cloud(W-430,120,22);

    rainbow(W/2,395,225);

    mountain(
        W/2-250,
        430,
        530,
        270,
        "#4baacd"
    );

    mountain(
        W/2+250,
        430,
        530,
        270,
        "#419bc3"
    );

    const fieldTop=Math.min(
        H-150,
        Math.max(495,H/2)
    );

    ctx.fillStyle=C.grass;
    ctx.fillRect(
        0,
        fieldTop,
        W,
        H-fieldTop
    );

    const tile=80;

    for(
        let y=fieldTop,row=0;
        y<H;
        y+=tile,row++
    )
        for(
            let x=0,col=0;
            x<W;
            x+=tile,col++
        )
            if((row+col)%2===0){
                ctx.fillStyle=C.grassLight;
                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }

    bush(
        -80,
        H-145,
        370,
        145,
        "#2d9150"
    );

    bush(
        170,
        H-120,
        300,
        120,
        "#4baa5a"
    );

    bush(
        W-470,
        H-120,
        300,
        120,
        "#4baa5a"
    );

    bush(
        W-290,
        H-145,
        370,
        145,
        "#2d9150"
    );

    flower(85,H-90,24,C.pink);
    flower(220,H-62,18,C.purple);
    flower(W-85,H-90,24,C.pink);
    flower(W-220,H-62,18,C.purple);
}

function foodArea() {
    let top=Math.min(
        H-220,
        Math.max(525,H/2+20)
    );

    let bottom=H-170;

    if(bottom<=top){
        top=Math.max(100,H/2);
        bottom=Math.max(
            top+GRID,
            H-100
        );
    }

    return {top,bottom};
}

function newFood() {
    const a=foodArea();

    const minY=Math.max(
        1,
        Math.floor(a.top/GRID)
    );

    const maxY=Math.max(
        minY+1,
        Math.floor(a.bottom/GRID)
    );

    const maxX=Math.max(
        4,
        Math.floor(W/GRID)-2
    );

    return {
        x:Math.floor(
            1+Math.random()*(maxX-1)
        )*GRID,

        y:Math.floor(
            minY+Math.random()*(maxY-minY)
        )*GRID,

        type:Math.floor(Math.random()*5)
    };
}

function foodValid(f) {
    if(
        snake.some(
            s=>s.x===f.x&&s.y===f.y
        )
    )
        return false;

    if(
        foods.some(
            a=>a.x===f.x&&a.y===f.y
        )
    )
        return false;

    return true;
}

function createFoods() {
    foods=[];
    let tries=0;

    while(
        foods.length<5&&
        tries<1000
    ){
        const f=newFood();

        if(foodValid(f))
            foods.push(f);

        tries++;
    }
}

function addFood() {
    let tries=0;

    while(
        foods.length<5&&
        tries<500
    ){
        const f=newFood();

        if(foodValid(f))
            foods.push(f);

        tries++;
    }
}

function resetGame() {
    let y=Math.floor(
        (H/2+70)/GRID
    )*GRID;

    snake=[
        {
            x:Math.floor(W/2/GRID)*GRID,
            y
        },
        {
            x:Math.floor(W/2/GRID)*GRID-GRID,
            y
        },
        {
            x:Math.floor(W/2/GRID)*GRID-GRID*2,
            y
        }
    ];

    direction={x:1,y:0};
    score=0;
    speed=5;
    colorIndex=0;
    moveTimer=0;
    gameOver=false;

    createFoods();
    addFood();
}

function drawFood(f) {
    const x=f.x+GRID/2;
    const y=f.y+GRID/2;

    ctx.lineWidth=3;

    if(f.type===0){
        ctx.fillStyle=C.red;
        ctx.beginPath();
        ctx.arc(x,y+2,9,0,Math.PI*2);
        ctx.fill();

        ctx.strokeStyle=C.brown;
        ctx.beginPath();
        ctx.moveTo(x,y-8);
        ctx.lineTo(x+2,y-14);
        ctx.stroke();

        ctx.fillStyle=C.green;
        ctx.beginPath();
        ctx.ellipse(
            x+5,
            y-12,
            5,
            2.5,
            0,
            0,
            Math.PI*2
        );
        ctx.fill();

    } else if(f.type===1){

        ctx.fillStyle=C.purple;

        [
            [-6,3],
            [0,5],
            [6,3],
            [-3,-3],
            [3,-3],
            [0,-8]
        ].forEach(([dx,dy])=>{
            ctx.beginPath();
            ctx.arc(
                x+dx,
                y+dy,
                4,
                0,
                Math.PI*2
            );
            ctx.fill();
        });

        ctx.fillStyle=C.green;
        ctx.beginPath();
        ctx.ellipse(
            x+7,
            y-11,
            5,
            2.5,
            0,
            0,
            Math.PI*2
        );
        ctx.fill();

    } else if(f.type===2){

        ctx.strokeStyle=C.yellow;
        ctx.lineWidth=7;
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            11,
            .3,
            3
        );
        ctx.stroke();

        ctx.strokeStyle=C.orange;
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            8,
            .4,
            2.8
        );
        ctx.stroke();

    } else if(f.type===3){

        ctx.fillStyle=C.red;
        ctx.beginPath();
        ctx.moveTo(x,y+10);
        ctx.lineTo(x-9,y-2);
        ctx.quadraticCurveTo(
            x-6,
            y-10,
            x,
            y-8
        );
        ctx.quadraticCurveTo(
            x+6,
            y-10,
            x+9,
            y-2
        );
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle=C.green;
        ctx.beginPath();
        ctx.moveTo(x-8,y-8);
        ctx.lineTo(x,y-14);
        ctx.lineTo(x+8,y-8);
        ctx.lineTo(x+3,y-5);
        ctx.lineTo(x-3,y-5);
        ctx.closePath();
        ctx.fill();

    } else {

        ctx.fillStyle=C.yellow;
        ctx.beginPath();
        ctx.ellipse(
            x,
            y,
            8,
            9,
            0,
            0,
            Math.PI*2
        );
        ctx.fill();

        ctx.strokeStyle=C.orange;
        ctx.lineWidth=1;

        [
            [-7,-3],
            [7,-3],
            [-7,3],
            [7,3]
        ].forEach(([dx,dy])=>{
            ctx.beginPath();
            ctx.moveTo(
                x+dx,
                y+dy
            );
            ctx.lineTo(
                x-dx,
                y-dy
            );
            ctx.stroke();
        });

        ctx.fillStyle=C.green;
        ctx.beginPath();
        ctx.moveTo(x-6,y-7);
        ctx.lineTo(x-4,y-15);
        ctx.lineTo(x,y-8);
        ctx.lineTo(x+4,y-15);
        ctx.lineTo(x+6,y-7);
        ctx.closePath();
        ctx.fill();
    }
}

function drawControls() {
    const size=mobile
        ?Math.max(58,Math.min(76,W/6))
        :78;

    const gap=mobile
        ?Math.max(6,Math.min(10,W/70))
        :10;

    const cx=mobile
        ?W-size*2.5
        :W-135;

    const cy=mobile
        ?H-size*1.25
        :H-110;

    const btns=[
        {
            x:cx-size/2,
            y:cy-size*2-gap,
            s:"↑"
        },
        {
            x:cx-size-gap-size/2,
            y:cy-size,
            s:"←"
        },
        {
            x:cx-size/2,
            y:cy-size,
            s:"↓"
        },
        {
            x:cx+gap+size/2,
            y:cy-size,
            s:"→"
        }
    ];

    btns.forEach(b=>{
        roundedRect(
            b.x,
            b.y,
            size,
            size,
            18,
            C.dpink
        );

        roundedRect(
            b.x,
            b.y-5,
            size,
            size,
            18,
            C.pink,
            C.white,
            3
        );

        text(
            b.s,
            b.x+size/2,
            b.y+size/2-5,
            mobile?28:32,
            C.white
        );
    });

    return btns;
}

function controlDirection(px,py) {
    const size=mobile
        ?Math.max(58,Math.min(76,W/6))
        :78;

    const gap=mobile
        ?Math.max(6,Math.min(10,W/70))
        :10;

    const cx=mobile
        ?W-size*2.5
        :W-135;

    const cy=mobile
        ?H-size*1.25
        :H-110;

    const rects=[
        {
            x:cx-size/2,
            y:cy-size*2-gap,
            w:size,
            h:size,
            d:{x:0,y:-1}
        },
        {
            x:cx-size-gap-size/2,
            y:cy-size,
            w:size,
            h:size,
            d:{x:-1,y:0}
        },
        {
            x:cx-size/2,
            y:cy-size,
            w:size,
            h:size,
            d:{x:0,y:1}
        },
        {
            x:cx+gap+size/2,
            y:cy-size,
            w:size,
            h:size,
            d:{x:1,y:0}
        }
    ];

    for(const r of rects)
        if(
            px>=r.x&&
            px<=r.x+r.w&&
            py>=r.y&&
            py<=r.y+r.h
        )
            return r.d;

    return null;
}

function changeDirection(d) {
    if(!d)
        return;

    if(
        d.x===-direction.x&&
        d.y===-direction.y
    )
        return;

    direction=d;
}

function moveSnake() {
    const head={
        x:snake[0].x+direction.x*GRID,
        y:snake[0].y+direction.y*GRID
    };

    let eaten=-1;

    foods.forEach((f,i)=>{
        if(
            head.x===f.x&&
            head.y===f.y
        )
            eaten=i;
    });

    snake.unshift(head);

    if(eaten>=0){
        foods.splice(eaten,1);

        score++;

        colorIndex=
            (colorIndex+1)%
            snakeColors.length;

        speed=Math.min(
            5+score*.3,
            10
        );

        addFood();

    } else {
        snake.pop();
    }

    if(
        head.x<0||
        head.x+GRID>W||
        head.y<0||
        head.y+GRID>H
    ){
        gameOver=true;
        return;
    }

    for(
        let i=1;
        i<snake.length;
        i++
    )
        if(
            head.x===snake[i].x&&
            head.y===snake[i].y
        ){
            gameOver=true;
            return;
        }

    if(!gameOver&&foods.length<5)
        addFood();
}

function drawSnake() {
    const colors=snakeColors[colorIndex];

    snake.forEach((s,i)=>{
        ctx.fillStyle=
            i===0
                ?colors[0]
                :(i%2===0
                    ?colors[1]
                    :colors[2]);

        ctx.beginPath();
        ctx.arc(
            s.x+GRID/2,
            s.y+GRID/2,
            GRID/2+3,
            0,
            Math.PI*2
        );
        ctx.fill();

        ctx.strokeStyle=C.white;
        ctx.lineWidth=2;
        ctx.stroke();
    });

    const h=snake[0];
    const ex=[];

    if(direction.x>0){
        ex.push(
            [h.x+GRID-6,h.y+6],
            [h.x+GRID-6,h.y+GRID-6]
        );
    } else if(direction.x<0){
        ex.push(
            [h.x+6,h.y+6],
            [h.x+6,h.y+GRID-6]
        );
    } else if(direction.y<0){
        ex.push(
            [h.x+6,h.y+6],
            [h.x+GRID-6,h.y+6]
        );
    } else {
        ex.push(
            [h.x+6,h.y+GRID-6],
            [h.x+GRID-6,h.y+GRID-6]
        );
    }

    ex.forEach(([x,y])=>{
        ctx.fillStyle=C.white;
        ctx.beginPath();
        ctx.arc(x,y,5,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle=C.black;
        ctx.beginPath();
        ctx.arc(x,y,2,0,Math.PI*2);
        ctx.fill();
    });
}

function drawGameOver() {
    ctx.fillStyle="rgba(65,60,70,.57)";
    ctx.fillRect(0,0,W,H);

    const pw=Math.min(
        W-30,
        mobile?400:480
    );

    const ph=Math.min(
        H-30,
        mobile?370:380
    );

    const px=W/2-pw/2;
    const py=H/2-ph/2;

    roundedRect(
        px,
        py+8,
        pw,
        ph,
        34,
        "#28232d"
    );

    roundedRect(
        px,
        py,
        pw,
        ph,
        34,
        C.light,
        C.pink,
        5
    );

    heart(px+48,py+48,13);
    heart(px+pw-48,py+48,13);

    text(
        "GAME OVER",
        W/2,
        py+65,
        mobile?38:55,
        C.dpink
    );

    const iw=Math.min(
        pw-50,
        330
    );

    roundedRect(
        W/2-iw/2,
        py+105,
        iw,
        48,
        18,
        C.white,
        C.pink,
        2
    );

    text(
        "SKOR  "+score,
        W/2,
        py+129,
        22,
        C.dpink
    );

    roundedRect(
        W/2-iw/2,
        py+162,
        iw,
        45,
        18,
        C.white,
        C.green,
        2
    );

    text(
        "SPEED  "+speed.toFixed(1),
        W/2,
        py+184,
        18,
        C.dgreen
    );

    const bw=Math.min(
        pw-40,
        mobile?290:240
    );

    const bx=W/2-bw/2;

    const by1=py+ph-125;
    const by2=py+ph-65;

    roundedRect(
        bx,
        by1+5,
        bw,
        50,
        20,
        C.dgreen
    );

    roundedRect(
        bx,
        by1,
        bw,
        50,
        20,
        C.green,
        C.white,
        3
    );

    text(
        "MAIN LAGI",
        W/2,
        by1+25,
        18,
        C.white
    );

    roundedRect(
        bx,
        by2+5,
        bw,
        50,
        20,
        "#b9416e"
    );

    roundedRect(
        bx,
        by2,
        bw,
        50,
        20,
        C.dpink,
        C.white,
        3
    );

    text(
        "KEMBALI KE MENU",
        W/2,
        by2+25,
        18,
        C.white
    );

    return {
        ulang:{
            x:bx,
            y:by1,
            w:bw,
            h:50
        },
        menu:{
            x:bx,
            y:by2,
            w:bw,
            h:50
        }
    };
}

let overButtons=null;

function drawLogin() {
    loginBackground();

    text(
        "SNAKE",
        W/2,
        65,
        Math.max(
            40,
            Math.min(70,W/17)
        ),
        C.dpink
    );

    text(
        "Snake of Jura",
        W/2,
        120,
        Math.max(
            20,
            Math.min(30,W/45)
        ),
        C.black
    );

    cuteSnake();

    const fs=Math.max(
        15,
        Math.min(23,W/50)
    );

    text(
        "Ayo bantu ular mencari makanan!",
        W/2,
        H/2-15,
        fs,
        C.dgreen
    );

    const bw=Math.min(
        350,
        W-60
    );

    const bh=65;
    const bx=W/2-bw/2;
    const by=H/2+45;

    roundedRect(
        bx,
        by+6,
        bw,
        bh,
        24,
        C.dgreen
    );

    roundedRect(
        bx,
        by,
        bw,
        bh,
        24,
        C.green,
        C.white,
        3
    );

    text(
        "MULAI GAME",
        W/2,
        by+bh/2,
        Math.max(
            20,
            Math.min(30,W/43)
        ),
        C.white
    );

    const ey=H/2+125;

    roundedRect(
        bx,
        ey+6,
        bw,
        bh,
        24,
        "#b9416e"
    );

    roundedRect(
        bx,
        ey,
        bw,
        bh,
        24,
        C.dpink,
        C.white,
        3
    );

    text(
        "KELUAR",
        W/2,
        ey+bh/2,
        Math.max(
            20,
            Math.min(30,W/43)
        ),
        C.white
    );

    return {
        play:{
            x:bx,
            y:by,
            w:bw,
            h:bh
        },
        exit:{
            x:bx,
            y:ey,
            w:bw,
            h:bh
        }
    };
}

function drawGame() {
    gameBackground();

    const menu={
        x:12,
        y:8,
        w:Math.min(
            125,
            Math.max(105,W/6)
        ),
        h:Math.min(
            42,
            Math.max(36,H/14)
        )
    };

    roundedRect(
        menu.x,
        menu.y+4,
        menu.w,
        menu.h,
        16,
        C.dpink
    );

    roundedRect(
        menu.x,
        menu.y,
        menu.w,
        menu.h,
        16,
        C.pink,
        C.white,
        3
    );

    text(
        "MENU",
        menu.x+menu.w/2,
        menu.y+menu.h/2,
        Math.max(
            17,
            Math.min(25,W/60)
        ),
        C.white
    );

    text(
        "Pemain",
        menu.x+menu.w+20,
        27,
        Math.max(
            17,
            Math.min(25,W/60)
        ),
        C.dpink,
        "left"
    );

    const sw=Math.min(
        185,
        Math.max(145,W/7)
    );

    const sx=W-sw-210;

    roundedRect(
        sx,
        7,
        sw,
        37,
        18,
        C.white,
        C.pink,
        2
    );

    text(
        "SPEED "+speed.toFixed(1),
        sx+sw/2,
        25,
        Math.max(
            17,
            Math.min(25,W/60)
        ),
        C.dpink
    );

    const qw=Math.min(
        195,
        Math.max(145,W/7)
    );

    const qx=W-qw-15;

    roundedRect(
        qx,
        7,
        qw,
        37,
        18,
        C.white,
        C.pink,
        2
    );

    text(
        "SKOR "+score,
        qx+qw/2,
        25,
        Math.max(
            17,
            Math.min(25,W/60)
        ),
        C.dpink
    );

    foods.forEach(drawFood);
    drawSnake();
    drawControls();

    if(gameOver)
        overButtons=drawGameOver();

    return {menu};
}

function frame(t) {
    const dt=Math.min(
        100,
        t-lastTime
    );

    lastTime=t;

    if(
        page==="game"&&
        !gameOver
    ){
        moveTimer+=dt;

        const interval=Math.max(
            75,
            1000/speed
        );

        if(moveTimer>=interval){
            moveTimer-=interval;

            if(moveTimer>interval)
                moveTimer=0;

            moveSnake();
        }
    }

    const ui=
        page==="login"
            ?drawLogin()
            :drawGame();

    canvas._ui=ui;

    requestAnimationFrame(frame);
}

function inside(p,r) {
    return (
        p.x>=r.x&&
        p.x<=r.x+r.w&&
        p.y>=r.y&&
        p.y<=r.y+r.h
    );
}

function handlePointer(x,y) {
    if(page==="login"){
        const ui=canvas._ui;

        if(
            inside(
                {x,y},
                ui.play
            )
        ){
            resetGame();
            page="game";
        }
        else if(
            inside(
                {x,y},
                ui.exit
            )
        ){
            document.exitFullscreen?.();

            try {
                window.close();
            } catch(e) {}
        }

        return;
    }

    const ui=canvas._ui;

    if(
        inside(
            {x,y},
            ui.menu
        )
    ){
        page="login";
        gameOver=false;
        return;
    }

    if(gameOver){
        if(
            inside(
                {x,y},
                overButtons.ulang
            )
        ){
            resetGame();
            return;
        }

        if(
            inside(
                {x,y},
                overButtons.menu
            )
        ){
            page="login";
            gameOver=false;
            return;
        }

    } else {
        changeDirection(
            controlDirection(x,y)
        );
    }
}

canvas.addEventListener(
    "pointerdown",
    e=>{
        const r=
            canvas.getBoundingClientRect();

        handlePointer(
            e.clientX-r.left,
            e.clientY-r.top
        );
    }
);

window.addEventListener(
    "keydown",
    e=>{
        if(e.key==="Escape"){
            if(page==="game"){
                page="login";
                gameOver=false;
            } else {
                document.exitFullscreen?.();
            }

            return;
        }

        if(
            page==="login"&&
            e.key==="Enter"
        ){
            resetGame();
            page="game";
            return;
        }

        if(
            page==="game"&&
            !gameOver
        ){
            if(
                ["ArrowUp","w","W"].includes(e.key)
            )
                changeDirection({
                    x:0,
                    y:-1
                });

            else if(
                ["ArrowDown","s","S"].includes(e.key)
            )
                changeDirection({
                    x:0,
                    y:1
                });

            else if(
                ["ArrowLeft","a","A"].includes(e.key)
            )
                changeDirection({
                    x:-1,
                    y:0
                });

            else if(
                ["ArrowRight","d","D"].includes(e.key)
            )
                changeDirection({
                    x:1,
                    y:0
                });
        }
    }
);

resetGame();
page="login";
requestAnimationFrame(frame);
