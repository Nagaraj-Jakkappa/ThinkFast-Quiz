const quizData = [
    // HTML
    { question: "What does HTML stand for?", a: "Hyper Trainer Marking Language", b: "Hyper Text Markup Language", c: "Hyper Text Marketing Language", d: "Hyper Tool Multi Language", correct: "b" },
    { question: "Which tag is used for the largest heading in HTML?", a: "<h6>", b: "<h1>", c: "<head>", d: "<header>", correct: "b" },
    { question: "Which HTML attribute specifies an alternate text for images?", a: "alt", b: "title", c: "src", d: "longdesc", correct: "a" },
    { question: "What is the correct HTML for creating a hyperlink?", a: "<a>www.google.com</a>", b: "<a href='www.google.com'>Google</a>", c: "<a url='www.google.com'>Google</a>", d: "<link>www.google.com</link>", correct: "b" },
    { question: "Which HTML element is used to define important text?", a: "<b>", b: "<strong>", c: "<i>", d: "<em>", correct: "b" },
    { question: "Which tag is used to create a table row in HTML?", a: "<tr>", b: "<td>", c: "<th>", d: "<row>", correct: "a" },
    { question: "Which input type defines a slider control?", a: "text", b: "range", c: "slider", d: "scroll", correct: "b" },
    { question: "Which tag is used to play video files in HTML5?", a: "<media>", b: "<video>", c: "<movie>", d: "<player>", correct: "b" },
    { question: "Which element is used for line breaks in HTML?", a: "<break>", b: "<lb>", c: "<br>", d: "<line>", correct: "c" },
    { question: "Which HTML element is used for metadata?", a: "<meta>", b: "<data>", c: "<info>", d: "<link>", correct: "a" },

    // CSS
    { question: "Which CSS property controls text size?", a: "font-style", b: "text-size", c: "font-size", d: "text-style", correct: "c" },
    { question: "Which CSS property makes text bold?", a: "font-style", b: "text-decoration", c: "font-weight", d: "bold", correct: "c" },
    { question: "Which CSS property is used to change text color?", a: "font-color", b: "text-color", c: "color", d: "background-color", correct: "c" },
    { question: "Which symbol is used for comments in CSS?", a: "//", b: "/* */", c: "<!-- -->", d: "#", correct: "b" },
    { question: "What is the default position property in CSS?", a: "relative", b: "absolute", c: "fixed", d: "static", correct: "d" },
    { question: "Which CSS property sets background color?", a: "color", b: "bgcolor", c: "background-color", d: "background-style", correct: "c" },
    { question: "Which CSS unit is relative to the root element?", a: "em", b: "rem", c: "px", d: "%", correct: "b" },
    { question: "Which CSS property is used for shadows on text?", a: "text-style", b: "font-shadow", c: "text-shadow", d: "shadow", correct: "c" },
    { question: "How do you make a list display horizontally in CSS?", a: "display: inline;", b: "display: block;", c: "list-style: none;", d: "float: left;", correct: "a" },
    { question: "Which CSS property controls spacing between letters?", a: "word-spacing", b: "line-height", c: "letter-spacing", d: "font-spacing", correct: "c" },

    // JavaScript
    { question: "Inside which HTML element do we put JavaScript?", a: "<js>", b: "<script>", c: "<javascript>", d: "<code>", correct: "b" },
    { question: "Which company developed JavaScript?", a: "Netscape", b: "Microsoft", c: "Google", d: "Oracle", correct: "a" },
    { question: "Which JS keyword declares a constant?", a: "var", b: "let", c: "const", d: "constant", correct: "c" },
    { question: "Which method is used to add an element at the end of an array?", a: "push()", b: "pop()", c: "shift()", d: "concat()", correct: "a" },
    { question: "Which symbol is used for strict equality in JS?", a: "===", b: "=", c: "==", d: "!=", correct: "a" },
    { question: "Which function converts JSON text into a JS object?", a: "JSON.parse()", b: "JSON.stringify()", c: "JSON.object()", d: "JSON.convert()", correct: "a" },
    { question: "Which function removes the last element from an array?", a: "push()", b: "pop()", c: "shift()", d: "slice()", correct: "b" },
    { question: "What is the output of typeof null in JS?", a: "object", b: "null", c: "undefined", d: "boolean", correct: "a" },
    { question: "Which loop is guaranteed to run at least once?", a: "for loop", b: "while loop", c: "do...while loop", d: "forEach loop", correct: "c" },
    { question: "Which JS operator is used to combine strings?", a: "+", b: "&", c: "||", d: "*", correct: "a" }
];

