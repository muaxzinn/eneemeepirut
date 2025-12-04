// app.js

let currentIndex = 0;
let totalGreen = 0;
let totalRed = 0;
let lastLevel = null;
let answers = [];
let shuffledQuestions = []; // คำถามที่มีตัวเลือกสลับแล้ว (แต่ลำดับคำถามยังเหมือนเดิม)
let choiceMappings = []; // mapping จาก shuffled choice index กลับไปยัง original choice index ของแต่ละคำถาม

/* FLAG CONFIG */

const FLAG_CONFIG = {
  GREEN: {
    title: "ผลลัพธ์ของคุณอยู่ในระดับ Green Flag",
    desc:
      "โดยรวมแล้วคุณมีวิธีคิดและวิธีรับมือกับความสัมพันธ์ค่อนข้างใช้สติ " +
      "กล้าที่จะมองทั้งตัวเองและอีกฝ่ายอย่างตรงไปตรงมา โดยไม่ทิ้งตัวเองไปจากภาพรวม"
  },
  SOFT_GREEN: {
    title: "ผลลัพธ์ของคุณอยู่ในโซน Soft Green Flag",
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
    "assets/image/green/Teodora (@sephirothrule34) on X.jpeg",
    "assets/image/green/ดาวน์โหลด (7).jpeg"
  ],
  SOFT_GREEN: [
    "assets/image/soft green/ดาวน์โหลด (5).jpeg",
    "assets/image/soft green/ดาวน์โหลด (6).jpeg"
  ],
  RED: [
    "assets/image/red/ดาวน์โหลด (1).jpeg",
    "assets/image/red/ดาวน์โหลด (2).jpeg",
    "assets/image/red/ดาวน์โหลด (4).jpeg"
  ],
  NUCLEAR: [
    "assets/image/nuclear/hell nah.jpeg"
  ]
};

const QUOTES = {
  GREEN: [
    "คุณไม่จำเป็นต้องเป็นคนดีสำหรับทุกคน แค่ไม่ทำร้ายคนที่จริงใจกับคุณโดยตั้งใจก็เพียงพอแล้ว",
    "การดูแลความรู้สึกของตัวเองไปพร้อมกับเคารพความรู้สึกของคนอื่น คือความรับผิดชอบต่อความสัมพันธ์ที่แท้จริง",
    "คุณไม่จำเป็นต้องเข้มแข็งตลอดเวลา แต่การซื่อสัตย์กับตัวเองทำให้คุณอยู่กับความสัมพันธ์ได้อย่างสบายใจกว่าเดิม"
  ],
  SOFT_GREEN: [
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

// ฟังก์ชันสลับ array แบบ Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// สร้างคำถามที่มีตัวเลือกสลับแล้ว (แต่ลำดับคำถามยังเหมือนเดิม)
function initializeShuffledQuestions() {
  // ไม่สลับลำดับคำถาม แค่สลับตัวเลือกในแต่ละคำถาม
  choiceMappings = [];
  shuffledQuestions = QUESTIONS.map((question) => {
    const shuffledChoices = shuffleArray(question.choices);
    
    // สร้าง mapping จาก shuffled choice index กลับไปยัง original choice index
    const choiceMapping = shuffledChoices.map(shuffledChoice =>
      question.choices.findIndex(origChoice => 
        origChoice.text === shuffledChoice.text &&
        origChoice.green === shuffledChoice.green &&
        origChoice.red === shuffledChoice.red
      )
    );
    choiceMappings.push(choiceMapping);
    
    return {
      ...question,
      choices: shuffledChoices
    };
  });
}

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
  initializeShuffledQuestions(); // สร้างคำถามและตัวเลือกที่สลับใหม่ทุกครั้ง
  updateProgressBar();
  clearFlagClasses();
}

/* THEME + FLAG COLOR HANDLING */

function clearFlagClasses() {
  const body = document.body;
  body.classList.remove("flag-green", "flag-soft-green", "flag-red", "flag-nuclear");
}

function applyFlagClass(level) {
  const body = document.body;
  clearFlagClasses();
  if (level === "GREEN") body.classList.add("flag-green");
  else if (level === "SOFT_GREEN") body.classList.add("flag-soft-green");
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
  for (let i = fromIndex + 1; i < QUESTIONS.length; i++) {
    if (answers[i] === null || answers[i] === undefined) {
      return i;
    }
  }
  return -1;
}

function getPrevUnansweredIndex(fromIndex) {
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (answers[i] === null || answers[i] === undefined) {
      return i;
    }
  }
  return -1;
}

function hasUnanswered() {
  return answers.some((v) => v === null || v === undefined);
}

