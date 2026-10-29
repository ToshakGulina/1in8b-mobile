import { COUNTRIES, NAMES, EVENTS, ERA, QUIET_TEXTS } from './data.js';

// Утилиты
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a,b)=> Math.max(a, Math.min(b,v));
const pick = a => a[Math.floor(Math.random()*a.length)];
const weightedPick = (arr, wKey) => {
  const total = arr.reduce((s,c)=> s + c[wKey], 0);
  let r = Math.random()*total;
  for(const c of arr){ r-=c[wKey]; if(r<=0) return c; }
  return arr[0];
};
const vibrate = ms => { try{ if('vibrate' in navigator) navigator.vibrate(ms);}catch(e){} };
const toast = (msg, ms=2200) => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hide);
  t._hide = setTimeout(()=> t.classList.remove('show'), ms);
};

// State
let eraKey = '2024';
let currentCountry = null;
let birthData = null; // {country, era, sex, name, cityType, incomeRank, familySize, oddsText}
let game = null; // {age, maxAge, stats:{}, history:[], flags:Set, used:Set, alive, name, sex, country, cityType}
let autoTimer = null;
let autoSpeed = 1; // 1, 2, 4
let drag = { active:false, startX:0, startY:0, dx:0, vel:0, lastX:0, lastT:0 };

const els = {
  screens: $$('.screen'),
  topbarLabel: $('#topbar-label'),
  topbarSub: $('#topbar-sub'),
  progressBar: $('#progress-bar'),
  stats: {
    health: $('#stat-health'), happiness: $('#stat-happiness'), relations: $('#stat-relations'), money: $('#stat-money'),
    vHealth: $('#val-health'), vHapp: $('#val-happiness'), vRel: $('#val-relations'), vMoney: $('#val-money')
  },
  home: $('#screen-home'), picker: $('#screen-picker'), birth: $('#screen-birth'), game: $('#screen-game'), death: $('#screen-death'), archive: $('#screen-archive'),
  countryList: $('#country-list'), countrySearch: $('#country-search'),
  birthPaper: {
    kicker: $('#birth-kicker'), flag: $('#birth-flag'), name: $('#birth-name'), place: $('#birth-place'),
    country: $('#birth-country'), odds: $('#birth-odds'), lifeexp: $('#birth-lifeexp'), region: $('#birth-region'),
    family: $('#birth-family'), income: $('#birth-income'), city: $('#birth-city'), sex: $('#birth-sex'), quote: $('#birth-quote')
  },
  card: {
    stage: $('#card-stage'), stack: $('#card-stack'),
    current: $('#card-current'), next: $('#card-next'),
    ill: $('#card-ill'), badge: $('#card-age-badge'), title: $('#card-title'), text: $('#card-text'),
    leftLabel: $('#choice-left-label'), rightLabel: $('#choice-right-label'),
    btnLeft: $('#btn-choice-left'), btnRight: $('#btn-choice-right'),
    btnLeftText: $('#btn-left-text'), btnRightText: $('#btn-right-text'),
    leftDragLabel: $('#drag-label-left'), rightDragLabel: $('#drag-label-right')
  },
  gameMeta: { ageNum: $('#game-age-num'), ageLab: $('#game-age-label'), flag: $('#game-flag'), country: $('#game-country'), city: $('#game-city'), name: $('#game-name') },
  historyList: $('#history-list'), historyCount: $('#history-count'), historySheet: $('#history-sheet'),
  deathName: $('#death-name'), deathCause: $('#death-cause'), deathStats: $('#death-stats'), deathTimeline: $('#death-timeline'), deathQuote: $('#death-quote'), deathType: $('#death-type'),
  archiveList: $('#archive-list'), archiveCount: $('#archive-count'), navBadge: $('#nav-archive-badge'),
  overlay: $('#overlay'),
  btnAuto: $('#btn-auto'), autoSpeedChip: $('#auto-speed')
};

// Навигация экранов
function showScreen(id){
  $$('.screen').forEach(s=> s.classList.remove('active'));
  const map = { home:'screen-home', picker:'screen-picker', birth:'screen-birth', game:'screen-game', death:'screen-death', archive:'screen-archive' };
  const el = document.getElementById(map[id] || map.home);
  if(el) el.classList.add('active');
  // bottom nav active
  $$('#bottom-nav .nav-item').forEach(b=> b.classList.toggle('active', b.dataset.nav===id || (id==='picker'||id==='birth'||id==='game'||id==='death') && b.dataset.nav==='home'));
  // topbar text
  if(id==='home'){ els.topbarLabel.textContent='1 из 8 миллиардов'; els.topbarSub.textContent='проживи одну жизнь'; }
  if(id==='game'){ els.topbarLabel.textContent='Жизнь идёт'; els.topbarSub.textContent='свайпай карточку →'; }
  if(id==='death'){ els.topbarLabel.textContent='Память'; els.topbarSub.textContent='история сохранена'; }
  if(id==='archive'){ els.topbarLabel.textContent='Архив'; els.topbarSub.textContent='только на этом устройстве'; }
  window.scrollTo({top:0, behavior:'smooth'});
  hideAllSheets();
  // stats bar visible только в игре
  $('#stats-bar').style.display = (id==='game') ? 'grid' : 'none';
  $('#progress-wrap').style.display = (id==='game' || id==='birth') ? 'block' : 'none';
}

function hideAllSheets(){ $$('.sheet').forEach(s=> s.classList.remove('open')); els.overlay.classList.remove('show'); }
function openSheet(id){ $(id).classList.add('open'); els.overlay.classList.add('show'); }

