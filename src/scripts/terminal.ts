// AI Club homepage behaviour: replay, sessions, permission prompt, command input, theme.
// Everything here enhances content that is already in the HTML.

type Status = 'done' | 'next' | 'upcoming';
interface Person {
  name: string;
  role: string;
}

const root = document.documentElement;
const data = JSON.parse(document.getElementById('aiclub-data')?.textContent || '{}') as {
  joinFormUrl?: string;
  guestFormUrl?: string;
  people?: Person[];
};
// Typed commands print above the input box; join answers print right under the join prompt.
const log = document.querySelector<HTMLElement>('[data-log]')!;
const joinLog = document.querySelector<HTMLElement>('[data-join-log]') ?? log;
const laterTemplate = document.querySelector<HTMLTemplateElement>('template[data-later]');
const touch = matchMedia('(hover: none), (pointer: coarse)');
const statusLabel: Record<Status, string> = { done: 'done', next: 'next session', upcoming: 'upcoming' };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- small DOM helpers ---------- */

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function echo(text: string) {
  const p = el('p', 'user-prompt echo');
  const sign = el('span', 'prompt-sign', '>');
  sign.setAttribute('aria-hidden', 'true');
  p.append(sign, el('span', '', text));
  return p;
}

/** An assistant message: a dot, a body of lines, and an optional elbowed result. */
function message(lines: (string | Node)[], result?: (string | Node)[], ok = false) {
  const section = el('section', 'msg');
  const dot = el('span', ok ? 'g-dot ok' : 'g-dot');
  dot.setAttribute('aria-hidden', 'true');
  const body = el('div', 'msg-body prose');
  for (const line of lines) body.append(typeof line === 'string' ? el('p', '', line) : line);
  if (result) {
    const r = el('div', 'result');
    const elbow = el('span', 'g-elbow');
    elbow.setAttribute('aria-hidden', 'true');
    const rb = el('div', 'result-body');
    for (const line of result) rb.append(typeof line === 'string' ? el('p', 'dim result-line', line) : line);
    r.append(elbow, rb);
    body.append(r);
  }
  section.append(dot, body);
  return section;
}

function commandList() {
  const dl = el('dl', 'kv');
  const rows: [string, string][] = [
    ['/join', data.joinFormUrl ? 'open the sign-up form' : 'sign up (form link coming soon)'],
    ['/next', 'show the next session'],
    ['/sessions', 'show all sessions, winter and summer'],
    ['/guest', 'register as an external guest'],
    ['/people', 'show who runs the club'],
    ['/theme', 'switch between dark and light'],
    ['/help', 'list all commands'],
  ];
  if (!touch.matches) {
    rows.push(['ctrl+o', 'expand or collapse the selected session'], ['1 2 3', 'answer the join question']);
  }
  for (const [k, v] of rows) dl.append(el('dt', '', k), el('dd', '', v));
  return dl;
}

function printTo(target: HTMLElement, ...nodes: Node[]) {
  const first = nodes[0] as HTMLElement | undefined;
  target.append(...nodes);
  first?.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}
const print = (...nodes: Node[]) => printTo(log, ...nodes);

function link(text: string, href: string) {
  const a = el('a', '', text);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

function guestMessage() {
  const result: (string | Node)[] = data.guestFormUrl
    ? [link('Register with the guest form', data.guestFormUrl), 'Then pick a date above.']
    : ['Pick a date above and come by at the listed time and place.'];
  return message(['External guests are welcome at our club meetings, at school or online.'], result);
}

/* ---------- theme ---------- */

// Dark is the default; light applies only when the visitor picks it.
const currentTheme = () => (root.dataset.theme === 'light' ? 'light' : 'dark');

function renderTheme() {
  const theme = currentTheme();
  const other = theme === 'dark' ? 'light' : 'dark';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((btn) => {
    const name = btn.querySelector('.theme-name');
    if (name) name.textContent = theme;
    btn.setAttribute('aria-label', `Theme: ${theme}. Switch to ${other}`);
  });
}

function setTheme(theme: 'light' | 'dark') {
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fcfbfa' : '#131215');
  try {
    localStorage.setItem('aiclub-theme', theme);
  } catch {}
  renderTheme();
}

document.querySelectorAll('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark')),
);
renderTheme();

