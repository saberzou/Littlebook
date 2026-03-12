// Unsplash API (used only for download tracking)
const UNSPLASH_KEY = '7-kO0WQ3pHHi_EcDxNzCIEixVr9QeRZecSUQhXVEh9c';
const UNSPLASH_API = 'https://api.unsplash.com';

// Daily data: book + wallpaper + quote
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
        wallpaper: { id: "YDNvydD1jAY", imgBase: "https://images.unsplash.com/photo-1490349368154-73de9c9bc37c", user: "Maarten Deckers", userUrl: "https://unsplash.com/@maartendeckers" },
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
        wallpaper: { id: "1c33ba-uh_8", imgBase: "https://images.unsplash.com/photo-1547327132-5d20850c62b5", user: "Anthony Da Cruz", userUrl: "https://unsplash.com/@akhu" },
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
        wallpaper: { id: "sO-JmQj95ec", imgBase: "https://images.unsplash.com/photo-1492724724894-7464c27d0ceb", user: "Kevin Lanceplaine", userUrl: "https://unsplash.com/@lanceplaine" },
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
        wallpaper: { id: "GJYY_5VZB3c", imgBase: "https://images.unsplash.com/photo-1501254667263-b4867b4f7482", user: "Fernando Puente", userUrl: "https://unsplash.com/@fernandopuente" },
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
        wallpaper: { id: "Q1p7bh3SHj8", imgBase: "https://images.unsplash.com/photo-1451187580459-43490279c0fa", user: "NASA", userUrl: "https://unsplash.com/@nasa" },
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
        wallpaper: { id: "7XbxPUdRtgw", imgBase: "https://images.unsplash.com/photo-1572270907014-c31da1c54124", user: "Carlos Vega", userUrl: "https://unsplash.com/@charliebcn" },
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
        wallpaper: { id: "qaT_Wrv5p0s", imgBase: "https://images.unsplash.com/photo-1606149407720-523a20a30f35", user: "Tobias Rademacher", userUrl: "https://unsplash.com/@tobbes_rd" },
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
        wallpaper: { id: "UVyavSwslOg", imgBase: "https://images.unsplash.com/photo-1488572749058-7f52dd70e0fa", user: "Keith Hardy", userUrl: "https://unsplash.com/@keithhardy2001" },
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
        wallpaper: { id: "phIFdC6lA4E", imgBase: "https://images.unsplash.com/photo-1519681393784-d120267933ba", user: "Benjamin Voros", userUrl: "https://unsplash.com/@vorosbenisop" },
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
        wallpaper: { id: "kXMe4hugFA4", imgBase: "https://images.unsplash.com/photo-1551949730-c0b55d675af1", user: "Alexis Antoine", userUrl: "https://unsplash.com/@alexisantoine" },
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
        wallpaper: { id: "t07FAEn9wAA", imgBase: "https://images.unsplash.com/photo-1477573893384-10fa704dfbd9", user: "Jon Flobrant", userUrl: "https://unsplash.com/@jonflobrant" },
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
        wallpaper: { id: "vNAZubsDWMg", imgBase: "https://images.unsplash.com/photo-1430651717504-ebb9e3e6795e", user: "Anthony DELANOIX", userUrl: "https://unsplash.com/@anthonydelanoix" },
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
        wallpaper: { id: "c9MFM8rSMsQ", imgBase: "https://images.unsplash.com/photo-1541599468348-e96984315921", user: "Michelle Spollen", userUrl: "https://unsplash.com/@micki" },
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
        wallpaper: { id: "6tfO1M8_gas", imgBase: "https://images.unsplash.com/photo-1512923927402-a9867a68180e", user: "Chris Lawton", userUrl: "https://unsplash.com/@chrislawton" },
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
        wallpaper: { id: "xJ2tjuUHD9M", imgBase: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d", user: "Paul Earle", userUrl: "https://unsplash.com/@paulearlephotography" },
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
        wallpaper: { id: "pQDBGxtiDEo", imgBase: "https://images.unsplash.com/reserve/d1Ntvq9mSVmV0RcnWN1Y_23rd%20Studios%20Photography%20Boulder%20Colorado.jpg", user: "Paul Talbot", userUrl: "https://unsplash.com/@paultalbot" },
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
        wallpaper: { id: "sVhRMCyo1_Y", imgBase: "https://images.unsplash.com/photo-1517968724828-7f2ba6e098c3", user: "Artem Beliaikin", userUrl: "https://unsplash.com/@belart84" },
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
        wallpaper: { id: "tpCPd4MbzNU", imgBase: "https://images.unsplash.com/photo-1577578306649-09e937512e28", user: "Gissur O. Steinarsson", userUrl: "https://unsplash.com/@gissurosteinarsson" },
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
        wallpaper: { id: "KMn4VEeEPR8", imgBase: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", user: "Sean Oulashin", userUrl: "https://unsplash.com/@oulashin" },
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
        wallpaper: { id: "MQzSZ5BkjAg", imgBase: "https://images.unsplash.com/photo-1576502200272-341a4b8d5ebb", user: "Clark Van Der Beken", userUrl: "https://unsplash.com/@snapsbyclark" },
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
        wallpaper: { id: "p7ri-9fOAC8", imgBase: "https://images.unsplash.com/photo-1570528813189-d1ae3ccc1081", user: "Tom Öhlin", userUrl: "https://unsplash.com/@tomohlin" },
        quote: {
            text: "Between life and death, there is a library. It holds all possible versions of your life.",
            source: "Matt Haig, The Midnight Library"
        }
    },
    {
        date: "2026-02-26",
        book: {
            isbn: "9780307961517",
            title: "The Invention of Nature",
            author: "Andrea Wulf",
            category: "Biography & Science",
            desc: "A sweeping biography of explorer-scientist Alexander von Humboldt, whose revolutionary vision unified nature as an interconnected whole."
        },
        wallpaper: { id: "zNPaUirWQpU", imgBase: "https://images.unsplash.com/photo-1615421533158-f6c874badff4", user: "Solen Feyissa", userUrl: "https://unsplash.com/@solenfeyissa" },
        quote: {
            text: "Everything is interconnected. The universe is one unified organism, not a collection of separate things.",
            source: "Andrea Wulf, The Invention of Nature"
        }
    },
    {
        date: "2026-02-27",
        book: {
            isbn: "9780316396584",
            title: "Humankind",
            author: "Rutger Bregman",
            category: "Philosophy",
            desc: "A revolutionary take on human history that challenges the assumption we're selfish by nature, revealing evidence of our natural cooperation and kindness."
        },
        wallpaper: { id: "3RicCdnXfHs", imgBase: "https://images.unsplash.com/photo-1578664934514-789f4fb29160", user: "Matheus Cenali", userUrl: "https://unsplash.com/@cenali" },
        quote: {
            text: "History is not a catalogue of disasters. It is a story about improbable possibilities.",
            source: "Rutger Bregman, Humankind"
        }
    },
    {
        date: "2026-02-28",
        book: {
            isbn: "9780441172719",
            title: "Dune",
            author: "Frank Herbert",
            category: "Science Fiction",
            desc: "An epic tale of political intrigue, prophecy, and survival on the desert planet Arrakis, exploring themes of power, destiny, and human potential."
        },
                wallpaper: { id: "7_q1mh7Ibvk", imgBase: "https://images.unsplash.com/photo-1772415912163-bd5fe16b8ff0", user: "Dmytro Koplyk", userUrl: "https://unsplash.com/@dkoplyk" },
quote: {
            text: "Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear.",
            source: "Frank Herbert, Dune"
        }
    },
    {
        date: "2026-03-01",
        book: {
            isbn: "9780385480017",
            title: "Bird by Bird",
            author: "Anne Lamott",
            category: "Writing & Creativity",
            desc: "A beloved guide to writing and life, offering practical wisdom and spiritual insight on overcoming perfectionism and finding your voice."
        },
                wallpaper: { id: "-Fr4DhM0ge8", imgBase: "https://images.unsplash.com/photo-1772392174256-ae0ceb14ca99", user: "Peter Steiner", userUrl: "https://unsplash.com/@pedrino5_official" },
quote: {
            text: "Writing and reading decrease our sense of isolation. They deepen and widen and expand our sense of life.",
            source: "Anne Lamott, Bird by Bird"
        }
    },
    {
        date: "2026-03-02",
        book: {
            isbn: "9780385095129",
            title: "The Double Helix",
            author: "James D. Watson",
            category: "Science & Discovery",
            desc: "Watson's intimate account of the race to discover DNA's structure, revealing the brilliance, ambition, and personalities behind one of science's greatest breakthroughs."
        },
                wallpaper: { id: "_jmXZHtCi4U", imgBase: "https://images.unsplash.com/photo-1772289239052-7bbbd9bda160", user: "NIR HIMI", userUrl: "https://unsplash.com/@nirhimi" },
quote: {
            text: "Science rarely ends with a final answer. It ends with a better question.",
            source: "James D. Watson, The Double Helix"
        }
    },
    {
        date: "2026-03-03",
        book: {
            isbn: "9780192860926",
            title: "The Selfish Gene",
            author: "Richard Dawkins",
            category: "Evolution & Biology",
            desc: "A groundbreaking exploration of evolution that reframes life through the lens of genes, asking what organisms are really for beyond reproductive success."
        },
                wallpaper: { id: "HuqZMC7shx0", imgBase: "https://images.unsplash.com/photo-1770110000218-e9376e581258", user: "Philipp Düsel", userUrl: "https://unsplash.com/@philipp_dice" },
quote: {
            text: "We are survival machines—robot vehicles blindly programmed to preserve the selfish molecules known as genes.",
            source: "Richard Dawkins, The Selfish Gene"
        }
    },
    {
        date: "2026-03-04",
        book: {
            isbn: "9780307389717",
            title: "What I Talk About When I Talk About Running",
            author: "Haruki Murakami",
            category: "Sports & Philosophy",
            desc: "A meditative memoir-essay on the connection between running marathons and the discipline required to write, exploring how solitude shapes creative work."
        },
                wallpaper: { id: "OkO9BDH-IEc", imgBase: "https://images.unsplash.com/photo-1770873263537-fbb8d39b6103", user: "Ryunosuke Kikuno", userUrl: "https://unsplash.com/@ryunosuke_kikuno" },
quote: {
            text: "I run in order to acquire a void.",
            source: "Haruki Murakami, What I Talk About When I Talk About Running"
        }
    },
    {
        date: "2026-03-05",
        book: {
            isbn: "9781524746742",
            title: "Dopamine Nation",
            author: "Anna Lembke",
            category: "Neuroscience & Behavior",
            desc: "A Stanford psychiatrist explores how constant stimulation rewires our brains and offers practical strategies for reclaiming balance in an age of unlimited dopamine hits."
        },
                wallpaper: { id: "llezNN2OGEY", imgBase: "https://images.unsplash.com/photo-1771149076648-d0fdcd270f86", user: "Kristaps Ungurs", userUrl: "https://unsplash.com/@kristapsungurs" },
quote: {
            text: "In the age of internet pornography, social media, and digital gaming, we are all at risk of numbing ourselves to the point of dysfunction.",
            source: "Anna Lembke, Dopamine Nation"
        }
    },
    {
        date: "2026-03-06",
        book: {
            isbn: "9781617322402",
            title: "Maybe You Should Talk to Someone",
            author: "Lori Gottlieb",
            category: "Mental Health & Psychology",
            desc: "A therapist becomes a patient, revealing the hidden conversations that happen in therapy and what it really takes to understand ourselves and others."
        },
        wallpaper: { id: "YOE8v9KdsB0", imgBase: "https://images.unsplash.com/photo-1772657356280-fefe4c350287", user: "Dmitry Spravko", userUrl: "https://unsplash.com/@kaprion" },
        quote: {
            text: "We are all works in progress. The goal is not to arrive at some final, polished version of ourselves, but to become increasingly aware of who we are.",
            source: "Lori Gottlieb, Maybe You Should Talk to Someone"
        }
    },
    {
        date: "2026-03-07",
        book: {
            isbn: "9780374533557",
            title: "The Geometry of Beauty",
            author: "Adrian Bejan",
            category: "Art & Science",
            desc: "An exploration of how the laws of physics shape what we find beautiful, from nature to architecture to design."
        },
        wallpaper: { id: "PEaG0Wu5w70", imgBase: "https://images.unsplash.com/photo-1772536888848-c0e7f0f6cf39", user: "Elena Rodriguez", userUrl: "https://unsplash.com/@elenarod" },
        quote: {
            text: "Beauty is not arbitrary. It follows laws, and those laws are written in the structure of the universe.",
            source: "Adrian Bejan, The Geometry of Beauty"
        }
    },
    {
        date: "2026-03-08",
        book: {
            isbn: "9780525657743",
            title: "The Anthropocene Reviewed",
            author: "John Green",
            category: "Essays",
            desc: "A collection of personal essays reviewing facets of the human-centered planet on a five-star scale, from Diet Dr Pepper to sunsets."
        },
        wallpaper: { id: "0IFvTeguMJs", imgBase: "https://images.unsplash.com/photo-1772211506039-8bd23fcc060a", user: "Maria Lupan", userUrl: "https://unsplash.com/@luandmario" },
        quote: {
            text: "All the light we never see is still shining. We just have to look up.",
            source: "John Green, The Anthropocene Reviewed"
        }
    },
    {
        date: "2026-03-09",
        book: {
            isbn: "9780062316110",
            title: "Sapiens: A Graphic Novel",
            author: "Yuval Noah Harari & David Vandermeulen",
            category: "History & Graphic Novel",
            desc: "The illustrated adaptation of the bestselling history of humankind, turning big ideas about civilization into vivid visual storytelling."
        },
        wallpaper: { id: "yfXHqoFpNH0", imgBase: "https://images.unsplash.com/photo-1772656928131-bd7592d1d119", user: "Dmitry Spravko", userUrl: "https://unsplash.com/@kaprion" },
        quote: {
            text: "We did not domesticate wheat. It domesticated us.",
            source: "Yuval Noah Harari, Sapiens"
        }
    },
    {
        date: "2026-03-10",
        book: {
            isbn: "9780374529260",
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology & Behavioral Science",
            desc: "Nobel laureate Kahneman reveals the two systems that drive how we think — the fast, intuitive mind and the slow, deliberate one — reshaping our understanding of decision-making."
        },
        wallpaper: { id: "A1IoRfRQHuk", imgBase: "https://images.unsplash.com/photo-1772733694354-3b4a33568ef4", user: "Marek Piwnicki", userUrl: "https://unsplash.com/@marekpiwnicki" },
        quote: {
            text: "Nothing in life is as important as you think it is, while you are thinking about it.",
            source: "Daniel Kahneman, Thinking, Fast and Slow"
        }
    },
    {
        date: "2026-03-11",
        book: {
            isbn: "9780812988406",
            title: "When Breath Becomes Air",
            author: "Paul Kalanithi",
            category: "Memoir & Medicine",
            desc: "A young neurosurgeon facing terminal cancer explores what makes life worth living, weaving literature, philosophy, and medicine into a devastating and luminous meditation on mortality."
        },
        wallpaper: { id: "7DV_dT3JuLs", imgBase: "https://images.unsplash.com/photo-1772173333668-c10d2246e523", user: "Matthew Mosbauer", userUrl: "https://unsplash.com/@matthewmosbauer" },
        quote: {
            text: "You can't ever reach perfection, but you can believe in an asymptote toward which you are ceaselessly striving.",
            source: "Paul Kalanithi, When Breath Becomes Air"
        }
    },
    {
        date: "2026-03-12",
        book: {
            isbn: "9780374529260",
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology & Decision Making",
            desc: "Nobel laureate Daniel Kahneman maps the two systems that drive how we think — the fast, intuitive, and emotional versus the slow, deliberate, and logical — revealing the cognitive biases that shape our judgments and choices."
        },
        wallpaper: { id: "0NkVsmKFzWc", imgBase: "https://images.unsplash.com/photo-1770045990733-6e9f6c083f0d", user: "Edson Junior", userUrl: "https://unsplash.com/@roinuj16" },
        quote: {
            text: "Nothing in life is as important as you think it is, while you are thinking about it.",
            source: "Daniel Kahneman, Thinking, Fast and Slow"
        }
    },
    {
        date: "2026-03-13",
        book: {
            isbn: "9780525559474",
            title: "The Boy, the Mole, the Fox and the Horse",
            author: "Charlie Mackesy",
            category: "Illustrated & Inspiration",
            desc: "A beautifully illustrated fable about kindness, courage, and hope — told through the unlikely friendship of a curious boy, a cake-loving mole, a wary fox, and a wise horse."
        },
        wallpaper: { id: "_r4AuOYg5Ao", imgBase: "https://images.unsplash.com/photo-1773083405815-34ea5253db0b", user: "Rafael Garcin", userUrl: "https://unsplash.com/@nimbus_vulpis" },
        quote: {
            text: "Asking for help isn't giving up. It's refusing to give up.",
            source: "Charlie Mackesy, The Boy, the Mole, the Fox and the Horse"
        }
    },
    {
        date: "2026-03-14",
        book: {
            isbn: "9780062316110",
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            category: "History & Anthropology",
            desc: "A sweeping narrative of how Homo sapiens came to dominate the Earth — from the Cognitive Revolution to the age of algorithms."
        },
        wallpaper: { id: "e1wycgI4c9g", imgBase: "https://images.unsplash.com/photo-1703333737684-41eb22ed4363", user: "Pawel Czerwinski", userUrl: "https://unsplash.com/@pawel_czerwinski" },
        quote: {
            text: "You could never convince a monkey to give you a banana by promising him limitless bananas after death.",
            source: "Yuval Noah Harari, Sapiens"
        }
    }
];

