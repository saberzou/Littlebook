'use strict';

let currentData = null;
let currentDate = null;
let archiveMonth = '';
const archiveDates = DailyData.getAllDates().slice().sort();
const archiveMonths = [...new Set(archiveDates.map(date => date.slice(0, 7)))];
const dateLabel = date => new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

let calendarCloseTimer;
function closeCalendar() {
    const dialog = document.getElementById('archiveDialog');
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        dialog.close();
        return;
    }
    dialog.classList.add('is-closing');
    calendarCloseTimer = setTimeout(() => dialog.close(), 220);
}

function init() {
    let saved;
    try { saved = localStorage.getItem('littlebook-theme'); } catch {}
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    const dialog = document.getElementById('archiveDialog');
    const sidebar = document.getElementById('archiveSidebar');
    const mobile = window.matchMedia('(max-width: 800px)');
    function placeCalendar() {
        if (dialog.open) dialog.close();
        if (mobile.matches) document.getElementById('mobileCalendarHost').appendChild(sidebar);
        else document.querySelector('.archive-layout').prepend(sidebar);
    }
    placeCalendar();
    mobile.addEventListener('change', placeCalendar);
    document.getElementById('browseArchive').addEventListener('click', () => {
        clearTimeout(calendarCloseTimer);
        dialog.classList.remove('is-closing');
        dialog.showModal();
        document.getElementById('calendarHeading').focus({ preventScroll: true });
    });
    dialog.addEventListener('close', () => {
        clearTimeout(calendarCloseTimer);
        dialog.classList.remove('is-closing');
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeCalendar(); });
    document.getElementById('closeArchive').addEventListener('click', closeCalendar);
    dialog.addEventListener('click', event => { if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeCalendar();
    }});
    const select = document.getElementById('monthSelect');
    archiveMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = new Date(month + '-01T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        select.appendChild(option);
    });
    select.addEventListener('change', () => { archiveMonth = select.value; buildCalendar(); });
    document.getElementById('prevMonth').addEventListener('click', () => moveMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => moveMonth(1));
    document.getElementById('prevEntry').addEventListener('click', () => moveEntry(-1));
    document.getElementById('nextEntry').addEventListener('click', () => moveEntry(1));
    document.getElementById('archiveSummary').textContent = `${archiveDates.length} days of books & quotes`;
    const spread = document.getElementById('bookSpread');
    spread.addEventListener('click', toggleBookSpread);
    spread.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleBookSpread(); }
    });
    selectDate(new URLSearchParams(location.search).get('date'), false);
}

function toggleBookSpread() {
    const spread = document.getElementById('bookSpread');
    const open = spread.classList.toggle('open');
    spread.setAttribute('aria-expanded', String(open));
    document.getElementById('bookPages').setAttribute('aria-hidden', String(!open));
    document.querySelector('.cover-back').setAttribute('aria-hidden', String(!open));
    spread.setAttribute('aria-label', open ? 'Close book' : 'Open book to read its quote');
    document.getElementById('bookHint').textContent = open ? 'Tap the book to close' : 'Open the book for a quote';
    if (open) requestAnimationFrame(() => {
        const page = document.querySelector('.book-page-right');
        if (page.scrollHeight > page.clientHeight + 2) document.getElementById('bookHint').textContent = 'Scroll the quote to read more · Tap to close';
    });
}

function moveMonth(direction) {
    const next = archiveMonths[archiveMonths.indexOf(archiveMonth) + direction];
    if (next) { archiveMonth = next; buildCalendar(); }
}

function moveEntry(direction) {
    const next = archiveDates[archiveDates.indexOf(currentDate) + direction];
    if (next) selectDate(next);
}

function buildCalendar() {
    const track = document.getElementById('calendarTrack');
    track.replaceChildren();
    document.getElementById('monthSelect').value = archiveMonth;
    const index = archiveMonths.indexOf(archiveMonth);
    document.getElementById('prevMonth').disabled = index <= 0;
    document.getElementById('nextMonth').disabled = index >= archiveMonths.length - 1;
    const [year, month] = archiveMonth.split('-').map(Number);
    const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) track.appendChild(document.createElement('span'));
    const days = new Date(year, month, 0).getDate();
    for (let day = 1; day <= days; day++) {
        const date = `${archiveMonth}-${String(day).padStart(2, '0')}`;
        const data = DailyData.getByDate(date);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'archive-day' + (data ? ' has-entry' : '') + (date === currentDate ? ' selected' : '');
        cell.textContent = day;
        cell.dataset.date = date;
        cell.disabled = !data;
        cell.setAttribute('aria-label', dateLabel(date) + (data ? ': ' + data.book.title : ': no entry'));
        cell.setAttribute('aria-pressed', String(date === currentDate));
        if (data) cell.title = data.book.title;
        cell.addEventListener('click', () => selectDate(date));
        track.appendChild(cell);
    }
}

