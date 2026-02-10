'use strict';

let currentData = null;
let currentIndex = 0; // 0=book, 1=wallpaper, 2=quote
let currentDate = null;
let showingHourglass = false;
let hourglassTimer = null;



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
    if (currentDate === tomorrowStr) {
        showHourglass();
    } else if (DailyData.getByDate(currentDate)) {
        loadContent();
    } else {
        showNoData();
    }
    applySlide(0);

    // Nav items
    document.querySelectorAll('.pill-nav .nav-item[data-index]').forEach(item => {
        item.addEventListener('click', () => {
            goToSlide(parseInt(item.dataset.index));
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

    // Skip if same date
    if (dateStr === currentDate) return;

    currentDate = dateStr;
    updateCalendarSelection(dateStr);
    updateURL(dateStr);

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
                goToSlide(0);
            } else {
                showNoData();
            }
        }
        // Fade back in
        requestAnimationFrame(() => {
            contentArea.classList.remove('fade-out');
        });
    }, 250);
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
//  WAITING OVERLAY — Dog ASCII art + countdown
// =============================================

function showHourglass() {
    showingHourglass = true;

    document.getElementById('swiperContainer').style.display = 'none';
    document.getElementById('hourglassOverlay').style.display = 'flex';
    document.getElementById('bottomBar').style.display = 'none';

    // Restore countdown elements (may have been hidden by showNoData)
    document.querySelector('.ascii-dog').style.display = 'block';
    document.querySelector('.hourglass-label').textContent = "Tomorrow's pick arrives in";
    document.querySelector('.hourglass-countdown').style.display = '';
    document.querySelector('.hourglass-hint').textContent = 'Come back tomorrow for a new book, wallpaper & quote';

    // Start countdown
    updateCountdown();
    hourglassTimer = setInterval(updateCountdown, 1000);
}

function hideHourglass() {
    showingHourglass = false;

    document.getElementById('swiperContainer').style.display = '';
    document.getElementById('hourglassOverlay').style.display = 'none';
    document.getElementById('bottomBar').style.display = '';

    if (hourglassTimer) { clearInterval(hourglassTimer); hourglassTimer = null; }
}

function showNoData() {
    showingHourglass = false;

    document.getElementById('swiperContainer').style.display = 'none';
    document.getElementById('hourglassOverlay').style.display = 'flex';
    document.getElementById('bottomBar').style.display = 'none';

    // Hide countdown-specific elements, show a simple message
    document.querySelector('.ascii-dog').style.display = 'block';
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
    // Wrap title text into lines (max ~14 chars per line)
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

    const titleY = 130 - (lines.length * 12);
    const titleSvg = lines.map((l, i) =>
        `<text x="100" y="${titleY + i * 28}" text-anchor="middle" fill="%23F0EBE6" font-family="Georgia, serif" font-size="18" font-weight="600">${l.replace(/&/g, '&amp;')}</text>`
    ).join('');

    return 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="360">' +
        '<rect width="240" height="360" fill="%236B5E55" rx="4"/>' +
        '<line x1="30" y1="60" x2="170" y2="60" stroke="%23E8A87C" stroke-width="2" opacity="0.6"/>' +
        titleSvg +
        `<text x="100" y="${titleY + lines.length * 28 + 8}" text-anchor="middle" fill="%23C4BBB5" font-family="sans-serif" font-size="11">${(author || '').replace(/&/g, '&amp;')}</text>` +
        '<line x1="30" y1="240" x2="170" y2="240" stroke="%23E8A87C" stroke-width="2" opacity="0.6"/>' +
        '</svg>'
    );
}

function loadContent() {
    if (!currentData) return;

    const { book, quote } = currentData;

    // Book
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookDesc').textContent = book.desc;

    const coverImg = document.getElementById('bookCover');
    const wrapper = coverImg.closest('.book-cover-wrapper');
    const coverUrl = DailyData.fetchCover(book.isbn);

    // Show skeleton
    wrapper.classList.add('loading');

    // Check if already cached by browser
    const testImg = new Image();
    testImg.onload = () => {
        coverImg.src = coverUrl;
        coverImg.alt = book.title;
        wrapper.classList.remove('loading');
    };
    testImg.onerror = () => {
        coverImg.src = generateCoverPlaceholder(book.title, book.author);
        coverImg.alt = book.title;
        wrapper.classList.remove('loading');
    };
    testImg.src = coverUrl;

    // Preload adjacent dates' covers
    preloadAdjacentCovers();

    // Wallpaper — fetch from Unsplash wallpapers topic
    loadWallpaper();

    // Quote
    document.getElementById('quoteText').textContent = quote.text;
    document.getElementById('quoteSource').textContent = `— ${quote.source}`;
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
            const img = new Image();
            img.src = DailyData.fetchCover(data.book.isbn);
        }
    });
}

async function loadWallpaper() {
    const img = document.getElementById('wallpaperImage');
    const creditEl = document.getElementById('wallpaperCredit');

    // Show loading state
    img.style.opacity = '0.4';
    creditEl.textContent = 'Loading...';

    // Fetch from Unsplash wallpapers topic based on current date
    const wp = await DailyData.fetchWallpaperForDate(currentDate);

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
    if (!currentDate) return;

    // Trigger Unsplash download tracking (API guidelines requirement)
    await DailyData.trackDownload(currentDate);

    // Get cached wallpaper data for download URL
    const wp = await DailyData.fetchWallpaperForDate(currentDate);
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
