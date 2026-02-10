'use strict';

let currentData = null;
let currentIndex = 0; // 0=book, 1=wallpaper, 2=quote
let currentDate = null;
let showingHourglass = false;
let hourglassTimer = null;
let hourglassAnimId = null;

const pages = () => document.querySelectorAll('.page');
const totalPages = () => pages().length;

// ---- Initialise ----
function init() {
    currentData = DailyData.getToday();
    currentDate = currentData ? currentData.date : new Date().toISOString().split('T')[0];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Check URL params
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
                // Past date with no data — still set the date for calendar selection
                currentDate = dateParam;
            }
        }
    }

    // Build calendar strip
    buildCalendar();

    // Load content or hourglass
    if (currentDate === tomorrowStr || !DailyData.getByDate(currentDate)) {
        showHourglass();
    } else {
        loadContent();
    }
    applySlide(0);

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
    document.getElementById('buyBookBtn').addEventListener('click', buyBook);

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

    // Always show 7 cells: 5 past days + today + tomorrow
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const calendarDates = [];

    for (let i = 5; i >= 1; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        calendarDates.push(d.toISOString().split('T')[0]);
    }
    calendarDates.push(todayStr); // today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    calendarDates.push(tomorrowStr); // tomorrow

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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    currentDate = dateStr;
    updateCalendarSelection(dateStr);
    updateURL(dateStr);

    if (dateStr === tomorrowStr) {
        showHourglass();
    } else {
        const data = DailyData.getByDate(dateStr);
        if (data) {
            currentData = data;
            hideHourglass();
            loadContent();
            goToSlide(0);
        } else {
            // Past date with no data available
            showHourglass();
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
//  HOURGLASS — Canvas-based animated hourglass
// =============================================
const SAND_COLOR = '#E8A87C';
const GLASS_COLOR_LIGHT = '#3D3229';
const GLASS_COLOR_DARK = '#F0EBE6';

// Sand particle system
let sandParticles = [];
let fallingGrains = [];
let topSandLevel = 0;
let bottomSandLevel = 0;

function initHourglassSand() {
    sandParticles = [];
    fallingGrains = [];
    topSandLevel = 1.0; // 1.0 = full, 0.0 = empty
    bottomSandLevel = 0.0;

    // Calculate based on time remaining
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const totalMs = 24 * 60 * 60 * 1000;
    const elapsed = totalMs - (tomorrow - now);
    const progress = Math.min(1, Math.max(0, elapsed / totalMs));

    topSandLevel = 1.0 - progress;
    bottomSandLevel = progress;
}

function drawHourglass(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const glassColor = isDark ? GLASS_COLOR_DARK : GLASS_COLOR_LIGHT;

    ctx.clearRect(0, 0, W, H);

    // Hourglass dimensions
    const cx = W / 2;
    const topY = 20;
    const botY = H - 20;
    const midY = H / 2;
    const halfW = 80;
    const neckW = 6;
    const capH = 8;

    // Draw glass outline
    ctx.strokeStyle = glassColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top cap
    ctx.beginPath();
    ctx.moveTo(cx - halfW, topY);
    ctx.lineTo(cx + halfW, topY);
    ctx.stroke();

    // Bottom cap
    ctx.beginPath();
    ctx.moveTo(cx - halfW, botY);
    ctx.lineTo(cx + halfW, botY);
    ctx.stroke();

    // Left side
    ctx.beginPath();
    ctx.moveTo(cx - halfW, topY + capH);
    ctx.lineTo(cx - halfW, topY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - halfW, botY - capH);
    ctx.lineTo(cx - halfW, botY);
    ctx.stroke();

    // Right side
    ctx.beginPath();
    ctx.moveTo(cx + halfW, topY + capH);
    ctx.lineTo(cx + halfW, topY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + halfW, botY - capH);
    ctx.lineTo(cx + halfW, botY);
    ctx.stroke();

    // Glass curves — top bulb
    ctx.beginPath();
    ctx.moveTo(cx - halfW, topY + capH);
    ctx.bezierCurveTo(
        cx - halfW, midY - 20,
        cx - neckW, midY - 15,
        cx - neckW, midY
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + halfW, topY + capH);
    ctx.bezierCurveTo(
        cx + halfW, midY - 20,
        cx + neckW, midY - 15,
        cx + neckW, midY
    );
    ctx.stroke();

    // Glass curves — bottom bulb
    ctx.beginPath();
    ctx.moveTo(cx - neckW, midY);
    ctx.bezierCurveTo(
        cx - neckW, midY + 15,
        cx - halfW, midY + 20,
        cx - halfW, botY - capH
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + neckW, midY);
    ctx.bezierCurveTo(
        cx + neckW, midY + 15,
        cx + halfW, midY + 20,
        cx + halfW, botY - capH
    );
    ctx.stroke();

    // Draw sand in top bulb
    if (topSandLevel > 0.02) {
        const sandTopStart = topY + capH + 10;
        const sandTopEnd = midY - 18;
        const sandRange = sandTopEnd - sandTopStart;
        const sandFillY = sandTopEnd - sandRange * topSandLevel;

        ctx.fillStyle = SAND_COLOR;
        ctx.globalAlpha = 0.6;

        // Draw sand dots in top
        for (let y = sandFillY; y < sandTopEnd; y += 6) {
            const t = (y - sandTopStart) / sandRange;
            const bulbWidth = halfW * (1 - Math.pow(t - 0.2, 2) * 1.5);
            const w = Math.max(neckW, Math.min(halfW - 5, bulbWidth));
            for (let x = cx - w + 4; x < cx + w - 4; x += 6) {
                const jx = x + (Math.random() - 0.5) * 3;
                const jy = y + (Math.random() - 0.5) * 3;
                ctx.beginPath();
                ctx.arc(jx, jy, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    // Draw sand in bottom bulb
    if (bottomSandLevel > 0.02) {
        const sandBotStart = midY + 18;
        const sandBotEnd = botY - capH - 10;
        const sandRange = sandBotEnd - sandBotStart;
        const sandFillY = sandBotEnd - sandRange * bottomSandLevel;

        ctx.fillStyle = SAND_COLOR;
        ctx.globalAlpha = 0.6;

        for (let y = sandFillY; y < sandBotEnd; y += 6) {
            const t = (y - sandBotStart) / sandRange;
            const bulbWidth = halfW * (1 - Math.pow(t - 0.8, 2) * 1.5);
            const w = Math.max(neckW, Math.min(halfW - 5, bulbWidth));
            for (let x = cx - w + 4; x < cx + w - 4; x += 6) {
                const jx = x + (Math.random() - 0.5) * 3;
                const jy = y + (Math.random() - 0.5) * 3;
                ctx.beginPath();
                ctx.arc(jx, jy, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    // Falling sand stream through neck
    if (topSandLevel > 0.02) {
        ctx.fillStyle = SAND_COLOR;
        ctx.globalAlpha = 0.7;
        const streamTop = midY - 12;
        const streamBot = midY + 12;
        const time = Date.now() / 150;
        for (let i = 0; i < 8; i++) {
            const t = ((time + i * 3) % 24) / 24;
            const y = streamTop + t * (streamBot - streamTop);
            const x = cx + (Math.random() - 0.5) * 4;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

function animateHourglass() {
    const canvas = document.getElementById('hourglassCanvas');
    if (!canvas) return;

    // Slowly transfer sand
    if (topSandLevel > 0) {
        const rate = 0.0003;
        topSandLevel = Math.max(0, topSandLevel - rate);
        bottomSandLevel = Math.min(1, bottomSandLevel + rate);
    }

    drawHourglass(canvas);
    hourglassAnimId = requestAnimationFrame(animateHourglass);
}

function showHourglass() {
    showingHourglass = true;

    document.getElementById('swiperContainer').style.display = 'none';
    document.getElementById('hourglassOverlay').style.display = 'flex';
    document.getElementById('slideIndicator').style.display = 'none';
    document.getElementById('bottomBar').style.display = 'none';

    initHourglassSand();
    animateHourglass();

    // Start countdown
    updateCountdown();
    hourglassTimer = setInterval(updateCountdown, 1000);
}

function hideHourglass() {
    showingHourglass = false;

    document.getElementById('swiperContainer').style.display = '';
    document.getElementById('hourglassOverlay').style.display = 'none';
    document.getElementById('slideIndicator').style.display = '';
    document.getElementById('bottomBar').style.display = '';

    if (hourglassTimer) { clearInterval(hourglassTimer); hourglassTimer = null; }
    if (hourglassAnimId) { cancelAnimationFrame(hourglassAnimId); hourglassAnimId = null; }
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
//  SLIDE TRANSITION (left/right)
// =============================================
function applySlide(activeIndex) {
    pages().forEach((page, i) => {
        page.classList.remove('slide-left', 'slide-center', 'slide-right');
        if (i < activeIndex) page.classList.add('slide-left');
        else if (i === activeIndex) page.classList.add('slide-center');
        else page.classList.add('slide-right');
    });
}

function goToSlide(index) {
    if (showingHourglass) return;
    const max = totalPages() - 1;
    if (index < 0 || index > max) return;
    currentIndex = index;
    applySlide(index);

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

function buyBook() {
    if (!currentData) return;
    const { isbn } = currentData.book;
    const url = `https://www.amazon.com/dp/${isbn}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