function selectDate(date, pushHistory = true) {
    const resolved = DailyData.getByDate(date) ? date : archiveDates[archiveDates.length - 1];
    const dialog = document.getElementById('archiveDialog');
    if (dialog.open) closeCalendar();
    currentDate = resolved;
    currentData = DailyData.getByDate(resolved);
    archiveMonth = resolved.slice(0, 7);
    buildCalendar();
    const spread = document.getElementById('bookSpread');
    spread.classList.remove('open');
    spread.setAttribute('aria-expanded', 'false');
    document.getElementById('bookPages').setAttribute('aria-hidden', 'true');
    document.querySelector('.cover-back').setAttribute('aria-hidden', 'true');
    spread.setAttribute('aria-label', 'Open book to read its quote');
    document.getElementById('bookHint').textContent = 'Open the book for a quote';
    const dateEl = document.getElementById('entryDate');
    dateEl.textContent = dateLabel(resolved);
    dateEl.dateTime = resolved;
    document.getElementById('prevEntry').disabled = resolved === archiveDates[0];
    document.getElementById('nextEntry').disabled = resolved === archiveDates[archiveDates.length - 1];
    const url = new URL(location.href);
    url.searchParams.set('date', resolved);
    history[pushHistory ? 'pushState' : 'replaceState']({ date: resolved }, '', url);
    loadContent();
}

window.addEventListener('popstate', () => selectDate(new URLSearchParams(location.search).get('date'), false));

// =============================================
//  CONTENT LOADING
// =============================================
function generateCoverPlaceholder(title, author) {
    const maxChars = 14;
    const words = title.split(' ');
    const lines = [];
    let line = '';
    words.forEach(w => {
        if ((line + ' ' + w).trim().length > maxChars) {
            if (line) lines.push(line.trim());
            line = w;
        } else {
            line = (line + ' ' + w).trim();
        }
    });
    if (line) lines.push(line.trim());

    const totalBlockHeight = lines.length * 28 + 20;
    const titleY = (360 - totalBlockHeight) / 2 + 14;
    const cx = 120;
    const titleSvg = lines.map((l, i) =>
        `<text x="${cx}" y="${titleY + i * 28}" text-anchor="middle" fill="#EDEDED" font-family="system-ui, sans-serif" font-size="18" font-weight="600">${l.replace(/&/g, '&amp;')}</text>`
    ).join('');

    return 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="360">' +
        '<rect width="240" height="360" fill="#171717" rx="4"/>' +
        `<line x1="40" y1="${titleY - 30}" x2="200" y2="${titleY - 30}" stroke="#333333" stroke-width="1" opacity="0.8"/>` +
        titleSvg +
        `<text x="${cx}" y="${titleY + lines.length * 28 + 8}" text-anchor="middle" fill="#888888" font-family="system-ui, sans-serif" font-size="11">${(author || '').replace(/&/g, '&amp;')}</text>` +
        `<line x1="40" y1="${titleY + lines.length * 28 + 40}" x2="200" y2="${titleY + lines.length * 28 + 40}" stroke="#333333" stroke-width="1" opacity="0.8"/>` +
        '</svg>'
    );
}

