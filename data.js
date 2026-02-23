// Unsplash API
const UNSPLASH_KEY = '7-kO0WQ3pHHi_EcDxNzCIEixVr9QeRZecSUQhXVEh9c';
const UNSPLASH_API = 'https://api.unsplash.com';
const wallpaperCache = {};

// Daily data: book + wallpaper (photo ID) + quote
const dailyData = [
    {
        date: "2026-02-05",
        book: {
            isbn: "9781599869773",
            title: "The Art of War",
            author: "Sun Tzu",
            category: "Strategy",
            desc: "Ancient Chinese military treatise offering timeless wisdom on strategy, leadership and conflict resolution."
        },
        quote: {
            text: "In the midst of chaos, there is also opportunity.",
            source: "Sun Tzu, The Art of War"
        }
    },
    {
        date: "2026-02-06",
        book: {
            isbn: "9780671027032",
            title: "How to Win Friends and Influence People",
            author: "Dale Carnegie",
            category: "Communication",
            desc: "The classic guide to interpersonal skills that has helped millions build better relationships and succeed in life."
        },
        quote: {
            text: "You can make more friends in two months by becoming interested in other people than in two years by trying to get people interested in you.",
            source: "Dale Carnegie, How to Win Friends and Influence People"
        }
    },
    {
        date: "2026-02-07",
        book: {
            isbn: "9780374533557",
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology",
            desc: "Nobel laureate dissects two modes of human thought, revealing systematic errors in our decision-making."
        },
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
        quote: {
            text: "The real measure of any time management technique is whether it helps you neglect the right things.",
            source: "Oliver Burkeman, Four Thousand Weeks"
        }
    },
    {
        date: "2026-02-14",
        book: {
            isbn: "9780062457714",
            title: "The Course of Love",
            author: "Alain de Botton",
            category: "Fiction",
            desc: "A novel that explores what happens after the initial thrill of falling in love — the long, complex journey of sustaining it."
        },
        quote: {
            text: "Love is a skill, not just an enthusiasm.",
            source: "Alain de Botton, The Course of Love"
        }
    },
    {
        date: "2026-02-15",
        book: {
            isbn: "9780465050659",
            title: "The Design of Everyday Things",
            author: "Don Norman",
            category: "Design",
            desc: "A seminal exploration of user-centered design and how good design becomes invisible to the user."
        },
        quote: {
            text: "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.",
            source: "Don Norman, The Design of Everyday Things"
        }
    },
    {
        date: "2026-02-16",
        book: {
            isbn: "9780761169253",
            title: "Steal Like an Artist",
            author: "Austin Kleon",
            category: "Creativity",
            desc: "A manifesto showing how developing your creative voice means learning from and building on the work you admire."
        },
        quote: {
            text: "The best way to come up with good ideas is to come up with lots of ideas.",
            source: "Austin Kleon, Steal Like an Artist"
        }
    },
    {
        date: "2026-02-17",
        book: {
            isbn: "9780465026562",
            title: "Gödel, Escher, Bach",
            author: "Douglas Hofstadter",
            category: "Art & Science",
            desc: "A landmark exploration of consciousness, patterns, and self-reference through music, art, and mathematics."
        },
        quote: {
            text: "We are strange loops: cycling systems which strange-loop back to themselves in a complex, self-reinforcing way.",
            source: "Douglas Hofstadter, Gödel, Escher, Bach"
        }
    },
    {
        date: "2026-02-18",
        book: {
            isbn: "9781603580557",
            title: "Thinking in Systems: A Primer",
            author: "Donella H. Meadows",
            category: "Systems & Science",
            desc: "An elegant introduction to systems thinking and how to understand complex interconnected problems."
        },
        quote: {
            text: "The behavior of a system cannot be known just by knowing the elements of which the system is made.",
            source: "Donella H. Meadows, Thinking in Systems"
        }
    },
    {
        date: "2026-02-19",
        book: {
            isbn: "9780804139298",
            title: "Zero to One",
            author: "Peter Thiel",
            category: "Business",
            desc: "A guide to building the future by creating something genuinely new rather than copying what exists."
        },
        quote: {
            text: "The most contrarian thing of all is not to oppose the crowd but to think for yourself.",
            source: "Peter Thiel, Zero to One"
        }
    },
    {
        date: "2026-02-20",
        book: {
            isbn: "9780735214484",
            title: "Range",
            author: "David Epstein",
            category: "Learning",
            desc: "Why generalists who embrace diverse experiences and broad knowledge excel at solving novel problems."
        },
        quote: {
            text: "The ability to make distant connections is what we celebrate as creativity.",
            source: "David Epstein, Range"
        }
    },
    {
        date: "2026-02-21",
        book: {
            isbn: "9781553814528",
            title: "Braiding Sweetgrass",
            author: "Robin Wall Kimmerer",
            category: "Nature & Wisdom",
            desc: "Indigenous botanist weaves together science, nature writing, and indigenous wisdom to explore our relationship with the living world."
        },
        quote: {
            text: "We are caretakers, not owners. Our gifts come with the responsibility to reciprocate and care for what sustains us.",
            source: "Robin Wall Kimmerer, Braiding Sweetgrass"
        }
    },
    {
        date: "2026-02-22",
        book: {
            isbn: "9780399590504",
            title: "Educated",
            author: "Tara Westover",
            category: "Memoir",
            desc: "A transformative memoir of a woman who leaves an isolated survivalist family to pursue education and self-discovery."
        },
        quote: {
            text: "I am no longer afraid. I took my education into my own hands.",
            source: "Tara Westover, Educated"
        }
    },
    {
        date: "2026-02-23",
        book: {
            isbn: "9780807014295",
            title: "Man's Search for Meaning",
            author: "Viktor E. Frankl",
            category: "Philosophy",
            desc: "A Holocaust survivor's profound meditation on finding meaning in suffering and how the search for purpose can sustain us through adversity."
        },
        quote: {
            text: "The last of the human freedoms is to choose one's attitudes in any given set of circumstances.",
            source: "Viktor E. Frankl, Man's Search for Meaning"
        }
    },
    {
        date: "2026-02-24",
        book: {
            isbn: "9780156012195",
            title: "The Little Prince",
            author: "Antoine de Saint-Exupéry",
            category: "Literature",
            desc: "A poetic fable about a young prince's journey across distant planets, exploring timeless themes of love, loss, friendship, and what truly matters in life."
        },
        quote: {
            text: "And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
            source: "Antoine de Saint-Exupéry, The Little Prince"
        }
    },
    {
        date: "2026-02-25",
        book: {
            isbn: "9780020195597",
            title: "The Midnight Library",
            author: "Matt Haig",
            category: "Contemporary Fiction",
            desc: "A woman on the edge of despair discovers a magical library containing all the lives she could have lived, learning that every life has infinite possibility."
        },
        quote: {
            text: "Between life and death, there is a library. It holds all possible versions of your life.",
            source: "Matt Haig, The Midnight Library"
        }
    }
];