// История lives в localStorage
function loadArchive(){ try{ return JSON.parse(localStorage.getItem('1in8b-archive-v3')||'[]'); }catch{ return [] } }
function saveArchive(arr){ localStorage.setItem('1in8b-archive-v3', JSON.stringify(arr)); updateArchiveBadge(); }
function updateArchiveBadge(){
  const a = loadArchive();
  els.archiveCount.textContent = a.length;
  els.navBadge.textContent = a.length;
  els.navBadge.classList.toggle('hidden', a.length===0);
}
function addToArchive(entry){
  const a = loadArchive();
  a.unshift(entry);
  if(a.length>50) a.length=50;
  saveArchive(a);
}

function formatOdds(country){
  const totalBirths = COUNTRIES.reduce((s,c)=> s+c.births,0);
  const pct = (country.births/totalBirths*100);
  const oneIn = Math.round(totalBirths/country.births);
  return { pct: pct.toFixed(1), oneIn };
}

function randomSex(country){
  // упрощённо 51.2% м, 48.8% ж — чуть варьируем по стране
  return Math.random()<0.512 ? 'm':'f';
}
function randomName(region, sex){
  const pool = NAMES[region] || NAMES['Европа'];
  const list = sex==='m' ? pool.m : pool.f;
  return pick(list);
}
function randomCityType(country){
  const r = Math.random()*100;
  if(r < (100-country.urban)*0.7) return CITY_TYPES[0]; // деревня чаще если urban низкий
  if(r < 100-country.urban + 20) return CITY_TYPES[1];
  return CITY_TYPES[2];
}
const CITY_TYPES = [
  { id:'village', label:'деревня' },
  { id:'town', label:'городок' },
  { id:'city', label:'город' }
];
function incomeLabel(rank){
  if(rank<0.2) return 'очень низкий';
  if(rank<0.45) return 'ниже среднего';
  if(rank<0.65) return 'средний';
  if(rank<0.85) return 'выше среднего';
  return 'высокий';
}
function ageLabel(age){
  if(age===0) return 'младенец';
  if(age<3) return 'малыш';
  if(age<6) return 'дошкольник';
  if(age<12) return 'школьник';
  if(age<18) return 'подросток';
  if(age<25) return 'юность';
  if(age<35) return 'молодость';
  if(age<50) return 'зрелость';
  if(age<65) return 'средний возраст';
  return 'пожилой';
}

// Генерация рождения
function generateBirth(countryOverride=null, eraOverride=null){
  const eraK = eraOverride || eraKey;
  const country = countryOverride || weightedPick(COUNTRIES, 'births');
  const sex = randomSex(country);
  const region = country.region;
  const name = randomName(region, sex);
  const cityType = randomCityType(country);
  const incomeRank = Math.random(); // 0-1
  // семейный размер: бедные страны больше
  const famBase = country.births>2000 ? 5 : 3.5;
  const familySize = Math.max(2, Math.round(famBase + (Math.random()*2 -1) + (incomeRank<0.3?1:0)));
  const odds = formatOdds(country);
  currentCountry = country;
  birthData = {
    country, era: eraK, sex, name, cityType, incomeRank, familySize,
    oddsText: `1 из ${odds.oneIn} · ${odds.pct}% всех рождений`,
    odds,
  };
  renderBirth();
  showScreen('birth');
  // прогресс для рождения
  els.progressBar.style.width = '2%';
}

function renderBirth(){
  const c = birthData.country;
  const sexLabel = birthData.sex==='m' ? 'мальчик' : 'девочка';
  const era = ERA[birthData.era];
  const lifeExp = Math.round((c.lifeM + c.lifeF)/2 + era.lifeAdj);
  els.birthPaper.kicker.textContent = `СВИДЕТЕЛЬСТВО · ${era.year}`;
  els.birthPaper.flag.textContent = c.flag;
  els.birthPaper.name.textContent = `${birthData.name}, 0 лет`;
  els.birthPaper.place.textContent = `${c.name} · ${birthData.cityType.label} · семья с ${incomeLabel(birthData.incomeRank)} достатком`;
  els.birthPaper.country.textContent = c.name;
  els.birthPaper.odds.textContent = birthData.oddsText;
  els.birthPaper.lifeexp.textContent = `${lifeExp} лет`;
  els.birthPaper.region.textContent = c.region;
  els.birthPaper.family.textContent = `${birthData.familySize} человек`;
  els.birthPaper.income.textContent = `доход ${incomeLabel(birthData.incomeRank)}`;
  els.birthPaper.city.textContent = birthData.cityType.label;
  els.birthPaper.sex.textContent = `${sexLabel} · ${(birthData.sex==='m'?51.2:48.8).toFixed(1)}%`;
  const quotes = [
    `«Ты появилась на свет ${birthData.cityType.id==='village' ? 'в доме без водопровода, но с радио на три станции' : 'в роддоме, где очередь с утра'}. Снаружи — ${c.region==='Африка'?'пыльная дорога и рынок':'дорога в город и поля'}.»`,
    `«Первый крик — и мир стал на одного человека больше. Твоя семья уже любит тебя, хотя не знает, какой ты будешь.»`,
    `«За окном — ${c.name}. Твоя страна даёт тебе шанс 1 из ${birthData.odds.oneIn} — и целую статистику за плечами.»`,
  ];
  els.birthPaper.quote.textContent = pick(quotes);
}

