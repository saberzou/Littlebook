let currentData = null;
let currentIndex = 0; // 0=book, 1=wallpaper, 2=quote
let currentDate = null;

// 初始化
async function init() {
    // 获取今日数据
    currentData = DailyData.getToday();
    currentDate = currentData.date;
    
    // 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        const data = DailyData.getByDate(dateParam);
        if (data) {
            currentData = data;
            currentDate = dateParam;
        }
    }
    
    // 加载内容
    await loadContent();
    updateDateDisplay();
    
    // 绑定导航点击
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            goToSlide(index);
        });
    });
    
    // 绑定指示器点击
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            goToSlide(index);
        });
    });
    
    // 触摸滑动支持
    initSwipe();
    
    // 绑定按钮
    document.getElementById('downloadBtn').addEventListener('click', downloadWallpaper);
    document.getElementById('shareQuoteBtn').addEventListener('click', shareQuote);
}

// 加载内容
async function loadContent() {
    if (!currentData) return;
    
    const { book, wallpaper, quote } = currentData;
    
    // 加载书籍
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookDesc').textContent = book.desc;
    document.getElementById('bookCover').src = await DailyData.fetchCover(book.isbn);
    document.getElementById('bookCover').onerror = function() {
        this.src = 'https://via.placeholder.com/300x450/2a2a4a/ffffff?text=Littlebook';
    };
    
    // 加载壁纸
    document.getElementById('wallpaperImage').src = wallpaper.url;
    document.getElementById('wallpaperCredit').textContent = wallpaper.credit;
    
    // 加载语录
    document.getElementById('quoteText').textContent = quote.text;
    document.getElementById('quoteSource').textContent = `—— ${quote.source}`;
}

// 更新日期显示
function updateDateDisplay() {
    const date = new Date(currentDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    
    document.getElementById('dateText').textContent = `${month}月${day}日 ${weekday}`;
}

// 切换到指定卡片
function goToSlide(index) {
    currentIndex = index;
    const wrapper = document.getElementById('swiperWrapper');
    wrapper.style.transform = `translateX(-${index * 100}%)`;
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // 更新指示器
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // 更新卡片激活状态
    document.querySelectorAll('.card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
}

// 触摸滑动
function initSwipe() {
    const container = document.getElementById('swiperContainer');
    let startX = 0;
    let isDragging = false;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        // 滑动阈值 50px
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < 2) {
                // 左滑，下一张
                goToSlide(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // 右滑，上一张
                goToSlide(currentIndex - 1);
            }
        }
    });
    
    // 鼠标滑动（桌面端）
    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });
    
    container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - e.clientX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < 2) {
                goToSlide(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        }
    });
}

// 下载壁纸
function downloadWallpaper() {
    if (!currentData) return;
    
    const link = document.createElement('a');
    link.href = currentData.wallpaper.download;
    link.download = `littlebook-wallpaper-${currentDate}.jpg`;
    link.target = '_blank';
    link.click();
}

// 分享语录
function shareQuote() {
    if (!currentData) return;
    
    const { quote } = currentData;
    const text = `${quote.text}\n\n${quote.source}\n\n分享自 Littlebook`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Littlebook 每日语录',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('shareQuoteBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 已复制';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    }
}

// 切换日期（前后天）
async function changeDate(direction) {
    const newData = DailyData.getAdjacent(currentDate, direction);
    if (!newData) return;
    
    currentData = newData;
    currentDate = newData.date;
    
    await loadContent();
    updateDateDisplay();
    updateURL(currentDate);
}

// 更新 URL
function updateURL(dateStr) {
    const newURL = `${window.location.pathname}?date=${dateStr}`;
    window.history.pushState({ date: dateStr }, '', newURL);
}

// 监听浏览器前进后退
window.addEventListener('popstate', async (e) => {
    const date = e.state?.date;
    if (date) {
        const data = DailyData.getByDate(date);
        if (data) {
            currentData = data;
            currentDate = date;
            await loadContent();
            updateDateDisplay();
        }
    }
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < 2) {
        goToSlide(currentIndex + 1);
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', init);
