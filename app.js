// app.js

let currentIndex = 0;
let totalGreen = 0;
let totalRed = 0;
let lastLevel = null;
let answers = [];

/* FLAG CONFIG */

const FLAG_CONFIG = {
  GREEN: {
    title: "ผลลัพธ์ของคุณอยู่ในระดับ Green Flag",
    desc:
      "โดยรวมแล้วคุณมีวิธีคิดและวิธีรับมือกับความสัมพันธ์ค่อนข้างใช้สติ " +
      "กล้าที่จะมองทั้งตัวเองและอีกฝ่ายอย่างตรงไปตรงมา โดยไม่ทิ้งตัวเองไปจากภาพรวม"
  },
  YELLOW: {
    title: "ผลลัพธ์ของคุณอยู่ในโซน Yellow Flag",
    desc:
      "คุณไม่ได้เป็นคนแย่ แต่มีบางมุมที่ถ้าไม่ระวัง อาจทำให้ทั้งคุณและคนใกล้ตัวรู้สึกเหนื่อยซ้ำๆ " +
      "การเห็นตัวเองชัดขึ้นคือจุดเริ่มต้นของการปรับความสัมพันธ์ให้เบาสบายกว่าเดิม"
  },
  RED: {
    title: "ผลลัพธ์ของคุณเข้าใกล้ Red Flag",
    desc:
      "บางพฤติกรรมของคุณอาจกำลังทำร้ายทั้งตัวเองและคนที่ผูกพันอยู่ด้วยอย่างเงียบๆ " +
      "การยอมรับว่าบางส่วนในตัวเราต้องการการเปลี่ยนแปลง คือสัญญาณว่าคุณพร้อมฮีลตัวเองมากกว่าที่คิด"
  },
  NUCLEAR: {
    title: "ระดับสัญญาณของคุณเกิน Red Flag ไปแล้ว",
    desc:
      "ดูเหมือนว่าคุณสะสมทั้งแผลเก่าและกลไกป้องกันตัวเองจำนวนมาก จนบางครั้งทำให้คนรอบตัวสับสนไปด้วย " +
      "การค่อยๆ แยกอดีตออกจากคนที่ยืนอยู่ตรงหน้าตอนนี้ คือสิ่งสำคัญที่สุดสำหรับคุณในช่วงนี้"
  }
};

const RESULT_IMAGES = {
  GREEN: [
    "https://images.pexels.com/photos/6146920/pexels-photo-6146920.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/7974877/pexels-photo-7974877.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/15578754/pexels-photo-15578754.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  YELLOW: [
    "https://images.pexels.com/photos/4063868/pexels-photo-4063868.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4559953/pexels-photo-4559953.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3791669/pexels-photo-3791669.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  RED: [
    "https://images.pexels.com/photos/6835875/pexels-photo-6835875.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3799126/pexels-photo-3799126.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5531131/pexels-photo-5531131.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  NUCLEAR: [
    "https://images.pexels.com/photos/999267/pexels-photo-999267.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4551830/pexels-photo-4551830.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?auto=compress&cs=tinysrgb&w=800"
  ]
};