/* ---------- sessions: status, expand, deep links ---------- */

function allSessions(): HTMLElement[] {
  const live = [...document.querySelectorAll<HTMLElement>('li.session')];
  const ids = new Set(live.map((s) => s.id));
  const parked = laterTemplate
    ? [...laterTemplate.content.querySelectorAll<HTMLElement>('li.session')].filter((s) => !ids.has(s.id))
    : [];
  return [...live, ...parked].sort((a, b) => Date.parse(a.dataset.start!) - Date.parse(b.dataset.start!));
}

let nextId: string | null = null;

/** Recompute done/next/upcoming in the visitor's browser, so a static build never goes stale. */
function applyStatus() {
  const now = Date.now();
  let found = false;
  for (const s of allSessions()) {
    let status: Status = 'upcoming';
    if (Date.parse(s.dataset.end!) < now) status = 'done';
    else if (!found) {
      status = 'next';
      found = true;
      nextId = s.id;
    }
    s.dataset.status = status;
    const text = s.querySelector('.status-text');
    if (text) text.textContent = `(${statusLabel[status]})`;
  }
  if (!found) nextId = null;
}

/** Show the expand hint once per list, on its first collapsed session, instead of on every row. */
function markHints(scope: ParentNode = document) {
  scope.querySelectorAll('ol.sessions').forEach((list) => {
    const rows = [...list.querySelectorAll<HTMLElement>(':scope > li.session')];
    const first = rows.find((s) => !('open' in s.dataset));
    rows.forEach((s) => (s === first ? (s.dataset.hint = '') : delete s.dataset.hint));
  });
}

function setOpen(session: HTMLElement, open: boolean) {
  const row = session.querySelector<HTMLButtonElement>('.row');
  const details = session.querySelector<HTMLElement>('.details');
  if (open) session.dataset.open = '';
  else delete session.dataset.open;
  row?.setAttribute('aria-expanded', String(open));
  if (details) details.inert = !open;
  const list = session.closest('ol.sessions');
  if (list) markHints(list.parentElement ?? document);
}

function initSessions(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('li.session').forEach((s) => {
    // Only the next session starts open.
    setOpen(s, s.id === nextId);
  });
}

function updateNextLine() {
  const line = document.querySelector<HTMLElement>('[data-next-line]');
  const next = nextId ? allSessions().find((s) => s.id === nextId) : null;
  if (!next) {
    if (line) line.textContent = 'Dates for the next semester follow soon.';
    const side = document.querySelector('.side-next');
    if (side) side.replaceWith(el('span', 'dim', 'Dates for the next semester follow soon.'));
    document.querySelector('.side-link')?.remove();
    return;
  }
  const title = next.querySelector('.title')?.firstChild?.textContent?.trim() ?? '';
  const when = next.querySelector('.date time')?.textContent?.trim() ?? '';
  const nextAnchor = el('a');
  nextAnchor.href = `#${next.id}`;
  nextAnchor.append(el('b', '', when), ` · ${title}`);
  line?.replaceChildren('Next up: ', nextAnchor);

  const side = document.querySelector<HTMLAnchorElement>('.side-next');
  if (side) {
    side.href = `#${next.id}`;
    const place = next.querySelector('.place')?.textContent?.trim() ?? '';
    side.replaceChildren(el('b', '', when), el('span', '', title), el('small', '', place));
  }

  // The next session's first link (e.g. a contest registration) sits under it in the welcome panel.
  const sessionLink = next.querySelector<HTMLAnchorElement>('a.session-link');
  let sideLink = document.querySelector<HTMLElement>('.side-link');
  if (!sessionLink) sideLink?.remove();
  else {
    if (!sideLink) {
      sideLink = el('p', 'side-link');
      side?.closest('p')?.after(sideLink);
    }
    sideLink.replaceChildren(link(sessionLink.textContent?.trim() ?? '', sessionLink.href));
  }
}

