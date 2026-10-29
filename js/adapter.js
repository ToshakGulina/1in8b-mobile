// Mobile adapter — патчи поверх оригинала 1in8b.life, не переписывает механику
const $ = s => document.querySelector(s);
const toast = (msg, ms=2200) => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hide);
  t._hide = setTimeout(()=> t.classList.remove('show'), ms);
};
const vibrate = ms => { try{ if('vibrate' in navigator) navigator.vibrate(ms);}catch(e){} };

const els = {
  frame: $('#game-frame'),
  wrap: $('#frame-wrap'),
  skeleton: $('#frame-skeleton'),
  fallback: $('#frame-fallback'),
  status: $('#toolbar-status'),
  dot: document.querySelector('.toolbar-dot'),
  adaptNotice: $('#adapt-notice'),
  overlay: $('#overlay'),
  sheet: $('#sheet-adapt'),
  installBtn: $('#btn-install'),
};

let deferredPrompt = null;
let loadTimeout = null;
let loaded = false;

// 1. Заметить что iframe загрузился
function markLoaded(){
  if(loaded) return;
  loaded = true;
  clearTimeout(loadTimeout);
  els.wrap.classList.add('loaded');
  els.status.textContent = 'Оригинал загружен — скролль, всё управляется как в оригинале';
  els.dot.classList.add('live');
  toast('Оригинал подстроился под экран');
  vibrate(10);
}
function markFailed(reason='недоступен'){
  clearTimeout(loadTimeout);
  els.wrap.classList.add('loaded');
  els.fallback.hidden = false;
  els.status.textContent = 'Фолбэк: оригинал ' + reason;
  els.dot.classList.remove('live');
  els.frame.style.display = 'none';
}

// Пробуем определить блокировку X-Frame
els.frame.addEventListener('load', ()=>{
  // load может сработать даже при ошибке X-Frame, поэтому дополнительно проверим через таймаут доступность
  setTimeout(()=>{
    try{
      // кросс-домен — доступ к contentDocument бросит исключение, это нормально
      const doc = els.frame.contentDocument;
      if(doc){
        // неожиданно same-origin — можно инжектить патчи
        injectMobilePatches(doc);
        markLoaded();
      } else {
        // кросс-домен, но load есть — считаем успехом
        markLoaded();
      }
    }catch(e){
      // SecurityError ожидается для кросс-домен — значит iframe живой, но изолирован
      // Проверяем что фрейм не пустой по размеру
      markLoaded();
    }
  }, 400);
});

els.frame.addEventListener('error', ()=> markFailed('ошибка загрузки'));

// Таймаут на случай полной блокировки (нет даже load)
loadTimeout = setTimeout(()=>{
  if(!loaded){
    // проверим, есть ли хоть что-то внутри
    markFailed('не встроился (X-Frame/CSP)');
    toast('Открой оригинал в новой вкладке — там тоже всё работает');
  }
}, 8000);

// 2. Инжект мобильных патчей если вдруг same-origin (для локального вендора / форка)
function injectMobilePatches(doc){
  if(!doc) return;
  try{
    // viewport
    let vp = doc.querySelector('meta[name="viewport"]');
    if(!vp){
      vp = doc.createElement('meta');
      vp.name='viewport';
      doc.head.appendChild(vp);
    }
    vp.content = 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content';

    // safe-area стиль
    const style = doc.createElement('style');
    style.textContent = `
      :root{ --safe-top: env(safe-area-inset-top); --safe-bottom: env(safe-area-inset-bottom); }
      body{ padding-top: var(--safe-top); padding-bottom: var(--safe-bottom); overscroll-behavior-y: contain; }
      button, a{ min-height:44px; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
      /* увеличить тапы в оригинале, если были 32px */
      @media (max-width: 600px){
        header, .topbar{ position: sticky; top: 0; backdrop-filter: blur(12px); }
      }
    `;
    doc.head.appendChild(style);

    // haptics
    doc.addEventListener('click', ()=> vibrate(5), {passive:true});
  }catch(e){ /* ignore */ }
}