// Список стран рендер
function renderCountryList(filter='', tab='all'){
  let list = [...COUNTRIES];
  if(tab==='common') list = list.filter(c=> c.births>800).sort((a,b)=> b.births - a.births);
  if(tab==='rare') list = list.filter(c=> c.births<200).sort((a,b)=> a.births - b.births);
  if(filter){
    const q = filter.toLowerCase();
    list = list.filter(c=> c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q) || c.flag.includes(q));
  }
  if(tab==='all' && !filter) list = list.sort((a,b)=> b.births - a.births);
  els.countryList.innerHTML = '';
  list.forEach(c=>{
    const odds = formatOdds(c);
    const btn = document.createElement('button');
    btn.className = 'country-item';
    btn.setAttribute('role','option');
    btn.innerHTML = `
      <div class="country-flag">${c.flag}</div>
      <div class="country-main">
        <b>${c.name}</b>
        <small>${c.region} · ${c.urban}% город · ${Math.round((c.lifeM+c.lifeF)/2)} лет жизни</small>
      </div>
      <div class="country-odds">
        <b>1 из ${odds.oneIn}</b>
        <small>${odds.pct}%</small>
      </div>
    `;
    btn.addEventListener('click', ()=>{
      vibrate(10);
      $$('.country-item').forEach(x=> x.classList.remove('active'));
      btn.classList.add('active');
      setTimeout(()=> generateBirth(c), 120);
    });
    els.countryList.appendChild(btn);
  });
  if(list.length===0){
    els.countryList.innerHTML = `<div style="text-align:center; padding:18px; color:var(--muted)">Ничего не найдено. Попробуй «Россия» или «Африка»</div>`;
  }
}

// Game init
function startLife(){
  if(!birthData) return;
  vibrate(20);
  const c = birthData.country;
  const era = ERA[birthData.era];
  const baseLife = (c.lifeM + c.lifeF)/2 + era.lifeAdj;
  // доход влияет: богатые +6, бедные -5
  const incomeAdj = (birthData.incomeRank - 0.5) * 12;
  const maxAge = clamp(Math.round(baseLife + incomeAdj + (Math.random()*10 -2)), 1, 102);
  game = {
    age: 0,
    maxAge,
    stats: {
      health: clamp(75 + (c.gdp>30000?5:0) + (birthData.incomeRank*10 -5) + (Math.random()*6-3), 45, 90),
      happiness: clamp(70 + (Math.random()*10-5), 40, 90),
      relations: clamp(68 + (birthData.familySize*2), 45, 92),
      money: clamp(35 + birthData.incomeRank*45 + (c.gdp>40000?10:0), 5, 85),
    },
    history: [],
    flags: new Set(),
    used: new Set(),
    alive: true,
    name: birthData.name,
    sex: birthData.sex,
    country: c,
    cityType: birthData.cityType,
    incomeRank: birthData.incomeRank,
    era: birthData.era,
  };
  // мета
  els.gameMeta.ageNum.textContent = '0';
  els.gameMeta.ageLab.textContent = `лет · ${ageLabel(0)}`;
  els.gameMeta.flag.textContent = c.flag;
  els.gameMeta.country.textContent = c.name;
  els.gameMeta.city.textContent = `· ${birthData.cityType.label}`;
  els.gameMeta.name.textContent = birthData.name;
  updateStatsUI();
  showScreen('game');
  els.progressBar.style.width = '1%';
  renderHistory();
  // первое событие — рождение
  const birthEvent = EVENTS.find(e=> e.id==='birth');
  showCard(birthEvent, 0);
}

function updateStatsUI(){
  if(!game) return;
  const s = game.stats;
  const set = (el,val,fill) => {
    const pct = clamp(val,0,100);
    if(fill) fill.style.width = pct+'%';
    // цвет по уровню
    let col = 'var(--accent)';
    if(pct<30) col = 'var(--danger)';
    else if(pct<55) col = 'var(--warn)';
    else if(pct>75) col = 'var(--ok)';
    if(fill) fill.style.background = col;
    if(el) el.textContent = Math.round(pct);
  };
  set(els.stats.vHealth, s.health, els.stats.health);
  set(els.stats.vHapp, s.happiness, els.stats.happiness);
  set(els.stats.vRel, s.relations, els.stats.relations);
  set(els.stats.vMoney, s.money, els.stats.money);
}

function getDeathProbability(age){
  // Базовая младенческая смертность: inversely to life expectancy
  const c = game.country;
  const lifeExp = (c.lifeM + c.lifeF)/2;
  const infantBase = clamp((80 - lifeExp)/400, 0.004, 0.06); // 0.4% - 6%
  if(age===0) return infantBase * (game.stats.health<40 ? 1.7 : 1);
  if(age<5) return infantBase*0.6;
  // Gompertz: mortality doubles every ~8 years after 30
  const base = 0.0006; // 0.06% at 30
  const gompertz = base * Math.pow(2, (age-30)/8);
  // adjust by health
  const healthMult = 1 + (50 - game.stats.health)/60; // 0.3 .. 1.8
  // near maxAge increase sharply
  const nearEnd = age > game.maxAge ? Math.pow(1.35, age - game.maxAge) : 1;
  return clamp(gompertz * healthMult * nearEnd, 0.0001, 0.45);
}

function pickEventForAge(age){
  // фильтр
  let pool = EVENTS.filter(e=>{
    if(age < e.age[0] || age > e.age[1]) return false;
    if(e.reqFlag && !game.flags.has(e.reqFlag)) return false;
    if(e.flag && game.flags.has(e.flag)) {
      // некоторые флаги — одноразовые, не давать повторно тот же флаг
      // разрешаем повторно только если это не тот же id? упростим: если флаг уже есть — пропускаем событие которое даёт тот же флаг
      // но это не строго
    }
    if(game.used.has(e.id) && e.id!=='quiet' && e.id!=='conflict' && e.id!=='lottery' && e.id!=='illness_mid' && e.id!=='illness_baby') return false;
    // эпоха/страна фильтр? пока нет
    return true;
  });
  // если есть birth — prioritise at 0
  if(age===0) return EVENTS.find(e=> e.id==='birth');
  // шанс тихого года — 18% после 40 лет если пул мал
  if(pool.length===0 || (age>35 && Math.random()<0.18 && pool.length<3)){
    return { id:'quiet', icon: pick(['☕','🌿','📻','🌙']), title:'Тихий год', text: pick(QUIET_TEXTS), choices: [
      { text:'Прожить', effects:{happiness:1, health:0}, log:'Тихий год — тоже жизнь.' },
      { text:'Замечать мелочи', effects:{happiness:2, relations:1}, log:'Ты замечала мелочи — и год стал тёплым.' }
    ], age:[age,age]};
  }
  // взвешиваем: редкие события реже? Пока равновероятно, но даём приоритет не-quiet
  // если есть несколько — pick one, но quiet как fallback уже
  return pick(pool) || pool[0];
}

