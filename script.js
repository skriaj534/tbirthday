/* ============================================================
   TANIYA'S BIRTHDAY UNIVERSE — script.js
   Edit HER_NAME / MY_NAME below to reuse this for someone else.
   ============================================================ */
(() => {
  'use strict';

  const HER_NAME = "Taniya";
  const MY_NAME  = "Riyaz";
  const TOTAL_PAGES = 7;

  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------- ambient background: stars + hearts ---------------- */
  function initStars(){
    const layer = $('#stars');
    const n = window.innerWidth < 420 ? 40 : 60;
    let html = '';
    for(let i=0;i<n;i++){
      const top = Math.random()*100, left = Math.random()*100;
      const dur = (2 + Math.random()*3).toFixed(2);
      const delay = (Math.random()*4).toFixed(2);
      const size = (Math.random()<0.15) ? 3 : 2;
      html += `<div class="star" style="top:${top}%;left:${left}%;--dur:${dur}s;--delay:${delay}s;width:${size}px;height:${size}px;"></div>`;
    }
    layer.innerHTML = html;
  }

  let heartLoopId = null;
  function spawnAmbientHeart(){
    const layer = $('#hearts-layer');
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.textContent = ['💜','💗','✨','💫'][Math.floor(Math.random()*4)];
    const left = Math.random()*100;
    const dur = 7 + Math.random()*6;
    const drift = (Math.random()*60-30).toFixed(0)+'px';
    el.style.left = left+'%';
    el.style.fontSize = (0.9+Math.random()*0.9).toFixed(2)+'rem';
    el.style.setProperty('--drift', drift);
    el.style.animationDuration = dur+'s';
    layer.appendChild(el);
    setTimeout(()=>el.remove(), dur*1000+200);
  }
  function startAmbientHearts(){
    if(heartLoopId) return;
    heartLoopId = setInterval(spawnAmbientHeart, 1400);
  }

  /* ---------------- confetti + burst fx ---------------- */
  const FX_COLORS = ['#ff2d95','#a855f7','#38bdf8','#ff7ac6','#c4b5fd'];
  function confettiBurst(count=60){
    const layer = $('#fx-layer');
    const w = window.innerWidth;
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const x = Math.random()*w;
      const color = FX_COLORS[Math.floor(Math.random()*FX_COLORS.length)];
      const dur = (2.2 + Math.random()*1.6).toFixed(2);
      const delay = (Math.random()*0.4).toFixed(2);
      const rot = (Math.random()*720-360).toFixed(0)+'deg';
      el.style.left = x+'px';
      el.style.background = color;
      el.style.borderRadius = Math.random()<0.5 ? '50%' : '2px';
      el.style.animationDuration = dur+'s';
      el.style.animationDelay = delay+'s';
      el.style.setProperty('--rot', rot);
      layer.appendChild(el);
      setTimeout(()=>el.remove(), (parseFloat(dur)+parseFloat(delay))*1000+150);
    }
  }
  function heartBurst(originEl, count=14){
    const layer = $('#fx-layer');
    const rect = originEl ? originEl.getBoundingClientRect() : {left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0};
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'burst-heart';
      el.textContent = Math.random()<0.5 ? '💜':'💗';
      const angle = Math.random()*Math.PI*2;
      const dist = 60+Math.random()*90;
      el.style.left = cx+'px'; el.style.top = cy+'px';
      el.style.setProperty('--bx', (Math.cos(angle)*dist).toFixed(0)+'px');
      el.style.setProperty('--by', (Math.sin(angle)*dist - 40).toFixed(0)+'px');
      layer.appendChild(el);
      setTimeout(()=>el.remove(), 950);
    }
  }

  /* ---------------- music ---------------- */
  const audio = new Audio('assets/birthday-music.mp3');
  audio.loop = true;
  audio.volume = 0.55;
  let musicStarted = false, musicPlaying = false;

  function tryStartMusic(){
    if(musicStarted) return;
    musicStarted = true;
    audio.play().then(()=>{
      musicPlaying = true;
      $('#music-btn').classList.add('playing');
    }).catch(()=>{
      // Autoplay blocked or file missing — user can tap the button.
      musicPlaying = false;
    });
  }
  function toggleMusic(){
    if(!musicStarted){ tryStartMusic(); return; }
    if(musicPlaying){
      audio.pause(); musicPlaying = false;
      $('#music-btn').classList.remove('playing');
    } else {
      audio.play().then(()=>{
        musicPlaying = true;
        $('#music-btn').classList.add('playing');
      }).catch(()=>{});
    }
  }
  function musicEnergize(){
    // subtle little "lift" on the final reveal
    if(musicPlaying){
      audio.volume = 0.75;
      setTimeout(()=>{ audio.volume = 0.55; }, 4000);
    }
  }

  /* ---------------- page navigation ---------------- */
  let currentPage = 1;
  function buildProgressDots(){
    const track = $('#dot-track');
    let html = '';
    for(let i=1;i<=TOTAL_PAGES;i++) html += `<span class="dot" data-i="${i}"></span>`;
    track.innerHTML = html;
  }
  function updateProgress(){
    $('#progress-num').textContent = String(currentPage).padStart(2,'0');
    $$('#dot-track .dot').forEach(d=>{
      d.classList.toggle('done', parseInt(d.dataset.i,10) <= currentPage);
    });
  }
  function goToPage(n){
    if(n < 1 || n > TOTAL_PAGES) return;
    $$('.page').forEach(p=>p.classList.remove('active'));
    const target = $(`#page-${n}`);
    target.classList.add('active');
    currentPage = n;
    updateProgress();
    window.scrollTo({top:0, behavior:'instant' in document.documentElement.style ? 'instant' : 'auto'});
    // trigger any page-specific onEnter behavior
    const handler = pageEnterHandlers[n];
    if(handler) handler();
  }

  /* ---------------- PAGE 1: terminal + riddle ---------------- */
  const terminalLines = [
    { text: 'Initializing birthday protocol' , dots:true },
    { text: 'Loading memories...' },
    { text: 'Searching for birthday girl...' },
    { text: `Target found ❤️` , ok:true },
    { text: 'System status: TOO CUTE TO HANDLE', ok:true },
  ];
  let terminalPlayed = false;
  function playTerminal(){
    if(terminalPlayed) return;
    terminalPlayed = true;
    const box = $('#terminal-lines');
    box.innerHTML = '';
    let i = 0;
    function next(){
      if(i >= terminalLines.length){
        setTimeout(()=>{
          $('#terminal-stage').style.display = 'none';
          $('#hey-stage').style.display = 'flex';
          $('#hey-stage').style.animation = 'pageIn .5s ease both';
        }, 500);
        return;
      }
      const item = terminalLines[i];
      const div = document.createElement('div');
      div.className = 'line';
      div.innerHTML = item.ok ? item.text.replace(/(❤️|TOO CUTE TO HANDLE)/,'<span class="ok">$1</span>') : item.text;
      box.appendChild(div);
      requestAnimationFrame(()=> div.classList.add('show'));
      i++;
      setTimeout(next, 620);
    }
    next();
  }

  const riddleReactions = ["Nice try 😂","Hmm, suspicious answer 👀","We'll allow it 😌","Correct-ish. Close enough ❤️"];
  function initRiddle(){
    $$('#riddle-choices .choice').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        $$('#riddle-choices .choice').forEach(b=>b.classList.remove('picked'));
        btn.classList.add('picked');
        $('#riddle-reaction').textContent = riddleReactions[Math.floor(Math.random()*riddleReactions.length)];
        setTimeout(()=>{
          $('#riddle-stage').style.display = 'none';
          $('#granted-stage').style.display = 'flex';
          $('#granted-stage').style.animation = 'pageIn .5s ease both';
        }, 900);
      }, {once:false});
    });
  }

  /* ---------------- PAGE 2: countdown ---------------- */
  let countdownPlayed = false;
  function playCountdown(){
    if(countdownPlayed) return;
    countdownPlayed = true;
    const numEl = $('#countdown-num');
    const seq = ['3','2','1'];
    let i = 0;
    function step(){
      if(i < seq.length){
        numEl.style.animation = 'none';
        void numEl.offsetWidth;
        numEl.textContent = seq[i];
        numEl.style.animation = 'pop .5s cubic-bezier(.2,1.6,.4,1)';
        i++;
        setTimeout(step, 700);
      } else {
        $('#countdown-stage').style.display = 'none';
        $('#reveal-stage').style.display = 'flex';
        $('#reveal-stage').style.animation = 'pageIn .5s ease both';
        confettiBurst(70);
        heartBurst(null, 18);
      }
    }
    step();
  }

  /* ---------------- PAGE 3: favorites quiz ---------------- */
  const quizQuestions = [
    { q:"What's your favorite food? 🍕🍫", opts:["Pizza 🍕","Chocolate 🍫","Biryani 🍗","Something else 😋"] },
    { q:"What's your paln to spend a lazy day with riyaz? 😴", opts:["Sleeping 😴","Watching movies 🎬","Scrolling on my phone 📱",`Talking with ${MY_NAME} ❤️`] },
    { q:"What's your favorite type of music? 🎵", opts:["Romantic ❤️","Sad 🥲","Chill 🌙","Party 🔥"] },
    { q:"What's your dream place to visit? ✈️🌍", opts:["Beach 🏖️","Mountains 🏔️","Big city 🌃",`Somewhere with ${MY_NAME} ❤️`] },
    { q:"What's your favorite person? 👀❤️", opts:["Only Riyaz ❤️","Riyaz and Riyaz 🥰","My  Riyaz 😎",`${MY_NAME} 😌❤️`] },
  ];
  const quizReactions = ["Also riyaz's 👀","Okay, I'll remember that ❤️","Interesting choice 😂",`${MY_NAME}'s surely bring you there❤️`,"Ab mereko saram ati re baba❤️"];
  let quizIndex =0;
  const quizAnswers = [];

  function renderQuiz(){
    const q = quizQuestions[quizIndex];
    $('#quiz-progress').textContent = `Question ${quizIndex+1} of ${quizQuestions.length}`;
    $('#quiz-question').textContent = q.q;
    $('#quiz-reaction').textContent = '';
    const wrap = $('#quiz-choices');
    wrap.innerHTML = '';
    q.opts.forEach(opt=>{
      const b = document.createElement('button');
      b.className = 'choice';
      b.textContent = opt;
      b.addEventListener('click', ()=> handleQuizAnswer(opt, b));
      wrap.appendChild(b);
    });
  }
  function handleQuizAnswer(opt, btnEl){
    $$('#quiz-choices .choice').forEach(b=> b.disabled = true);
    btnEl.classList.add('picked');
    quizAnswers.push({q: quizQuestions[quizIndex].q, a: opt});
    $('#quiz-reaction').textContent = quizReactions[Math.floor(Math.random()*quizReactions.length)];
    setTimeout(()=>{
      quizIndex++;
      if(quizIndex < quizQuestions.length){
        renderQuiz();
      } else {
        showQuizSummary();
      }
    }, 850);
  }
  function showQuizSummary(){
    $('#quiz-live').style.display = 'none';
    const sum = $('#quiz-summary');
    sum.style.display = 'flex';
    sum.style.animation = 'pageIn .5s ease both';
    const list = $('#summary-list');
    list.innerHTML = '';
    quizAnswers.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'summary-row';
      const qShort = item.q.replace(/[^\w\s?'.]/g,'').split('?')[0] + '?';
      row.innerHTML = `<span>${qShort}</span><b>${item.a}</b>`;
      list.appendChild(row);
    });
  }
  function initQuiz(){ quizIndex = 0; quizAnswers.length = 0; $('#quiz-live').style.display='flex'; $('#quiz-summary').style.display='none'; renderQuiz(); }

  /* ---------------- PAGE 4: the love trap ---------------- */
  const trapMessages = [
    "Nice try 😂","NO button is currently on vacation.","Error 404: NO not found.",
    "Your finger slipped. Try YES ❤️","The system rejected your answer 😌","Are you REALLY sure? 👀",
    "I think you meant YES.","Stop trying to escape 😂❤️","This button doesn't work on ex-buttons privileges 👀",
    "Access denied. Try the pink one."
  ];
  let trapAttempts = 0;
  let trapWon = false;

  function moveNoButton(){
    const stage = $('#trap-stage');
    const btn = $('#no-btn');
    const yesBtn = $('#yes-btn');
    const stageRect = stage.getBoundingClientRect();
    const btnW = btn.offsetWidth || 100, btnH = btn.offsetHeight || 52;
    const pad = 10;

    // roam within the viewport (fixed position) so it always stays visible
    const vw = window.innerWidth, vh = window.innerHeight;
    const minX = pad, maxX = vw - btnW - pad;
    const minY = Math.max(pad, stageRect.top);
    const maxY = Math.min(vh - btnH - pad, stageRect.bottom - btnH);

    const yesRect = yesBtn.getBoundingClientRect();
    let x, y, tries = 0;
    do {
      x = minX + Math.random()*(maxX-minX);
      y = minY + Math.random()*Math.max(1,(maxY-minY));
      tries++;
    } while (
      tries < 12 &&
      x < yesRect.right+16 && x+btnW > yesRect.left-16 &&
      y < yesRect.bottom+16 && y+btnH > yesRect.top-16
    );

    if(!btn.classList.contains('roaming')){
      btn.classList.add('roaming');
    }
    btn.style.left = x+'px';
    btn.style.top = y+'px';

    if(trapAttempts>0 && trapAttempts % 3 === 0){
      const scale = Math.max(0.68, 1 - trapAttempts*0.03);
      btn.style.transform = `scale(${scale})`;
    }
  }

  function initLoveTrap(){
    trapAttempts = 0; trapWon = false;
    const btn = $('#no-btn');
    btn.classList.remove('roaming');
    btn.style.left = ''; btn.style.top=''; btn.style.transform='';
    btn.textContent = 'NO 😈';
    btn.disabled = false;
    $('#trap-msg').textContent = '';
    $('#trap-cta').style.display = 'none';
    $('#yes-btn').textContent = 'YES I do ❤️';
    $('#yes-btn').classList.remove('won');

    const evade = (e)=>{
      if(trapWon) return;
      e.preventDefault();
      trapAttempts++;
      moveNoButton();
      if(trapAttempts === 10){
        $('#trap-msg').textContent = `Girl... why are you fighting the website? 😂❤️ Just admit it. You love ${MY_NAME}.`;
      } else {
        $('#trap-msg').textContent = trapMessages[Math.floor(Math.random()*trapMessages.length)];
      }
    };
    btn.onpointerdown = evade;
    btn.onclick = evade;

    $('#yes-btn').onclick = ()=>{
      if(trapWon) return;
      trapWon = true;
      btn.style.display = 'none';
      const yb = $('#yes-btn');
      yb.textContent = 'I KNEW IT 😎❤️';
      yb.classList.add('won');
      confettiBurst(80);
      heartBurst(yb, 20);
      $('#trap-msg').textContent = `Correct answer. Obviously. ${MY_NAME} has officially received confirmation. This information will be stored forever. 😌`;
      setTimeout(()=>{ $('#trap-cta').style.display = 'flex'; }, 900);
    };
  }

  /* ---------------- PAGE 5: memory timeline (scroll reveal) ---------------- */
  let memoryObserver = null;
  function initMemories(){
    const cards = $$('#page-5 .memory-card');
    if(memoryObserver) memoryObserver.disconnect();
    memoryObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('in');
      });
    }, {threshold:0.2});
    cards.forEach(c=>memoryObserver.observe(c));
    // reveal the first one immediately even before scroll
    if(cards[0]) requestAnimationFrame(()=>cards[0].classList.add('in'));
  }
  function handleImgFallback(imgEl){
    const wrap = imgEl.closest('.memory-photo');
    imgEl.remove();
    const fb = document.createElement('div');
    fb.className = 'ph-fallback';
    fb.innerHTML = `<span class="icon">🖼️</span><span>${wrap.dataset.filename}</span><span>drop this photo in /assets</span>`;
    wrap.appendChild(fb);
  }
  window.__imgFallback = handleImgFallback;

  /* ---------------- PAGE 6: gift shop ---------------- */
  function initGiftShop(){
    $$('#page-6 [data-gift-action]').forEach(btn=>{
      btn.addEventListener('click', function handler(){
        const resultEl = this.closest('.gift-card').querySelector('.gift-result');
        const msg = this.dataset.giftAction;
        resultEl.textContent = msg;
        this.disabled = true;
        this.textContent = this.dataset.giftDone || 'Done';
        heartBurst(this, 8);
      }, {once:true});
    });
    const mysteryBtn = $('#mystery-open');
    if(mysteryBtn){
      mysteryBtn.addEventListener('click', ()=>{
        $('#mystery-result').textContent = `Surprise! You got me. ❤️`;
        mysteryBtn.disabled = true;
        mysteryBtn.textContent = 'Opened 🎁';
        heartBurst(mysteryBtn, 10);
      }, {once:true});
    }
  }

  /* ---------------- PAGE 7: final gift box ---------------- */
  let boxOpened = false;
  function initFinalBox(){
    boxOpened = false;
    const box = $('#giftbox');
    box.classList.remove('opened');
    box.textContent = '🎁';
    $('#final-reveal').style.display = 'none';
    box.onclick = ()=>{
      if(boxOpened) return;
      boxOpened = true;
      box.classList.add('opened');
      box.textContent = '🎉';
      confettiBurst(90);
      heartBurst(box, 24);
      musicEnergize();
      document.body.style.setProperty('--flash','1');
      setTimeout(()=>{
        $('#final-reveal').style.display = 'flex';
        $('#final-reveal').style.animation = 'pageIn .6s ease both';
      }, 400);
    };
  }

  /* ---------------- easter eggs ---------------- */
  let logoTaps = 0, logoTapTimer = null;
  function showEggToast(msg){
    const t = $('#egg-toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._hideT);
    t._hideT = setTimeout(()=> t.classList.remove('show'), 2200);
  }
  function initEasterEggs(){
    const logo = $('#brand-logo');
    if(logo){
      logo.addEventListener('click', ()=>{
        logoTaps++;
        clearTimeout(logoTapTimer);
        logoTapTimer = setTimeout(()=>{ logoTaps = 0; }, 1500);
        if(logoTaps === 5){
          logoTaps = 0;
          showEggToast('You found a secret 👀❤️ — ' + HER_NAME + ' + ' + MY_NAME + ', since always.');
          heartBurst(logo, 10);
        }
      });
    }
    // long-press secret on the footer heart
    const secretHeart = $('#secret-heart');
    if(secretHeart){
      let pressTimer = null;
      const start = (e)=>{
        pressTimer = setTimeout(()=>{
          showEggToast('You found a secret 👀❤️');
          heartBurst(secretHeart, 12);
        }, 650);
      };
      const cancel = ()=> clearTimeout(pressTimer);
      secretHeart.addEventListener('pointerdown', start);
      secretHeart.addEventListener('pointerup', cancel);
      secretHeart.addEventListener('pointerleave', cancel);
    }
  }

  /* ---------------- page enter handlers ---------------- */
  const pageEnterHandlers = {
    1: playTerminal,
    2: playCountdown,
    3: initQuiz,
    4: initLoveTrap,
    5: initMemories,
    6: initGiftShop,
    7: initFinalBox,
  };

  /* ---------------- wire up all CONTINUE / nav buttons ---------------- */
  function initNav(){
    $$('[data-next]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        tryStartMusic();
        goToPage(currentPage + 1);
      });
    });
    $('#restart-btn')?.addEventListener('click', ()=>{
      quizAnswers.length = 0;
      terminalPlayed = false; countdownPlayed = false;
      $('#terminal-stage').style.display='flex';
      $('#hey-stage').style.display='none';
      $('#riddle-stage').style.display='none';
      $('#granted-stage').style.display='none';
      $('#countdown-stage').style.display='flex';
      $('#reveal-stage').style.display='none';
      $('#terminal-lines').innerHTML='';
      $('#countdown-num').textContent='3';
      goToPage(1);
    });
    $('#music-btn').addEventListener('click', toggleMusic);
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    initStars();
    startAmbientHearts();
    buildProgressDots();
    initRiddle();
    initEasterEggs();
    initNav();
    goToPage(1);
    // first-interaction music start (in addition to CONTINUE buttons)
    document.body.addEventListener('click', tryStartMusic, {once:true});
  });
})();
