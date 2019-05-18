const config = {
    brickSpeed: 5,
}

const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
let firstGame = true;
let timerId;

const x = gameBoard.width / 2;
const y = gameBoard.height - 30;
const brickHeight = 15;
const brickWidth = 150;

const LIFES = 5;
let score = 0, life = LIFES;
let ballRadius = 15;
let brickX = (gameBoard.width - brickWidth) / 2;
let rightKey = false, leftKey = false;

const start = document.querySelector('#start');

function initGameBoard() {
    start.addEventListener('click', () => {
        if(firstGame) {
            start.textContent = 'Restart';
            firstGame = false;
        }
        start.style.display = 'none';
        initBalls();
        timerId = setInterval(draw, 10);
    });
    
    Balls = new Array(6)

    ctx.font = "50px Cursive";
    ctx.fillText("WELCOME TO BOUNCING BALLS", 100, (gameBoard.height /2 ) );
}
initGameBoard();

// Init the balls array
function initBalls(){
    Balls = Balls.fill(0).map( _ => ({
        x: Math.random() * (gameBoard.width-2 * ballRadius) + ballRadius,
        y: ballRadius + 1,
        dx: Math.random() * 2 - 1, //left right bouncing with a random speed between -1 and 1
        dy: -Math.random(), //drop down with a random speed between 0 and 1
    }));
}		

function drawBall() {
    Balls.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#34495e";
        ctx.fill();
        ctx.closePath();
    });
}

function drawText(){
    ctx.font = "30px Cursiva";
    ctx.fillText("Score : "+score+"    Life : "+life, 10, 50);
}

function drawBrick() {
    if(rightKey) brickX += config.brickSpeed;
    if(leftKey) brickX -= config.brickSpeed;

    ctx.beginPath();
    ctx.rect(brickX, gameBoard.height - brickHeight, brickWidth, brickHeight);
    ctx.fillStyle = "#c0392b";
    ctx.fill();
    ctx.closePath();
}  	 

function draw() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    drawBall();
    drawBrick();
    drawText()

    for(let i=0;i<Balls.length;++i) {

        const c = Balls[i];

        if ( hitSideWall() )
            c.dx = -c.dx-0.01;

        if ( hitBrick() ) {
            c.dy = -c.dy-0.01;
            score ++;
        }

        if ( hitTop() )
            c.dy = -c.dy-0.01;

        if( hitBottom() ){
            life--;
            c.x= Math.random() * (gameBoard.width -2 * ballRadius) + ballRadius;
            c.y = ballRadius + 1;
        }


        if ( gameOver() ) {
            ctx.font = "50px Cursive";
            ctx.fillText("Game Over", (gameBoard.width /2) - 75 , (gameBoard.height /2 ) );
            clearInterval(timerId);
            start.style.display = 'block';
            life = LIFES;
            score = 0;
            return;
        }

        function hitBrick() { return hitBottom() && ballOverBrick(); }
        function ballOverBrick() { return c.x > brickX  &&  c.x < brickX + brickWidth; }
        function hitBottom() { return c.y + c.dy > gameBoard.height - ballRadius; }
        function gameOver() { return life == 0; }
        function hitSideWall() { return c.x + c.dx > gameBoard.width - ballRadius || c.x + c.dx < ballRadius; }
        function hitTop() { return c.y + c.dy < ballRadius; }
        function rightPressed(e) { return e.key == 'ArrowRight'; }
        function leftPressed(e) { return e.key == 'ArrowLeft'; }

        function keyDown(e) {
            rightKey = rightPressed(e);
            leftKey = leftPressed(e);
        }

        function keyUp(e) {
            rightKey = rightPressed(e) ? false : rightKey;
            leftKey = leftPressed(e) ? false : leftKey;
        }

        document.addEventListener("keydown", keyDown, false);
        document.addEventListener("keyup", keyUp, false);

        const maxX = gameBoard.width - brickWidth;
        const minX = 0;
        const brickDelta = rightKey ? 0.5 : leftKey ? -0.5 : 0;

        brickX = brickX + brickDelta;
        brickX = Math.min(brickX, maxX);
        brickX = Math.max(brickX, minX);

        c.x += c.dx;
        c.y += c.dy;

    }

}