function loadContent() {
    if (!currentData) return;
    const { book, quote } = currentData;

    // Stop any playing audio
    if (window._stopAudio) window._stopAudio();

    // Show audio player if available
    if (window._showAudio) window._showAudio(currentData.audio || null);

    // Book info — inside spread left page
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;

    // Book info — below spread (visible when closed)
    document.getElementById('bookCategoryBelow').textContent = book.category;
    document.getElementById('bookTitleBelow').textContent = book.title;
    document.getElementById('bookAuthorBelow').textContent = book.author;
    document.getElementById('bookDescBelow').textContent = book.desc;

    // Quote — inside spread right page
    document.getElementById('quoteText').textContent = quote.text;
    document.getElementById('bookSpread').classList.toggle('long-quote', quote.text.length > 120);
    document.getElementById('quoteSource').textContent = `— ${quote.source}`;

    // Cover image
    const coverImg = document.getElementById('bookCover');
    const cover3d = document.getElementById('bookCover3d');

    // Hide old cover immediately, show shimmer while loading
    cover3d.classList.remove('loading');
    const placeholder = generateCoverPlaceholder(book.title, book.author);
    coverImg.onerror = null;
    coverImg.src = placeholder;
    coverImg.alt = book.title;

    // Tag this fetch so stale responses from previous day switches are ignored
    const fetchId = ++coverImg._fetchId || (coverImg._fetchId = 1);

    DailyData.fetchBestCover(book.isbn, book.title, book.author).then(url => {
        if (coverImg._fetchId !== fetchId || !url) return;
        coverImg.onerror = () => {
            if (coverImg._fetchId !== fetchId) return;
            coverImg.onerror = null;
            coverImg.src = placeholder;
        };
        coverImg.src = url;
    }).catch(() => {});

    // Fetch only the selected cover; the archive does not need background API traffic.

    // Set book pages background color from palette
    const quoteColors = ['#D9A48B', '#CC7F4E', '#B8A0B0', '#7BC4D9', '#8B8B6E', '#D4C9A1'];
    const colorIdx = Math.abs(currentDate.split('-').reduce((a, b) => a + parseInt(b), 0)) % quoteColors.length;
    const bgColor = quoteColors[colorIdx];
    const bookPages = document.getElementById('bookPages');
    document.getElementById('bookSpread').style.setProperty('--paper-color', bgColor);
    bookPages.style.backgroundColor = 'transparent';

    // Dark mode: muted version
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.getElementById('bookSpread').style.setProperty('--paper-color', blendWithDark(bgColor, 0.35));
    }
}

function blendWithDark(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const blend = (c) => Math.round(c * (1 - amount));
    return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}

function preloadAdjacentCovers() {
    if (!currentDate) return;
    const allDates = DailyData.getAllDates();
    const idx = allDates.indexOf(currentDate);
    const toPreload = [];
    if (idx > 0) toPreload.push(allDates[idx - 1]);
    if (idx < allDates.length - 1) toPreload.push(allDates[idx + 1]);
    toPreload.forEach(date => {
        const data = DailyData.getByDate(date);
        if (data && data.book) {
            DailyData.fetchBestCover(data.book.isbn, data.book.title, data.book.author);
        }
    });
}

// =============================================
//  AUDIO PLAYER
// =============================================
function initAudioPlayer() {
    const player = document.getElementById('audioPlayer');
    const btn = document.getElementById('audioBtn');
    const el = document.getElementById('audioEl');
    const progress = document.getElementById('audioProgress');
    const timeEl = document.getElementById('audioTime');
    if (!player || !el) return;

    function showAudio(src) {
        if (!src) { player.style.display = 'none'; return; }
        player.style.display = '';
        player.classList.remove('playing');
        player.classList.add('loading');
        el.src = src;
        el.load();
        progress.style.width = '0%';
        timeEl.textContent = '0:00';
    }

    function fmt(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + String(sec).padStart(2, '0');
    }

    el.addEventListener('error', () => {
        player.classList.remove('playing', 'loading');
        timeEl.textContent = 'Unavailable';
    });

    el.addEventListener('loadedmetadata', () => {
        player.classList.remove('loading');
        timeEl.textContent = fmt(el.duration);
    });

    el.addEventListener('timeupdate', () => {
        if (!el.duration) return;
        const pct = (el.currentTime / el.duration) * 100;
        progress.style.width = pct + '%';
        timeEl.textContent = fmt(el.duration - el.currentTime);
    });

    el.addEventListener('ended', () => {
        player.classList.remove('playing');
        progress.style.width = '0%';
        timeEl.textContent = fmt(el.duration);
    });

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.paused) {
            el.play().then(() => player.classList.add('playing')).catch(() => {
                player.classList.remove('playing', 'loading');
                timeEl.textContent = 'Unavailable';
            });
        } else {
            el.pause();
            player.classList.remove('playing');
        }
    });

    // Expose for use in loadContent
    window._showAudio = showAudio;
    window._stopAudio = () => { el.pause(); el.currentTime = 0; player.classList.remove('playing'); };
}

// =============================================
//  BOOT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initAudioPlayer();
    init();
});