let currentEvent = null;
let currentChoices = null;

function showCard(event, age){
  currentEvent = event;
  currentChoices = event.choices;
  // обновить UI
  els.card.ill.textContent = event.icon || '✦';
  els.card.badge.textContent = `${age} лет`;
  els.card.title.textContent = event.title;
  els.card.text.textContent = event.text;
  els.card.leftLabel.textContent = event.choices[0].text;
  els.card.rightLabel.textContent = event.choices[1].text;
  els.card.btnLeftText.textContent = event.choices[0].text;
  els.card.btnRightText.textContent = event.choices[1].text;
  els.card.leftDragLabel.textContent = `← ${event.choices[0].text}`;
  els.card.rightDragLabel.textContent = `${event.choices[1].text} →`;
  // сброс трансформа
  els.card.current.style.transition = 'none';
  els.card.current.style.transform = 'translateX(0) rotate(0deg)';
  els.card.current.style.opacity = '1';
  // подсказка next card (peek)
  const nextAge = age+1;
  const nextEv = pickEventForAge(nextAge);
  if(nextEv){
    els.card.next.innerHTML = `<div class="card-ill">${nextEv.icon}</div><div class="card-age-badge">${nextAge} лет</div><h3 style="font-size:18px">${nextEv.title}</h3><p style="font-size:13px">${nextEv.text.slice(0,70)}…</p>`;
    els.card.next.style.display='flex';
  } else {
    els.card.next.style.display='none';
  }
  // обновить мету
  els.gameMeta.ageNum.textContent = String(age);
  els.gameMeta.ageLab.textContent = `лет · ${ageLabel(age)}`;
  // прогресс
  const pct = clamp((age / Math.max(game.maxAge, 75))*100, 0, 100);
  els.progressBar.style.width = pct + '%';
  // history count
  els.historyCount.textContent = String(game.history.length);
}

function applyChoice(side){
  if(!game || !game.alive || !currentEvent) return;
  vibrate(12);
  const choice = side==='left' ? currentChoices[0] : currentChoices[1];
  // эффекты
  const deltas = [];
  for(const k in choice.effects){
    const before = game.stats[k];
    if(typeof before==='number'){
      game.stats[k] = clamp(before + choice.effects[k] + (Math.random()*2-1), 0, 100);
      const diff = Math.round(game.stats[k]-before);
      if(diff!==0) deltas.push(`${k==='health'?'♥':k==='happiness'?'☺':k==='relations'?'◐':'◆'} ${diff>0?'+':''}${diff}`);
    }
  }
  if(choice.flag) game.flags.add(choice.flag);
  game.used.add(currentEvent.id);
  // история
  const entry = {
    age: game.age,
    title: currentEvent.title,
    icon: currentEvent.icon,
    text: currentEvent.text,
    choice: choice.text,
    log: choice.log,
    deltas
  };
  game.history.push(entry);
  renderHistory();
  updateStatsUI();
  if(deltas.length) toast(deltas.join(' · '), 1800);
  // проверить смерть в следующем возрасте? Сначала увеличиваем возраст
  game.age += 1;
  if(game.age > 102){
    // естественный конец
    triggerDeath('Старость взяла своё. Ты умер от старости в окружении близких.');
    return;
  }
  // шанс смерти перед следующим событием
  const pDeath = getDeathProbability(game.age);
  if(Math.random() < pDeath){
    // причина смерти зависит от возраста и здоровья
    let cause = '';
    if(game.age<5) cause = 'Детская болезнь оказалась сильнее. Маленькое сердце остановилось.';
    else if(game.age<35 && game.stats.health<30) cause = 'Несчастный случай. Жизнь оборвалась внезапно.';
    else if(game.age<60 && Math.random()<0.3) cause = 'Внезапная болезнь. Врачи не успели.';
    else if(game.stats.health<25) cause = 'Здоровье подвело. Организм не выдержал.';
    else cause = 'Сердце остановилось во сне. Рядом — фотография семьи.';
    triggerDeath(cause);
    return;
  }
  const nextEvent = pickEventForAge(game.age);
  animateCardOut(side, ()=>{
    showCard(nextEvent, game.age);
  });
}

function animateCardOut(side, cb){
  const card = els.card.current;
  const dir = side==='left' ? -1 : 1;
  card.style.transition = 'transform .38s cubic-bezier(.4,0,.2,1), opacity .28s ease';
  card.style.transform = `translateX(${dir*520}px) rotate(${dir*18}deg)`;
  card.style.opacity = '0';
  setTimeout(()=>{
    card.style.transition = 'none';
    card.style.transform = 'translateX(0) rotate(0deg)';
    card.style.opacity = '1';
    hideDragLabels();
    if(cb) cb();
  }, 360);
}