// เลื่อนไปยังข้อที่ยังไม่ตอบถัดไป/ก่อนหน้า
function goToQuestion(offset) {
  if (!answers.length) return;

  if (offset > 0) {
    // ปุ่ม "ถัดไป" - ข้ามไปยังข้อที่ยังไม่ตอบ
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
    // ปุ่ม "ก่อนหน้า" - ไปยังข้อก่อนหน้าตามลำดับปกติ (ไม่ข้าม) เพื่อให้แก้ไขคำตอบได้
    const newIndex = currentIndex + offset;
    if (newIndex >= 0) {
      currentIndex = newIndex;
      renderQuestion();
      return;
    }
    // ถ้าเป็นข้อแรกแล้ว ไม่ต้องทำอะไร
  }
}

function renderQuestion() {
  const current = shuffledQuestions[currentIndex];
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

  // ตรวจสอบว่ามีคำตอบเดิมหรือไม่
  const prevAnswer = answers[currentIndex];
  const choiceMapping = choiceMappings[currentIndex];
  
  // ถ้ามีคำตอบเดิม หา index ใน shuffled choices ที่ตรงกับคำตอบเดิม
  let selectedShuffledIndex = -1;
  if (prevAnswer !== null && prevAnswer !== undefined) {
    selectedShuffledIndex = choiceMapping.findIndex(origIdx => origIdx === prevAnswer);
  }

  current.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    
    // ถ้าเป็นตัวเลือกที่ตอบไปแล้ว ให้เพิ่ม class selected
    if (idx === selectedShuffledIndex) {
      btn.classList.add("selected");
    }
    
    btn.textContent = choice.text;
    btn.addEventListener("click", () => handleAnswer(idx));
    choicesContainer.appendChild(btn);
  });
}

function handleAnswer(choiceIndex) {
  const question = shuffledQuestions[currentIndex];
  const choiceMapping = choiceMappings[currentIndex];
  
  // แปลง shuffled choice index กลับไปยัง original choice index
  const originalChoiceIndex = choiceMapping[choiceIndex];
  
  const prevAnswer = answers[currentIndex];
  
  // ถ้ามีคำตอบเดิม ให้ลบคะแนนเดิมออกก่อน
  if (prevAnswer !== null && prevAnswer !== undefined) {
    const originalQuestion = QUESTIONS[currentIndex];
    const prevChoice = originalQuestion.choices[prevAnswer];
    totalGreen -= prevChoice.green;
    totalRed -= prevChoice.red;
  }

  const originalQuestion = QUESTIONS[currentIndex];
  const choice = originalQuestion.choices[originalChoiceIndex];
  
  // บันทึกคำตอบด้วย original choice index
  answers[currentIndex] = originalChoiceIndex;

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
  if (score <= -20) return "GREEN";
  if (score <= -5) return "SOFT_GREEN";
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

function updateStoryTemplate(level, greenScore, redScore, quote, imageUrl, title, desc) {
  let flagLabelText = "";
  switch (level) {
    case "GREEN":
      flagLabelText = "PURE GREEN FLAG";
      break;
    case "SOFT_GREEN":
      flagLabelText = "SOFT GREEN FLAG";
      break;
    case "RED":
      flagLabelText = "RED FLAG WARNING ZONE";
      break;
    case "NUCLEAR":
      flagLabelText = "EXTREME RED FLAG";
      break;
    default:
      flagLabelText = "RESULT";
  }

  const flagLabelEl = document.getElementById("story-flag-label");
  const flagTitleEl = document.getElementById("story-flag-title");
  const flagDescEl = document.getElementById("story-flag-desc");
  const greenScoreEl = document.getElementById("story-green-score");
  const redScoreEl = document.getElementById("story-red-score");
  const quoteEl = document.getElementById("story-quote-text");
  const storyMainImgEl = document.getElementById("story-main-img");

  if (flagLabelEl) flagLabelEl.textContent = flagLabelText;
  if (flagTitleEl && title) flagTitleEl.textContent = title;
  if (flagDescEl && desc) flagDescEl.textContent = desc;
  if (greenScoreEl) greenScoreEl.textContent = greenScore;
  if (redScoreEl) redScoreEl.textContent = redScore;
  if (quoteEl) quoteEl.textContent = quote;
  if (storyMainImgEl && imageUrl) {
    // ตรวจสอบว่าเป็น local file หรือ external URL
    if (imageUrl.startsWith('assets/') || imageUrl.startsWith('./assets/')) {
      // Local file ไม่มีปัญหา CORS ใช้ได้เลย
      storyMainImgEl.src = imageUrl;
    } else {
      // External URL ต้องแปลงเป็น base64 เพื่อแก้ปัญหา CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
      
      fetch(proxyUrl)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.blob();
        })
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .then(base64 => {
          storyMainImgEl.src = base64;
        })
        .catch(error => {
          console.error('Error loading image with proxy, trying direct:', error);
          // ถ้า proxy ไม่ได้ ลอง fetch โดยตรง
          fetch(imageUrl)
            .then(response => {
              if (!response.ok) throw new Error('Network response was not ok');
              return response.blob();
            })
            .then(blob => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            })
            .then(base64 => {
              storyMainImgEl.src = base64;
            })
            .catch(error2 => {
              console.error('Error loading image directly:', error2);
              // ถ้า fetch ไม่ได้เลย ให้ใช้ URL เดิม
              storyMainImgEl.src = imageUrl;
            });
        });
    }
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
    // ใช้รูปเดียวกันกับ story และแสดงภาพเต็ม
    if (imageUrl.startsWith('assets/') || imageUrl.startsWith('./assets/')) {
      // Local file ไม่มีปัญหา CORS ใช้ได้เลย
      resultAsideImgEl.src = imageUrl;
    } else {
      // External URL ต้องแปลงเป็น base64 เพื่อแก้ปัญหา CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
      
      fetch(proxyUrl)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.blob();
        })
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .then(base64 => {
          resultAsideImgEl.src = base64;
        })
        .catch(error => {
          console.error('Error loading image with proxy, trying direct:', error);
          // ถ้า proxy ไม่ได้ ลอง fetch โดยตรง
          fetch(imageUrl)
            .then(response => {
              if (!response.ok) throw new Error('Network response was not ok');
              return response.blob();
            })
            .then(blob => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            })
            .then(base64 => {
              resultAsideImgEl.src = base64;
            })
            .catch(error2 => {
              console.error('Error loading image directly:', error2);
              // ถ้า fetch ไม่ได้เลย ให้ใช้ URL เดิม
              resultAsideImgEl.src = imageUrl;
            });
        });
    }
  }

  updateStoryTemplate(level, totalGreen, totalRed, quote, imageUrl, config.title, config.desc);
}

