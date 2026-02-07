// Open Library API 封装
const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

// 通过 ISBN 获取书籍详情
async function fetchBookByISBN(isbn) {
    try {
        const response = await fetch(`${OPEN_LIBRARY_BASE}/isbn/${isbn}.json`);
        if (!response.ok) throw new Error('Book not found');
        const data = await response.json();
        return formatBookData(data, isbn);
    } catch (error) {
        console.error('Error fetching book:', error);
        return null;
    }
}

// 搜索书籍
async function searchBooks(query, limit = 10) {
    try {
        const response = await fetch(
            `${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        return data.docs.map(formatSearchResult);
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
}

// 获取封面图片 URL
function getCoverUrl(coverId, size = 'L') {
    if (!coverId) return 'https://via.placeholder.com/300x450/f5f3f0/c45c3e?text=No+Cover';
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

// 格式化书籍数据
function formatBookData(data, isbn) {
    const coverId = data.covers?.[0] || data.cover_i;
    return {
        id: isbn,
        title: data.title,
        author: data.authors?.[0]?.name || data.author_name?.[0] || 'Unknown Author',
        category: data.subjects?.[0] || 'General',
        rating: generateRating(data.ratings_average),
        cover: getCoverUrl(coverId, 'L'),
        description: data.description?.value || data.first_sentence?.[0] || getDefaultDescription(data.title),
        quote: data.first_sentence?.[0] || getDefaultQuote(),
        link: `https://openlibrary.org${data.key}`,
        publishYear: data.first_publish_year || data.publish_date?.[0]?.match(/\d{4}/)?.[0] || '',
        pages: data.number_of_pages_median || data.pagination || ''
    };
}

// 格式化搜索结果
function formatSearchResult(doc) {
    return {
        id: doc.isbn?.[0] || doc.key,
        title: doc.title,
        author: doc.author_name?.[0] || 'Unknown',
        category: doc.subject?.[0] || 'General',
        cover: getCoverUrl(doc.cover_i, 'M'),
        year: doc.first_publish_year || ''
    };
}

// 生成评分星星
function generateRating(rating) {
    if (!rating) return '★★★★☆';
    const stars = Math.round(rating / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

// 默认描述
function getDefaultDescription(title) {
    return `《${title}》是一本值得阅读的好书。通过 Open Library  API 获取的推荐书籍。`;
}

// 默认书摘
function getDefaultQuote() {
    const quotes = [
        "读书不是为了雄辩和驳斥，也不是为了轻信和盲从，而是为了思考和权衡。",
        "书籍是人类进步的阶梯。",
        "读一本好书，就是和许多高尚的人谈话。",
        "书卷多情似故人，晨昏忧乐每相亲。"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// 预加载书籍数据（带缓存）
const bookCache = new Map();

async function getBookWithCache(isbn) {
    if (bookCache.has(isbn)) {
        return bookCache.get(isbn);
    }
    
    const book = await fetchBookByISBN(isbn);
    if (book) {
        bookCache.set(isbn, book);
    }
    return book;
}

// 导出 API
window.BookAPI = {
    fetchByISBN: fetchBookByISBN,
    search: searchBooks,
    getCoverUrl: getCoverUrl,
    getBookWithCache: getBookWithCache
};
