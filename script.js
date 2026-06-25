let gameState = {
    isRunning: false,
    difficulty: 'easy',
    timeLimit: 30,
    score: 0,
    streak: 0,
    bestStreak: 0,
    currentQuestion: null,
    answered: 0,
    correct: 0,
    incorrect: 0,
    timeRemaining: 0,
    timerInterval: null
};

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');

const startBtn = document.getElementById('startBtn');
const quitBtn = document.getElementById('quitBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const homeBtn = document.getElementById('homeBtn');

const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const questionEl = document.getElementById('question');
const feedbackEl = document.getElementById('feedback');

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const streakEl = document.getElementById('streak');

const difficultyConfig = {
    easy: {
        maxNumber: 10,
        operations: ['+', '-']
    },
    medium: {
        maxNumber: 50,
        operations: ['+', '-', '*']
    },
    hard: {
        maxNumber: 100,
        operations: ['+', '-', '*', '/']
    }
};

document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.difficulty = btn.dataset.level;
    });
});

document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.timeLimit = parseInt(btn.dataset.time);
    });
});

startBtn.addEventListener('click', startGame);
quitBtn.addEventListener('click', quitGame);
playAgainBtn.addEventListener('click', resetAndStart);
homeBtn.addEventListener('click', goHome);

submitBtn.addEventListener('click', submitAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAnswer();
});

function generateQuestion() {
    const config = difficultyConfig[gameState.difficulty];
    const num1 = Math.floor(Math.random() * config.maxNumber) + 1;
    const num2 = Math.floor(Math.random() * config.maxNumber) + 1;
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    
    let answer;
    switch(operation) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
        case '/':
            answer = Math.round((num1 / num2) * 100) / 100;
            break;
    }
    
    gameState.currentQuestion = {
        num1,
        num2,
        operation,
        answer: Math.round(answer)
    };
    
    return gameState.currentQuestion;
}

function displayQuestion() {
    const q = gameState.currentQuestion;
    questionEl.textContent = `${q.num1} ${q.operation} ${q.num2} = ?`;
    answerInput.value = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    answerInput.focus();
}

function submitAnswer() {
    if (!gameState.isRunning) return;
    
    const userAnswer = parseInt(answerInput.value) || null;
    
    if (userAnswer === null) {
        feedbackEl.textContent = 'Please enter a number!';
        feedbackEl.className = 'feedback incorrect';
        return;
    }
    
    gameState.answered++;
    
    if (userAnswer === gameState.currentQuestion.answer) {
        gameState.correct++;
        gameState.streak++;
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        gameState.score += 10 + (gameState.difficulty === 'easy' ? 0 : gameState.difficulty === 'medium' ? 5 : 10);
        
        feedbackEl.textContent = '✓ Correct!';
        feedbackEl.className = 'feedback correct';
    } else {
        gameState.incorrect++;
        gameState.streak = 0;
        feedbackEl.textContent = `✗ Wrong! Answer: ${gameState.currentQuestion.answer}`;
        feedbackEl.className = 'feedback incorrect';
    }
    
    updateStats();
    
    setTimeout(() => {
        generateQuestion();
        displayQuestion();
    }, 800);
}

function updateStats() {
    scoreEl.textContent = gameState.score;
    streakEl.textContent = gameState.streak;
    timerEl.textContent = gameState.timeRemaining;
}

function startGame() {
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.answered = 0;
    gameState.correct = 0;
    gameState.incorrect = 0;
    gameState.timeRemaining = gameState.timeLimit;
    
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    generateQuestion();
    displayQuestion();
    updateStats();
    
    startTimer();
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateStats();
        
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameState.isRunning = false;
    clearInterval(gameState.timerInterval);
    
    gameScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    displayResults();
}

function displayResults() {
    const accuracy = gameState.answered > 0 
        ? Math.round((gameState.correct / gameState.answered) * 100)
        : 0;
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('questionsSolved').textContent = gameState.answered;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('bestStreak').textContent = gameState.bestStreak;
}

function quitGame() {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        endGame();
    }
}

function resetAndStart() {
    resultsScreen.classList.remove('active');
    startScreen.classList.add('active');
    
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-level="easy"]').classList.add('active');
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-time="30"]').classList.add('active');
    
    gameState.difficulty = 'easy';
    gameState.timeLimit = 30;
}

function goHome() {
    resetAndStart();
}

window.addEventListener('load', () => {
    startScreen.classList.add('active');
});