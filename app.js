'use strict';

let currentData = null;
let currentIndex = 0; // 0=book, 1=wallpaper, 2=quote
let currentDate = null;
let showingHourglass = false;
let hourglassTimer = null;
let hourglassAnimFrame = 0;
let hourglassAnimInterval = null;

const pages = () => document.querySelectorAll('.page');
const totalPages = () => pages().length;

// ---- Initialise ----
function init() {
    currentData = DailyData.getToday();
    currentDate = currentData.date;

    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        const nextDate = DailyData.getNextDate();
        if (dateParam === nextDate) {
            currentDate = nextDate;
        } else {
            const data = DailyData.getByDate(dateParam);
            if (data) {
                currentData = data;
                currentDate = dateParam;
            }
        }
    }

    // Build calendar strip
    buildCalendar();

    // Load content or hourglass
    if (currentDate === DailyData.getNextDate()) {
        showHourglass();
    } else {
        loadContent();
    }
    applyFan(0);

    // Nav items
    document.querySelectorAll('.pill-nav .nav-item[data-index]').forEach(item => {
        item.addEventListener('click', () => {
            goToSlide(parseInt(item.dataset.index));
        });
    });

    // Dot indicators
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
        });
    });

    // Swipe support
    initSwipe();

    // Buttons
    document.getElementById('downloadBtn').addEventListener('click', downloadWallpaper);
    document.getElementById('shareQuoteBtn').addEventListener('click', shareQuote);

    // Dark mode toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Restore saved theme
    const saved = localStorage.getItem('littlebook-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Calendar swipe
    initCalendarSwipe();
}

