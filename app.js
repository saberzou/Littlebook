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
    updateDateBadge();
    
    // 绑定事件
    document.getElementById('prevDay').addEventListener('click', showPrevBook);
    document.getElementById('nextDay').addEventListener('click', showNextBook);
    document.getElementById('randomBook').addEventListener('click', showRandomBook);
    document.getElementById('shareBtn').addEventListener('click', shareBook);
}

// 显示书籍
function displayBook(book) {
    if (!book) return;
    
    currentBook = book;
    
    // 更新内容
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookRating').textContent = book.rating;
    document.getElementById('bookDescription').textContent = book.description;
    document.getElementById('bookQuote').textContent = book.quote;
    document.getElementById('bookCover').src = book.cover;
    document.getElementById('bookCover').alt = book.title;
    document.getElementById('bookLink').href = book.link;
    
    // 更新日期
    updateDateBadge(book.date);
    updateNavigationButtons();
}

// 更新日期徽章
function updateDateBadge(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    document.getElementById('dayNum').textContent = String(day).padStart(2, '0');
    document.getElementById('monthNum').textContent = `${month}月`;
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevDay');
    const nextBtn = document.getElementById('nextDay');
    
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

// 分享功能
function shareBook() {
    const shareData = {
        title: `Littlebook 推荐：${currentBook.title}`,
        text: `${currentBook.title} - ${currentBook.author}\n\n${currentBook.quote}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // 复制到剪贴板
        const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('shareBtn');
            const originalText = btn.textContent;
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = originalText, 2000);
        });
    }
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
