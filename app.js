let currentBook = null;

// 初始化
function init() {
    // 显示今日书籍或 URL 参数指定的日期
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    
    if (dateParam) {
        currentBook = getBookByDate(dateParam) || getTodayBook();
    } else {
        currentBook = getTodayBook();
    }
    
    displayBook(currentBook);
    updateDateDisplay();
    
    // 绑定事件
    document.getElementById('prevBtn').addEventListener('click', showPrevBook);
    document.getElementById('nextBtn').addEventListener('click', showNextBook);
    document.getElementById('randomBtn').addEventListener('click', showRandomBook);
}

// 显示书籍
function displayBook(book) {
    if (!book) return;
    
    currentBook = book;
    
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = `作者：${book.author}`;
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookRating').textContent = book.rating;
    document.getElementById('bookDescription').textContent = book.description;
    document.getElementById('bookQuote').textContent = book.quote;
    document.getElementById('bookCover').src = book.cover;
    document.getElementById('bookCover').alt = book.title;
    document.getElementById('bookLink').href = book.link;
    
    updateDateDisplay(book.date);
    updateNavigationButtons();
}

// 更新日期显示
function updateDateDisplay(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateText = date.toLocaleDateString('zh-CN', options);
    const isToday = date.toDateString() === new Date().toDateString();
    
    document.getElementById('dateDisplay').textContent = 
        isToday ? `📅 今日推荐 · ${dateText}` : `📅 ${dateText}`;
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    const prevBook = getAdjacentBook(currentBook.id, 'prev');
    const nextBook = getAdjacentBook(currentBook.id, 'next');
    
    prevBtn.disabled = !prevBook;
    prevBtn.style.opacity = prevBook ? '1' : '0.3';
    
    nextBtn.disabled = !nextBook;
    nextBtn.style.opacity = nextBook ? '1' : '0.3';
}

// 显示上一本
function showPrevBook() {
    const book = getAdjacentBook(currentBook.id, 'prev');
    if (book) {
        displayBook(book);
        updateURL(book.date);
    }
}

// 显示下一本
function showNextBook() {
    const book = getAdjacentBook(currentBook.id, 'next');
    if (book) {
        displayBook(book);
        updateURL(book.date);
    }
}

// 显示随机书籍
function showRandomBook() {
    const book = getRandomBook();
    displayBook(book);
    updateURL(book.date);
}

// 更新 URL
function updateURL(dateStr) {
    const newURL = `${window.location.pathname}?date=${dateStr}`;
    window.history.pushState({ date: dateStr }, '', newURL);
}

// 监听浏览器前进后退
window.addEventListener('popstate', (e) => {
    const date = e.state?.date || new Date().toISOString().split('T')[0];
    const book = getBookByDate(date) || getTodayBook();
    displayBook(book);
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