const QUOTES = {
  GREEN: [
    "คุณไม่จำเป็นต้องเป็นคนดีสำหรับทุกคน แค่ไม่ทำร้ายคนที่จริงใจกับคุณโดยตั้งใจก็เพียงพอแล้ว",
    "การดูแลความรู้สึกของตัวเองไปพร้อมกับเคารพความรู้สึกของคนอื่น คือความรับผิดชอบต่อความสัมพันธ์ที่แท้จริง",
    "คุณไม่จำเป็นต้องเข้มแข็งตลอดเวลา แต่การซื่อสัตย์กับตัวเองทำให้คุณอยู่กับความสัมพันธ์ได้อย่างสบายใจกว่าเดิม"
  ],
  YELLOW: [
    "หลายครั้งที่คุณเหนื่อย เพราะคุณพยายามเป็นคนดีในสถานการณ์ที่ตัวเองไม่สบายใจตั้งแต่แรก",
    "คุณไม่ได้เป็นคนมีปัญหา คุณแค่ยังไม่ชัดกับตัวเองมากพอว่าจริงๆ แล้วต้องการความสัมพันธ์ในรูปแบบไหน",
    "การยอมคนอื่นมากเกินไปอาจทำให้วันหนึ่งคุณหายไปจากเรื่องราวของตัวเองโดยไม่รู้ตัว"
  ],
  RED: [
    "คุณไม่ใช่คนเลว คุณแค่ใช้วิธีปกป้องตัวเองที่ทำให้คนรอบตัวเจ็บไปด้วยมากกว่าที่คุณตั้งใจ",
    "ถ้าคุณไม่เริ่มฮีลตัวเอง คุณจะพาความเจ็บแบบเดิมไปวางไว้ในทุกความสัมพันธ์ที่กำลังจะเข้ามา",
    "การกล้าดูตัวเองในมุมที่ไม่สวยที่สุด คือจุดเริ่มต้นของการเปลี่ยนแปลงที่ลึกและจริงจังกว่าที่เคย"
  ],
  NUCLEAR: [
    "ไม่ใช่ทุกคนจะรับมือกับพายุในหัวคุณได้ แต่คุณเองก็ไม่จำเป็นต้องใช้พายุนั้นทำลายทุกอย่างที่เข้าใกล้",
    "คุณไม่ได้ต้องการคนกู้ชีพตลอดเวลา คุณต้องการตัวเองเวอร์ชันที่ไม่ทำร้ายทั้งตัวเองและคนอื่นในเวลาเดียวกัน",
    "การยอมรับว่าคุณต้องการความช่วยเหลือไม่ใช่ความอ่อนแอ แต่เป็นสัญญาณว่าคุณอยากให้ชีวิตตัวเองเบากว่านี้จริงๆ"
  ]
};

/* UTILITIES */

function showSection(sectionId) {
  const sections = ["landing-section", "quiz-section", "result-section"];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = id === sectionId ? "flex" : "none";
  });
}

function resetState() {
  currentIndex = 0;
  totalGreen = 0;
  totalRed = 0;
  lastLevel = null;
  answers = new Array(QUESTIONS.length).fill(null);
  updateProgressBar();
  clearFlagClasses();
}

/* THEME + FLAG COLOR HANDLING */

function clearFlagClasses() {
  const body = document.body;
  body.classList.remove("flag-green", "flag-yellow", "flag-red", "flag-nuclear");
}

function applyFlagClass(level) {
  const body = document.body;
  clearFlagClasses();
  if (level === "GREEN") body.classList.add("flag-green");
  else if (level === "YELLOW") body.classList.add("flag-yellow");
  else if (level === "RED") body.classList.add("flag-red");
  else if (level === "NUCLEAR") body.classList.add("flag-nuclear");
}

/* QUIZ RENDERING */

function updateProgressBar() {
  const fill = document.getElementById("quiz-progress-fill");
  if (!fill) return;
  const percent = (currentIndex / QUESTIONS.length) * 100;
  fill.style.width = `${percent}%`;
}

function getFirstUnansweredIndex() {
  return answers.findIndex((v) => v === null || v === undefined);
}

function getNextUnansweredIndex(fromIndex) {
  for (let i = fromIndex + 1; i < answers.length; i++) {
    if (answers[i] === null || answers[i] === undefined) return i;
  }
  return -1;
}

function getPrevUnansweredIndex(fromIndex) {
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (answers[i] === null || answers[i] === undefined) return i;
  }
  return -1;
}

function hasUnanswered() {
  return getFirstUnansweredIndex() !== -1;
}

// เลื่อนไปยังข้อที่ยังไม่ตอบถัดไป/ก่อนหน้า (ข้ามข้อที่ตอบแล้ว)
function goToQuestion(offset) {
  if (!answers.length) return;

  if (offset > 0) {
    const next = getNextUnansweredIndex(currentIndex);
    if (next !== -1) {
      currentIndex = next;
      renderQuestion();
      return;
    }

    const firstUnanswered = getFirstUnansweredIndex();
    if (firstUnanswered !== -1 && firstUnanswered !== currentIndex) {
      currentIndex = firstUnanswered;
      renderQuestion();
      return;
    }

    // ถ้าไม่มีข้อไหนว่างแล้ว แสดงผลลัพธ์ได้เลย
    updateProgressBar();
    showResult();
    return;
  }

  if (offset < 0) {
    const prev = getPrevUnansweredIndex(currentIndex);
    if (prev !== -1) {
      currentIndex = prev;
      renderQuestion();
      return;
    }

    const firstUnanswered = getFirstUnansweredIndex();
    if (firstUnanswered !== -1 && firstUnanswered !== currentIndex) {
      currentIndex = firstUnanswered;
      renderQuestion();
    }
  }
}

