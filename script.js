// Math Mission - a simple +, -, x, / practice game for kids.

const setupEl = document.getElementById('setup');
const quizEl = document.getElementById('quiz');
const resultsEl = document.getElementById('results');

const startButton = document.getElementById('startButton');
const roundsSelect = document.getElementById('rounds');

const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer');
const answerForm = document.getElementById('answerForm');
const feedbackEl = document.getElementById('feedback');

const finalScoreEl = document.getElementById('finalScore');
const finalCorrectEl = document.getElementById('finalCorrect');
const finalStreakEl = document.getElementById('finalStreak');
const resultsMessageEl = document.getElementById('resultsMessage');
const playAgainBtn = document.getElementById('playAgain');
const changeSettingsBtn = document.getElementById('changeSettings');

const LEVEL_RANGES = {
  easy: { min: 0, max: 10 },
  medium: { min: 0, max: 20 },
  hard: { min: 1, max: 50 },
};

const state = {
  ops: ['+', '\u2212', '\u00d7', '\u00f7'],
  level: 'easy',
  totalRounds: 10,
  round: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  currentAnswer: 0,
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProblem(ops, level) {
  const range = LEVEL_RANGES[level];
  const op = pick(ops);
  let a;
  let b;
  let answer;

  switch (op) {
    case '+': {
      a = randInt(range.min, range.max);
      b = randInt(range.min, range.max);
      answer = a + b;
      break;
    }
    case '\u2212': {
      a = randInt(range.min, range.max);
      b = randInt(range.min, a);
      answer = a - b;
      break;
    }
    case '\u00d7': {
      const cap = level === 'easy' ? 10 : level === 'medium' ? 12 : 15;
      a = randInt(0, cap);
      b = randInt(0, cap);
      answer = a * b;
      break;
    }
    case '\u00f7': {
      const cap = level === 'easy' ? 10 : level === 'medium' ? 12 : 15;
      b = randInt(1, cap);
      const q = randInt(0, cap);
      a = b * q;
      answer = q;
      break;
    }
    default:
      a = 0;
      b = 0;
      answer = 0;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}

function readSetup() {
  const ops = Array.from(
    document.querySelectorAll('input[name="op"]:checked'),
  ).map((el) => el.value);
  const level = document.querySelector('input[name="level"]:checked').value;
  const totalRounds = parseInt(roundsSelect.value, 10) || 10;
  return { ops, level, totalRounds };
}

function showPanel(panel) {
  [setupEl, quizEl, resultsEl].forEach((el) => el.classList.add('hidden'));
  panel.classList.remove('hidden');
}

function updateHUD() {
  progressEl.textContent = `${state.round} / ${state.totalRounds}`;
  scoreEl.textContent = String(state.score);
  streakEl.textContent = `${state.streak} \u{1F525}`;
}

function nextQuestion() {
  state.round += 1;
  if (state.round > state.totalRounds) {
    finishGame();
    return;
  }

  const problem = generateProblem(state.ops, state.level);
  state.currentAnswer = problem.answer;
  questionEl.textContent = problem.text;
  questionEl.classList.remove('pulse', 'shake');
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  answerInput.value = '';
  answerInput.focus();
  updateHUD();
}

function startGame() {
  const setup = readSetup();
  if (setup.ops.length === 0) {
    alert('Pick at least one kind of problem!');
    return;
  }

  state.ops = setup.ops;
  state.level = setup.level;
  state.totalRounds = setup.totalRounds;
  state.round = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.correct = 0;

  showPanel(quizEl);
  nextQuestion();
}

function handleAnswer(event) {
  event.preventDefault();
  const raw = answerInput.value.trim();
  if (raw === '') return;
  const given = Number(raw);

  if (given === state.currentAnswer) {
    state.correct += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    const points = 10 + Math.min(state.streak - 1, 5) * 2;
    state.score += points;
    feedbackEl.textContent = `\u2705 Correct! +${points} points`;
    feedbackEl.className = 'feedback correct';
    questionEl.classList.add('pulse');
    setTimeout(nextQuestion, 650);
  } else {
    state.streak = 0;
    feedbackEl.textContent = `\u274C Not quite - the answer was ${state.currentAnswer}.`;
    feedbackEl.className = 'feedback wrong';
    questionEl.classList.add('shake');
    setTimeout(nextQuestion, 1400);
  }
  updateHUD();
}

function finishGame() {
  finalScoreEl.textContent = String(state.score);
  finalCorrectEl.textContent = `${state.correct} / ${state.totalRounds}`;
  finalStreakEl.textContent = `${state.bestStreak} \u{1F525}`;

  const pct = state.correct / state.totalRounds;
  let message;
  if (pct === 1) message = 'Perfect score! You are a math superstar! \u{1F31F}';
  else if (pct >= 0.8) message = 'Awesome work! \u{1F389}';
  else if (pct >= 0.5) message = 'Nice job - keep practicing! \u{1F4AA}';
  else message = 'Good try! Every round makes you stronger. \u{1F4A1}';
  resultsMessageEl.textContent = message;

  showPanel(resultsEl);
}

startButton.addEventListener('click', startGame);
answerForm.addEventListener('submit', handleAnswer);
playAgainBtn.addEventListener('click', startGame);
changeSettingsBtn.addEventListener('click', () => showPanel(setupEl));
