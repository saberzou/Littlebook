let currentBook = null;
let currentISBN = null;

// 初始化
async function init() {
    showLoading();
    
    // 显示今日书籍或 URL 参数指定的日期
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    
    let isbn;
    if (dateParam) {
        isbn = getBookByDate(dateParam);
    } else {
        isbn = getTodayBookISBN();
    }
    
    if (isbn) {
        currentISBN = isbn;
        const book = await BookAPI.getBookWithCache(isbn);
        if (book) {
            displayBook(book);
        } else {
            showError('无法加载书籍信息，请稍后重试');
        }
    }
    
    updateDateBadge(dateParam);
    
    // 绑定事件
    document.getElementById('prevDay').addEventListener('click', showPrevBook);
    document.getElementById('nextDay').addEventListener('click', showNextBook);
    document.getElementById('randomBook').addEventListener('click', showRandomBook);
    document.getElementById('shareBtn').addEventListener('click', shareBook);
}

// 显示加载状态
function showLoading() {
    document.getElementById('bookTitle').textContent = '加载中...';
    document.getElementById('bookAuthor').textContent = '';
    document.getElementById('bookCategory').textContent = '';
    document.getElementById('bookDescription').textContent = '正在从 Open Library 获取书籍信息...';
    document.getElementById('bookQuote').textContent = '';
    document.getElementById('bookCover').src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill=%22%23f5f3f0" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill=%22%23999" font-family="sans-serif" font-size="16"%3E加载中...%3C/text%3E%3C/svg%3E';
}

// 显示错误
function showError(message) {
    document.getElementById('bookTitle').textContent = '出错了';
    document.getElementById('bookDescription').textContent = message;
}

// 显示书籍
function displayBook(book) {
    if (!book) return;
    
    currentBook = book;
    currentISBN = book.id;
    
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
    
    // 更新导航按钮
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
    
    const prevBook = getAdjacentBookISBN(currentISBN, 'prev');
    const nextBook = getAdjacentBookISBN(currentISBN, 'next');
    
    prevBtn.disabled = !prevBook;
    prevBtn.style.opacity = prevBook ? '1' : '0.3';
    
    nextBtn.disabled = !nextBook;
    nextBtn.style.opacity = nextBook ? '1' : '0.3';
}

// 显示上一本
async function showPrevBook() {
    const isbn = getAdjacentBookISBN(currentISBN, 'prev');
    if (isbn) {
        showLoading();
        const book = await BookAPI.getBookWithCache(isbn);
        if (book) {
            displayBook(book);
            updateDateBadge(getBookDateByIsbn(isbn));
            updateURL(getBookDateByIsbn(isbn));
        }
    }
}

// 显示下一本
async function showNextBook() {
    const isbn = getAdjacentBookISBN(currentISBN, 'next');
    if (isbn) {
        showLoading();
        const book = await BookAPI.getBookWithCache(isbn);
        if (book) {
            displayBook(book);
            updateDateBadge(getBookDateByIsbn(isbn));
            updateURL(getBookDateByIsbn(isbn));
        }
    }
}

// 显示随机书籍
async function showRandomBook() {
    showLoading();
    const isbn = getRandomBookISBN();
    const book = await BookAPI.getBookWithCache(isbn);
    if (book) {
        displayBook(book);
        updateDateBadge(getBookDateByIsbn(isbn));
        updateURL(getBookDateByIsbn(isbn));
    }
}

// 根据 ISBN 获取日期
function getBookDateByIsbn(isbn) {
    const book = dailyBooks.find(b => b.isbn === isbn);
    return book ? book.date : new Date().toISOString().split('T')[0];
}

// 分享功能
function shareBook() {
    if (!currentBook) return;
    
    const shareData = {
        title: `Littlebook 推荐：${currentBook.title}`,
        text: `${currentBook.title} - ${currentBook.author}\n\n${currentBook.quote}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
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
window.addEventListener('popstate', async (e) => {
    const date = e.state?.date || new Date().toISOString().split('T')[0];
    const isbn = getBookByDate(date);
    if (isbn) {
        showLoading();
        const book = await BookAPI.getBookWithCache(isbn);
        if (book) {
            displayBook(book);
            updateDateBadge(date);
        }
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
