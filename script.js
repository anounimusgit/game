const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const mensagem = document.getElementById("mensagem");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");

let fotos = Array.from(document.querySelectorAll(".foto"));
let heartImg = new Image();
heartImg.src = "https://anounimusgit.github.io/game/heart.png";

let heart, pipes, frame, gameOver, score;
let fraseIndex = 0;

const frases = [
  "Você é a melhor parte do meu dia.",
  "Game over? Só se for pra recomeçar ao seu lado.",
  "Jogar contigo é meu passatempo favorito.",
  "O único nível difícil é ficar longe de você.",
  "Você é o meu checkpoint.",
  "Nada me deixa mais leve que pensar em você.",
  "Você desbloqueou meu lado mais feliz.",
  "Você é meu placar mais alto.",
  "Você é meu fim de jogo perfeito: com final feliz.",
  "Te amar não tem pause, nem reset — é infinito.",
  "Você é meu lugar seguro, mesmo nas fases difíceis.",
  "Você não é fase... é o jogo inteiro.",
  "Se for pra cair, que seja no seu colo.",
  "Você é a skin mais rara do meu universo.",
  "Se a vida travar, só reinicia comigo do lado."
];

function randomizeFotos() {
  fotos.forEach((foto) => {
    foto.style.left = Math.random() * window.innerWidth + "px";
    foto.style.top = Math.random() * window.innerHeight + "px";
    foto.style.animationDelay = Math.random() * 20 + "s";
  });
}

function resetGame() {
  heart = { x: 50, y: 150, size: 40, velocity: 0, gravity: 0.3, jump: -6 };
  pipes = [];
  frame = 0;
  gameOver = false;
  score = 0;
  scoreDisplay.textContent = "Pontos: 0";
  randomizeFotos();
}

function drawHeart(x, y) {
  ctx.drawImage(heartImg, x, y, heart.size, heart.size);
}

function drawPipe(pipe) {
  ctx.fillStyle = "#cc3366";
  ctx.fillRect(pipe.x, 0, 50, pipe.top);
  ctx.fillRect(pipe.x, pipe.top + 180, 50, canvas.height - pipe.top - 180);
}

function createPipe() {
  const top = Math.random() * 180 + 70;
  pipes.push({ x: canvas.width, top: top, passed: false });
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  heart.velocity += heart.gravity;
  heart.y += heart.velocity;
  drawHeart(heart.x, heart.y);

  if (frame % 120 === 0) createPipe();

  pipes.forEach((pipe, i) => {
    pipe.x -= 1.5;
    drawPipe(pipe);

    if (
      heart.x + heart.size > pipe.x && heart.x < pipe.x + 50 &&
      (heart.y < pipe.top || heart.y + heart.size > pipe.top + 180)
    ) {
      endGame();
    }

    if (!pipe.passed && pipe.x + 50 < heart.x) {
      pipe.passed = true;
      score++;
      scoreDisplay.textContent = `Pontos: ${score}`;
    }

    if (pipe.x + 50 < 0) pipes.splice(i, 1);
  });

  if (heart.y > canvas.height || heart.y < 0) {
    endGame();
  }

  frame++;
  requestAnimationFrame(update);
}

function endGame() {
  gameOver = true;
  mensagem.style.display = "block";
  mensagem.firstChild.textContent = frases[fraseIndex];
  fraseIndex = (fraseIndex + 1) % frases.length;
}

document.addEventListener("keydown", () => {
  if (!gameOver) heart.velocity = heart.jump;
});

document.addEventListener("touchstart", () => {
  if (!gameOver) heart.velocity = heart.jump;
});

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  resetGame();
  update();
});

restartBtn.addEventListener("click", () => {
  mensagem.style.display = "none";
  resetGame();
  update();
});

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

let lastTouchEnd = 0;

document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