// =============================================
//  WALLPAPER — stable, hardcoded per date
// =============================================
const UTM = 'utm_source=littlebook&utm_medium=referral';

function getWallpaperForDate(dateStr) {
    const entry = dailyData.find(d => d.date === dateStr);
    if (!entry || !entry.wallpaper) return null;
    const wp = entry.wallpaper;
    return {
        photoId: wp.id,
        url: wp.imgBase + '?w=1080&q=80',
        urlPortrait: wp.imgBase + '?w=800&h=1200&fit=crop&crop=center&q=80',
        credit: wp.user,
        creditUrl: wp.userUrl + '?' + UTM,
        downloadLocation: `${UNSPLASH_API}/photos/${wp.id}/download`,
        unsplashUrl: `https://unsplash.com/photos/${wp.id}?${UTM}`,
    };
}

async function fetchWallpaperForDate(dateStr) {
    return getWallpaperForDate(dateStr) || {
        photoId: null,
        url: 'https://images.unsplash.com/photo-1490349368154-73de9c9bc37c?w=1080&q=80',
        urlPortrait: 'https://images.unsplash.com/photo-1490349368154-73de9c9bc37c?w=800&h=1200&fit=crop&crop=center&q=80',
        credit: 'Unsplash',
        creditUrl: 'https://unsplash.com/?' + UTM,
        downloadLocation: null,
        unsplashUrl: 'https://unsplash.com/t/wallpapers',
    };
}

