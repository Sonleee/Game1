const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');

let gameActive = false;

const asteroidImg = new Image();
asteroidImg.src = 'asteroid.png';


canvas.width = 1024;
canvas.height = 768;


const ship = {
  x: 300, y: 300, angle: 0,
  dx: 10, dy: 10, radius: 10,
  lives: 3, score: 0
};

const bullets = [];
const asteroids = [];

function createAsteroids(count) {
  for (let i = 0; i < count; i++) {
    asteroids.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1,
      size: Math.random() * 15 + 7
    });
  }
}

function drawShip(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(7, 10);
  ctx.lineTo(-7, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.restore();
}

function resetGame() {
  ship.x = 300;
  ship.y = 300;
  ship.angle = 10;
  ship.dx = 0;
  ship.dy = 0;
  ship.lives = 3;
  ship.score = 0;

  bullets.length = 0;
  asteroids.length = 0;

  createAsteroids(5);
}

function update() {
  if (ship.lives <= 0) return;

  ship.x += ship.dx;
  ship.y += ship.dy;

  if (ship.x < 0) ship.x = canvas.width;
  if (ship.x > canvas.width) ship.x = 0;
  if (ship.y < 0) ship.y = canvas.height;
  if (ship.y > canvas.height) ship.y = 0;

  bullets.forEach(b => {
    b.x += Math.cos(b.angle) * 5;
    b.y += Math.sin(b.angle) * 5;
  });

  bullets.forEach((bullet, bIndex) => {
    asteroids.forEach((a, aIndex) => {
      const dx = bullet.x - a.x;
      const dy = bullet.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < a.size) {
        bullets.splice(bIndex, 1);
        asteroids.splice(aIndex, 1);
        ship.score += 10;
      }
    });
  });

  asteroids.forEach(a => {
    a.x += a.dx;
    a.y += a.dy;
    if (a.x < 0) a.x = canvas.width;
    if (a.x > canvas.width) a.x = 0;
    if (a.y < 0) a.y = canvas.height;
    if (a.y > canvas.height) a.y = 0;

    const dx = ship.x - a.x;
    const dy = ship.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < a.size) {
      ship.lives -= 1;
      a.x = Math.random() * canvas.width;
      a.y = Math.random() * canvas.height;
    }
  });

  bullets.forEach((b, i) => {
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
    }
  });

  if (asteroids.length === 0) {
    createAsteroids(5);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (ship.lives > 0) {
    drawShip(ship.x, ship.y, ship.angle);
  }

  ctx.strokeStyle = 'gray';
  /*asteroids.forEach(a => {
  ctx.drawImage(asteroidImg, a.x - a.size, a.y - a.size, a.size * 2, a.size * 2);
  });*/

  asteroids.forEach(a => {
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.fillStyle = 'white';
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText('Vidas: ' + ship.lives, 10, 20);
  ctx.fillText('Pontos: ' + ship.score, 10, 40);

  if (ship.lives <= 0) {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', 200, 300);
  }
}

function gameLoop() {
  if (gameActive) {
    update();
    draw();

    if (ship.lives <= 0) {
      gameActive = false;
      startScreen.style.display = 'flex';
    } else {
      requestAnimationFrame(gameLoop);
    }
  }
}

document.addEventListener('keydown', e => {
  if (!gameActive) return;

  if (e.key === 'ArrowLeft') ship.angle -= 0.2;
  if (e.key === 'ArrowRight') ship.angle += 0.2;
  if (e.key === 'ArrowUp') {
    ship.dx += Math.cos(ship.angle) * 0.6;
    ship.dy += Math.sin(ship.angle) * 0.6;
  }
  if (e.key === ' ') {
    
      const bulletDistance = ship.radius + 10;  // distância extra além do centro

      bullets.push({
        x: ship.x + Math.cos(ship.angle) * bulletDistance,
        y: ship.y + Math.sin(ship.angle) * bulletDistance,
        angle: ship.angle
      });

    
  }
});

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  resetGame();
  gameActive = true;
  gameLoop();
});
