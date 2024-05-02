document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const menu = document.getElementById('menu');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const scoreDisplay = document.getElementById('score');
    const title = document.getElementById('title');

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const SIZE = 20;
    let snake = [{ x: WIDTH / 2, y: HEIGHT / 2 }];
    let direction = { x: 0, y: -SIZE };
    let food = generateFood();
    let score = 0;
    let speed = 100; // Initial speed of the game (in milliseconds)
    let gameInterval;

    function generateFood() {
        return {
            x: Math.floor(Math.random() * (WIDTH / SIZE)) * SIZE,
            y: Math.floor(Math.random() * (HEIGHT / SIZE)) * SIZE
        };
    }

    function update() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Check for collisions with the walls
        if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
            gameOver();
            return;
        }

        // Check for collisions with the snake itself
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        // Check for collisions with food
        if (head.x === food.x && head.y === food.y) {
            snake.unshift({});
            score++;
            if (score % 5 === 0) {
                speed -= 10; // Increase speed every 5 apples
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, speed);
            }
            food = generateFood();
        }

        snake.pop();
        snake.unshift(head);

        // Show live score
        scoreDisplay.innerText = `Score: ${score}`;
    }

    function drawApple() {
        // Draw the apple body
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(food.x + SIZE / 2, food.y + SIZE / 2, SIZE / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw the apple leaf
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(food.x + SIZE / 2, food.y);
        ctx.lineTo(food.x + SIZE / 4, food.y - SIZE / 2);
        ctx.lineTo(food.x + SIZE / 2 + SIZE / 4, food.y - SIZE / 2);
        ctx.closePath();
        ctx.fill();
    }

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = 'darkgreen';
                ctx.beginPath();
                ctx.arc(segment.x + SIZE / 2, segment.y + SIZE / 2, SIZE / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(segment.x + SIZE / 3, segment.y + SIZE / 3, SIZE / 10, 0, Math.PI * 2);
                ctx.arc(segment.x + SIZE * 2 / 3, segment.y + SIZE / 3, SIZE / 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(segment.x + SIZE / 3, segment.y + SIZE * 2 / 3);
                ctx.lineTo(segment.x + SIZE * 2 / 3, segment.y + SIZE * 2 / 3);
                ctx.stroke();
            } else {
                ctx.fillStyle = 'green';
                ctx.fillRect(segment.x, segment.y, SIZE, SIZE);
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        drawApple();
        drawSnake();
    }

    function gameLoop() {
        update();
        draw();
    }

    function gameOver() {
        clearInterval(gameInterval);
        title.innerText = 'Game Over';
        menu.style.display = 'flex';
        canvas.style.display = 'none';
        scoreDisplay.style.display = 'block';
        restartButton.style.display = 'block';
        startButton.style.display = 'none';
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction.y !== SIZE) {
                    direction = { x: 0, y: -SIZE };
                }
                break;
            case 'ArrowDown':
                if (direction.y !== -SIZE) {
                    direction = { x: 0, y: SIZE };
                }
                break;
            case 'ArrowLeft':
                if (direction.x !== SIZE) {
                    direction = { x: -SIZE, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (direction.x !== -SIZE) {
                    direction = { x: SIZE, y: 0 };
                }
                break;
            default:
                break;
        }
    });

    startButton.addEventListener('click', () => {
        menu.style.display = 'none';
        canvas.style.display = 'block';
        scoreDisplay.style.display = 'block';
        gameInterval = setInterval(gameLoop, speed);
    });

    restartButton.addEventListener('click', () => {
        snake = [{ x: WIDTH / 2, y: HEIGHT / 2 }];
        direction = { x: 0, y: -SIZE };
        food = generateFood();
        score = 0;
        speed = 100;
        title.innerText = 'Snake Game';
        menu.style.display = 'none';
        canvas.style.display = 'block';
        scoreDisplay.style.display = 'block';
        restartButton.style.display = 'none';
        startButton.style.display = 'block';
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    });
});


