// Kiosk: plays the slides in a loop. Each slide types its prompt, thinks briefly, then streams its answer.
// Keys: → / PageDown next · ← / PageUp back · space pause · f fullscreen. Start at a slide with #3.

interface SessionData {
  start: string;
  end: string;
  when: string;
  title: string;
  place: string;
}

const root = document.querySelector<HTMLElement>('[data-kiosk]')!;
const stage = document.querySelector<HTMLElement>('[data-stage]')!;
const slides = [...document.querySelectorAll<HTMLElement>('.slide')];
const progress = document.querySelector<HTMLOListElement>('[data-progress]')!;
const pausedLabel = document.querySelector<HTMLElement>('[data-paused]')!;
const itemTemplate = document.querySelector<HTMLTemplateElement>('[data-progress-item]')!;
const data: { sessions: SessionData[] } = JSON.parse(document.getElementById('kiosk-data')!.textContent || '{}');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

// ---------- fit the 1920×1080 stage to the screen ----------

function fit() {
  stage.style.setProperty('--fit', String(Math.min(innerWidth / 1920, innerHeight / 1080)));
}
fit();
addEventListener('resize', fit);

// ---------- live dates ----------

function nextSession(now = Date.now()) {
  return data.sessions.find((s) => new Date(s.end).getTime() >= now);
}

function refreshDates() {
  const now = Date.now();
  let nextFound = false;
  document.querySelectorAll<HTMLElement>('.k-session').forEach((row) => {
    let status = 'upcoming';
    if (new Date(row.dataset.end!).getTime() < now) status = 'done';
    else if (!nextFound) {
      status = 'next';
      nextFound = true;
    }
    row.dataset.status = status;
  });

  const next = nextSession(now);
  const box = document.querySelector<HTMLElement>('[data-next]');
  if (!box) return;
  if (!next) {
    box.innerHTML = '<span class="dim">Dates for the next semester follow soon.</span>';
    return;
  }
  const set = (sel: string, text: string) => {
    const node = box.querySelector(sel);
    if (node) node.textContent = text;
  };
  set('[data-next-when]', next.when);
  set('[data-next-title]', next.title);
  set('[data-next-place]', next.place);
}

// A slide with data-until (the CCC) leaves the loop once its event is over.
const isLive = (slide: HTMLElement) => !slide.dataset.until || new Date(slide.dataset.until).getTime() > Date.now();

// ---------- progress, as todo checkboxes in the status line ----------

const marks = slides.map(() => {
  const li = itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
  progress.append(li);
  return li;
});

function renderProgress(current: number) {
  marks.forEach((li, i) => {
    li.hidden = !isLive(slides[i]);
    li.dataset.state = i === current ? 'current' : i < current ? 'done' : 'upcoming';
  });
}

// ---------- playing one slide ----------

let current = -1;
let run = 0; // bumps on every slide change, so timelines of earlier slides stop
let advanceTimer = 0;
let paused = false;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function reset(slide: HTMLElement) {
  slide.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => el.removeAttribute('data-shown'));
  slide.querySelectorAll<HTMLElement>('[data-tick]').forEach((el) => el.removeAttribute('data-state'));
  slide.querySelectorAll<HTMLElement>('[data-spin]').forEach((el) => (el.hidden = true));
  slide.querySelectorAll<HTMLElement>('[data-typed]').forEach((el) => {
    el.dataset.text ??= el.textContent || '';
    el.textContent = '';
  });
}

function finish(slide: HTMLElement) {
  slide.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => el.setAttribute('data-shown', ''));
  slide.querySelectorAll<HTMLElement>('[data-tick]').forEach((el) => (el.dataset.state = 'done'));
  slide.querySelectorAll<HTMLElement>('[data-spin]').forEach((el) => (el.hidden = true));
  slide.querySelectorAll<HTMLElement>('[data-typed]').forEach((el) => {
    el.textContent = el.dataset.text ?? el.textContent;
    el.removeAttribute('data-typing');
  });
}

async function play(slide: HTMLElement, token: number) {
  if (reduced.matches) return finish(slide);
  await wait(450); // let the slide arrive first
  const live = () => token === run;
  const parts = slide.querySelectorAll<HTMLElement>('[data-typed], [data-spin], [data-step], [data-tick]');
  for (const el of parts) {
    if (!live()) return;
    if (el.hasAttribute('data-typed')) {
      el.dataset.typing = '';
      for (const ch of el.dataset.text ?? '') {
        if (!live()) return;
        el.textContent += ch;
        await wait(ch === ' ' ? 70 : 48);
      }
      await wait(260);
      el.removeAttribute('data-typing');
    } else if (el.hasAttribute('data-spin')) {
      el.hidden = false;
      await wait(900);
      el.hidden = true;
    } else if (el.hasAttribute('data-step')) {
      await wait(Number(el.dataset.wait ?? 380));
      el.setAttribute('data-shown', '');
    } else {
      await wait(500);
      el.dataset.state = 'active';
      await wait(950);
      if (live()) el.dataset.state = 'done';
    }
  }
}

function schedule() {
  clearTimeout(advanceTimer);
  if (paused || current < 0) return;
  advanceTimer = window.setTimeout(() => go(1), Number(slides[current].dataset.dur ?? 12) * 1000);
}

function step(from: number, dir: 1 | -1) {
  for (let n = 1; n <= slides.length; n++) {
    const i = (from + dir * n + slides.length * n) % slides.length;
    if (isLive(slides[i])) return i;
  }
  return from;
}

function show(index: number) {
  const previous = slides[current];
  if (previous && index !== current) {
    previous.removeAttribute('data-current');
    previous.setAttribute('data-leaving', '');
    setTimeout(() => previous.removeAttribute('data-leaving'), 700);
  }
  current = index;
  const slide = slides[index];
  run++;
  refreshDates();
  reset(slide);
  slide.removeAttribute('data-leaving');
  slide.setAttribute('data-current', '');
  root.toggleAttribute('data-own-qr', slide.hasAttribute('data-own-qr'));
  renderProgress(index);
  play(slide, run);
  schedule();
}

const go = (dir: 1 | -1) => show(step(current, dir));

function setPaused(value: boolean) {
  paused = value;
  pausedLabel.hidden = !paused;
  schedule();
}

// ---------- controls ----------

addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
      go(1);
      break;
    case 'ArrowLeft':
    case 'PageUp':
      go(-1);
      break;
    case ' ':
    case 'p':
      setPaused(!paused);
      break;
    case 'f':
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.().catch(() => {});
      break;
    case 'Home':
      show(step(-1, 1));
      break;
    default:
      return;
  }
  e.preventDefault();
});

root.addEventListener('click', () => go(1));

// Hide the mouse pointer while nobody moves it.
let idleTimer = 0;
addEventListener('pointermove', () => {
  root.removeAttribute('data-idle');
  clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => root.setAttribute('data-idle', ''), 2500);
});
root.setAttribute('data-idle', '');

// Keep the screen awake where the browser allows it.
async function keepAwake() {
  try {
    await (navigator as Navigator & { wakeLock?: { request(type: 'screen'): Promise<unknown> } }).wakeLock?.request('screen');
  } catch {
    /* not supported or not allowed: the screen's own settings apply */
  }
}
document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && keepAwake());
keepAwake();

// ---------- start ----------

const startAt = Math.max(0, Number(location.hash.slice(1)) - 1 || 0);
document.fonts.ready.then(() => show(isLive(slides[startAt] ?? slides[0]) ? Math.min(startAt, slides.length - 1) : step(startAt, 1)));
