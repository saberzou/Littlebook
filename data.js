// 每日数据：书籍 + 壁纸 + 语录
const dailyData = [
    {
        date: "2026-02-07",
        book: {
            isbn: "9780374533557",
            title: "思考，快与慢",
            author: "丹尼尔·卡尼曼",
            category: "心理学",
            desc: "诺贝尔经济学奖得主深入剖析人类思维的两种模式，揭示决策中的系统性错误。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
            credit: "Photo by Denise Jans on Unsplash",
            download: "https://unsplash.com/photos/photo-of-library-with-turned-on-lights-9lTUClNBK_4/download?force=true"
        },
        quote: {
            text: "我们常常高估自己对世界的了解，却低估了事件中存在的偶然性。",
            source: "丹尼尔·卡尼曼《思考，快与慢》"
        }
    },
    {
        date: "2026-02-08",
        book: {
            isbn: "9780735211292",
            title: "原子习惯",
            author: "詹姆斯·克利尔",
            category: "自我提升",
            desc: "细微改变带来巨大成就的实证法则，建立好习惯的实用系统。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
            credit: "Photo by Alfons Morales on Unsplash",
            download: "https://unsplash.com/photos/photo-of-library-with-turned-on-lights-YLSwjSy7stw/download?force=true"
        },
        quote: {
            text: "每天进步1%，一年后你会进步37倍；每天退步1%，一年后你会趋近于零。",
            source: "詹姆斯·克利尔《原子习惯》"
        }
    },
    {
        date: "2026-02-09",
        book: {
            isbn: "9780062316097",
            title: "人类简史",
            author: "尤瓦尔·赫拉利",
            category: "历史",
            desc: "从认知革命到科学革命，宏大视角审视人类历史的颠覆性著作。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
            credit: "Photo by Christian Wiediger on Unsplash",
            download: "https://unsplash.com/photos/pile-of-assorted-title-books-lgf2D8qmZuw/download?force=true"
        },
        quote: {
            text: "历史的铁则就是：事后看来无可避免的事，在当时看来总是毫不明显。",
            source: "尤瓦尔·赫拉利《人类简史》"
        }
    },
    {
        date: "2026-02-10",
        book: {
            isbn: "9781455586691",
            title: "深度工作",
            author: "卡尔·纽波特",
            category: "效率",
            desc: "在碎片化时代重建专注力，创造真正有价值成果的指南。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
            credit: "Photo by Sharon McCutcheon on Unsplash",
            download: "https://unsplash.com/photos/eyFbjKWlR2g/download?force=true"
        },
        quote: {
            text: "高质量工作产出 = 所花时间 × 专注程度",
            source: "卡尔·纽波特《深度工作》"
        }
    },
    {
        date: "2026-02-11",
        book: {
            isbn: "9787111495482",
            title: "被讨厌的勇气",
            author: "岸见一郎 / 古贺史健",
            category: "哲学",
            desc: "阿德勒心理学入门，探讨如何拥有被讨厌的勇气，获得真正的自由。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
            credit: "Photo by Aaron Burden on Unsplash",
            download: "https://unsplash.com/photos/turned-on-pendant-lamp-Y02jEX_B0O0/download?force=true"
        },
        quote: {
            text: "所谓的自由，就是被别人讨厌。",
            source: "岸见一郎《被讨厌的勇气》"
        }
    },
    {
        date: "2026-02-12",
        book: {
            isbn: "9781544514200",
            title: "纳瓦尔宝典",
            author: "埃里克·乔根森",
            category: "财富",
            desc: "硅谷知名投资人的智慧箴言，关于财富创造和幸福生活的深刻见解。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
            credit: "Photo by Susan Yin on Unsplash",
            download: "https://unsplash.com/photos/photo-of-library-shelves-FXJfTl8xvl0/download?force=true"
        },
        quote: {
            text: "培养迭代思维。生活中所有的回报，无论是财富、人际关系，还是知识，都来自复利。",
            source: "埃里克·乔根森《纳瓦尔宝典》"
        }
    },
    {
        date: "2026-02-13",
        book: {
            isbn: "9787540497187",
            title: "置身事内",
            author: "兰小欢",
            category: "经济",
            desc: "让普通人读懂中国政府与经济发展的书，通俗易懂解释中国经济运行逻辑。"
        },
        wallpaper: {
            url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
            credit: "Photo by Christin Hume on Unsplash",
            download: "https://unsplash.com/photos/mIi8HzvHxWc/download?force=true"
        },
        quote: {
            text: "经济发展不是理论推演，而是现实问题的解决过程。",
            source: "兰小欢《置身事内》"
        }
    }
];

// Open Library API
const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

async function fetchBookCover(isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

// 获取特定日期的数据
function getDataByDate(dateStr) {
    return dailyData.find(d => d.date === dateStr);
}

// 获取今日数据
function getTodayData() {
    const today = new Date().toISOString().split('T')[0];
    return getDataByDate(today) || dailyData[0];
}

// 获取上一日/下一日数据
function getAdjacentData(currentDate, direction) {
    const index = dailyData.findIndex(d => d.date === currentDate);
    if (direction === 'prev' && index > 0) return dailyData[index - 1];
    if (direction === 'next' && index < dailyData.length - 1) return dailyData[index + 1];
    return null;
}

// 导出
window.DailyData = {
    data: dailyData,
    getByDate: getDataByDate,
    getToday: getTodayData,
    getAdjacent: getAdjacentData,
    fetchCover: fetchBookCover
};
