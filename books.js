// 每日推荐书单（使用 ISBN，通过 Open Library API 获取详情）
const dailyBooks = [
    {
        isbn: "9780374533557",  // Thinking, Fast and Slow
        date: "2026-02-07"
    },
    {
        isbn: "9780735211292",  // Atomic Habits
        date: "2026-02-08"
    },
    {
        isbn: "9780062316097",  // Sapiens
        date: "2026-02-09"
    },
    {
        isbn: "9781455586691",  // Deep Work
        date: "2026-02-10"
    },
    {
        isbn: "9787111495482",  // 被讨厌的勇气 (中文 ISBN)
        date: "2026-02-11"
    },
    {
        isbn: "9781544514200",  // The Almanack of Naval Ravikant
        date: "2026-02-12"
    },
    {
        isbn: "9787540497187",  // 置身事内 (中文 ISBN)
        date: "2026-02-13"
    }
];

// 获取特定日期的书籍 ISBN
function getBookByDate(dateStr) {
    const book = dailyBooks.find(b => b.date === dateStr);
    return book ? book.isbn : null;
}

// 获取今日书籍 ISBN
function getTodayBookISBN() {
    const today = new Date().toISOString().split('T')[0];
    return getBookByDate(today) || dailyBooks[0].isbn;
}

// 获取所有书籍（用于本周推荐页面）
function getAllBooks() {
    return dailyBooks;
}

// 获取随机书籍 ISBN
function getRandomBookISBN() {
    const index = Math.floor(Math.random() * dailyBooks.length);
    return dailyBooks[index].isbn;
}

// 获取上一本/下一本 ISBN
function getAdjacentBookISBN(currentIsbn, direction) {
    const index = dailyBooks.findIndex(b => b.isbn === currentIsbn);
    if (direction === 'prev' && index > 0) return dailyBooks[index - 1].isbn;
    if (direction === 'next' && index < dailyBooks.length - 1) return dailyBooks[index + 1].isbn;
    return null;
}

// 兼容旧接口的转换函数
async function getBookByDateFull(dateStr) {
    const isbn = getBookByDate(dateStr);
    if (!isbn) return null;
    return await BookAPI.getBookWithCache(isbn);
}

async function getTodayBook() {
    const isbn = getTodayBookISBN();
    return await BookAPI.getBookWithCache(isbn);
}

async function getRandomBook() {
    const isbn = getRandomBookISBN();
    return await BookAPI.getBookWithCache(isbn);
}

async function getAdjacentBook(currentIsbn, direction) {
    const nextIsbn = getAdjacentBookISBN(currentIsbn, direction);
    if (!nextIsbn) return null;
    return await BookAPI.getBookWithCache(nextIsbn);
}