document.addEventListener('click', (e) => {
  const row = (e.target as Element).closest<HTMLButtonElement>('li.session .row');
  if (!row) return;
  const session = row.closest<HTMLElement>('li.session')!;
  setOpen(session, !('open' in session.dataset));
});

/** Move the later semesters from their template into the transcript. Returns the first one. */
function revealLater(withEcho?: string, target: HTMLElement = log): HTMLElement | null {
  const existing = document.querySelector<HTMLElement>('[id^="sessions-"]');
  if (existing) return existing;
  if (!laterTemplate) return null;
  const fragment = laterTemplate.content.cloneNode(true) as DocumentFragment;
  const first = fragment.firstElementChild as HTMLElement | null;
  initSessions(fragment);
  if (withEcho) target.append(echo(withEcho));
  target.append(fragment);
  laterTemplate.remove();
  applyStatus();
  hideSessionsOption();
  return first;
}

function openSession(id: string, focus = true) {
  let session = document.getElementById(id);
  if (!session && laterTemplate?.content.getElementById(id)) {
    revealLater();
    session = document.getElementById(id);
  }
  if (!session || !session.matches('li.session')) return false;
  setOpen(session, true);
  session.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  if (focus) session.querySelector<HTMLElement>('.row')?.focus({ preventScroll: true });
  return true;
}

function handleHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (/^[a-z]\d{2}-\d{2}$/.test(id)) openSession(id);
  else if (id.startsWith('sessions-')) revealLater()?.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', handleHash);

/* ---------- permission prompt ---------- */

const optionsList = document.querySelector<HTMLElement>('[data-options]')!;
const options = () => [...optionsList.querySelectorAll<HTMLElement>('.opt')];

function setActive(opt: HTMLElement) {
  options().forEach((o) => delete o.dataset.active);
  opt.dataset.active = '';
}

function renumber() {
  options().forEach((o, i) => (o.querySelector('.opt-n')!.textContent = `${i + 1}.`));
  const keys = document.querySelector('.permission .keys');
  if (keys) {
    const units = ['↑↓ to move', 'enter to select', `or press 1–${options().length}`].map((t) => el('span', 'unit', t));
    keys.replaceChildren(units[0], ' · ', units[1], ' · ', units[2]);
  }
}

function hideSessionsOption() {
  const item = optionsList.querySelector('[data-opt-item="sessions"]');
  if (!item) return;
  const wasActive = item.querySelector('[data-active]');
  const hadFocus = item.contains(document.activeElement);
  item.remove();
  renumber();
  if (wasActive) setActive(options()[0]);
  if (hadFocus) options()[0].focus({ preventScroll: true });
}

function unlinkedJoin() {
  const people = (data.people ?? []).map((p) => p.name).join(' or ');
  return message(
    ["The sign-up form isn't online yet."],
    [`Until it is, ask ${people || 'the club'} at school how to join.`],
  );
}

function answer(kind: string, label: string) {
  const q = `Join the AI Club? › ${label}`;
  if (kind === 'join') {
    printTo(joinLog, echo(q), unlinkedJoin());
  } else if (kind === 'sessions') {
    const first = revealLater(q, joinLog);
    first?.previousElementSibling?.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  } else if (kind === 'guest') {
    printTo(joinLog, echo(q), guestMessage());
  }
}

optionsList.addEventListener('click', (e) => {
  const opt = (e.target as Element).closest<HTMLElement>('.opt');
  if (!opt) return;
  setActive(opt);
  const kind = opt.dataset.opt!;
  if (kind === 'join' && !('unlinked' in opt.dataset)) return; // a real link opens the form
  e.preventDefault();
  answer(kind, opt.lastElementChild?.textContent ?? '');
  // After any answer the prompt offers joining again.
  setActive(options()[0]);
});
optionsList.addEventListener('pointerover', (e) => {
  const opt = (e.target as Element).closest<HTMLElement>('.opt');
  if (opt) setActive(opt);
});
optionsList.addEventListener('focusin', (e) => {
  const opt = (e.target as Element).closest<HTMLElement>('.opt');
  if (opt) setActive(opt);
});
optionsList.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const list = options();
  const i = list.indexOf(document.activeElement as HTMLElement);
  const next = list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length];
  next.focus();
  e.preventDefault();
});
setActive(options()[0]);