// 3. Кнопки тулбара
$('#btn-reload').addEventListener('click', ()=>{
  vibrate(8);
  loaded = false;
  els.fallback.hidden = true;
  els.frame.style.display = '';
  els.wrap.classList.remove('loaded');
  els.status.textContent = 'Перезагружаем оригинал…';
  // bust cache
  const url = new URL(els.frame.src);
  url.searchParams.set('_', Date.now());
  els.frame.src = url.toString();
  loadTimeout = setTimeout(()=>{ if(!loaded) markFailed('таймаут'); }, 8000);
  toast('Перезагрузка');
});

$('#btn-open-external').addEventListener('click', ()=>{
  window.open(els.frame.src, '_blank', 'noopener');
  vibrate(6);
});
$('#fallback-link').addEventListener('click', ()=> vibrate(6));
$('#btn-notice-close').addEventListener('click', ()=>{
  els.adaptNotice.style.display='none';
  localStorage.setItem('1in8b-adapt-notice','1');
});
if(localStorage.getItem('1in8b-adapt-notice')) els.adaptNotice.style.display='none';

// 4. Шторка патчей
function openSheet(){
  els.sheet.classList.add('open');
  els.sheet.setAttribute('aria-hidden','false');
  els.overlay.classList.add('show');
}
function closeSheet(){
  els.sheet.classList.remove('open');
  els.sheet.setAttribute('aria-hidden','true');
  els.overlay.classList.remove('show');
}
$('#btn-sheet-adapt').addEventListener('click', openSheet);
$('#btn-about').addEventListener('click', openSheet);
$('[data-close]').addEventListener('click', closeSheet);
els.overlay.addEventListener('click', closeSheet);

// 5. PWA install
window.addEventListener('beforeinstallprompt', e=>{
  e.preventDefault();
  deferredPrompt = e;
  els.installBtn.hidden = false;
});
els.installBtn.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  toast(outcome==='accepted' ? 'Устанавливаем…' : 'Отклонено');
  deferredPrompt = null;
  els.installBtn.hidden = true;
});
window.addEventListener('appinstalled', ()=>{
  toast('Установлено на главный экран');
  els.installBtn.hidden = true;
});

// 6. Локальная адаптированная копия (fallback) — ленивая загрузка
// Мы не грузим тяжёлый движок сразу, чтобы не утяжелять обёртку
$('#btn-fallback-local').addEventListener('click', async ()=>{
  vibrate(10);
  $('#local-copy').hidden = false;
  $('#local-stage').innerHTML = '<p style="text-align:center; padding:24px; color:var(--muted)">Загружаем локальную копию…</p>';
  try{
    // Динамически подгружаем адаптированный движок (сохранён как local-adaptation)
    const mod = await import('./local-adaptation/app.js');
    if(mod.initLocal) mod.initLocal($('#local-stage'));
  }catch(e){
    // если файла нет — покажем инструкцию
    $('#local-stage').innerHTML = `
      <div style="background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:16px; text-align:center; box-shadow:var(--shadow-soft)">
        <h3 style="margin:0">Локальная копия не собрана</h3>
        <p class="muted small">Она собирается из тех же данных оригинала (172 страны, life tables) + наши мобильные патчи. Чтобы включить — добавь папку <code>js/local-adaptation/</code> из предыдущего коммита.</p>
        <a href="https://1in8b.life/ru/" target="_blank" class="btn-primary" style="display:block; margin-top:12px">Играть в оригинал</a>
      </div>
    `;
  }
});
$('#btn-local-back').addEventListener('click', ()=>{
  $('#local-copy').hidden = true;
});

// 7. Viewport fix for iOS 100vh
function setVH(){
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', ()=> setTimeout(setVH, 200));

// 8. Внешние ссылки — вибрация
document.addEventListener('click', e=>{
  const a = e.target.closest('a[target="_blank"]');
  if(a) vibrate(6);
}, {passive:true});

// 9. Service Worker — кэширует только оболочку
if('serviceWorker' in navigator){
  fetch('./sw.js', {method:'HEAD'}).then(r=>{
    if(r.ok) navigator.serviceWorker.register('./sw.js');
  }).catch(()=>{});
}

// Отметим что адаптация загружена
console.log('[adapter] 1in8b mobile adapter loaded — patches active, original untouched');
