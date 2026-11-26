import { BANK_SOAL } from "./questions.js";

const OPTION_LETTERS = ["A", "B", "C", "D"];

let selectedCourseId = Object.keys(BANK_SOAL)[0];
let activeQuestions = [];
let currentIndex = 0;
let score = 0;
let answeredCurrent = false;
let answerHistory = [];

// DOM Elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const courseBadge = document.getElementById("courseBadge");
const headerTitle = document.getElementById("headerTitle");
const headerSubtitle = document.getElementById("headerSubtitle");

const courseSelect = document.getElementById("courseSelect");
const coursePreview = document.getElementById("coursePreview");
const questionCountSelect = document.getElementById("questionCountSelect");
const startBtn = document.getElementById("startBtn");

const questionCounter = document.getElementById("questionCounter");
const liveScore = document.getElementById("liveScore");
const progressFill = document.getElementById("progressFill");
const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const feedbackBox = document.getElementById("feedbackBox");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackExplanation = document.getElementById("feedbackExplanation");
const nextBtn = document.getElementById("nextBtn");

const finalScore = document.getElementById("finalScore");
const scorePredicate = document.getElementById("scorePredicate");
const scoreSummary = document.getElementById("scoreSummary");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");
const reviewList = document.getElementById("reviewList");

// Algoritma Fisher-Yates untuk mengacak urutan soal
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderCourseSelector() {
  courseSelect.innerHTML = "";
  coursePreview.innerHTML = "";

  Object.entries(BANK_SOAL).forEach(([id, course]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${course.kode} - ${course.nama} (${course.soal.length} Soal)`;
    courseSelect.appendChild(option);

    const card = document.createElement("div");
    card.className = `course-card ${id === selectedCourseId ? "active" : ""}`;
    card.dataset.id = id;
    card.innerHTML = `
      <div class="course-card-header">
        <span class="course-code-tag">${course.kode}</span>
        <span class="course-total-tag">${course.soal.length} Soal Tersedia</span>
      </div>
      <div class="course-card-title">${course.nama}</div>
      <div class="course-card-desc">${course.deskripsi}</div>
    `;
    card.addEventListener("click", () => setSelectedCourse(id));
    coursePreview.appendChild(card);
  });

  courseSelect.value = selectedCourseId;
}

function setSelectedCourse(id) {
  selectedCourseId = id;
  courseSelect.value = id;
  document.querySelectorAll(".course-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === id);
  });
}

courseSelect.addEventListener("change", (event) => {
  setSelectedCourse(event.target.value);
});

function startQuiz() {
  const course = BANK_SOAL[selectedCourseId];
  const shuffled = shuffle(course.soal);
  const countVal = questionCountSelect.value;

  if (countVal === "all") {
    activeQuestions = shuffled;
  } else {
    const limit = Math.min(Number(countVal), shuffled.length);
    activeQuestions = shuffled.slice(0, limit);
  }

  currentIndex = 0;
  score = 0;
  answerHistory = [];

  courseBadge.textContent = course.kode;
  headerTitle.textContent = course.nama;
  headerSubtitle.textContent = `Latihan Soal Acak (${activeQuestions.length} Soal)`;

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  renderQuestion();
}

function renderQuestion() {
  answeredCurrent = false;
  const item = activeQuestions[currentIndex];
  const total = activeQuestions.length;

  questionCounter.textContent = `Soal ${currentIndex + 1} dari ${total}`;
  liveScore.textContent = `Benar: ${score}`;
  progressFill.style.width = `${(currentIndex / total) * 100}%`;

  questionText.textContent = `${currentIndex + 1}. ${item.q}`;
  optionsList.innerHTML = "";
  feedbackBox.classList.add("hidden");
  nextBtn.classList.add("hidden");

  item.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-key">${OPTION_LETTERS[idx]}</span>
      <span>${optText}</span>
    `;
    btn.addEventListener("click", () => selectOption(idx, btn));
    optionsList.appendChild(btn);
  });
}