// =============================================
//  CALENDAR STRIP
// =============================================
function buildCalendar() {
    const track = document.getElementById('calendarTrack');
    track.innerHTML = '';

    const dates = DailyData.getAllDates();
    const nextDate = DailyData.getNextDate();
    const allDates = [...dates, nextDate];

    const todayStr = new Date().toISOString().split('T')[0];

    allDates.forEach(dateStr => {
        const d = new Date(dateStr + 'T12:00:00');
        const isFuture = dateStr === nextDate;
        const isSelected = dateStr === currentDate;
        const isToday = dateStr === todayStr;

        const cell = document.createElement('button');
        cell.className = 'cal-cell' + (isSelected ? ' selected' : '') + (isFuture ? ' future' : '') + (isToday ? ' today' : '');
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

    // Scroll to selected date
    requestAnimationFrame(() => {
        const selected = track.querySelector('.cal-cell.selected');
        if (selected) {
            selected.scrollIntoView({ inline: 'center', behavior: 'instant' });
        }
    });
}

function updateCalendarSelection(dateStr) {
    document.querySelectorAll('.cal-cell').forEach(cell => {
        cell.classList.toggle('selected', cell.dataset.date === dateStr);
    });

    // Scroll selected into view
    const track = document.getElementById('calendarTrack');
    const selected = track.querySelector('.cal-cell.selected');
    if (selected) {
        selected.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
}

function selectDate(dateStr) {
    const nextDate = DailyData.getNextDate();

    currentDate = dateStr;
    updateCalendarSelection(dateStr);
    updateURL(dateStr);

    if (dateStr === nextDate) {
        showHourglass();
    } else {
        const data = DailyData.getByDate(dateStr);
        if (data) {
            currentData = data;
            hideHourglass();
            loadContent();
            goToSlide(0);
        }
    }
}

function initCalendarSwipe() {
    const strip = document.getElementById('calendarStrip');
    let startX = 0;
    let scrollStart = 0;

    strip.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        scrollStart = strip.scrollLeft;
    }, { passive: true });

    strip.addEventListener('touchmove', (e) => {
        const dx = startX - e.touches[0].clientX;
        strip.scrollLeft = scrollStart + dx;
    }, { passive: true });
}

// =============================================
//  HOURGLASS — animated ASCII art + countdown
// =============================================
const HOURGLASS_FRAMES = [
    [
        '     ╔═══════════╗',
        '     ║ . . . . . ║',
        '     ║  . . . .  ║',
        '     ║   . . .   ║',
        '     ║    . .    ║',
        '      \\    .    /',
        '       \\       /',
        '        \\     /',
        '         \\   /',
        '          \\ /',
        '           X',
        '          / \\',
        '         /   \\',
        '        /     \\',
        '       /       \\',
        '      /         \\',
        '     ║           ║',
        '     ║           ║',
        '     ║           ║',
        '     ║           ║',
        '     ╚═══════════╝',
    ],
    [
        '     ╔═══════════╗',
        '     ║  . . . .  ║',
        '     ║   . . .   ║',
        '     ║    . .    ║',
        '     ║     .     ║',
        '      \\         /',
        '       \\       /',
        '        \\     /',
        '         \\   /',
        '          \\ /',
        '           o',
        '          / \\',
        '         /   \\',
        '        /     \\',
        '       /       \\',
        '      /         \\',
        '     ║           ║',
        '     ║           ║',
        '     ║     .     ║',
        '     ║           ║',
        '     ╚═══════════╝',
    ],
    [
        '     ╔═══════════╗',
        '     ║   . . .   ║',
        '     ║    . .    ║',
        '     ║     .     ║',
        '     ║           ║',
        '      \\         /',
        '       \\       /',
        '        \\     /',
        '         \\   /',
        '          \\ /',
        '           o',
        '          / \\',
        '         /   \\',
        '        /     \\',
        '       /       \\',
        '      /         \\',
        '     ║           ║',
        '     ║     .     ║',
        '     ║    . .    ║',
        '     ║           ║',
        '     ╚═══════════╝',
    ],
    [
        '     ╔═══════════╗',
        '     ║    . .    ║',
        '     ║     .     ║',
        '     ║           ║',
        '     ║           ║',
        '      \\         /',
        '       \\       /',
        '        \\     /',
        '         \\   /',
        '          \\ /',
        '           o',
        '          / \\',
        '         /   \\',
        '        /     \\',
        '       /       \\',
        '      /         \\',
        '     ║     .     ║',
        '     ║    . .    ║',
        '     ║   . . .   ║',
        '     ║           ║',
        '     ╚═══════════╝',
    ],
    [
        '     ╔═══════════╗',
        '     ║     .     ║',
        '     ║           ║',
        '     ║           ║',
        '     ║           ║',
        '      \\         /',
        '       \\       /',
        '        \\     /',
        '         \\   /',
        '          \\ /',
        '           o',
        '          / \\',
        '         /   \\',
        '        /     \\',
        '       /       \\',
        '      /         \\',
        '     ║    . .    ║',
        '     ║   . . .   ║',
        '     ║  . . . .  ║',
        '     ║           ║',
        '     ╚═══════════╝',
    ],
    [
        '     ╔═══════════╗',
        '     ║           ║',
        '     ║           ║',
        '     ║           ║',
        '     ║           ║',
        '      \\         /',
        '       \\       /',
        '        \\     /',
        '         \\   /',
        '          \\ /',
        '           o',
        '          / \\',
        '         /   \\',
        '        /     \\',
        '       /       \\',
        '      /         \\',
        '     ║   . . .   ║',
        '     ║  . . . .  ║',
        '     ║ . . . . . ║',
        '     ║. . . . . .║',
        '     ╚═══════════╝',
    ],
];

function showHourglass() {
    showingHourglass = true;

    document.getElementById('swiperContainer').style.display = 'none';
    document.getElementById('hourglassOverlay').style.display = 'flex';
    document.getElementById('slideIndicator').style.display = 'none';
    document.getElementById('pillNav').style.display = 'none';

    // Start animation
    hourglassAnimFrame = 0;
    renderHourglassFrame();
    hourglassAnimInterval = setInterval(() => {
        hourglassAnimFrame = (hourglassAnimFrame + 1) % HOURGLASS_FRAMES.length;
        renderHourglassFrame();
    }, 800);

    // Start countdown
    updateCountdown();
    hourglassTimer = setInterval(updateCountdown, 1000);
}

function hideHourglass() {
    showingHourglass = false;

    document.getElementById('swiperContainer').style.display = '';
    document.getElementById('hourglassOverlay').style.display = 'none';
    document.getElementById('slideIndicator').style.display = '';
    document.getElementById('pillNav').style.display = '';

    if (hourglassTimer) { clearInterval(hourglassTimer); hourglassTimer = null; }
    if (hourglassAnimInterval) { clearInterval(hourglassAnimInterval); hourglassAnimInterval = null; }
}

function renderHourglassFrame() {
    const el = document.getElementById('hourglassArt');
    el.textContent = HOURGLASS_FRAMES[hourglassAnimFrame].join('\n');
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
function loadContent() {
    if (!currentData) return;

    const { book, wallpaper, quote } = currentData;

    // Book
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookDesc').textContent = book.desc;

    const coverImg = document.getElementById('bookCover');
    coverImg.src = DailyData.fetchCover(book.isbn);
    coverImg.alt = book.title;
    coverImg.onerror = function () {
        this.onerror = null;
        this.src = 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" fill="%23F5F0EB">' +
            '<rect width="200" height="300"/>' +
            '<text x="100" y="155" text-anchor="middle" fill="%236B5E55" font-family="serif" font-size="16">Littlebook</text>' +
            '</svg>'
        );
    };

    // Wallpaper — fetch from Unsplash API
    loadWallpaper(wallpaper.photoId);

    // Quote
    document.getElementById('quoteText').textContent = quote.text;
    document.getElementById('quoteSource').textContent = `— ${quote.source}`;
}

async function loadWallpaper(photoId) {
    const img = document.getElementById('wallpaperImage');
    const creditEl = document.getElementById('wallpaperCredit');

    // Show loading state
    img.style.opacity = '0.4';
    creditEl.textContent = 'Loading...';

    const wp = await DailyData.fetchWallpaper(photoId);

    img.src = wp.urlPortrait;
    img.style.opacity = '';

    // Proper Unsplash attribution with links
    creditEl.innerHTML = '';
    const txt1 = document.createTextNode('Photo by ');
    const userLink = document.createElement('a');
    userLink.href = wp.creditUrl;
    userLink.target = '_blank';
    userLink.rel = 'noopener noreferrer';
    userLink.textContent = wp.credit;
    const txt2 = document.createTextNode(' on ');
    const unsplashLink = document.createElement('a');
    unsplashLink.href = wp.unsplashUrl;
    unsplashLink.target = '_blank';
    unsplashLink.rel = 'noopener noreferrer';
    unsplashLink.textContent = 'Unsplash';
    creditEl.appendChild(txt1);
    creditEl.appendChild(userLink);
    creditEl.appendChild(txt2);
    creditEl.appendChild(unsplashLink);
}

// =============================================
//  FAN TRANSITION
// =============================================
function applyFan(activeIndex) {
    pages().forEach((page, i) => {
        page.classList.remove('fan-left', 'fan-center', 'fan-right');
        if (i < activeIndex) page.classList.add('fan-left');
        else if (i === activeIndex) page.classList.add('fan-center');
        else page.classList.add('fan-right');
    });
}

function goToSlide(index) {
    if (showingHourglass) return;
    const max = totalPages() - 1;
    if (index < 0 || index > max) return;
    currentIndex = index;
    applyFan(index);

    document.querySelectorAll('.pill-nav .nav-item[data-index]').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// =============================================
//  TOUCH / MOUSE SWIPE (content pages)
// =============================================
function initSwipe() {
    const container = document.getElementById('swiperContainer');
    let startX = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < totalPages() - 1) goToSlide(currentIndex + 1);
            else if (diff < 0 && currentIndex > 0) goToSlide(currentIndex - 1);
        }
    });

    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });

    container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < totalPages() - 1) goToSlide(currentIndex + 1);
            else if (diff < 0 && currentIndex > 0) goToSlide(currentIndex - 1);
        }
    });
}

