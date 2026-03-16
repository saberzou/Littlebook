'use strict';

let gravityClock = null;
let currentData = null;
let currentDate = null;
let showingHourglass = false;
let hourglassTimer = null;

function localDateStr(date) {
    return (date || new Date()).toLocaleDateString('en-CA');
}

function localDateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-CA');
}

const isDesktop = () => window.innerWidth >= 769;
let carouselDates = [];
let carouselBuilt = false;

// =============================================
//  DESKTOP BOOK CAROUSEL
// =============================================
function buildCarousel() {
    if (!isDesktop()) return;
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    track.innerHTML = '';
    carouselDates = DailyData.getAllDates();

    carouselDates.forEach((dateStr, i) => {
        const data = DailyData.getByDate(dateStr);
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.dataset.date = dateStr;
        item.dataset.index = i;

        const img = document.createElement('img');
        if (data && data.book) {
            img.src = generateCoverPlaceholder(data.book.title, data.book.author);
            img.alt = data.book.title;
            DailyData.fetchBestCover(data.book.isbn, data.book.title, data.book.author)
                .then(url => { if (url) img.src = url; })
                .catch(() => {});
        }

        item.appendChild(img);
        item.addEventListener('click', () => {
            if (dateStr !== currentDate) selectDate(dateStr);
        });
        track.appendChild(item);
    });

    carouselBuilt = true;
    updateCarousel(currentDate);
}

function updateCarousel(dateStr) {
    if (!isDesktop() || !carouselBuilt) return;
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const items = track.querySelectorAll('.carousel-item');
    const idx = carouselDates.indexOf(dateStr);
    if (idx < 0) return;

    const itemWidth = 180;
    const gap = 20;
    const step = itemWidth + gap;
    const containerWidth = track.parentElement.offsetWidth;
    const offset = containerWidth / 2 - itemWidth / 2 - idx * step;

    track.style.transform = `translateX(${offset}px)`;

    items.forEach((item, i) => {
        const dist = Math.abs(i - idx);
        item.classList.toggle('active', dist === 0);

        let scale, opacity;
        if (dist === 0) { scale = 1; opacity = 1; }
        else if (dist === 1) { scale = 0.8; opacity = 0.7; }
        else if (dist === 2) { scale = 0.65; opacity = 0.4; }
        else { scale = 0.55; opacity = 0.25; }

        if (dist !== 0) {
            item.style.transform = `scale(${scale})`;
            item.style.opacity = opacity;
            item.style.boxShadow = 'none';
        } else {
            item.style.transform = '';
            item.style.opacity = '';
            item.style.boxShadow = '';
        }
    });
}

// =============================================
//  INIT
// =============================================
function init() {
    currentData = DailyData.getToday();
    currentDate = currentData ? currentData.date : localDateStr();

    const todayStr = localDateStr();
    const tomorrowStr = localDateOffset(1);

    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        if (dateParam === tomorrowStr) {
            currentDate = tomorrowStr;
        } else {
            const data = DailyData.getByDate(dateParam);
            if (data) {
                currentData = data;
                currentDate = dateParam;
            } else {
                currentDate = dateParam;
            }
        }
    }

    buildCalendar();

    if (currentDate === tomorrowStr) {
        showHourglass();
    } else if (DailyData.getByDate(currentDate)) {
        loadContent();
    } else {
        showNoData();
    }

    // Book spread click to toggle open/close
    document.getElementById('bookSpread').addEventListener('click', toggleBookSpread);

    // Dark mode — auto-detect only (toggle removed)
    const saved = localStorage.getItem('littlebook-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    initCalendarSwipe();
    buildCarousel();

    window.addEventListener('resize', () => {
        if (isDesktop() && !carouselBuilt) buildCarousel();
        if (isDesktop()) updateCarousel(currentDate);
    });
}

// =============================================
//  BOOK SPREAD TOGGLE
// =============================================
function toggleBookSpread() {
    document.getElementById('bookSpread').classList.toggle('open');
}

