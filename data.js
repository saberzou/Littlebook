// Unsplash API
const UNSPLASH_KEY = '7-kO0WQ3pHHi_EcDxNzCIEixVr9QeRZecSUQhXVEh9c';
const UNSPLASH_API = 'https://api.unsplash.com';
const wallpaperCache = {};

// Daily data: book + wallpaper (photo ID) + quote
const dailyData = [
    {
        date: "2026-02-07",
        book: {
            isbn: "9780374533557",
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology",
            desc: "Nobel laureate dissects two modes of human thought, revealing systematic errors in our decision-making."
        },
        wallpaper: { photoId: "8xqqEM1Ha7I" },
        quote: {
            text: "We are often overconfident about what we know about the world, and underestimate the role of chance in events.",
            source: "Daniel Kahneman, Thinking, Fast and Slow"
        }
    },
    {
        date: "2026-02-08",
        book: {
            isbn: "9780735211292",
            title: "Atomic Habits",
            author: "James Clear",
            category: "Self-Improvement",
            desc: "Proven methods for building good habits and breaking bad ones through tiny, incremental changes."
        },
        wallpaper: { photoId: "1tvoNtVqgns" },
        quote: {
            text: "Improve by 1% each day, and in a year you'll be 37 times better. Decline by 1%, and you'll approach zero.",
            source: "James Clear, Atomic Habits"
        }
    },
    {
        date: "2026-02-09",
        book: {
            isbn: "9780062316097",
            title: "Sapiens",
            author: "Yuval Noah Harari",
            category: "History",
            desc: "A sweeping narrative of humanity from the Cognitive Revolution to the present, challenging everything we thought we knew."
        },
        wallpaper: { photoId: "tO7KVwv4UyQ" },
        quote: {
            text: "The iron rule of history is that what seems inevitable in hindsight was far from obvious at the time.",
            source: "Yuval Noah Harari, Sapiens"
        }
    },
    {
        date: "2026-02-10",
        book: {
            isbn: "9781455586691",
            title: "Deep Work",
            author: "Cal Newport",
            category: "Productivity",
            desc: "A guide to rebuilding focus in the age of distraction and producing work of real value."
        },
        wallpaper: { photoId: "raZDkCx56pg" },
        quote: {
            text: "High-quality work produced = Time spent x Intensity of focus.",
            source: "Cal Newport, Deep Work"
        }
    },
    {
        date: "2026-02-11",
        book: {
            isbn: "9781501197277",
            title: "The Courage to Be Disliked",
            author: "Ichiro Kishimi & Fumitake Koga",
            category: "Philosophy",
            desc: "An introduction to Adlerian psychology through Socratic dialogue, exploring how to find true freedom."
        },
        wallpaper: { photoId: "eoJ0Lhi-nFA" },
        quote: {
            text: "True freedom is being disliked by other people.",
            source: "Ichiro Kishimi, The Courage to Be Disliked"
        }
    },
    {
        date: "2026-02-12",
        book: {
            isbn: "9781544514200",
            title: "The Almanack of Naval Ravikant",
            author: "Eric Jorgenson",
            category: "Wealth & Wisdom",
            desc: "Collected wisdom from Silicon Valley's philosopher-investor on wealth creation and finding happiness."
        },
        wallpaper: { photoId: "nfKmnLEl7bc" },
        quote: {
            text: "Play iterated games. All the returns in life — whether in wealth, relationships, or knowledge — come from compound interest.",
            source: "Eric Jorgenson, The Almanack of Naval Ravikant"
        }
    },
    {
        date: "2026-02-13",
        book: {
            isbn: "9780593238295",
            title: "Four Thousand Weeks",
            author: "Oliver Burkeman",
            category: "Philosophy",
            desc: "A radical rethinking of time management for finite humans — embrace your limits to live a meaningful life."
        },
        wallpaper: { photoId: "B9yFFlVOjP4" },
        quote: {
            text: "The real measure of any time management technique is whether it helps you neglect the right things.",
            source: "Oliver Burkeman, Four Thousand Weeks"
        }
    }
];

// Fetch wallpaper data from Unsplash API (with cache)
async function fetchWallpaper(photoId) {
    if (wallpaperCache[photoId]) return wallpaperCache[photoId];

    try {
        const res = await fetch(
            `${UNSPLASH_API}/photos/${photoId}?client_id=${UNSPLASH_KEY}`
        );
        if (!res.ok) throw new Error(res.status);
        const photo = await res.json();

        const data = {
            url: photo.urls.regular,
            urlPortrait: photo.urls.raw + '&w=800&h=1200&fit=crop&crop=center&q=80',
            credit: photo.user.name,
            creditUrl: photo.user.links.html + '?utm_source=littlebook&utm_medium=referral',
            downloadLocation: photo.links.download_location,
            unsplashUrl: photo.links.html + '?utm_source=littlebook&utm_medium=referral',
        };
        wallpaperCache[photoId] = data;
        return data;
    } catch {
        // Fallback: direct Unsplash image URL (no API)
        return {
            url: `https://images.unsplash.com/photo-${photoId}?w=800&h=1200&fit=crop&crop=center&q=80`,
            urlPortrait: `https://images.unsplash.com/photo-${photoId}?w=800&h=1200&fit=crop&crop=center&q=80`,
            credit: 'Unsplash',
            creditUrl: 'https://unsplash.com/?utm_source=littlebook&utm_medium=referral',
            downloadLocation: null,
            unsplashUrl: `https://unsplash.com/photos/${photoId}`,
        };
    }
}

// Trigger Unsplash download tracking (required by API guidelines)
async function trackDownload(photoId) {
    const cached = wallpaperCache[photoId];
    if (cached && cached.downloadLocation) {
        try {
            await fetch(cached.downloadLocation + '?client_id=' + UNSPLASH_KEY);
        } catch {
            // Silently fail — tracking is best-effort
        }
    }
}

// Open Library cover URL
function fetchBookCover(isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

// Get data by date
function getDataByDate(dateStr) {
    return dailyData.find(d => d.date === dateStr);
}

// Get today's data
function getTodayData() {
    const today = new Date().toISOString().split('T')[0];
    return getDataByDate(today) || dailyData[0];
}

// Get previous/next day data
function getAdjacentData(currentDate, direction) {
    const index = dailyData.findIndex(d => d.date === currentDate);
    if (direction === 'prev' && index > 0) return dailyData[index - 1];
    if (direction === 'next' && index < dailyData.length - 1) return dailyData[index + 1];
    return null;
}

// Get the latest date that has data
function getLatestDate() {
    return dailyData[dailyData.length - 1].date;
}

// Get tomorrow's date string relative to the latest data date
function getNextDate() {
    const latest = new Date(getLatestDate() + 'T12:00:00');
    latest.setDate(latest.getDate() + 1);
    return latest.toISOString().split('T')[0];
}

// Get all available date strings
function getAllDates() {
    return dailyData.map(d => d.date);
}

// Export
window.DailyData = {
    data: dailyData,
    getByDate: getDataByDate,
    getToday: getTodayData,
    getAdjacent: getAdjacentData,
    fetchCover: fetchBookCover,
    fetchWallpaper: fetchWallpaper,
    trackDownload: trackDownload,
    getLatestDate: getLatestDate,
    getNextDate: getNextDate,
    getAllDates: getAllDates
};
