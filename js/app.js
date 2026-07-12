/* ===== 앱: 네비게이션 · 렌더링 · 게임 실행 ===== */
const App = {
  init() {
    // 탭 전환
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => this.go(el.dataset.nav));
    });

    // 검색
    document.getElementById('search').addEventListener('input', e => {
      this.renderBuiltin(e.target.value.toLowerCase());
    });

    // 실행 모달 컨트롤
    document.getElementById('player-close').onclick = () => this.closePlayer();
    document.getElementById('player-restart').onclick = () => this.restartPlayer();
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.getElementById('player').hidden) this.closePlayer();
    });

    Editor.init();
    this.renderBuiltin('');
    this.renderMine();
  },

  go(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
    document.getElementById('view-' + view).classList.add('is-active');
    document.querySelectorAll('.tab').forEach(t =>
      t.classList.toggle('is-active', t.dataset.nav === view));
    if (view === 'mine') this.renderMine();
    if (view === 'create' && !Editor._editingId) { /* 편집 중이 아니면 그대로 둠 */ }
    window.scrollTo(0, 0);
  },

  /* ---- 내장 게임 카드 ---- */
  renderBuiltin(q) {
    const grid = document.getElementById('builtin-grid');
    grid.innerHTML = '';
    BUILTIN_GAMES
      .filter(g => !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.tag.includes(q))
      .forEach(g => grid.appendChild(this.card(g, false)));
  },

  /* ---- 내 게임 카드 ---- */
  renderMine() {
    const grid = document.getElementById('mine-grid');
    const empty = document.getElementById('mine-empty');
    const games = Store.all();
    document.getElementById('mine-count').textContent = games.length ? games.length + '개' : '';
    grid.innerHTML = '';
    empty.hidden = games.length > 0;
    games.forEach(g => grid.appendChild(this.card(g, true)));
  },

  card(g, mine) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="card-thumb">${g.emoji || '🎮'}</div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(g.title)}</div>
        <div class="card-desc">${escapeHtml(g.desc || (mine ? '내가 만든 게임' : ''))}</div>
        <div class="card-foot">
          <span class="tag">${mine ? '내 게임' : g.tag}</span>
          ${mine ? '<button class="card-del" data-act="edit">✏️ 편집</button>' +
                   '<button class="card-del" data-act="del">🗑</button>' : ''}
        </div>
      </div>`;
    // 카드 본문 클릭 → 실행
    el.querySelector('.card-thumb').onclick = () => this.play(g, mine);
    el.querySelector('.card-title').onclick = () => this.play(g, mine);
    el.querySelector('.card-desc').onclick = () => this.play(g, mine);
    if (mine) {
      el.querySelector('[data-act="edit"]').onclick = e => {
        e.stopPropagation(); Editor.edit(g.id); this.go('create');
      };
      el.querySelector('[data-act="del"]').onclick = e => {
        e.stopPropagation();
        if (confirm(`"${g.title}" 게임을 삭제할까요?`)) { Store.remove(g.id); this.renderMine(); }
      };
    }
    return el;
  },

  /* ---- 게임 실행 (모달 + 격리 iframe) ---- */
  _current: null,
  play(g, mine) {
    this._current = { g, mine };
    document.getElementById('player-title').textContent = g.title;
    const frame = document.getElementById('player-frame');
    if (mine) frame.srcdoc = buildSrcDoc(g);
    else { frame.removeAttribute('srcdoc'); frame.src = bustCache(g.file); }
    document.getElementById('player').hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => frame.focus(), 100);
  },
  restartPlayer() {
    if (!this._current) return;
    const { g, mine } = this._current;
    const frame = document.getElementById('player-frame');
    if (mine) frame.srcdoc = buildSrcDoc(g);
    else frame.src = bustCache(g.file);
  },
  closePlayer() {
    document.getElementById('player').hidden = true;
    const frame = document.getElementById('player-frame');
    frame.removeAttribute('srcdoc'); frame.src = 'about:blank';
    document.body.style.overflow = '';
    this._current = null;
  },
};

/* 게임 파일을 매번 새로 받아오도록 캐시 무효화 (개발 중 수정사항이 바로 반영되게) */
function bustCache(url) {
  return url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

window.addEventListener('DOMContentLoaded', () => App.init());