// Simple hash from date string to get a consistent index
function dateHash(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// Fetch wallpaper from Unsplash wallpapers topic, deterministic per date
let topicPhotosCache = null;

async function fetchWallpaperForDate(dateStr) {
    // Return from cache if already fetched for this date
    if (wallpaperCache[dateStr]) return wallpaperCache[dateStr];

    try {
        // Fetch wallpapers topic photos (cache the full list)
        if (!topicPhotosCache) {
            const page = (dateHash(dateStr) % 5) + 1; // vary pages for diversity
            const res = await fetch(
                `${UNSPLASH_API}/topics/wallpapers/photos?per_page=30&page=${page}&order_by=popular&client_id=${UNSPLASH_KEY}`
            );
            if (!res.ok) throw new Error(res.status);
            topicPhotosCache = await res.json();
        }

        // Pick a photo deterministically based on date
        const index = dateHash(dateStr) % topicPhotosCache.length;
        const photo = topicPhotosCache[index];

        const data = {
            photoId: photo.id,
            url: photo.urls.regular,
            urlPortrait: photo.urls.raw + '&w=800&h=1200&fit=crop&crop=center&q=80',
            credit: photo.user.name,
            creditUrl: photo.user.links.html + '?utm_source=littlebook&utm_medium=referral',
            downloadLocation: photo.links.download_location,
            unsplashUrl: photo.links.html + '?utm_source=littlebook&utm_medium=referral',
        };
        wallpaperCache[dateStr] = data;
        return data;
    } catch {
        // Fallback: use Unsplash source random with date seed
        return {
            photoId: null,
            url: `https://source.unsplash.com/800x1200/?wallpaper&sig=${dateHash(dateStr)}`,
            urlPortrait: `https://source.unsplash.com/800x1200/?wallpaper&sig=${dateHash(dateStr)}`,
            credit: 'Unsplash',
            creditUrl: 'https://unsplash.com/?utm_source=littlebook&utm_medium=referral',
            downloadLocation: null,
            unsplashUrl: 'https://unsplash.com/t/wallpapers',
        };
    }
}

// Fetch wallpaper by specific photo ID (legacy support)
async function fetchWallpaper(photoId) {
    if (wallpaperCache[photoId]) return wallpaperCache[photoId];

    try {
        const res = await fetch(
            `${UNSPLASH_API}/photos/${photoId}?client_id=${UNSPLASH_KEY}`
        );
        if (!res.ok) throw new Error(res.status);
        const photo = await res.json();

        const data = {
            photoId: photo.id,
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
        return {
            photoId,
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
async function trackDownload(dateOrPhotoId) {
    const cached = wallpaperCache[dateOrPhotoId];
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
    const today = new Date().toLocaleDateString('en-CA');
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
    const y = latest.getFullYear();
    const m = String(latest.getMonth() + 1).padStart(2, '0');
    const d = String(latest.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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
    fetchWallpaperForDate: fetchWallpaperForDate,
    trackDownload: trackDownload,
    getLatestDate: getLatestDate,
    getNextDate: getNextDate,
    getAllDates: getAllDates
};