// =============================================
//  CALENDAR STRIP
// =============================================
function buildCalendar() {
    const track = document.getElementById('calendarTrack');
    track.innerHTML = '';

    const todayStr = localDateStr();
    const calendarDates = [];
    for (let i = 5; i >= 1; i--) calendarDates.push(localDateOffset(-i));
    calendarDates.push(todayStr);
    const tomorrowStr = localDateOffset(1);
    calendarDates.push(tomorrowStr);

    calendarDates.forEach(dateStr => {
        const d = new Date(dateStr + 'T12:00:00');
        const isFuture = dateStr === tomorrowStr;
        const isSelected = dateStr === currentDate;
        const isToday = dateStr === todayStr;
        const hasData = !!DailyData.getByDate(dateStr);

        const cell = document.createElement('button');
        cell.className = 'cal-cell'
            + (isSelected ? ' selected' : '')
            + (isFuture ? ' future' : '')
            + (isToday ? ' today' : '')
            + (!hasData && !isFuture ? ' no-data' : '');
        cell.dataset.date = dateStr;

        const weekday = document.createElement('span');
        weekday.className = 'cal-weekday';
        weekday.textContent = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

        const day = document.createElement('span');
        day.className = 'cal-day';
        day.textContent = d.getDate();

        cell.appendChild(weekday);
        cell.appendChild(day);

        if (isToday) {
            const todayDot = document.createElement('span');
            todayDot.className = 'cal-today-dot';
            cell.appendChild(todayDot);
        }

        cell.addEventListener('click', () => selectDate(dateStr));
        track.appendChild(cell);
    });

    requestAnimationFrame(() => {
        const selected = track.querySelector('.cal-cell.selected');
        if (selected) selected.scrollIntoView({ inline: 'center', behavior: 'instant' });
    });
}

function updateCalendarSelection(dateStr) {
    document.querySelectorAll('.cal-cell').forEach(cell => {
        cell.classList.toggle('selected', cell.dataset.date === dateStr);
    });
    const track = document.getElementById('calendarTrack');
    const selected = track.querySelector('.cal-cell.selected');
    if (selected) selected.scrollIntoView({ inline: 'center', behavior: 'smooth' });
}

function selectDate(dateStr) {
    const tomorrowStr = localDateOffset(1);
    if (dateStr === currentDate) return;

    currentDate = dateStr;
    updateCalendarSelection(dateStr);
    updateURL(dateStr);

    // Close book spread on date change
    document.getElementById('bookSpread').classList.remove('open');

    const contentArea = document.getElementById('contentArea');
    contentArea.classList.add('fade-out');

    setTimeout(() => {
        if (dateStr === tomorrowStr) {
            showHourglass();
        } else {
            const data = DailyData.getByDate(dateStr);
            if (data) {
                currentData = data;
                hideHourglass();
                loadContent();
                updateCarousel(dateStr);
            } else {
                showNoData();
            }
        }
        requestAnimationFrame(() => contentArea.classList.remove('fade-out'));
    }, 250);
}

function initCalendarSwipe() {
    const strip = document.getElementById('calendarStrip');
    let startX = 0, scrollStart = 0;
    strip.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        scrollStart = strip.scrollLeft;
    }, { passive: true });
    strip.addEventListener('touchmove', (e) => {
        strip.scrollLeft = scrollStart + (startX - e.touches[0].clientX);
    }, { passive: true });
}

// =============================================
//  HOURGLASS / NO DATA
// =============================================
function showHourglass() {
    showingHourglass = true;
    document.getElementById('bookSpread').style.display = 'none';
    document.getElementById('bookMetaBelow').style.display = 'none';
    document.getElementById('hourglassOverlay').style.display = 'flex';
    if (document.getElementById('bookCarousel')) document.getElementById('bookCarousel').style.display = 'none';

    document.getElementById('gravityClockCanvas').style.display = 'block';
    document.querySelector('.hourglass-label').textContent = "Tomorrow's pick arrives in";
    document.querySelector('.hourglass-countdown').style.display = '';
    document.querySelector('.hourglass-hint').textContent = 'Come back tomorrow for a new book, wallpaper & quote';

    const canvas = document.getElementById('gravityClockCanvas');
    if (gravityClock) gravityClock.stop();
    gravityClock = new GravityClock(canvas);
    gravityClock.init();
    updateCountdown();
    hourglassTimer = setInterval(updateCountdown, 1000);
}