/* ---------- command input ---------- */

const form = document.querySelector<HTMLFormElement>('[data-input]')!;
const input = form.querySelector<HTMLInputElement>('input')!;
const menu = form.querySelector<HTMLUListElement>('#cmd-menu')!;
const menuItems = [...menu.querySelectorAll<HTMLLIElement>('li')];
let menuIndex = 0;

function visibleItems() {
  return menuItems.filter((li) => !li.hidden);
}

function renderMenu() {
  const value = input.value.trim().toLowerCase();
  const open = value.startsWith('/') && !value.includes(' ');
  menuItems.forEach((li) => (li.hidden = !li.dataset.cmd!.startsWith(value)));
  const items = visibleItems();
  const show = open && items.length > 0 && !(items.length === 1 && items[0].dataset.cmd === value);
  menu.hidden = !show;
  input.setAttribute('aria-expanded', String(show));
  menuIndex = Math.min(menuIndex, Math.max(items.length - 1, 0));
  items.forEach((li, i) => li.setAttribute('aria-selected', String(show && i === menuIndex)));
  if (show && items[menuIndex]) input.setAttribute('aria-activedescendant', items[menuIndex].id);
  else input.removeAttribute('aria-activedescendant');
}

function closeMenu() {
  menu.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
}

input.addEventListener('input', () => {
  menuIndex = 0;
  renderMenu();
});
input.addEventListener('blur', () => window.setTimeout(closeMenu, 120));
input.addEventListener('keydown', (e) => {
  if (menu.hidden) {
    if (e.key === 'Escape') input.blur();
    return;
  }
  const items = visibleItems();
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    menuIndex = (menuIndex + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    renderMenu();
    e.preventDefault();
  } else if (e.key === 'Tab' || (e.key === 'Enter' && items[menuIndex] && input.value.trim() !== items[menuIndex].dataset.cmd)) {
    input.value = items[menuIndex].dataset.cmd!;
    closeMenu();
    if (e.key === 'Tab') e.preventDefault();
  } else if (e.key === 'Escape') {
    closeMenu();
    e.preventDefault();
  }
});
menu.addEventListener('pointerdown', (e) => {
  const li = (e.target as Element).closest<HTMLLIElement>('li');
  if (!li) return;
  e.preventDefault();
  input.value = li.dataset.cmd!;
  closeMenu();
  form.requestSubmit();
});

function run(raw: string) {
  const value = raw.trim();
  if (!value) return;
  const [cmd, arg] = value.toLowerCase().split(/\s+/);
  const said = echo(value);
  switch (cmd) {
    case '/join': {
      if (data.joinFormUrl) {
        print(said, message(['Opening the sign-up form in a new tab.'], [link('Open the sign-up form', data.joinFormUrl)]));
        window.open(data.joinFormUrl, '_blank', 'noopener');
      } else print(said, unlinkedJoin());
      break;
    }
    case '/next': {
      if (!nextId) {
        print(said, message(["There's no upcoming session yet."], ['Dates for the next semester follow soon.']));
        break;
      }
      const session = allSessions().find((s) => s.id === nextId)!;
      const title = session.querySelector('.title')?.firstChild?.textContent?.trim() ?? '';
      log.append(said, message([`Next session: ${session.querySelector('.date')?.textContent?.trim()} · ${title}`], ['Opened it in the session list above.']));
      openSession(nextId);
      break;
    }
    case '/sessions': {
      const already = document.querySelector('[id^="sessions-"]');
      if (already) {
        print(said, message(['All sessions are listed above.']));
        already.scrollIntoView({ block: 'start' });
      } else {
        revealLater(value)?.previousElementSibling?.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
      break;
    }
    case '/guest':
      print(said, guestMessage());
      break;
    case '/people': {
      const dl = el('dl', 'owners');
      for (const p of data.people ?? []) {
        const row = el('div', 'owner');
        row.append(el('dt', '', p.name), el('dd', 'dim', `# ${p.role}`));
        dl.append(row);
      }
      print(said, message(['The club is run by:'], [dl], true));
      break;
    }
    case '/theme': {
      const target = arg === 'light' || arg === 'dark' ? arg : currentTheme() === 'dark' ? 'light' : 'dark';
      setTheme(target);
      print(said, message([`Theme set to ${target}.`]));
      break;
    }
    case '/help':
    case '?':
      print(said, message(['Commands you can type here:'], [commandList()]));
      break;
    default:
      print(
        said,
        message(["I'm a web page, not a real agent, so I only know a few commands:"], [commandList()]),
      );
  }
}

// Commands named in the welcome box run when clicked, as if typed.
document.querySelectorAll<HTMLButtonElement>('button[data-run]').forEach((btn) =>
  btn.addEventListener('click', () => run(btn.dataset.run!)),
);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  closeMenu();
  run(input.value);
  input.value = '';
});

