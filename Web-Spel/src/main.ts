import './style.css'

const canvas = document.createElement('canvas');
canvas.width = 950;
canvas.height = 300;
const context = canvas.getContext('2d')!;
document.querySelector('#game')!.append(canvas);

const start = document.querySelector('#startGame')

const restart = document.querySelector('.restart')

const timer = document.querySelector('.timer')!

const restartGame = document.querySelector('.restartGame')
 
let startTime = new Date()
let stopTime = new Date()

start?.addEventListener('click', ()=>{
 document.querySelector('.start')?.setAttribute("id", "hide")  
    startTime = new Date()
})

restartGame?.addEventListener('click', ()=>{
    document.querySelector('.restart')?.setAttribute("id", "hide")  
    player.y = 340
    player.x = 50
    startTime = new Date()
})

const player = {
    width: 8,
    height: 8,
    x: 50,
    y: 340,
    speed: 4,
    vx: 0,
    vy: 0,
    fillColor: '#B026FF',
    grounded: true
}

let gravity = 1

const keys: any = {
    w: false,
    a: false,
    d: false,
}

type Obstacle = {
    width: number,
    height: number,
    x: number,
    y: number,
    fillColor: string
}

type Lava = {
    width: number,
    height: number,
    x: number,
    y: number
}

type Win = {
    width: number,
    height: number,
    x: number,
    y: number,
    fillColor: string
}

const wins: Win[] = [
    {
        width: 50,
        height: 10,
        x: 0,
        y:60,
        fillColor: '#39FF14'
    }
]

const lavas: Lava[] = [
    {
        width: 840,
        height: 5,
        x: 120,
        y:295
    },
];

const obstacles: Obstacle[] = [
    {
        // border
        width: 10,
        height: 10,
        x: 110,
        y:290,
        fillColor: '#2697b9'
    },
    {
        // 1
        width: 30,
        height: 10,
        x: 140,
        y:263,
        fillColor: '#2697b9'
    },
    {
        // 2
        width: 30,
        height: 10,
        x: 230,
        y:223,
        fillColor: '#2697b9'
    },
    {
        // 3
        width: 30,
        height: 10,
        x: 300,
        y:280,
        fillColor: '#2697b9'
    },
    {
        // 4
        width: 30,
        height: 10,
        x: 380,
        y:250,
        fillColor: '#2697b9'
    },
    {
        // 5
        width: 30,
        height: 10,
        x: 468,
        y:210,
        fillColor: '#2697b9'
    },
    {
        // 6
        width: 30,
        height: 10,
        x: 560,
        y:250,
        fillColor: '#2697b9'
    },
    {
        // 7
        width: 30,
        height: 10,
        x: 660,
        y:230,
        fillColor: '#2697b9'
    },
    {
        // 8
        width: 30,
        height: 10,
        x: 760,
        y:270,
        fillColor: '#2697b9'
    },
    {
        // 9
        width: 30,
        height: 10,
        x: 860,
        y:260,
        fillColor: '#2697b9'
    },
    {
        // 10
        width: 30,
        height: 10,
        x: 910,
        y:200,
        fillColor: '#2697b9'
    },
    {
        // 11
        width: 30,
        height: 10,
        x: 860,
        y:150,
        fillColor: '#2697b9'
    },
    {
        // tower1
        width: 10,
        height: 60,
        x: 800,
        y:120,
        fillColor: '#2697b9'
    },
    {
        // tower2
        width: 10,
        height: 90,
        x: 700,
        y:100,
        fillColor: '#2697b9'
    },
    {
        // tower3
        width: 10,
        height: 50,
        x: 600,
        y:130,
        fillColor: '#2697b9'
    },
    {
        // tower4
        width: 10,
        height: 50,
        x: 500,
        y:100,
        fillColor: '#2697b9'
    },
    {
        // tower5
        width: 10,
        height: 90,
        x: 400,
        y:120,
        fillColor: '#2697b9'
    },
    {
        // tower6
        width: 10,
        height: 40,
        x: 300,
        y:100,
        fillColor: '#2697b9'
    },
    {
        // tower7
        width: 10,
        height: 75,
        x: 200,
        y:120,
        fillColor: '#2697b9'
    },
    {
        // tower8
        width: 10,
        height: 100,
        x: 90,
        y:100,
        fillColor: '#2697b9'
    },
];

gameLoop();

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop); 
}

window.addEventListener('mousedown', (e) => {
    e.button === 0
})

window.addEventListener('mouseup', (e) => {
    e.button === 0
})

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
})

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
})

