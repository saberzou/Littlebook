// 书籍数据库
const books = [
    {
        id: 1,
        title: "思考，快与慢",
        author: "[美] 丹尼尔·卡尼曼",
        category: "心理学",
        rating: "★★★★★",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        description: "诺贝尔经济学奖得主卡尼曼的巨著，深入剖析人类思维的两种模式：快速的直觉思维与缓慢的理性思维。书中揭示了我们在决策过程中常犯的系统性错误，帮助我们更好地理解自己的思维方式。",
        quote: "我们常常高估自己对世界的了解，却低估了事件中存在的偶然性。",
        link: "https://book.douban.com/subject/10785583/",
        date: "2026-02-07"
    },
    {
        id: 2,
        title: "原子习惯",
        author: "[美] 詹姆斯·克利尔",
        category: "自我提升",
        rating: "★★★★★",
        cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
        description: "细微改变带来巨大成就的实证法则。作者通过生物学、心理学和神经科学的最新研究，揭示了习惯形成的机制，并提供了一套实用的系统来建立好习惯、戒除坏习惯。",
        quote: "每天进步1%，一年后你会进步37倍；每天退步1%，一年后你会趋近于零。",
        link: "https://book.douban.com/subject/33463930/",
        date: "2026-02-08"
    },
    {
        id: 3,
        title: "人类简史",
        author: "[以色列] 尤瓦尔·赫拉利",
        category: "历史",
        rating: "★★★★☆",
        cover: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
        description: "从认知革命到农业革命，再到科学革命，赫拉利以宏大的视角审视人类历史，探讨了人类如何从一种不起眼的动物成为地球的主宰。书中充满了颠覆性的观点和令人深思的洞见。",
        quote: "历史的铁则就是：事后看来无可避免的事，在当时看来总是毫不明显。",
        link: "https://book.douban.com/subject/25985021/",
        date: "2026-02-09"
    },
    {
        id: 4,
        title: "深度工作",
        author: "[美] 卡尔·纽波特",
        category: "效率",
        rating: "★★★★☆",
        cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop",
        description: "在这个充满干扰的世界里，深度工作的能力正变得越来越稀缺。纽波特提出了深度工作的四个准则，帮助我们在碎片化时代重建专注力，创造真正有价值的成果。",
        quote: "高质量工作产出 = 所花时间 × 专注程度",
        link: "https://book.douban.com/subject/27056409/",
        date: "2026-02-10"
    },
    {
        id: 5,
        title: "被讨厌的勇气",
        author: "[日] 岸见一郎 / 古贺史健",
        category: "哲学",
        rating: "★★★★☆",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        description: "以哲人与青年对话的形式，深入浅出地介绍了阿德勒心理学的核心思想。书中探讨了如何摆脱人际关系的束缚，拥有被讨厌的勇气，从而获得真正的自由。",
        quote: "所谓的自由，就是被别人讨厌。",
        link: "https://book.douban.com/subject/26369699/",
        date: "2026-02-11"
    },
    {
        id: 6,
        title: "纳瓦尔宝典",
        author: "[美] 埃里克·乔根森",
        category: "财富",
        rating: "★★★★★",
        cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop",
        description: "硅谷知名天使投资人纳瓦尔的智慧箴言录。书中分享了关于财富创造和幸福生活的深刻见解，强调利用杠杆、培养专长和长期思考的重要性。",
        quote: "培养迭代思维。生活中所有的回报，无论是财富、人际关系，还是知识，都来自复利。",
        link: "https://book.douban.com/subject/35876121/",
        date: "2026-02-12"
    },
    {
        id: 7,
        title: "置身事内",
        author: "兰小欢",
        category: "经济",
        rating: "★★★★☆",
        cover: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop",
        description: "一本让普通人读懂中国政府与经济发展的书。作者用通俗易懂的语言，解释了中国经济运行的逻辑，以及政府在经济发展中扮演的角色。",
        quote: "经济发展不是理论推演，而是现实问题的解决过程。",
        link: "https://book.douban.com/subject/35546622/",
        date: "2026-02-13"
    }
];

// 获取特定日期的书籍
function getBookByDate(dateStr) {
    return books.find(book => book.date === dateStr);
}

// 获取今日书籍
function getTodayBook() {
    const today = new Date().toISOString().split('T')[0];
    return getBookByDate(today) || books[0];
}

// 获取随机书籍
function getRandomBook() {
    const index = Math.floor(Math.random() * books.length);
    return books[index];
}

// 获取上一本/下一本
function getAdjacentBook(currentId, direction) {
    const index = books.findIndex(b => b.id === currentId);
    if (direction === 'prev' && index > 0) return books[index - 1];
    if (direction === 'next' && index < books.length - 1) return books[index + 1];
    return null;
}