function selectOption(chosenIdx, chosenBtn) {
  if (answeredCurrent) return;
  answeredCurrent = true;

  const item = activeQuestions[currentIndex];
  const correctIdx = item.answer;
  const isRight = chosenIdx === correctIdx;

  const buttons = optionsList.querySelectorAll(".option-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIdx) {
      btn.classList.add("correct");
    }
  });

  if (isRight) {
    score++;
    liveScore.textContent = `Benar: ${score}`;
    feedbackBox.className = "feedback-box correct";
    feedbackTitle.textContent = "Benar! Jawaban Anda tepat.";
  } else {
    chosenBtn.classList.add("wrong");
    feedbackBox.className = "feedback-box wrong";
    feedbackTitle.textContent = `Salah. Jawaban yang benar adalah ${OPTION_LETTERS[correctIdx]}.`;
  }

  feedbackExplanation.textContent = item.explanation;
  feedbackBox.classList.remove("hidden");

  answerHistory.push({
    question: item.q,
    userAnswer: `${OPTION_LETTERS[chosenIdx]}. ${item.options[chosenIdx]}`,
    correctAnswer: `${OPTION_LETTERS[correctIdx]}. ${item.options[correctIdx]}`,
    isRight,
    explanation: item.explanation
  });

  progressFill.style.width = `${((currentIndex + 1) / activeQuestions.length) * 100}%`;
  nextBtn.textContent =
    currentIndex === activeQuestions.length - 1 ? "Lihat Skor Akhir" : "Soal Berikutnya";
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < activeQuestions.length) {
    renderQuestion();
  } else {
    renderResult();
  }
});

function renderResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const total = activeQuestions.length;
  const wrong = total - score;
  const finalValue = Math.round((score / total) * 100);

  headerSubtitle.textContent = "Rekap Hasil Latihan UAS";
  finalScore.textContent = finalValue;
  correctCount.textContent = score;
  wrongCount.textContent = wrong;
  scoreSummary.textContent = `Anda menjawab benar ${score} dari ${total} soal (${finalValue}%).`;

  if (finalValue >= 85) {
    scorePredicate.textContent = "Luar Biasa! Sangat Siap UAS";
  } else if (finalValue >= 70) {
    scorePredicate.textContent = "Bagus! Pemahaman Sudah Kuat";
  } else if (finalValue >= 55) {
    scorePredicate.textContent = "Cukup Baik, Pelajari Lagi Pembahasannya";
  } else {
    scorePredicate.textContent = "Tetap Semangat, Ulangi Latihannya!";
  }

  reviewList.innerHTML = "";
  answerHistory.forEach((entry, idx) => {
    const card = document.createElement("div");
    card.className = `review-card ${entry.isRight ? "is-correct" : "is-wrong"}`;
    card.innerHTML = `
      <div class="review-question">${idx + 1}. ${entry.question}</div>
      <div class="review-meta">Jawaban Anda: <strong>${entry.userAnswer}</strong> (${entry.isRight ? "Benar" : "Salah"})</div>
      ${!entry.isRight ? `<div class="review-meta">Kunci Jawaban: <strong>${entry.correctAnswer}</strong></div>` : ""}
      <div><em>Penjelasan:</em> ${entry.explanation}</div>
    `;
    reviewList.appendChild(card);
  });
}

// Dukungan shortcut keyboard (A/B/C/D dan Enter)
document.addEventListener("keydown", (event) => {
  if (quizScreen.classList.contains("hidden")) return;

  const key = event.key.toUpperCase();
  const keyIndex = OPTION_LETTERS.indexOf(key);
  if (keyIndex !== -1 && !answeredCurrent) {
    const buttons = optionsList.querySelectorAll(".option-btn");
    if (buttons[keyIndex]) {
      buttons[keyIndex].click();
    }
  } else if (event.key === "Enter" && answeredCurrent && !nextBtn.classList.contains("hidden")) {
    nextBtn.click();
  }
});

startBtn.addEventListener("click", startQuiz);
retryBtn.addEventListener("click", startQuiz);
homeBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  courseBadge.textContent = "SIMULASI UAS UT";
  headerTitle.textContent = "Kuis Interaktif Latihan UAS";
  headerSubtitle.textContent = "Pilih mata kuliah dan uji pemahamanmu secara acak";
});

renderCourseSelector();