async function trackDownload(dateStr) {
    const wp = getWallpaperForDate(dateStr);
    if (wp && wp.downloadLocation) {
        try {
            await fetch(wp.downloadLocation + '?client_id=' + UNSPLASH_KEY);
        } catch { /* best-effort */ }
    }
}

// =============================================
//  BOOK COVER — Open Library cover URL (legacy)
// =============================================
function fetchBookCover(isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

// =============================================
//  MULTI-SOURCE COVER FETCHING
// =============================================

function isbn13to10(isbn13) {
    const s = isbn13.replace(/-/g, '');
    if (s.length !== 13 || !s.startsWith('978')) return null;
    const body = s.slice(3, 12);
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(body[i]) * (10 - i);
    const r = (11 - (sum % 11)) % 11;
    return body + (r === 10 ? 'X' : String(r));
}

function probeImage(url, timeout = 3000) {
    return new Promise(resolve => {
        const timer = setTimeout(() => resolve(null), timeout);
        const img = new Image();
        img.onload = () => {
            clearTimeout(timer);
            resolve(img.naturalWidth > 10 && img.naturalHeight > 10 ? url : null);
        };
        img.onerror = () => { clearTimeout(timer); resolve(null); };
        img.src = url;
    });
}

async function googleBooksCover(isbn) {
    try {
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.replace(/-/g, '')}&fields=items(volumeInfo/imageLinks)`
        );
        if (!res.ok) return null;
        const data = await res.json();
        const links = data.items?.[0]?.volumeInfo?.imageLinks;
        if (!links) return null;
        const raw = links.extraLarge || links.large || links.medium
            || links.small || links.thumbnail || links.smallThumbnail || '';
        return raw.replace(/^http:/, 'https:').replace(/zoom=\d/, 'zoom=3') || null;
    } catch { return null; }
}

let olSearchActive = 0;
const olSearchQueue = [];

function olSearchCover(title, author) {
    return new Promise(resolve => {
        const run = async () => {
            olSearchActive++;
            try {
                const params = new URLSearchParams({ title, author, fields: 'cover_i', limit: '1' });
                const res = await fetch(`https://openlibrary.org/search.json?${params}`);
                if (!res.ok) { resolve(null); return; }
                const coverId = (await res.json()).docs?.[0]?.cover_i;
                resolve(coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null);
            } catch { resolve(null); }
            finally {
                olSearchActive--;
                if (olSearchQueue.length > 0) olSearchQueue.shift()();
            }
        };
        if (olSearchActive < 2) run();
        else olSearchQueue.push(run);
    });
}