function renderQuestion() {
  const current = QUESTIONS[currentIndex];
  if (!current) return;

  const currentQuestionEl = document.getElementById("current-question");
  const totalQuestionsEl = document.getElementById("total-questions");
  const questionTextEl = document.getElementById("question-text");
  const choicesContainer = document.getElementById("choices-container");

  if (currentQuestionEl) currentQuestionEl.textContent = currentIndex + 1;
  if (totalQuestionsEl) totalQuestionsEl.textContent = QUESTIONS.length;
  if (questionTextEl) questionTextEl.textContent = current.text;

  updateProgressBar();

  if (!choicesContainer) return;
  choicesContainer.innerHTML = "";

  current.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => handleAnswer(idx));
    choicesContainer.appendChild(btn);
  });
}

function handleAnswer(choiceIndex) {
  const question = QUESTIONS[currentIndex];
  const prevIndex = answers[currentIndex];

  // ถ้ามีคำตอบเดิม ให้ลบคะแนนเดิมออกก่อน
  if (prevIndex !== null && prevIndex !== undefined) {
    const prevChoice = question.choices[prevIndex];
    totalGreen -= prevChoice.green;
    totalRed -= prevChoice.red;
  }

  const choice = question.choices[choiceIndex];
  answers[currentIndex] = choiceIndex;

  totalGreen += choice.green;
  totalRed += choice.red;

  // หลังตอบ ให้ไปยังข้อที่ยังไม่ตอบถัดไป (ข้ามข้อที่ตอบแล้ว)
  if (hasUnanswered()) {
    goToQuestion(1);
  } else {
    updateProgressBar();
    showResult();
  }
}

/* RESULT LOGIC */

function getFlagLevel(greenScore, redScore) {
  const score = redScore - greenScore;
  if (score <= -10) return "GREEN";
  if (score <= 5) return "YELLOW";
  if (score <= 15) return "RED";
  return "NUCLEAR";
}

