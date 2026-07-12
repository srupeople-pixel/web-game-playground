/* ===== 내장 게임 카탈로그 ===== */
const BUILTIN_GAMES = [
  { id: 'snake',     title: '스네이크',   emoji: '🐍', tag: '아케이드',   desc: '사과를 먹고 몸을 늘리세요. 벽과 몸에 부딪히면 끝!', file: 'games/snake.html' },
  { id: '2048',      title: '2048',       emoji: '🔢', tag: '퍼즐',       desc: '같은 숫자를 밀어 합쳐 2048을 만드세요.',           file: 'games/2048.html' },
  { id: 'memory',    title: '메모리 카드', emoji: '🃏', tag: '기억력',     desc: '같은 그림 카드의 짝을 찾는 뒤집기 게임.',          file: 'games/memory.html' },
  { id: 'tictactoe', title: '틱택토',     emoji: '⭕', tag: '전략',       desc: '완벽한 AI와 겨루는 삼목. 이길 수 있을까요?',       file: 'games/tictactoe.html' },
  { id: 'breakout',  title: '벽돌깨기',   emoji: '🧱', tag: '아케이드',   desc: '공을 튕겨 모든 벽돌을 부수세요.',                  file: 'games/breakout.html' },
  { id: 'idle-rpg',  title: '방치형 RPG', emoji: '⚔️', tag: '방치형',     desc: '자동 전투로 몬스터를 사냥하고 레벨업·강화하세요. 꺼놔도 성장!', file: 'games/idle-rpg.html' },
];

/* ===== 내 게임 저장소 (localStorage) ===== */
const STORE_KEY = 'playlab_games';

const Store = {
  all() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch { return []; }
  },
  get(id) { return this.all().find(g => g.id === id); },
  save(game) {
    const games = this.all();
    const i = games.findIndex(g => g.id === game.id);
    if (i >= 0) games[i] = game; else games.unshift(game);
    localStorage.setItem(STORE_KEY, JSON.stringify(games));
    return game;
  },
  remove(id) {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.all().filter(g => g.id !== id)));
  },
};

/* 사용자 게임의 3개 코드 조각을 하나의 실행 가능한 HTML 문서로 합칩니다 */
function buildSrcDoc(game) {
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${game.css || ''}</style></head>
<body>${game.html || ''}
<script>${game.js || ''}<\/script></body></html>`;
}