// =============================================
//  ACTIONS
// =============================================
async function downloadWallpaper() {
    if (!currentData) return;
    const { photoId } = currentData.wallpaper;

    // Trigger Unsplash download tracking (API guidelines requirement)
    await DailyData.trackDownload(photoId);

    // Get cached wallpaper data for download URL
    const wp = await DailyData.fetchWallpaper(photoId);
    const link = document.createElement('a');
    link.href = wp.urlPortrait;
    link.download = `littlebook-wallpaper-${currentDate}.jpg`;
    link.target = '_blank';
    link.click();
}

function shareQuote() {
    if (!currentData) return;
    const { quote } = currentData;
    const text = `"${quote.text}"\n\n— ${quote.source}\n\nShared from Littlebook`;

    if (navigator.share) {
        navigator.share({ title: 'Littlebook — Daily Quote', text, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('shareQuoteBtn');
            const original = btn.innerHTML;
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
            setTimeout(() => { btn.innerHTML = original; }, 2000);
        }).catch(() => {});
    }
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
    if (date) {
        selectDate(date);
    }
});

// =============================================
//  KEYBOARD
// =============================================
document.addEventListener('keydown', (e) => {
    if (showingHourglass) return;
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToSlide(currentIndex - 1);
    else if (e.key === 'ArrowRight' && currentIndex < totalPages() - 1) goToSlide(currentIndex + 1);
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
}

// =============================================
//  BOOT
// =============================================
document.addEventListener('DOMContentLoaded', init);