const quiz = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const answerBtns = document.querySelectorAll(".answer-btn");
const submitBtn = document.getElementById("submit");
const skipBtn = document.getElementById("skip");
const timerEl = document.getElementById("time");
const progressContainer = document.getElementById("progress-container");

const beepShort = document.getElementById("beep-short");
const beepLong = document.getElementById("beep-long");

let currentQuiz = 0;
let score = 0;
let selectedAnswer = null;
let timeLeft = 15;
let timer;
let userAnswers = [];

// unlock audio on first click
document.addEventListener("click", () => {
    if (beepShort) {
        beepShort.play().then(() => {
            beepShort.pause();
            beepShort.currentTime = 0;
        }).catch(() => { });
    }
}, { once: true });

// progress bar
function initProgress() {
    progressContainer.innerHTML = "";
    for (let i = 0; i < quizData.length; i++) {
        const segment = document.createElement("div");
        segment.classList.add("progress-segment");
        progressContainer.appendChild(segment);
    }
}
function markProgress(index, status) {
    const segments = document.querySelectorAll(".progress-segment");
    if (segments[index]) {
        segments[index].classList.add(status);
    }
}

// load question
function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    document.getElementById("a_text").innerText = currentQuizData.a;
    document.getElementById("b_text").innerText = currentQuizData.b;
    document.getElementById("c_text").innerText = currentQuizData.c;
    document.getElementById("d_text").innerText = currentQuizData.d;

    if (currentQuiz === 0) initProgress();
    resetTimer();
}

function deselectAnswers() {
    answerBtns.forEach(btn => {
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
        btn.style.background = "";
    });
    selectedAnswer = null;
}

// answer selection
answerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedAnswer = btn.dataset.answer;
        answerBtns.forEach(b => b.style.background = "");
        btn.style.background = "#dce8ff";
    });
});

// submit answer
submitBtn.addEventListener("click", () => {
    if (!selectedAnswer) return;
    const currentQuizData = quizData[currentQuiz];
    const correctAnswer = currentQuizData.correct;
    userAnswers[currentQuiz] = selectedAnswer;

    if (selectedAnswer === correctAnswer) {
        document.querySelector(`[data-answer="${correctAnswer}"]`).classList.add("correct");
        score++;
        markProgress(currentQuiz, "correct");
    } else {
        document.querySelector(`[data-answer="${selectedAnswer}"]`).classList.add("wrong");
        document.querySelector(`[data-answer="${correctAnswer}"]`).classList.add("correct");
        markProgress(currentQuiz, "wrong");
    }

    answerBtns.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        currentQuiz++;
        if (currentQuiz < quizData.length) loadQuiz();
        else showResults();
    }, 1200);
});

// skip question
skipBtn.addEventListener("click", () => {
    userAnswers[currentQuiz] = null;
    markProgress(currentQuiz, "skipped");
    answerBtns.forEach(btn => btn.disabled = true);
    setTimeout(() => {
        currentQuiz++;
        if (currentQuiz < quizData.length) loadQuiz();
        else showResults();
    }, 500);
});