const coverUrlCache = {};

async function fetchBestCoverUrl(isbn, title, author) {
    if (coverUrlCache[isbn]) return coverUrlCache[isbn];

    const isbn10 = isbn13to10(isbn);
    const ol = (id, size) => `https://covers.openlibrary.org/b/isbn/${id}-${size}.jpg?default=false`;

    const googlePromise = googleBooksCover(isbn);
    const olSearchPromise = (title && author) ? olSearchCover(title, author) : Promise.resolve(null);

    let url = await probeImage(ol(isbn, 'L'));
    if (url) { coverUrlCache[isbn] = url; return url; }

    if (isbn10) {
        url = await probeImage(ol(isbn10, 'L'));
        if (url) { coverUrlCache[isbn] = url; return url; }
    }

    const olSearchUrl = await olSearchPromise;
    if (olSearchUrl) {
        url = await probeImage(olSearchUrl);
        if (url) { coverUrlCache[isbn] = url; return url; }
    }

    const googleUrl = await googlePromise;
    if (googleUrl) {
        url = await probeImage(googleUrl);
        if (url) { coverUrlCache[isbn] = url; return url; }
    }

    url = await probeImage(ol(isbn, 'M'));
    if (url) { coverUrlCache[isbn] = url; return url; }
    if (isbn10) {
        url = await probeImage(ol(isbn10, 'M'));
        if (url) { coverUrlCache[isbn] = url; return url; }
    }

    return null;
}

// =============================================
//  DATA ACCESS HELPERS
// =============================================
function getDataByDate(dateStr) {
    return dailyData.find(d => d.date === dateStr);
}

function getTodayData() {
    const today = new Date().toLocaleDateString('en-CA');
    return getDataByDate(today) || dailyData[0];
}

function getAdjacentData(currentDate, direction) {
    const index = dailyData.findIndex(d => d.date === currentDate);
    if (direction === 'prev' && index > 0) return dailyData[index - 1];
    if (direction === 'next' && index < dailyData.length - 1) return dailyData[index + 1];
    return null;
}

function getLatestDate() {
    return dailyData[dailyData.length - 1].date;
}

function getNextDate() {
    const latest = new Date(getLatestDate() + 'T12:00:00');
    latest.setDate(latest.getDate() + 1);
    const y = latest.getFullYear();
    const m = String(latest.getMonth() + 1).padStart(2, '0');
    const d = String(latest.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

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
    fetchBestCover: fetchBestCoverUrl,
    fetchWallpaperForDate: fetchWallpaperForDate,
    trackDownload: trackDownload,
    getLatestDate: getLatestDate,
    getNextDate: getNextDate,
    getAllDates: getAllDates
};