function hideHourglass() {
    showingHourglass = false;
    document.getElementById('bookSpread').style.display = '';
    document.getElementById('bookMetaBelow').style.display = '';
    document.getElementById('hourglassOverlay').style.display = 'none';
    if (document.getElementById('bookCarousel')) document.getElementById('bookCarousel').style.display = '';
    if (gravityClock) { gravityClock.stop(); gravityClock = null; }
    if (hourglassTimer) { clearInterval(hourglassTimer); hourglassTimer = null; }
}

function showNoData() {
    showingHourglass = false;
    document.getElementById('bookSpread').style.display = 'none';
    document.getElementById('bookMetaBelow').style.display = 'none';
    document.getElementById('hourglassOverlay').style.display = 'flex';
    if (document.getElementById('bookCarousel')) document.getElementById('bookCarousel').style.display = 'none';

    document.getElementById('gravityClockCanvas').style.display = 'none';
    document.querySelector('.hourglass-label').textContent = 'No content for this day';
    document.querySelector('.hourglass-countdown').style.display = 'none';
    document.querySelector('.hourglass-hint').textContent = 'Select another date to explore';
    if (hourglassTimer) { clearInterval(hourglassTimer); hourglassTimer = null; }
}

function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    document.getElementById('hourglassCountdown').textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

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
    document.getElementById('quoteSource').textContent = `— ${quote.source}`;

    // Cover image
    const coverImg = document.getElementById('bookCover');
    const cover3d = document.getElementById('bookCover3d');

    // Immediately show placeholder so old cover doesn't linger
    const placeholder = generateCoverPlaceholder(book.title, book.author);
    coverImg.src = placeholder;
    coverImg.alt = book.title;
    cover3d.classList.add('loading');

    // Tag this fetch so stale responses from previous day switches are ignored
    const fetchId = ++coverImg._fetchId || (coverImg._fetchId = 1);

    const coverTimeout = new Promise(resolve => setTimeout(() => resolve(null), 10000));
    Promise.race([
        DailyData.fetchBestCover(book.isbn, book.title, book.author),
        coverTimeout
    ]).then(url => {
        if (coverImg._fetchId !== fetchId) return; // stale, ignore
        if (url) {
            coverImg.src = url;
            coverImg.alt = book.title;
        }
        cover3d.classList.remove('loading');
    }).catch(() => {
        if (coverImg._fetchId !== fetchId) return;
        cover3d.classList.remove('loading');
    });

    preloadAdjacentCovers();

    // Set book pages background color from palette
    const quoteColors = ['#D9A48B', '#CC7F4E', '#B8A0B0', '#7BC4D9', '#8B8B6E', '#D4C9A1'];
    const colorIdx = Math.abs(currentDate.split('-').reduce((a, b) => a + parseInt(b), 0)) % quoteColors.length;
    const bgColor = quoteColors[colorIdx];
    const bookPages = document.getElementById('bookPages');
    bookPages.style.backgroundColor = bgColor;

    // Dark mode: muted version
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        bookPages.style.backgroundColor = blendWithDark(bgColor, 0.35);
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
//  URL + HISTORY
// =============================================
function updateURL(dateStr) {
    const newURL = `${window.location.pathname}?date=${dateStr}`;
    window.history.pushState({ date: dateStr }, '', newURL);
}

window.addEventListener('popstate', (e) => {
    const date = e.state?.date;
    if (date) selectDate(date);
});

// =============================================
//  DARK MODE
// =============================================
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('littlebook-theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('littlebook-theme', 'dark');
    }
    // Re-apply page color for dark mode blend
    if (currentData) loadContent();
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
            el.play();
            player.classList.add('playing');
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