// timer
function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerEl.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;

        if (timeLeft > 0 && timeLeft <= 3) {
            if (beepShort) {
                beepShort.currentTime = 0;
                beepShort.play().catch(() => { });
            }
            if (navigator.vibrate) navigator.vibrate(200);
        }

        if (timeLeft <= 0) {
            clearInterval(timer);

            const oldOverlay = document.querySelector(".time-overlay");
            if (oldOverlay) oldOverlay.remove();

            const overlay = document.createElement("div");
            overlay.classList.add("time-overlay");

            const warning = document.createElement("div");
            warning.classList.add("time-warning");
            warning.innerText = "⏰ TIME’S UP!";

            overlay.appendChild(warning);
            document.body.appendChild(overlay);

            if (beepLong) {
                beepLong.currentTime = 0;
                beepLong.play().catch(() => { });
                setTimeout(() => {
                    beepLong.pause();
                    beepLong.currentTime = 0;
                }, 1000);
            }
            if (navigator.vibrate) navigator.vibrate([600, 200, 600]);

            markProgress(currentQuiz, "skipped");
            userAnswers[currentQuiz] = null;
            answerBtns.forEach(btn => btn.disabled = true);

            setTimeout(() => {
                const overlayEl = document.querySelector(".time-overlay");
                if (overlayEl) overlayEl.remove();
                currentQuiz++;
                if (currentQuiz < quizData.length) loadQuiz();
                else showResults();
            }, 1500);
        }
    }, 1000);
}

// results
function showResults() {
    clearInterval(timer);
    const segments = document.querySelectorAll(".progress-segment");

    // recap bar
    let recapBar = '<div class="progress-container recap">';
    segments.forEach(seg => {
        recapBar += `<div class="progress-segment ${seg.classList.value.replace('progress-segment', '').trim()}"></div>`;
    });
    recapBar += "</div>";

    // summary list
    let summaryList = "<ul class='summary-list'>";
    quizData.forEach((q, index) => {
        let status = "skipped";
        if (segments[index].classList.contains("correct")) status = "correct";
        else if (segments[index].classList.contains("wrong")) status = "wrong";

        const userAnswer = userAnswers[index] ? userAnswers[index].toUpperCase() : "—";

        summaryList += `
            <li class="summary-item ${status}">
                <div class="summary-question">
                    Q${index + 1}: ${q.question}
                    <span class="status ${status}">
                        ${status === "correct" ? "✅" : status === "wrong" ? "❌" : "⏭️"}
                    </span>
                </div>
                <div class="summary-detail">
                    ✅ Correct Answer: <b>${q.correct.toUpperCase()}</b><br>
                    📌 Your Answer: <b>${userAnswer}</b>
                </div>
            </li>
        `;
    });
    summaryList += "</ul>";

    quiz.innerHTML = `
        <h2>You answered ${score}/${quizData.length} correctly ✅</h2>
        <h3>Recap:</h3>
        ${recapBar}
        <h3>Question Summary:</h3>
        ${summaryList}
        <button class="restart-btn ${score >= quizData.length / 2 ? "success" : "fail"}" onclick="location.reload()">🔄 Restart Quiz</button>
    `;

    // expand/collapse all
    const summaryListEl = document.querySelector('.summary-list');
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.id = "toggleAllBtn";
    toggleAllBtn.classList.add("restart-btn");
    toggleAllBtn.style.marginBottom = "12px";
    toggleAllBtn.style.padding = "8px 18px";
    toggleAllBtn.style.fontSize = "15px";
    toggleAllBtn.style.animation = "none";
    toggleAllBtn.innerHTML = `Expand All <span class="arrow">⬇️</span>`;
    summaryListEl.parentNode.insertBefore(toggleAllBtn, summaryListEl);

    let allExpanded = false;
    toggleAllBtn.addEventListener("click", () => {
        allExpanded = !allExpanded;
        document.querySelectorAll(".summary-item").forEach(item => {
            item.classList.toggle("active", allExpanded);
        });
        const arrow = toggleAllBtn.querySelector(".arrow");
        if (allExpanded) {
            toggleAllBtn.childNodes[0].nodeValue = "Collapse All ";
            arrow.style.transform = "rotate(180deg)";
        } else {
            toggleAllBtn.childNodes[0].nodeValue = "Expand All ";
            arrow.style.transform = "rotate(0deg)";
        }
    });
}

// start
loadQuiz();
