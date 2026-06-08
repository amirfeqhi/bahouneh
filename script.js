let selectedSituation = '';
let currentExcuse = '';
let history = [];

// Situation button selection
document.querySelectorAll('.situation-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.situation-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSituation = btn.dataset.situation;
    document.getElementById('customSituation').value = '';
  });
});

document.getElementById('customSituation').addEventListener('input', function() {
  if (this.value.trim()) {
    document.querySelectorAll('.situation-btn').forEach(b => b.classList.remove('active'));
    selectedSituation = '';
  }
});

async function generateExcuse() {
  const customText = document.getElementById('customSituation').value.trim();
  const situation = customText || selectedSituation;

  if (!situation) {
    // shake the grid
    const grid = document.getElementById('situationGrid');
    grid.style.animation = 'shake 0.4s ease';
    setTimeout(() => grid.style.animation = '', 400);
    document.getElementById('customSituation').focus();
    return;
  }

  const severity = document.getElementById('severity').value;
  const style = document.getElementById('style').value;

  const btn = document.getElementById('generateBtn');
  const btnContent = document.getElementById('btnContent');
  btn.disabled = true;
  btnContent.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> <span>دارم بهونه می‌بافم...</span>';

  const resultCard = document.getElementById('resultCard');
  const excuseText = document.getElementById('excuseText');
  const tipBox = document.getElementById('tipBox');
  const tipText = document.getElementById('tipText');

  resultCard.classList.add('visible');
  excuseText.innerHTML = '<span class="cursor"></span>';
  tipBox.classList.remove('visible');

  const prompt = `تو یه بهونه‌ساز حرفه‌ای ایرانی هستی. 
  
موقعیت: ${situation}
شدت بهونه: ${severity}
سبک: ${style}

یه بهونه کاملاً ایرانی، باورپذیر (یا نه!)، و ${style} برای این موقعیت بنویس.
بهونه باید:
- کاملاً به فارسی محاوره‌ای باشه
- حس ایرانی داشته باشه (می‌تونی از ترافیک، فامیل، مریضی ناگهانی، برق رفتن، و اتفاقات کلاسیک ایرانی استفاده کنی)
- بین ۳ تا ۵ جمله باشه
- ${severity === 'کاملاً پرت و باورنکردنی' ? 'کاملاً احمقانه و خنده‌دار باشه' : 'طبیعی به نظر برسه'}

بعد از بهونه، یه "نکته کاربردی" کوتاه (یک جمله) بنویس که بگه چطور این بهونه رو بهتر بگیم، شروعش رو با "💡 نکته:" بذار.

فقط متن بهونه و نکته رو بنویس، هیچ توضیح اضافه‌ای نده.`;

  try {
    // آدرس Cloudflare Worker خودت رو اینجا بذار
    const WORKER_URL = 'https://bahouneh.amirfeqhi.workers.dev';

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    excuseText.innerHTML = '<span class="cursor"></span>';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;

              // Split excuse and tip
              const tipSplit = fullText.split('💡 نکته:');
              const excusePart = tipSplit[0].trim();
              const tipPart = tipSplit[1] ? tipSplit[1].trim() : '';

              excuseText.innerHTML = excusePart + '<span class="cursor"></span>';

              if (tipPart) {
                tipBox.classList.add('visible');
                tipText.textContent = tipPart;
              }
            }
          } catch(e) {}
        }
      }
    }

    // Final cleanup
    currentExcuse = fullText.split('💡 نکته:')[0].trim();
    excuseText.innerHTML = currentExcuse;

    // Update quality stars based on severity
    updateStars(severity);

    // Add to history
    addToHistory(situation, currentExcuse);

  } catch (err) {
    excuseText.innerHTML = '⚠️ یه مشکل پیش اومد! شاید اینترنت قطعه... (این خودش یه بهونه‌ست 😄)';
  }

  btn.disabled = false;
  btnContent.innerHTML = '<span>🎯</span><span>یه بهونه دیگه بساز!</span>';
}

function updateStars(severity) {
  const stars = document.getElementById('qualityStars');
  const counts = {
    'ساده و معقول': 3,
    'کمی اغراق‌آمیز': 4,
    'خیلی دراماتیک و هیجانی': 5,
    'کاملاً پرت و باورنکردنی': 5
  };
  const count = counts[severity] || 4;
  stars.innerHTML = Array(5).fill(0).map((_, i) =>
    `<span class="star" style="opacity:${i < count ? 1 : 0.2}">★</span>`
  ).join('');
}

function addToHistory(situation, excuse) {
  history.unshift({ situation, excuse });
  if (history.length > 5) history.pop();

  const section = document.getElementById('historySection');
  const list = document.getElementById('historyList');
  section.style.display = 'block';

  list.innerHTML = history.map((h, i) => `
    <div class="history-item" onclick="showHistoryItem(${i})">
      <span>${h.excuse.slice(0, 80)}${h.excuse.length > 80 ? '...' : ''}</span>
      <span class="history-tag">${h.situation.slice(0, 12)}</span>
    </div>
  `).join('');
}

function showHistoryItem(i) {
  const h = history[i];
  document.getElementById('excuseText').textContent = h.excuse;
  document.getElementById('resultCard').classList.add('visible');
  currentExcuse = h.excuse;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function copyExcuse() {
  if (!currentExcuse) return;
  try {
    await navigator.clipboard.writeText(currentExcuse);
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ کپی شد!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 کپی کن';
      btn.classList.remove('copied');
    }, 2000);
  } catch(e) {}
}

function shareWhatsApp() {
  if (!currentExcuse) return;
  const text = encodeURIComponent('بهونه‌ام رو ببین 😂\n\n' + currentExcuse + '\n\n(ساخته‌شده با بهونه 🫖)');
  window.open('https://wa.me/?text=' + text, '_blank');
}

function shareTelegram() {
  if (!currentExcuse) return;
  const text = encodeURIComponent('بهونه‌ام رو ببین 😂\n\n' + currentExcuse + '\n\n(ساخته‌شده با بهونه 🫖)');
  window.open('https://t.me/share/url?url=https://github.com/amirfeqhi&text=' + text, '_blank');
}

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
}`;
document.head.appendChild(style);