function update() {
    movePlayerX()
    handlePlayerCollisionX();

    movePlayerY();
    handlePlayerCollisionY();
    if (player.y + player.height >= canvas.height) {
        player.grounded = true
    }
    handleJump()
    handleLava()
    handleWin()

    stopTime = new Date()
    let time = stopTime.getTime() - startTime.getTime()

    let convertSeconds = Math.floor(time / 1000 % 60)
    let convertMinutes = Math.floor(time / 1000 / 60)

    let paddedSeconds = String(convertSeconds).padStart(2,"0")
    let paddedMinutes = String(convertMinutes).padStart(2,"0")

    timer.innerHTML = `${paddedMinutes}:${paddedSeconds}` 
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player.fillColor);

    for (let i = 0; i < lavas.length; i++) {
        let lava = lavas[i];
        drawLava(lava.x, lava.y, lava.width, lava.height);        
    }

    
    for (let i = 0; i < wins.length; i++) {
        let win = wins[i];
        drawWin(win.x, win.y, win.width, win.height, win.fillColor);        
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        drawObstacle(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.fillColor);
    }
}

function drawPlayer(fillColor: string) {
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height);

    context.fillStyle = fillColor;
    context.fill();
}

function drawObstacle(x: number, y: number, width: number, height: number, fillColor:string) {
    context.beginPath();
    context.rect(x, y, width, height);

    context.fillStyle = fillColor;
    context.fill();
}

function drawLava(x: number, y: number, width: number, height: number) {
    context.beginPath();
    context.rect(x, y, width, height);

    context.fillStyle = '#FF3131';
    context.fill();
}

function drawWin(x: number, y: number, width: number, height: number, fillColor:string) {
    context.beginPath();
    context.rect(x, y, width, height);

    context.fillStyle = fillColor;
    context.fill();
}

function movePlayerX() {
    if (keys.a) {
        player.vx = -player.speed;
    }

    if (keys.d) {
        player.vx = player.speed;
    }

    if (!keys.a && !keys.d) {
        player.vx = 0;
    }

    player.x += player.vx;
}

function movePlayerY() {
    player.vy = player.vy + gravity;
    player.y = player.y + player.vy;
}

function handleJump() {
    if (keys.w && player.grounded) {
        player.vy = -30 // -12
        player.grounded = false
    }
}

function handlePlayerCollisionX() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        if (player.x < obstacle.x + obstacle.width && player.y + player.height > obstacle.y && player.y < obstacle.y + obstacle.height && player.x + player.width > obstacle.x) {

            if (player.vx < 0) {
                player.x = obstacle.x + obstacle.width;
            }

            else if (player.vx > 0) {
                player.x = obstacle.x - player.width;
            }
        }
    }
}

function handlePlayerCollisionY() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        if (player.x < obstacle.x + obstacle.width && player.y + player.height > obstacle.y && player.y < obstacle.y + obstacle.height && player.x + player.width > obstacle.x) {

            if (player.vy < 0) {
                player.y = obstacle.y + obstacle.height;
                player.vy = 0;
            }

            // Checkar collision på top sidan av en fyrkant
            // Grounded gör så du int "fastnar"
            else if (player.vy > 0) {
                player.y = obstacle.y - player.height;
                player.vy = 0;
                player.grounded = true
            }
        }
    }

    // assumar så int spelan far utanföri borden på y-axeln
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.vy = 0;
    }
}

function handleLava(){
    for (let i = 0; i < lavas.length; i++) {
        let lava = lavas[i]; 
        
        
        if (player.x < lava.x + lava.width && player.y + player.height > lava.y && player.y < lava.y + lava.height && player.x + player.width > lava.x) {

            if (player.y - player.height > lava.height) {
                player.y = 340
                player.x = 50
                }
        }
    } 
}

function handleWin(){
    for (let i = 0; i < wins.length; i++) {
        let win= wins[i]; 
        
        if (player.x < win.x + win.width && player.y + player.height > win.y && player.y < win.y + win.height && player.x + player.width > win.x) {

if(player.y - player.height > win.height){
    player.x = -1000
                document.querySelector('.restart')?.removeAttribute("id")

                    stopTime = new Date()
                    let time = stopTime.getTime() - startTime.getTime()

                    let convertSeconds = Math.floor(time / 1000 % 60)
                    let convertMinutes = Math.floor(time / 1000 / 60)

                    let paddedSeconds = String(convertSeconds).padStart(2,"0")
                    let paddedMinutes = String(convertMinutes).padStart(2,"0")

                    let h2 = restart!.querySelector('h2')!

                   h2.innerHTML = `${paddedMinutes}:${paddedSeconds}` 
}
        }
    } 
}