// Drag handling — Pointer Events unified
function setupDrag(){
  const card = els.card.current;
  const threshold = 82;
  const velocityNeeded = 0.55;

  card.addEventListener('pointerdown', (e)=>{
    if(!game || !game.alive) return;
    // только левый палец/мышь
    drag.active = true;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.dx = 0;
    drag.vel = 0;
    drag.lastX = e.clientX;
    drag.lastT = performance.now();
    card.setPointerCapture(e.pointerId);
    card.style.transition = 'none';
    // prevent text selection
    e.preventDefault();
  });

  card.addEventListener('pointermove', (e)=>{
    if(!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    // если вертикальный свайп большой — отпускаем (скролл)
    if(Math.abs(dy) > Math.abs(dx) * 1.4 && Math.abs(dy)>18){
      // считаем что скроллят — не мешаем, но не отменяем драг полностью? просто уменьшаем эффект
    }
    drag.dx = dx;
    // velocity
    const now = performance.now();
    const dt = Math.max(8, now - drag.lastT);
    drag.vel = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastT = now;

    const rot = dx * 0.07;
    const opacityLeft = clamp((-dx - 20)/80, 0, 1);
    const opacityRight = clamp((dx - 20)/80, 0, 1);
    card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
    // drag labels
    if(dx < -18) { els.card.leftDragLabel.classList.add('show'); } else els.card.leftDragLabel.classList.remove('show');
    if(dx > 18) { els.card.rightDragLabel.classList.add('show'); } else els.card.rightDragLabel.classList.remove('show');
    // fade card a bit when dragging far
    const abs = Math.abs(dx);
    if(abs>60) card.style.opacity = String(clamp(1 - (abs-60)/220, 0.7, 1));
  });

  const endDrag = (e)=>{
    if(!drag.active) return;
    drag.active = false;
    const dx = drag.dx;
    const abs = Math.abs(dx);
    const fast = Math.abs(drag.vel) > velocityNeeded;
    hideDragLabels();
    if(abs > threshold || (fast && abs>35)){
      const side = dx < 0 ? 'left' : 'right';
      vibrate(10);
      applyChoice(side);
      // applyChoice already animates out; но если мы не прошли порог — вернём
      // если прошли — applyChoice вызовет animateCardOut, нужно не делать возврат
      // поэтому делаем возврат только если не прошли
      return;
    }
    // возврат
    card.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1), opacity .2s';
    card.style.transform = 'translateX(0) rotate(0deg)';
    card.style.opacity = '1';
    setTimeout(()=> card.style.transition='none', 280);
  };
  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
  card.addEventListener('pointerleave', (e)=>{
    if(drag.active && e.buttons===0) endDrag(e);
  });
}
function hideDragLabels(){
  els.card.leftDragLabel.classList.remove('show');
  els.card.rightDragLabel.classList.remove('show');
}

function renderHistory(){
  if(!game) return;
  if(game.history.length===0){
    els.historyList.innerHTML = `<div class="muted small" style="text-align:center; padding:16px">Пока пусто — начни с первой карточки</div>`;
    return;
  }
  els.historyList.innerHTML = '';
  [...game.history].slice().reverse().forEach(h=>{
    const div = document.createElement('div');
    div.className='history-item';
    div.innerHTML = `
      <div class="history-age">${h.icon}<br>${h.age} лет</div>
      <div>
        <b>${h.title}</b>
        <p>${h.log}</p>
        <div class="history-choice">→ ${h.choice} ${h.deltas.length? '· '+h.deltas.join(' ') : ''}</div>
      </div>
    `;
    els.historyList.appendChild(div);
  });
  els.historyCount.textContent = String(game.history.length);
}

function triggerDeath(cause){
  if(!game) return;
  game.alive = false;
  stopAuto();
  // заполнить экран смерти
  const totalYears = game.age;
  const c = game.country;
  els.deathName.textContent = `${game.name} · ${totalYears} лет`;
  els.deathCause.textContent = cause;
  els.deathType.textContent = totalYears<5 ? 'КОРОТКАЯ ЖИЗНЬ' : totalYears<35 ? 'ВНЕЗАПНО' : totalYears>85 ? 'ДОЛГАЯ ЖИЗНЬ' : 'ПАМЯТЬ';
  // stats
  els.deathStats.innerHTML = `
    <div class="death-stat"><small>Здоровье</small><b>${Math.round(game.stats.health)}</b></div>
    <div class="death-stat"><small>Счастье</small><b>${Math.round(game.stats.happiness)}</b></div>
    <div class="death-stat"><small>Отношения</small><b>${Math.round(game.stats.relations)}</b></div>
    <div class="death-stat"><small>Деньги</small><b>${Math.round(game.stats.money)}</b></div>
  `;
  // timeline — берём 5-7 ключевых моментов
  const key = game.history.filter((_,i)=> i===0 || i===game.history.length-1 || Math.random()<0.35).slice(0,7);
  if(key.length===0) key.push({age:0, title:'Рождение', log:'Ты родилась в '+c.name});
  els.deathTimeline.innerHTML = key.map(k=> `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <p><b>${k.age} лет — ${k.title}</b><br><span>${k.log}</span></p>
    </div>
  `).join('');
  const quotes = [
    `«${game.name} прожила обычную жизнь — и в этом была её необычность.»`,
    `«История из ${c.name}. Одна из 8 миллиардов — и единственная.»`,
    `«Она любила, ошибалась и шла дальше. Как все мы.»`,
  ];
  els.deathQuote.textContent = pick(quotes);
  els.progressBar.style.width = '100%';
  showScreen('death');
  // подготовка к архиву (авто-сохранить предложим)
  // вибрация
  vibrate([30,40,30]);
}

function saveCurrentLife(){
  if(!game) return;
  const c = game.country;
  const entry = {
    id: Date.now(),
    name: game.name,
    country: c.name, flag: c.flag, region: c.region,
    sex: game.sex==='m'?'м':'ж',
    city: game.cityType.label,
    incomeRank: birthData.incomeRank,
    age: game.age,
    stats: {...game.stats},
    history: [...game.history],
    cause: els.deathCause.textContent,
    date: new Date().toLocaleDateString('ru-RU'),
    era: ERA[game.era].label
  };
  addToArchive(entry);
  toast('Сохранено в архив ◈', 2000);
  renderArchive();
}