function pickRandomQuote(level) {
  const list = QUOTES[level] || [];
  if (!list.length) return "";
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function pickRandomResultImage(level) {
  const list = RESULT_IMAGES[level] || [];
  if (!list.length) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function updateStoryTemplate(level, greenScore, redScore, quote, imageUrl) {
  let flagLabelText = "";
  switch (level) {
    case "GREEN":
      flagLabelText = "PURE GREEN FLAG";
      break;
    case "YELLOW":
      flagLabelText = "SOFT YELLOW FLAG";
      break;
    case "RED":
      flagLabelText = "CERTIFIED RED FLAG";
      break;
    case "NUCLEAR":
      flagLabelText = "EXTREME RED FLAG";
      break;
    default:
      flagLabelText = "RESULT";
  }

  const flagLabelEl = document.getElementById("story-flag-label");
  const greenScoreEl = document.getElementById("story-green-score");
  const redScoreEl = document.getElementById("story-red-score");
  const quoteEl = document.getElementById("story-quote-text");
  const storyMainImgEl = document.getElementById("story-main-img");

  if (flagLabelEl) flagLabelEl.textContent = flagLabelText;
  if (greenScoreEl) greenScoreEl.textContent = greenScore;
  if (redScoreEl) redScoreEl.textContent = redScore;
  if (quoteEl) quoteEl.textContent = quote;
  if (storyMainImgEl && imageUrl) {
    storyMainImgEl.src = imageUrl;
  }
}

function showResult() {
  const level = getFlagLevel(totalGreen, totalRed);
  lastLevel = level;
  applyFlagClass(level);

  const config = FLAG_CONFIG[level];
  const quote = pickRandomQuote(level);
  const imageUrl = pickRandomResultImage(level);

  showSection("result-section");

  const flagTitleEl = document.getElementById("flag-title");
  const flagDescEl = document.getElementById("flag-desc");
  const greenScoreEl = document.getElementById("green-score");
  const redScoreEl = document.getElementById("red-score");
  const quoteTextEl = document.getElementById("quote-text");
  const resultAsideImgEl = document.querySelector(".result-aside-img");

  if (flagTitleEl) flagTitleEl.textContent = config.title;
  if (flagDescEl) flagDescEl.textContent = config.desc;
  if (greenScoreEl) greenScoreEl.textContent = totalGreen;
  if (redScoreEl) redScoreEl.textContent = totalRed;
  if (quoteTextEl) quoteTextEl.textContent = quote;
  if (resultAsideImgEl && imageUrl) {
    resultAsideImgEl.src = imageUrl;
  }

  updateStoryTemplate(level, totalGreen, totalRed, quote, imageUrl);
}

/* IG STORY IMAGE GENERATION */

function downloadStoryImage() {
  const target = document.getElementById("story-capture");
  if (!target || typeof html2canvas === "undefined") return;

  window.scrollTo(0, 0);

  // เปิดโหมดจับภาพ เพื่อบังคับไม่ให้ย่อ scale ของ story-capture
  document.body.classList.add("story-capturing");

  html2canvas(target, {
    backgroundColor: null,
    scale: 1,          // ให้ตรงกับขนาด CSS (1080x1920)
    width: 1080,
    height: 1920,
    useCORS: true
  })
    .then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "green-red-flag-result-story.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("เกิดข้อผิดพลาดในการสร้างภาพ IG Story", error);
    })
    .finally(() => {
      document.body.classList.remove("story-capturing");
    });
}

/* SHARE RESULT (WEB SHARE API) */

function shareResult() {
  if (!navigator.share) {
    alert("เบราว์เซอร์นี้ยังไม่รองรับการแชร์โดยตรง กรุณาบันทึกภาพแล้วแชร์บนโซเชียลด้วยตัวเอง");
    return;
  }

  const level = lastLevel || getFlagLevel(totalGreen, totalRed);
  const config = FLAG_CONFIG[level];
  const quote = document.getElementById("quote-text")?.textContent ?? "";

  const text =
    `${config.title}\n\n` +
    `Green score: ${totalGreen}\n` +
    `Red score: ${totalRed}\n\n` +
    `ข้อความที่สะท้อนตัวคุณ: ${quote}\n\n` +
    `ทดลองทำแบบทดสอบได้ที่ yourdomain.com`;

  navigator
    .share({
      title: "ผลลัพธ์ Green / Red Flag Test",
      text
    })
    .catch(() => {});
}

/* THEME TOGGLE */

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("theme-light")) {
    body.classList.remove("theme-light");
    body.classList.add("theme-dark");
  } else {
    body.classList.remove("theme-dark");
    body.classList.add("theme-light");
  }
}

/* INTRO OVERLAY */

function hideIntroOverlay() {
  const overlay = document.getElementById("intro-overlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 400);
}

/* INIT */

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const prevQuestionBtn = document.getElementById("prev-question-btn");
  const nextQuestionBtn = document.getElementById("next-question-btn");
  const downloadStoryBtn = document.getElementById("download-story-btn");
  const shareBtn = document.getElementById("share-btn");
  const retryBtn = document.getElementById("retry-btn");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const introEnterBtn = document.getElementById("intro-enter-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      resetState();
      showSection("quiz-section");
      renderQuestion();
    });
  }

  if (prevQuestionBtn) {
    prevQuestionBtn.addEventListener("click", () => goToQuestion(-1));
  }

  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener("click", () => goToQuestion(1));
  }

  if (downloadStoryBtn) {
    downloadStoryBtn.addEventListener("click", downloadStoryImage);
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", shareResult);
  }

  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      resetState();
      showSection("landing-section");
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  if (introEnterBtn) {
    introEnterBtn.addEventListener("click", hideIntroOverlay);
  }

  // เริ่มต้นแสดงหน้า landing (intro โผล่ทับอยู่แล้ว)
  showSection("landing-section");
});