/* ---------- global keys ---------- */

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'o' && (e.ctrlKey || e.metaKey) && !e.altKey) {
    const focused = (document.activeElement as Element | null)?.closest<HTMLElement>('li.session');
    const target = focused ?? (nextId ? document.getElementById(nextId) : null);
    if (target) {
      e.preventDefault();
      setOpen(target, !('open' in target.dataset));
    }
    return;
  }
  if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '/') {
    e.preventDefault();
    input.focus();
    input.value = '/';
    renderMenu();
  } else if (e.key === '?') {
    e.preventDefault();
    run('/help');
  } else if (/^[1-9]$/.test(e.key)) {
    const opt = options()[Number(e.key) - 1];
    if (opt) {
      e.preventDefault();
      opt.focus();
      opt.click();
    }
  }
});

/* ---------- replay ---------- */

const verbs = ['Reading the room', 'Checking the schedule', 'Swapping tricks', 'Warming up the agent'];

function replay() {
  const steps = [...document.querySelectorAll<HTMLElement>('[data-step]')];
  const timers: number[] = [];
  let spinner: HTMLElement | null = null;
  let finished = false;

  const show = (s: HTMLElement) => s.setAttribute('data-shown', '');
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    spinner?.remove();
    const typed = document.querySelector<HTMLElement>('[data-typed]');
    if (typed) {
      typed.textContent = typed.dataset.full ?? typed.textContent;
      delete typed.dataset.typing;
    }
    steps.forEach(show);
    try {
      sessionStorage.setItem('aiclub-replayed', '1');
    } catch {}
    window.setTimeout(() => root.classList.remove('replay'), 700);
    ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach((t) => removeEventListener(t, finish));
  };
  ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, finish, { passive: true }));

  let t = 60;
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  for (const step of steps) {
    if (step.dataset.step === 'type') {
      const typed = step.querySelector<HTMLElement>('[data-typed]')!;
      const full = typed.textContent ?? '';
      typed.dataset.full = full;
      at(t, () => {
        typed.textContent = '';
        typed.dataset.typing = '';
        show(step);
      });
      t += 220;
      for (let i = 1; i <= full.length; i++) {
        at(t, () => (typed.textContent = full.slice(0, i)));
        t += 30;
      }
      at(t + 120, () => {
        delete typed.dataset.typing;
        spinner = el('p', 'spinner');
        spinner.setAttribute('aria-hidden', 'true');
        const glyph = el('span', 'spin-glyph');
        const text = el('span');
        const verb = el('span', 'spin-verb', `${verbs[Math.floor(Math.random() * verbs.length)]}…`);
        const kbd = el('span', 'dim kbd-hint', ' (esc to skip)');
        const touch = el('span', 'dim touch-hint', ' (tap to skip)');
        text.append(verb, kbd, touch);
        spinner.append(glyph, text);
        step.after(spinner);
      });
      t += 820;
      at(t, () => spinner?.remove());
      continue;
    }
    at(t, () => show(step));
    t += step.classList.contains('welcome') ? 520 : 120;
  }
  at(t + 200, finish);
}

/* ---------- boot ---------- */

applyStatus();
initSessions(document);
updateNextLine();
if (location.hash) handleHash();
if (root.classList.contains('replay')) replay();
