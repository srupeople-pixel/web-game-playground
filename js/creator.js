/* ===== 게임 만들기 에디터 ===== */

/* 처음 열었을 때 보여줄 예제 게임 (클릭 카운터 미니게임) */
const EXAMPLE = {
  html: `<div id="app">
  <h1>🎯 클릭 챌린지</h1>
  <p>5초 안에 버튼을 최대한 많이 누르세요!</p>
  <button id="hit">누르기</button>
  <div id="score">점수: 0</div>
  <div id="time">시간: 5.0</div>
</div>`,
  css: `body{font-family:system-ui,"Malgun Gothic",sans-serif;text-align:center;
  background:#0f1220;color:#fff;padding-top:30px;}
h1{color:#6c8cff;}
#hit{font-size:22px;padding:18px 40px;border:none;border-radius:14px;cursor:pointer;
  background:linear-gradient(135deg,#6c8cff,#b06cff);color:#fff;margin:16px;}
#hit:active{transform:scale(.95);}
#score,#time{font-size:20px;margin:8px;}`,
  js: `let score=0,time=5,playing=false,timer;
const hit=document.getElementById('hit');
const s=document.getElementById('score'),t=document.getElementById('time');
hit.onclick=()=>{
  if(!playing){playing=true;countdown();}
  score++;s.textContent='점수: '+score;
};
function countdown(){
  timer=setInterval(()=>{
    time-=0.1;t.textContent='시간: '+time.toFixed(1);
    if(time<=0){clearInterval(timer);hit.disabled=true;
      t.textContent='끝! 최종 점수 '+score;}
  },100);
}`,
};

const Editor = {
  els: {},
  init() {
    this.els = {
      title: document.getElementById('game-title'),
      html: document.getElementById('code-html'),
      css: document.getElementById('code-css'),
      js: document.getElementById('code-js'),
      preview: document.getElementById('preview'),
    };
    document.getElementById('btn-run').onclick = () => this.run();
    document.getElementById('btn-reset').onclick = () => { this.load(EXAMPLE); this.run(); };
    document.getElementById('btn-save').onclick = () => this.save();

    // 입력 시 자동 미리보기 (약간의 디바운스)
    let t;
    ['html', 'css', 'js'].forEach(k => {
      this.els[k].addEventListener('input', () => {
        clearTimeout(t); t = setTimeout(() => this.run(), 500);
      });
    });
    // Tab 키로 들여쓰기
    ['html', 'css', 'js'].forEach(k => {
      this.els[k].addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const el = e.target, s = el.selectionStart;
          el.value = el.value.slice(0, s) + '  ' + el.value.slice(el.selectionEnd);
          el.selectionStart = el.selectionEnd = s + 2;
        }
      });
    });

    this._editingId = null;
    this.load(EXAMPLE);
    this.run();
  },
  load(g) {
    this.els.html.value = g.html || '';
    this.els.css.value = g.css || '';
    this.els.js.value = g.js || '';
    if (g.title) this.els.title.value = g.title;
  },
  current() {
    return {
      title: this.els.title.value.trim() || '제목 없는 게임',
      html: this.els.html.value,
      css: this.els.css.value,
      js: this.els.js.value,
    };
  },
  run() {
    this.els.preview.srcdoc = buildSrcDoc(this.current());
  },
  save() {
    const g = this.current();
    g.id = this._editingId || 'user_' + Date.now();
    g.emoji = '🎨';
    g.updated = Date.now();
    Store.save(g);
    this._editingId = g.id;
    alert('저장했어요! "내 게임" 탭에서 확인하세요.');
    if (window.App) App.renderMine();
  },
  // 내 게임에서 "편집"을 눌렀을 때 불러오기
  edit(id) {
    const g = Store.get(id);
    if (!g) return;
    this._editingId = id;
    this.load(g);
    this.run();
  },
  // 새 게임 시작
  fresh() {
    this._editingId = null;
    this.els.title.value = '나의 첫 게임';
    this.load(EXAMPLE);
    this.run();
  },
};
