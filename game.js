const questionElement = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const timerElement = document.getElementById('timer');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timer;
let timerCountdown;

let questions = [
    {
        question: 'Which HTML tag is used to define an inline style?',
        choice1: '<script>',
        choice2: '<css>',
        choice3: '<style>',
        choice4: '<span>',
        answer: 3,
    },
    {
        question: 'Which property is used to change the text color in CSS?',
        choice1: 'text-color',
        choice2: 'font-color',
        choice3: 'text-style',
        choice4: 'color',
        answer: 4,
    },
    {
        question: 'Which of the following is the correct way to comment in HTML?',
        choice1: '// Comment',
        choice2: '<!-- Comment -->',
        choice3: '/* Comment */',
        choice4: '<! Comment>',
        answer: 2,
    },
];

const SCORE_POINTS = 100;
const MAX_QUESTIONS = 3;
const TIME_LIMIT = 15;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () => {
    choices.forEach(choice => {
        choice.classList.remove('correct');
        choice.classList.remove('incorrect');
    });

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionElement.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
    startTimer();
}


startTimer = () => {
    clearInterval(timer);
    timerCountdown = TIME_LIMIT;
    timerElement.innerText = timerCountdown;

    timer = setInterval(() => {
        timerCountdown--;
        timerElement.innerText = timerCountdown;

        if (timerCountdown <= 0) {
            clearInterval(timer);
            acceptingAnswers = false;
            choices.forEach(choice => {
                if (choice.dataset['number'] == currentQuestion.answer) {
                    choice.classList.add('correct');
                }
            });

            setTimeout(() => {
                choices.forEach(choice => choice.classList.remove('correct'));
                getNewQuestion();
            }, 1000);
        }
    }, 1000);
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        clearInterval(timer); 
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
        } else {
            const correctChoice = document.querySelector(`.choice-text[data-number="${currentQuestion.answer}"]`);
            correctChoice.classList.add('correct');
        }

        selectedChoice.classList.add(classToApply);

        setTimeout(() => {
            choices.forEach(choice => choice.classList.remove(classToApply));
            getNewQuestion();
        }, 1000);
    });
});


incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

startGame();
