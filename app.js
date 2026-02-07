'use strict';

let currentData = null;
let currentIndex = 0; // 0=book, 1=wallpaper, 2=quote
let currentDate = null;

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
        const data = DailyData.getByDate(dateParam);
        if (data) {
            currentData = data;
            currentDate = dateParam;
        }
    }

    loadContent();
    updateDateDisplay();
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
}

// ---- Load content into DOM ----
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

    // Wallpaper
    document.getElementById('wallpaperImage').src = wallpaper.url;
    document.getElementById('wallpaperCredit').textContent = wallpaper.credit;

    // Quote
    document.getElementById('quoteText').textContent = quote.text;
    document.getElementById('quoteSource').textContent = `— ${quote.source}`;
}

// ---- Date display ----
function updateDateDisplay() {
    const date = new Date(currentDate + 'T12:00:00'); // noon to avoid timezone shift
    const options = { month: 'short', day: 'numeric', weekday: 'long' };
    document.getElementById('dateText').textContent = date.toLocaleDateString('en-US', options);
}

// ---- Fan transition ----
function applyFan(activeIndex) {
    pages().forEach((page, i) => {
        page.classList.remove('fan-left', 'fan-center', 'fan-right');
        if (i < activeIndex) page.classList.add('fan-left');
        else if (i === activeIndex) page.classList.add('fan-center');
        else page.classList.add('fan-right');
    });
}

function goToSlide(index) {
    const max = totalPages() - 1;
    if (index < 0 || index > max) return;
    currentIndex = index;
    applyFan(index);

    // Update nav
    document.querySelectorAll('.pill-nav .nav-item[data-index]').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ---- Touch / mouse swipe ----
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

// ---- Download wallpaper ----
function downloadWallpaper() {
    if (!currentData) return;
    const link = document.createElement('a');
    link.href = currentData.wallpaper.download;
    link.download = `littlebook-wallpaper-${currentDate}.jpg`;
    link.target = '_blank';
    link.click();
}

// ---- Share quote ----
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

// ---- Date navigation ----
async function changeDate(direction) {
    const newData = DailyData.getAdjacent(currentDate, direction);
    if (!newData) return;
    currentData = newData;
    currentDate = newData.date;
    loadContent();
    updateDateDisplay();
    updateURL(currentDate);
}

function updateURL(dateStr) {
    const newURL = `${window.location.pathname}?date=${dateStr}`;
    window.history.pushState({ date: dateStr }, '', newURL);
}

// ---- Browser back / forward ----
window.addEventListener('popstate', (e) => {
    const date = e.state?.date;
    if (date) {
        const data = DailyData.getByDate(date);
        if (data) {
            currentData = data;
            currentDate = date;
            loadContent();
            updateDateDisplay();
        }
    }
});

// ---- Keyboard ----
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToSlide(currentIndex - 1);
    else if (e.key === 'ArrowRight' && currentIndex < totalPages() - 1) goToSlide(currentIndex + 1);
});

// ---- Dark mode ----
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

// ---- Boot ----
document.addEventListener('DOMContentLoaded', init);