function renderArchive(){
  const list = loadArchive();
  if(list.length===0){
    els.archiveList.innerHTML = `<div style="text-align:center; padding:24px; background:var(--paper); border:1px solid var(--line); border-radius:16px; color:var(--muted)">Пока нет сохранённых жизней.<br>Проживи первую — она попадёт сюда</div>`;
    return;
  }
  els.archiveList.innerHTML = '';
  list.forEach(item=>{
    const div = document.createElement('div');
    div.className='archive-item';
    const top = `
      <div class="archive-head">
        <div style="display:flex; gap:10px; align-items:center">
          <span style="width:42px; height:42px; display:grid; place-items:center; background:var(--bg-2); border:1px solid var(--line); border-radius:12px; font-size:20px">${item.flag}</span>
          <div>
            <b>${item.name} · ${item.age} лет</b>
            <small style="display:block; color:var(--muted)">${item.country} · ${item.region} · ${item.city}</small>
          </div>
        </div>
        <small>${item.date}</small>
      </div>
    `;
    const mid = `<div class="muted small">${item.cause}</div>`;
    const stats = `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px"><span class="chip">♥ ${Math.round(item.stats.health)}</span><span class="chip">☺ ${Math.round(item.stats.happiness)}</span><span class="chip">◐ ${Math.round(item.stats.relations)}</span><span class="chip">◆ ${Math.round(item.stats.money)}</span><span class="chip">${item.era}</span></div>`;
    const actions = `<div style="display:flex; gap:8px; margin-top:10px"><button class="btn-secondary" style="flex:1" data-view="${item.id}">Открыть</button><button class="btn-ghost danger" style="flex:1" data-del="${item.id}">Удалить</button></div>`;
    div.innerHTML = top + mid + stats + actions;
    els.archiveList.appendChild(div);
  });
  // bind
  els.archiveList.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', ()=>{
    const id = Number(b.dataset.del);
    let arr = loadArchive().filter(x=> x.id!==id);
    saveArchive(arr);
    renderArchive();
    toast('Удалено');
  }));
  els.archiveList.querySelectorAll('[data-view]').forEach(b=> b.addEventListener('click', ()=>{
    const id = Number(b.dataset.view);
    const item = loadArchive().find(x=> x.id===id);
    if(!item) return;
    // показать как death screen
    // заполняем временные данные
    els.deathName.textContent = `${item.name} · ${item.age} лет`;
    els.deathCause.textContent = item.cause;
    els.deathType.textContent = 'АРХИВ';
    els.deathStats.innerHTML = `
      <div class="death-stat"><small>Здоровье</small><b>${Math.round(item.stats.health)}</b></div>
      <div class="death-stat"><small>Счастье</small><b>${Math.round(item.stats.happiness)}</b></div>
      <div class="death-stat"><small>Отношения</small><b>${Math.round(item.stats.relations)}</b></div>
      <div class="death-stat"><small>Деньги</small><b>${Math.round(item.stats.money)}</b></div>
    `;
    els.deathTimeline.innerHTML = item.history.slice(0,12).map(k=> `
      <div class="tl-item"><div class="tl-dot"></div><p><b>${k.age} лет — ${k.title}</b><br><span>${k.log}</span></p></div>
    `).join('');
    els.deathQuote.textContent = `Архивная жизнь из ${item.country}. Сохранена ${item.date}.`;
    showScreen('death');
    // скрыть кнопки save/share? оставим но поменяем текст
    $('#btn-save-archive').style.display='none';
  }));
}