/* IG STORY IMAGE GENERATION */

function downloadStoryImage() {
  const target = document.getElementById("story-capture");
  if (!target || typeof html2canvas === "undefined") return;

  window.scrollTo(0, 0);

  // เปิดโหมดจับภาพ เพื่อบังคับไม่ให้ย่อ scale ของ story-capture
  document.body.classList.add("story-capturing");

  // รอให้รูปภาพโหลดเสร็จก่อนจับภาพ
  const storyMainImg = document.getElementById("story-main-img");
  
  function captureImage() {
    // ใช้ scale สูงขึ้นเพื่อให้ภาพคมชัด โดยเฉพาะในมือถือ
    const devicePixelRatio = window.devicePixelRatio || 2;
    const scale = Math.max(2, devicePixelRatio); // อย่างน้อย 2x เพื่อความคมชัด

    html2canvas(target, {
      backgroundColor: null,
      scale: scale,     // เพิ่ม scale เพื่อความคมชัด
      width: 1080,
      height: 1920,
      useCORS: true,
      allowTaint: true, // เปลี่ยนเป็น true เพื่อให้จับภาพ base64 ได้
      logging: false,
      imageTimeout: 20000 // เพิ่ม timeout สำหรับรูปภาพ
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
        alert("เกิดข้อผิดพลาดในการสร้างภาพ กรุณาลองใหม่อีกครั้ง");
      })
      .finally(() => {
        document.body.classList.remove("story-capturing");
      });
  }

  // ตรวจสอบว่ารูปภาพโหลดเสร็จแล้วหรือยัง
  if (storyMainImg) {
    if (storyMainImg.complete && storyMainImg.naturalHeight !== 0) {
      // รูปภาพโหลดเสร็จแล้ว
      setTimeout(captureImage, 300); // รอสักครู่เพื่อให้แน่ใจว่า render เสร็จ
    } else {
      // รอให้รูปภาพโหลดเสร็จ
      const checkImageLoaded = () => {
        if (storyMainImg.complete && storyMainImg.naturalHeight !== 0) {
          setTimeout(captureImage, 300);
        } else {
          setTimeout(checkImageLoaded, 100);
        }
      };
      
      storyMainImg.onload = () => {
        setTimeout(captureImage, 300);
      };
      
      storyMainImg.onerror = () => {
        // ถ้ารูปภาพโหลดไม่ได้ ให้จับภาพเลย (ไม่มีรูป)
        setTimeout(captureImage, 300);
      };
      
      // เริ่มตรวจสอบ
      checkImageLoaded();
      
      // ถ้า timeout 5 วินาที ให้จับภาพเลย
      setTimeout(() => {
        if (!storyMainImg.complete || storyMainImg.naturalHeight === 0) {
          captureImage();
        }
      }, 5000);
    }
  } else {
    // ไม่มีรูปภาพ ให้จับภาพเลย
    setTimeout(captureImage, 100);
  }
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
    `ทดลองทำแบบทดสอบได้ที่ muaxzinn.github.io/eneemeepirut`;

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
  
  // เริ่มต้นสร้าง shuffled questions เพื่อให้พร้อมใช้งาน
  initializeShuffledQuestions();
});
