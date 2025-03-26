const Locical_Competitor__url = 'https://script.google.com/macros/s/AKfycbyu0iegCLHkCIbDxxzeVlabfwE2wZxN4MoZyakfvtLQ3nQfQSibf5x4QrLzpWatJePcUw/exec';
let start = document.querySelector(".quiz-wrapper");
start.style.display = "none";
let start_btn = document.getElementById("start-container");
start_btn.style.display = "block";

let questions = {};
let currentQuestion = 0;
let overallTimerInterval;
let totalQuestions = 0;
let totalQuizTime = 0; 
let answeredQuestions = new Set();
let userAnswers = {}; // Store user-selected answers
let start_txt = document.getElementById("btn_txt");
let qstart_btn = document.getElementById("start-button");
start_btn.disabled = true;
// Fetch data from Google Sheets
fetch(Locical_Competitor__url)
    .then(response => response.json())
    .then(data => {
        updateLogical(data);
        qstart_btn.disabled = false;
        start_txt.textContent = "Click Start!"
    })
    .catch(error => console.error('Error fetching the sheet:', error));
//to normalize data
function normalizeText(text) {
    const tempElement = document.createElement("textarea");
    tempElement.innerHTML = text;
    return tempElement.value;
}
// Function to update questions based on fetched data
function updateLogical(data) {
    

    let count = 0;

    data[logical_concepts].forEach(element => {
        if (element.Concept === normalizeText(normalizeText(logical_topics)) && element.Level === level) {
            questions[count] = element;
            count++;
        }
    });

    totalQuestions = Object.keys(questions).length;
    totalQuizTime = totalQuestions * 60; // 60 seconds per question, adjust if needed

    console.log('Fetched Questions:', questions);
}

// Function to initialize the quiz
function initializeQuiz() {
    document.getElementById('start-container').style.display = 'none'; // Hide start button container
    document.querySelector('.quiz-wrapper').style.display = 'flex'; // Show quiz container
    loadQuestions();
    startOverallTimer();
}

function loadQuestions() {
    const questionSection = document.getElementById('question-section');
    const questionNumbersDiv = document.getElementById('question-numbers');
    const questionLevel = document.getElementById('qlevel');
    questionLevel.textContent = `Level: ${level}`;
    questionSection.innerHTML = ''; // Clear the current question display
    questionNumbersDiv.innerHTML = ''; // Clear question numbers display

    const question = questions[currentQuestion];

    if (!question) {
        console.error("Question not found! Check the question data or index.");
        return;
    }

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.textContent = question.Question;
    questionSection.appendChild(questionElement);

    const optionsElement = document.createElement('div');
    optionsElement.classList.add('options');

    for (let i = 1; i <= 4; i++) {
        const option = document.createElement('div');
        option.classList.add('option');
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.value = question[`Option_${i}`];
        optionInput.id = `option${i}`;
        optionInput.onclick = function () {
            answeredQuestions.add(currentQuestion);
            userAnswers[currentQuestion] = optionInput.value; // Store the selected answer
            updateStatus();
        };
        const optionLabel = document.createElement('label');
        optionLabel.htmlFor = `option${i}`;
        optionLabel.textContent = question[`Option_${i}`];
        option.appendChild(optionInput);
        option.appendChild(optionLabel);
        optionsElement.appendChild(option);
    }

    questionSection.appendChild(optionsElement);
    questionSection.classList.add('active'); // Set section to active to display

    for (let i = 0; i < totalQuestions; i++) {
        const numberElement = document.createElement('div');
        numberElement.classList.add('question-number');
        numberElement.textContent = i + 1;
        numberElement.onclick = function () {
            currentQuestion = i;
            loadQuestions();
        };
        if (answeredQuestions.has(i)) {
            numberElement.classList.add('answered');
        }
        questionNumbersDiv.appendChild(numberElement);
    }
}

function updateStatus() {
    document.getElementById('notAnswered').textContent = totalQuestions - answeredQuestions.size;
    document.getElementById('answered').textContent = answeredQuestions.size;
}

function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        loadQuestions();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestions();
    }
}

let currentReviewQuestion = 0;

function submitQuiz() {
    document.querySelector('.quiz-wrapper').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    let score = 0;
    Object.keys(questions).forEach((questionIndex) => {
        const question = questions[questionIndex];
        if (userAnswers[questionIndex] == question.Answer) {
            score++;
        }
    });

    document.getElementById('score').textContent = score;
    loadReviewQuestion(currentReviewQuestion);
    sendData(window.studentId,logical_concepts,normalizeText(normalizeText(logical_topics)),level,score);
}

function loadReviewQuestion(index) {
    const question = questions[index];
    document.getElementById('review-question').textContent = question.Question;
    document.getElementById('user-answer').textContent = userAnswers[index] || "No Answer";
    document.getElementById('correct-answer').textContent = question.Answer;
    document.getElementById('explanation').textContent = question.Explanation || "No explanation available.";
    
    // Disable or enable navigation buttons based on the current index
    document.getElementById('prev-review-btn').disabled = (index === 0);
    document.getElementById('next-review-btn').disabled = (index === totalQuestions - 1);
}

function nextReview() {
    if (currentReviewQuestion < totalQuestions - 1) {
        currentReviewQuestion++;
        loadReviewQuestion(currentReviewQuestion);
    }
}

function prevReview() {
    if (currentReviewQuestion > 0) {
        currentReviewQuestion--;
        loadReviewQuestion(currentReviewQuestion);
    }
}


function restartQuiz() {
    answeredQuestions.clear();
    userAnswers = {}; // Clear user answers
    currentQuestion = 0;
    document.getElementById('results').style.display = 'none';
    document.querySelector('.quiz-wrapper').style.display = 'flex';
    loadQuestions();
    startOverallTimer();
}

function startOverallTimer() {
    let totalTime = totalQuizTime;
    overallTimerInterval = setInterval(() => {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        document.getElementById('overall-timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        totalTime--;

        if (totalTime < 0) {
            clearInterval(overallTimerInterval);
            alert('Time is up!');
            submitQuiz();
        }
    }, 1000);
}

function sendData(regNo, concept, topic, level, score) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxG89bKv6Joi-pmaLHEpskObDQNeCuRro9JzK8u00WT789ZsneZJsKTVgidTT5v0E1-/exec';
    var payload = {
      regNo: regNo,
      concept: concept,
      topic: topic,
      level: level,
      score: score
    };

    $.post(scriptUrl, JSON.stringify(payload), function(response) {
      console.log('Response from server: ' + response);
    }).fail(function(xhr, status, error) {
      console.error('Error:', error);
    });
  }

document.getElementById('start-button').addEventListener('click', initializeQuiz);
document.getElementById('start-button').addEventListener('click', ()=>{
    start.style.display = "flex";
    start_btn.style.display = "none";
});