function exportArchiveTxt(){
  const list = loadArchive();
  if(list.length===0) return toast('Архив пуст');
  let txt = `1 из 8 миллиардов — архив жизней\nЭкспорт ${new Date().toLocaleString('ru-RU')}\n\n`;
  list.forEach((it,i)=>{
    txt += `\n— — — ЖИЗНЬ ${i+1} — — —\n${it.name}, ${it.sex}, ${it.age} лет · ${it.flag} ${it.country} (${it.region}) · ${it.city}\nПричина конца: ${it.cause}\nПоказатели: ♥${Math.round(it.stats.health)} ☺${Math.round(it.stats.happiness)} ◐${Math.round(it.stats.relations)} ◆${Math.round(it.stats.money)}\nИстория:\n`;
    it.history.forEach(h=> txt+= `  ${h.age} лет — ${h.title}: ${h.log} → ${h.choice}\n`);
  });
  const blob = new Blob([txt], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='1in8b-archive.txt'; a.click();
  setTimeout(()=> URL.revokeObjectURL(url), 1000);
  toast('Файл скачан');
}

// Share canvas — генерируем карточку 1080x1350 для соцсетей
function shareCard(){
  if(!game) return;
  const canvas = document.getElementById('share-canvas');
  const ctx = canvas.getContext('2d');
  const W=1080, H=1350;
  canvas.width=W; canvas.height=H;
  // bg
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#FFF8EE'); grad.addColorStop(1,'#FFD9C2');
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  // paper
  ctx.fillStyle='#FFFFFF';
  ctx.strokeStyle='#E8DDCB';
  ctx.lineWidth=3;
  const pad=36, r=32;
  // rounded rect
  ctx.beginPath();
  ctx.moveTo(pad+r,pad); ctx.lineTo(W-pad-r,pad); ctx.quadraticCurveTo(W-pad,pad,W-pad,pad+r);
  ctx.lineTo(W-pad,H-pad-r); ctx.quadraticCurveTo(W-pad,H-pad,W-pad-r,H-pad);
  ctx.lineTo(pad+r,H-pad); ctx.quadraticCurveTo(pad,H-pad,pad,H-pad-r);
  ctx.lineTo(pad,pad+r); ctx.quadraticCurveTo(pad,pad,pad+r,pad);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // header
  ctx.fillStyle='#7A7066'; ctx.font='700 24px Manrope, sans-serif'; ctx.textAlign='center';
  ctx.fillText('1 ИЗ 8 МИЛЛИАРДОВ · ОДНА ЖИЗНЬ', W/2, 120);
  ctx.fillStyle='#E85D3F'; ctx.beginPath(); ctx.arc(W/2, 170, 54, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.font='800 56px Manrope'; ctx.fillText('1', W/2, 190);
  // name
  ctx.fillStyle='#161616'; ctx.font='700 64px Cormorant Garamond, serif'; ctx.textAlign='center';
  const name = game.name || birthData?.name || 'Без имени';
  ctx.fillText(`${name} · ${game.age} лет`, W/2, 300);
  ctx.fillStyle='#7A7066'; ctx.font='600 28px Manrope'; ctx.fillText(`${game.country.flag} ${game.country.name} · ${game.country.region}`, W/2, 345);
  ctx.font='500 24px Manrope'; ctx.fillText(els.deathCause.textContent.slice(0,90), W/2, 385);
  // stats big
  const stats = [
    {k:'♥', v:Math.round(game.stats.health), l:'Здоровье'},
    {k:'☺', v:Math.round(game.stats.happiness), l:'Счастье'},
    {k:'◐', v:Math.round(game.stats.relations), l:'Отношения'},
    {k:'◆', v:Math.round(game.stats.money), l:'Деньги'},
  ];
  let sx = 120;
  stats.forEach(s=>{
    ctx.fillStyle='#FFF1DC'; ctx.strokeStyle='#E8DDCB';
    ctx.beginPath(); ctx.roundRect(sx, 440, 210, 140, 20); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#161616'; ctx.font='800 44px Manrope'; ctx.textAlign='center'; ctx.fillText(String(s.v), sx+105, 500);
    ctx.fillStyle='#7A7066'; ctx.font='700 18px Manrope'; ctx.fillText(s.l, sx+105, 540);
    sx+=240;
  });
  // timeline 3 key moments
  ctx.textAlign='left';
  let y=660;
  ctx.fillStyle='#161616'; ctx.font='800 26px Manrope'; ctx.fillText('Ключевые моменты:', 80, y); y+=40;
  ctx.fillStyle='#7A7066'; ctx.font='500 22px Manrope';
  const moments = game.history.slice(0,5);
  moments.forEach(m=>{
    if(y>1180) return;
    ctx.fillStyle='#E85D3F'; ctx.beginPath(); ctx.arc(80, y-8, 8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#161616'; ctx.font='700 22px Manrope'; ctx.fillText(`${m.age} лет — ${m.title}`, 110, y);
    ctx.fillStyle='#7A7066'; ctx.font='500 20px Manrope';
    // wrap text
    const words = (m.log||'').split(' '); let line=''; let ly=y+28;
    words.forEach(w=>{
      if(ctx.measureText(line+w+' ').width > 820){ ctx.fillText(line, 110, ly); line=w+' '; ly+=28; } else line+=w+' ';
    });
    if(line) ctx.fillText(line, 110, ly);
    y = ly+44;
  });
  // footer
  ctx.fillStyle='#7A7066'; ctx.font='600 20px Manrope'; ctx.textAlign='center';
  ctx.fillText('Проживи свою — 1in8b-mobile · офлайн · без регистрации', W/2, H-60);

  canvas.toBlob(async blob=>{
    if(!blob) return;
    const file = new File([blob], `1in8b-${name}.png`, {type:'image/png'});
    // Web Share API
    if(navigator.canShare && navigator.canShare({files:[file]})){
      try{ await navigator.share({files:[file], title:`${name} — 1 из 8 миллиардов`, text: els.deathCause.textContent}); toast('Поделились ✨'); return; }catch(e){ /* user cancel */ }
    }
    // fallback download
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`1in8b-${name}.png`; a.click();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
    toast('Карточка скачана — поделись ею');
  }, 'image/png', 0.92);
}

// Auto mode
function startAuto(){
  if(autoTimer) return;
  els.btnAuto.classList.add('active');
  els.btnAuto.textContent = 'Пауза ⏸';
  autoTimer = setInterval(()=>{
    if(!game || !game.alive) { stopAuto(); return; }
    // случайный выбор, чуть тяготеет к положительному результату
    const ev = currentEvent;
    if(!ev) return;
    // предпочитаем выбор с большим суммарным эффектом
    const sum = ch => Object.values(ch.effects).reduce((a,b)=> a+b, 0);
    let pickSide = Math.random()<0.62 ? (sum(ev.choices[0]) >= sum(ev.choices[1]) ? 'left' : 'right') : (Math.random()<0.5?'left':'right');
    applyChoice(pickSide);
    vibrate(5);
  }, autoSpeed===1? 1200 : autoSpeed===2? 700 : 380);
}
function stopAuto(){
  clearInterval(autoTimer); autoTimer=null;
  els.btnAuto.classList.remove('active');
  els.btnAuto.textContent = 'Авто ▶︎';
}
function toggleAuto(){
  if(autoTimer) stopAuto(); else startAuto();
}
function cycleSpeed(){
  autoSpeed = autoSpeed===1?2: autoSpeed===2?4:1;
  els.autoSpeedChip.textContent = autoSpeed+'×';
  if(autoTimer){ stopAuto(); startAuto(); }
}

// Binds
function bindUI(){
  // bottom nav
  $$('#bottom-nav .nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = btn.dataset.nav;
      if(nav==='home') showScreen('home');
      if(nav==='archive'){ renderArchive(); showScreen('archive'); }
      if(nav==='howto'){ openSheet('#sheet-howto'); }
    });
  });
  $('#btn-menu').addEventListener('click', ()=> openSheet('#sheet-howto'));
  $('#btn-archive').addEventListener('click', ()=> { renderArchive(); showScreen('archive'); });
  // home
  $('#btn-birth-random').addEventListener('click', ()=> { vibrate(12); generateBirth(null, eraKey); });
  $('#btn-birth-choose').addEventListener('click', ()=> { renderCountryList('', document.querySelector('.picker-tabs .tab.active')?.dataset.tab||'all'); showScreen('picker'); });
  $('#btn-birth-era').addEventListener('click', ()=> openSheet('#sheet-era'));
  $('#btn-howto').addEventListener('click', ()=> openSheet('#sheet-howto'));
  $('#btn-random-from-list').addEventListener('click', ()=> generateBirth());
  // era
  $$('.era-card').forEach(c=> c.addEventListener('click', ()=>{
    $$('.era-card').forEach(x=> x.classList.remove('active'));
    c.classList.add('active');
    eraKey = c.dataset.era;
    $('#btn-birth-era').textContent = `Эпоха: ${ERA[eraKey].year} ▾`;
    hideAllSheets();
    toast(`Эпоха — ${ERA[eraKey].label} · ${ERA[eraKey].note}`);
  }));
  // picker search & tabs
  let searchDebounce;
  $('#country-search').addEventListener('input', (e)=>{
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(()=> renderCountryList(e.target.value, document.querySelector('.picker-tabs .tab.active')?.dataset.tab||'all'), 160);
  });
  $$('.picker-tabs .tab').forEach(t=> t.addEventListener('click', ()=>{
    $$('.picker-tabs .tab').forEach(x=> x.classList.remove('active'));
    t.classList.add('active');
    renderCountryList($('#country-search').value, t.dataset.tab);
  }));
  // birth
  $('#btn-start-life').addEventListener('click', startLife);
  $('#btn-reroll').addEventListener('click', ()=> generateBirth(null, eraKey));
  $$('[data-back]').forEach(b=> b.addEventListener('click', ()=>{
    const to = b.dataset.back;
    if(to==='home') showScreen('home');
  }));
  // sheets close
  $$('[data-close]').forEach(b=> b.addEventListener('click', hideAllSheets));
  els.overlay.addEventListener('click', hideAllSheets);
  // game choices
  $('#btn-choice-left').addEventListener('click', ()=> applyChoice('left'));
  $('#btn-choice-right').addEventListener('click', ()=> applyChoice('right'));
  // also the hidden card buttons (for a11y / keyboard)
  $$('.choice').forEach(b=> b.addEventListener('click', ()=> applyChoice(b.dataset.side)));
  // auto / skip / history
  els.btnAuto.addEventListener('click', toggleAuto);
  els.autoSpeedChip.addEventListener('click', cycleSpeed);
  $('#btn-skip').addEventListener('click', ()=>{
    if(!game || !game.alive) return;
    // тихий год без события — просто +1 год с малым эффектом
    game.age+=1;
    game.stats.happiness = clamp(game.stats.happiness + (Math.random()*2-0.5),0,100);
    game.stats.health = clamp(game.stats.health + (Math.random()*2-1),0,100);
    updateStatsUI();
    const pDeath = getDeathProbability(game.age);
    if(Math.random()<pDeath){ triggerDeath('Тихий год оборвался — сердце не выдержало.'); return; }
    const ev = pickEventForAge(game.age);
    showCard(ev, game.age);
    toast('Год прожит тихо');
  });
  $('#btn-history-toggle').addEventListener('click', ()=> openSheet('#history-sheet'));
  $('#btn-close-history').addEventListener('click', hideAllSheets);
  // death
  $('#btn-save-archive').addEventListener('click', ()=> { saveCurrentLife(); $('#btn-save-archive').textContent='Сохранено ✓'; setTimeout(()=> $('#btn-save-archive').textContent='Сохранить в архив', 1500); });
  $('#btn-share').addEventListener('click', shareCard);
  $('#btn-new-life').addEventListener('click', ()=> { hideAllSheets(); showScreen('home'); els.progressBar.style.width='0%'; });
  // archive
  $('#btn-clear-archive').addEventListener('click', ()=>{
    if(confirm('Очистить архив? Все сохранённые жизни удалятся с устройства.')){
      localStorage.removeItem('1in8b-archive-v3');
      updateArchiveBadge(); renderArchive(); toast('Архив очищен');
    }
  });
  $('#btn-export-archive').addEventListener('click', exportArchiveTxt);
  // keyboard — стрелки
  window.addEventListener('keydown', (e)=>{
    if(!game || !game.alive || document.getElementById('screen-game').classList.contains('active')===false) return;
    if(e.key==='ArrowLeft') { e.preventDefault(); applyChoice('left'); }
    if(e.key==='ArrowRight') { e.preventDefault(); applyChoice('right'); }
    if(e.key===' ') { e.preventDefault(); toggleAuto(); }
  });
  // handle visibility — pause auto when hidden
  document.addEventListener('visibilitychange', ()=> { if(document.hidden && autoTimer) stopAuto(); });
}

