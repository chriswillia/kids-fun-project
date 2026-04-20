const balloonArea = document.getElementById('balloonArea');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
let score = 0;
let activeBalloons = [];

const colors = ['#ff7eb9', '#7afcff', '#ffef96', '#b4dffb', '#ff9a9e', '#a7ff83'];
const emojis = ['🎈', '✨', '💥', '🌟', '🎉', '😍'];

function createBalloon() {
  const balloon = document.createElement('button');
  balloon.className = 'balloon';
  balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
  balloon.innerHTML = `<span>${emojis[Math.floor(Math.random() * emojis.length)]}</span>`;
  balloon.addEventListener('click', () => popBalloon(balloon));
  balloonArea.appendChild(balloon);
  activeBalloons.push(balloon);
}

function popBalloon(balloon) {
  if (!balloon.classList.contains('pop')) {
    balloon.classList.add('pop');
    score += 10;
    scoreElement.textContent = score;
    setTimeout(() => balloon.remove(), 200);
  }
}

function startGame() {
  score = 0;
  scoreElement.textContent = score;
  balloonArea.innerHTML = '';
  activeBalloons = [];

  for (let i = 0; i < 8; i += 1) {
    createBalloon();
  }

  startButton.textContent = 'Restart Party';
}

startButton.addEventListener('click', startGame);
window.addEventListener('load', startGame);