// Init
function init(){
  bindUI();
  setupDrag();
  renderCountryList();
  updateArchiveBadge();
  showScreen('home');
  // check URL params for shortcuts (PWA)
  const params = new URLSearchParams(location.search);
  if(params.get('birth')==='random') setTimeout(()=> generateBirth(), 400);
  if(params.get('screen')==='archive'){ renderArchive(); showScreen('archive'); }
  // prevent overscroll pull-to-refresh on game stage
  let startY=0;
  $('#card-stage').addEventListener('touchstart', e=> startY=e.touches[0].clientY, {passive:true});
  $('#card-stage').addEventListener('touchmove', e=>{
    const y=e.touches[0].clientY;
    const diff = y - startY;
    // если карточка в фокусе и свайп горизонтальный — блокируем скролл
    if(game && game.alive && Math.abs(diff)<10) {} // allow
    // prevent pull-to-refresh when at top
    if(window.scrollY===0 && diff>0) e.preventDefault();
  }, {passive:false});
  // iOS 100vh fix already via dvh
  // register SW for offline (simple)
  if('serviceWorker' in navigator){
    // we create a tiny sw inline if file exists; otherwise skip
    // try to register ./sw.js if present
    fetch('./sw.js', {method:'HEAD'}).then(r=>{ if(r.ok) navigator.serviceWorker.register('./sw.js'); }).catch(()=>{});
  }
}

init();

// Eager prefetch fonts? already

// Expose for debug
window._1in8b = { generateBirth, startLife, COUNTRIES };
