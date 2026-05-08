// Daily data: book + quote
const dailyData = [
    {
        date: "2026-02-05",
        book: {
            isbn: "9781599869773",
            title: "The Art of War",
            author: "Sun Tzu",
            category: "Strategy",
            desc: "Ancient Chinese military treatise offering timeless wisdom on strategy, leadership and conflict resolution."
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },        quote: {
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
        },quote: {
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
        },quote: {
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
        },quote: {
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
        },quote: {
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
        },quote: {
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
        },quote: {
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
        },        quote: {
            text: "We are all works in progress. The goal is not to arrive at some final, polished version of ourselves, but to become increasingly aware of who we are.",
            source: "Lori Gottlieb, Maybe You Should Talk to Someone"
        }
    },
    {
        date: "2026-03-07",
        book: {
            isbn: "9781771642484",
            title: "The Hidden Life of Trees",
            author: "Peter Wohlleben",
            category: "Nature & Science",
            desc: "A forester reveals the astonishing social networks and communication systems of trees, forever changing how we see the natural world."
        },        quote: {
            text: "Trees are far more alert, social, sophisticated — and even intelligent — than we thought.",
            source: "Peter Wohlleben, The Hidden Life of Trees"
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
        },        quote: {
            text: "All the light we never see is still shining. We just have to look up.",
            source: "John Green, The Anthropocene Reviewed"
        }
    },
    {
        date: "2026-03-09",
        book: {
            isbn: "9780374529260",
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology",
            desc: "Nobel laureate Daniel Kahneman reveals the two systems that drive the way we think — and the systematic errors that distort our judgment."
        },        quote: {
            text: "Nothing in life is as important as you think it is, while you are thinking about it.",
            source: "Daniel Kahneman, Thinking, Fast and Slow"
        }
    },
    {
        date: "2026-03-10",
        book: {
            isbn: "9780062315007",
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "Fiction & Philosophy",
            desc: "A shepherd boy's journey across the desert in search of treasure becomes a timeless allegory about following your dreams and listening to your heart."
        },        quote: {
            text: "When you want something, all the universe conspires in helping you to achieve it.",
            source: "Paulo Coelho, The Alchemist"
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
        },        quote: {
            text: "You can't ever reach perfection, but you can believe in an asymptote toward which you are ceaselessly striving.",
            source: "Paul Kalanithi, When Breath Becomes Air"
        }
    },
    {
        date: "2026-03-12",
        book: {
            isbn: "9780140449334",
            title: "Meditations",
            author: "Marcus Aurelius",
            category: "Philosophy & Stoicism",
            desc: "The private journals of Rome's philosopher-emperor, offering timeless Stoic wisdom on resilience, duty, and the art of living well."
        },        quote: {
            text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
            source: "Marcus Aurelius, Meditations"
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
        },        quote: {
            text: "Asking for help isn't giving up. It's refusing to give up.",
            source: "Charlie Mackesy, The Boy, the Mole, the Fox and the Horse"
        }
    },
    {
        date: "2026-03-14",
        book: {
            isbn: "9780141983769",
            title: "Homo Deus: A Brief History of Tomorrow",
            author: "Yuval Noah Harari",
            category: "History & Futurism",
            desc: "Harari turns from the past to the future, exploring what might happen when old myths are coupled with godlike technologies like AI and genetic engineering."
        },        quote: {
            text: "In the twenty-first century, those who ride the train of progress will acquire divine abilities of creation and destruction.",
            source: "Yuval Noah Harari, Homo Deus"
        }
    },
    {
        date: "2026-03-15",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/2026-03-15.mp3",
        book: {
            isbn: "9781590171998",
            title: "Stoner",
            author: "John Williams",
            category: "Literary Fiction",
            desc: "A quiet masterpiece about an ordinary man's life — his love of literature, his failed marriage, and the small moments that define a meaningful existence."
        },        quote: {
            text: "He had, in odd ways, given it to every moment of his life, and had perhaps given it most fully when he was unaware of his giving.",
            source: "John Williams, Stoner"
        }
    },
    {
        date: "2026-03-16",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-16-y2qL9sPG47w3PJDnwH7jnkeiHDCQo4.mp3",
        book: {
            isbn: "9781771642484",
            title: "The Hidden Life of Trees",
            author: "Peter Wohlleben",
            category: "Nature & Science",
            desc: "A forester reveals how trees communicate, share nutrients through underground networks, and care for each other — reframing forests as complex social communities."
        },        quote: {
            text: "When trees grow together, nutrients and water can be optimally divided among them all so that each tree can grow into the best tree it can be.",
            source: "Peter Wohlleben, The Hidden Life of Trees"
        }
    },
    {
        date: "2026-03-17",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-17-PyOeEAAo7CDA0GpDnOdxjBm3azYwWl.mp3",
        book: {
            isbn: "9780062457714",
            title: "The Subtle Art of Not Giving a F*ck",
            author: "Mark Manson",
            category: "Self-Improvement",
            desc: "A counterintuitive approach to living a good life by choosing what truly matters and letting go of everything else."
        },        quote: {
            text: "Who you are is defined by what you're willing to struggle for.",
            source: "Mark Manson, The Subtle Art of Not Giving a F*ck"
        }
    },
    {
        date: "2026-03-18",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-18-NUAzgnfRgcBfOzupAUSujhCVmGduzO.mp3",
        book: {
            isbn: "9780679720201",
            title: "The Unbearable Lightness of Being",
            author: "Milan Kundera",
            category: "Fiction & Philosophy",
            desc: "A luminous novel about love, identity, and the weight of human choices — set against the Prague Spring, exploring whether life's meaning comes from its heaviness or its lightness."
        },        quote: {
            text: "The heaviest of burdens is simultaneously an image of life's most intense fulfillment.",
            source: "Milan Kundera, The Unbearable Lightness of Being"
        }
    },
    {
        date: "2026-03-19",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-19-NBmE1CNd20YseqX0CVAZ2Z6tpxZOGv.mp3",
        book: {
            isbn: "1560009624",
            title: "The Imperial Animal",
            author: "Lionel Tiger",
            category: "Anthropology",
            desc: "A provocative exploration of human nature through the lens of evolutionary biology — arguing that our politics, wars, and social bonds are driven by the same primal programs that shaped our primate ancestors."
        },        quote: {
            text: "We are not simply primates who happen to have culture; we are cultural animals whose culture is rooted in our biology.",
            source: "Lionel Tiger, The Imperial Animal"
        }
    },
    {
        date: "2026-03-20",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-20-r6nQpyKBZasXUbfzRInC9kQPaA5JUr.mp3",
        book: {
            isbn: "9780061233326",
            title: "Pilgrim at Tinker Creek",
            author: "Annie Dillard",
            category: "Nature Writing",
            desc: "A Pulitzer-winning meditation on the natural world observed from a Virginia creek — equal parts wonder and terror, beauty and violence, all rendered in luminous prose."
        },        quote: {
            text: "I am a frayed and nibbled survivor in a fallen world, and I am getting along.",
            source: "Annie Dillard, Pilgrim at Tinker Creek"
        }
    },
    {
        date: "2026-03-21",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-21-2WhAlUMQXJKwbEXS6NigYi8A5MRtTj.mp3",
        book: {
            isbn: "0151334811",
            title: "Free to Choose",
            author: "Milton Friedman",
            category: "Economics",
            desc: "A landmark argument for free markets and individual liberty — Friedman dismantles the case for government intervention with sharp logic, real-world examples, and an infectious belief that ordinary people make better choices than bureaucrats."
        },
        quote: {
            text: "A society that puts equality before freedom will get neither. A society that puts freedom before equality will get a high degree of both.",
            source: "Milton Friedman, Free to Choose"
        }
    },
    {
        date: "2026-03-22",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-22-xQ64kSRqSbBz4gsxeuos49Ch2bsmda.mp3",
        book: {
            isbn: "0226458083",
            title: "The Structure of Scientific Revolutions",
            author: "Thomas S. Kuhn",
            category: "Philosophy of Science",
            desc: "The book that gave us 'paradigm shift' — Kuhn argues that science doesn't progress in a straight line but through revolutionary upheavals, where the old worldview cracks and a new one takes its place. Essential reading for anyone who thinks about how ideas change."
        },
        quote: {
            text: "The scientist who pauses to examine every anomaly he notes will seldom get significant work done.",
            source: "Thomas S. Kuhn, The Structure of Scientific Revolutions"
        }
    },
    {
        date: "2026-03-23",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-23-KjDzhQjjvzv3tAUxDcqexOWKVqDE4w.mp3",
        book: {
            isbn: "0318768089",
            title: "An Introduction to Logic and Scientific Method",
            author: "Morris Raphael Cohen",
            category: "Philosophy / Logic",
            desc: "A foundational text that bridges formal logic with the practice of scientific inquiry — Cohen and Nagel show how clear thinking is the engine behind every credible experiment and every honest argument."
        },
        quote: {
            text: "The method of science is the method of bold conjectures and ingenious and severe attempts to refute them.",
            source: "Morris Raphael Cohen"
        }
    },
    {
        date: "2026-03-24",
        book: {
            isbn: "9780140433210",
            title: "Adam Bede",
            author: "George Eliot",
            category: "Fiction",
            desc: "George Eliot's debut novel drops you into rural England where a carpenter's quiet devotion collides with vanity and tragedy — a story about the gap between who we love and who deserves it."
        },
        quote: {
            text: "It's but little good you'll do a-watering the last year's crop.",
            source: "George Eliot, Adam Bede"
        }
    },
    {
        date: "2026-03-25",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-25-vSJd79T1XCUJ3GMG9JgoPiGuqjZZkT.mp3",
        book: {
            isbn: "9780062316110",
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            category: "History / Anthropology",
            desc: "Harari sweeps through 70,000 years of human history, revealing how fiction — from myths to money to nations — is the glue that lets strangers cooperate at scale."
        },
        quote: {
            text: "You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.",
            source: "Yuval Noah Harari, Sapiens"
        }
    },
    {
        date: "2026-03-26",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-26-YiNosI2Nye6tcqfSey5Nzk95mjvQat.mp3",
        book: {
            isbn: "9780679731726",
            title: "The Remains of the Day",
            author: "Kazuo Ishiguro",
            category: "Literary Fiction",
            desc: "A devoted English butler drives through the countryside reflecting on decades of service, slowly uncovering the cost of a life spent in perfect duty — the love he never pursued and the master whose ideals he never questioned."
        },
        quote: {
            text: "What is the point of worrying oneself too much about what one could or could not have done to control the course one's life took? Surely it is enough that the likes of you and I at least try to make our small contribution count for something true and worthy.",
            source: "Kazuo Ishiguro, The Remains of the Day"
        }
    },
    {
        date: "2026-03-27",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-27-Hlc8PmbVrxgYNuYH5I47pC0FjaPvMM.mp3",
        book: {
            isbn: "8497779096",
            title: "The Law of Success",
            author: "Napoleon Hill",
            category: "Psychology / Self-Development",
            desc: "Hill distills two decades of interviews with titans like Carnegie, Ford, and Edison into sixteen principles of achievement — a sprawling, obsessive blueprint for turning desire into results."
        },
        quote: {
            text: "A goal is a dream with a deadline.",
            source: "Napoleon Hill, The Law of Success"
        }
    },
    {
        date: "2026-03-28",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-28-GrJh5ecIpZtPihjGCKasPaS2YqDQlZ.mp3",
        book: {
            isbn: "0367199394",
            title: "Cross-Cultural Psychology",
            author: "Eric B. Shiraev",
            category: "Anthropology",
            desc: "A rigorous yet accessible exploration of how culture shapes perception, emotion, and thought — bridging psychology and anthropology to reveal the invisible forces behind human behavior worldwide."
        },
        quote: {
            text: "People do not simply live in a culture; they constantly create and re-create it.",
            source: "Eric B. Shiraev, Cross-Cultural Psychology"
        }
    },
    {
        date: "2026-03-29",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-29-tNfXxCkDVYdFdwyzIbWAZ4V11Yu031.mp3",
        book: {
            isbn: "9780131687288",
            title: "Digital Image Processing",
            author: "Rafael C. Gonzalez",
            category: "Technology",
            desc: "The definitive textbook on how computers see — from pixel-level operations to pattern recognition, this book laid the foundation for everything from medical imaging to the filters on your phone."
        },
        quote: {
            text: "The field of digital image processing refers to processing digital images by means of a digital computer — but its true power lies in making visible what was previously invisible.",
            source: "Rafael C. Gonzalez, Digital Image Processing"
        }
    },
    {
        date: "2026-03-30",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-30-dmv9kxrzoHtk6XPU4ypzM1tMvsV4NV.mp3",
        book: {
            isbn: "9782757899571",
            title: "The Three Musketeers",
            author: "Alexandre Dumas",
            category: "Fiction",
            desc: "A swashbuckling tale of friendship, honor, and intrigue in 17th-century France — young d'Artagnan joins three inseparable musketeers to outwit Cardinal Richelieu and protect the Queen's secret."
        },
        quote: {
            text: "All for one and one for all.",
            source: "Alexandre Dumas, The Three Musketeers"
        }
    },
    {
        date: "2026-03-31",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-03-31-OGBsQKaNOJAEB74vBklvbJXmV86Ora.mp3",
        book: {
            isbn: "0060959614",
            title: "Destined to Witness",
            author: "Hans J. Massaquoi",
            category: "Sociology",
            desc: "An astonishing memoir of growing up Black in Nazi Germany — Hans Massaquoi recounts his childhood in Hamburg, navigating survival, identity, and belonging in a world that rejected his very existence."
        },
        quote: {
            text: "I had to learn early that survival meant becoming invisible in a world that wanted me not to exist.",
            source: "Hans J. Massaquoi, Destined to Witness"
        }
    },
    {
        date: "2026-04-01",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-01-XgJhKLTnMB8ibPMf4crGlMvky9lRLH.mp3",
        book: {
            isbn: "349911044x",
            title: "La Chute",
            author: "Albert Camus",
            category: "Philosophy",
            desc: "A former Parisian lawyer confesses his moral failures to a stranger in an Amsterdam bar — Camus's haunting monologue on guilt, judgment, and the impossibility of innocence."
        },
        quote: {
            text: "I'll tell you a great secret, my friend. Do not wait for the last judgment. It takes place every day.",
            source: "Albert Camus, La Chute"
        }
    },
    {
        date: "2026-04-02",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-02-GDxdKX5wj9bVTmWAam0O3nqLqRHss5.mp3",
        book: {
            isbn: "9780553208849",
            title: "Siddhartha",
            author: "Hermann Hesse",
            category: "Philosophy",
            desc: "A young Brahmin's son leaves behind privilege and doctrine to seek meaning through asceticism, love, and the simple wisdom of a river — Hesse's luminous parable about finding truth not through teachings, but through living."
        },
        quote: {
            text: "Wisdom cannot be imparted. Wisdom that a wise man attempts to impart always sounds like foolishness to someone else.",
            source: "Hermann Hesse, Siddhartha"
        }
    },
    {
        date: "2026-04-03",
        audio: "undefined",
        book: {
            isbn: "9780374529208",
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology",
            desc: "Nobel laureate Kahneman reveals the two systems that drive how we think — the fast, intuitive mind and the slow, deliberate one — exposing the cognitive biases that shape every decision we make."
        },
        quote: {
            text: "Nothing in life is as important as you think it is, while you are thinking about it.",
            source: "Daniel Kahneman, Thinking, Fast and Slow"
        }
    },
    {
        date: "2026-04-04",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-04-MUdF8KdDvbWZl5JDBEy1sj0dU4Bgis.mp3",
        book: {
            isbn: "9780486229492",
            title: "The Gentle Art of Mathematics",
            author: "Daniel Pedoe",
            category: "Mathematics",
            desc: "A playful romp through mathematical puzzles, games, and paradoxes that reveals the surprising beauty lurking in everyday logic and number patterns."
        },
        quote: {
            text: "The mathematician does not study pure mathematics because it is useful; he studies it because he delights in it and he delights in it because it is beautiful.",
            source: "Daniel Pedoe"
        }
    },
    {
        date: "2026-04-05",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-06-mGGKayVe0CGK1QhHEQI3VSBC0chmEG.mp3",
        book: {
            isbn: "0816509190",
            title: "Mirror for Man",
            author: "Clyde Kluckhohn",
            category: "Anthropology",
            desc: "A landmark introduction to anthropology that holds up a mirror to human nature, exploring how culture shapes everything from our deepest beliefs to our most mundane habits."
        },
        quote: {
            text: "Every man is in certain respects like all other men, like some other men, like no other man.",
            source: "Clyde Kluckhohn"
        }
    },
    {
        date: "2026-04-06",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-06-XQtrOQVIzfkkDaNH5Iy8Rm5YfxENeX.mp3",
        book: {
            isbn: "9781717423504",
            title: "The Two Paths",
            author: "John Ruskin",
            category: "Art",
            desc: "Ruskin's fiery lectures on art and labor, arguing that true beauty springs from the worker's joy and imagination — not mechanical perfection."
        },
        quote: {
            text: "The highest reward for a person's toil is not what they get for it, but what they become by it.",
            source: "John Ruskin"
        }
    },
    {
        date: "2026-04-07",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-07-N85E3oYB5wxMMAvbadfn9NCgo6MhvD.mp3",
        book: {
            isbn: "9781610660068",
            title: "The Long Tail",
            author: "Chris Anderson",
            category: "Technology",
            desc: "The former Wired editor reveals how the internet economy thrives not on blockbusters, but on the endless shelf of niche products — and why selling less of more is the future of business."
        },
        quote: {
            text: "We are leaving the age of information and entering the age of recommendation.",
            source: "Chris Anderson"
        }
    },
    {
        date: "2026-04-08",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-08-fdGtJbFcH0y261QsIpQzXXPkt23aN8.mp3",
        book: {
            isbn: "9781101947883",
            title: "Exhalation: Stories",
            author: "Ted Chiang",
            category: "Science Fiction",
            desc: "Nine stunning stories that explore free will, determinism, and what it means to be human — from the mind behind 'Arrival,' each tale a quiet detonation of ideas that lingers long after the last page."
        },
        quote: {
            text: "The universe began as an enormous breath being held.",
            source: "Ted Chiang, Exhalation"
        }
    },
    {
        date: "2026-04-09",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-10-xug0BrHivYArq9liCT2R0v8LoIx9yn.mp3",
        book: {
            isbn: "9781493003358",
            title: "Leonardo's Brain",
            author: "Leonard Shlain",
            category: "Neuroscience",
            desc: "A surgeon-polymath argues that Leonardo da Vinci's genius arose from an extraordinary integration of left- and right-brain thinking, weaving art, science, and anatomy into a radical theory of creativity."
        },
        quote: {
            text: "Art and physics are a strange coupling, but like all good marriages, they are made in heaven.",
            source: "Leonard Shlain"
        }
    },
    {
        date: "2026-04-10",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-10-h7wzpC66FDWN3jNw7LesKc3x4ma6Wu.mp3",
        book: {
            isbn: "0760735824",
            title: "The Medieval Machine",
            author: "Jean Gimpel",
            category: "Technology",
            desc: "A revelatory history of the Middle Ages as an era of stunning technological innovation — water mills, mechanical clocks, Gothic cathedrals — that shatters the myth of medieval backwardness and draws unsettling parallels to modern industrial decline."
        },
        quote: {
            text: "The belief that the Middle Ages were a period of ignorance and stagnation is one of the most deeply rooted misconceptions in Western thought.",
            source: "Jean Gimpel"
        }
    },
    {
        date: "2026-04-11",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-11-QOYShMyKPz5mQBuO6Ma8BaxJpVfnzo.mp3",
        book: {
            isbn: "9780807064474",
            title: "The Poetics of Space",
            author: "Gaston Bachelard",
            category: "Philosophy",
            desc: "A lyrical phenomenology of intimate spaces — attics, cellars, drawers, nests — that reveals how the houses we inhabit shape our memories, daydreams, and deepest sense of self."
        },
        quote: {
            text: "The house shelters daydreaming, the house protects the dreamer, the house allows one to dream in peace.",
            source: "Gaston Bachelard"
        }
    },
    {
        date: "2026-04-12",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-12-ZugkruuLj8hvdtLssvPqnDZPa7kdqn.mp3",
        book: {
            isbn: "9780300179354",
            title: "Interaction of Color",
            author: "Josef Albers",
            category: "Design",
            desc: "A masterclass in color theory from the Bauhaus pioneer, demonstrating that color is never perceived as it really is, but always in relation to its surroundings."
        },
        quote: {
            text: "In visual perception a color is almost never seen as it really is - as it physically is. This fact makes color the most relative medium in art.",
            source: "Josef Albers"
        }
    },
    {
        date: "2026-04-13",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-13-9wGNlvQ7FkrYm0xvm9gAHdMLZ4GY0r.mp3",
        book: {
            isbn: "9780679741954",
            title: "The Death and Life of Great American Cities",
            author: "Jane Jacobs",
            category: "Architecture",
            desc: "A fierce critique of mid-century urban planning that champions organic, mixed-use neighborhoods and the complex 'ballet of the good city sidewalk'."
        },
        quote: {
            text: "Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.",
            source: "Jane Jacobs"
        }
    },
    {
        date: "2026-04-14",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-14-MoHN5VstOCdnkHUmARNuqrJiJTUwdz.mp3",
        book: {
            isbn: "9780262631594",
            title: "Understanding Media: The Extensions of Man",
            author: "Marshall McLuhan",
            category: "Sociology",
            desc: "A prophetic analysis of media and technology, introducing the concept that the medium itself, rather than its content, fundamentally shapes human society."
        },
        quote: {
            text: "The medium is the message. This is merely to say that the personal and social consequences of any medium - that is, of any extension of ourselves - result from the new scale that is introduced into our affairs by each extension of ourselves, or by any new technology.",
            source: "Marshall McLuhan"
        }
    },
    {
        date: "2026-04-15",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-15-XblU26l6zYL2lFSI2wxGOZSzh0gmI2.mp3",
        book: {
            isbn: "9780961392147",
            title: "The Visual Display of Quantitative Information",
            author: "Edward R. Tufte",
            category: "Design",
            desc: "The foundational text on data visualization, establishing principles for presenting complex information with clarity, precision, and elegance."
        },
        quote: {
            text: "Clutter and confusion are not attributes of data - they are shortcomings of design.",
            source: "Edward R. Tufte"
        }
    },
    {
        date: "2026-04-16",
        book: {
            isbn: "9780714834498",
            title: "The Art of Looking Sideways",
            author: "Alan Fletcher",
            category: "Design",
            desc: "A playful but rigorous cabinet of visual observations, prompts, diagrams, and provocations about how attention works. It trains taste by teaching you to notice more than you normally would."
        },
        quote: {
            text: "The real voyage of discovery consists not in seeking new landscapes but in having new eyes.",
            source: "Marcel Proust"
        }
    },
    {
        date: "2026-04-17",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-18-uYBejPykOaaweQ0jAp40mw6xBBNsN4.mp3",
        book: {
            isbn: "9780983662518",
            title: "The Shape of Design",
            author: "Frank Chimero",
            category: "Design",
            desc: "A small, warm book about form, responsibility, and making things for other people. It connects design craft to intention, systems, and the personality objects quietly accumulate over time."
        },
        quote: {
            text: "People ignore design that ignores people.",
            source: "Frank Chimero"
        }
    },
    {
        date: "2026-04-18",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-18-3uVdc54aT2lPpcq6SmoXfGtqXN6PEQ.mp3",
        book: {
            isbn: "9780060976255",
            title: "Understanding Comics",
            author: "Scott McCloud",
            category: "Visual Storytelling",
            desc: "Nominally about comics, actually about how visual communication works. McCloud breaks down abstraction, sequence, time, and meaning with unusual clarity and playfulness."
        },
        quote: {
            text: "When you look at a comic, you're seeing not just a picture but a language.",
            source: "Scott McCloud"
        }
    },
    {
        date: "2026-04-19",
        book: {
            isbn: "9780060891541",
            title: "On Writing Well",
            author: "William Zinsser",
            category: "Writing",
            desc: "A durable guide to nonfiction prose that values clarity, simplicity, rhythm, and respect for the reader. Zinsser's core lesson is that good writing is good thinking made visible."
        },
        quote: {
            text: "Writing is thinking on paper.",
            source: "William Zinsser"
        }
    },
    {
        date: "2026-04-20",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-20-JTnLZ5ihBRdWib4g1QkBLoPSGSMR0i.mp3",
        book: {
            isbn: "9781584230700",
            title: "The Medium is the Massage",
            author: "Marshall McLuhan",
            category: "Media Theory",
            desc: "A collage-like classic arguing that media reshape perception and social organization long before we consciously understand their content. Short, strange, and still useful."
        },
        quote: {
            text: "All media work us over completely.",
            source: "Marshall McLuhan"
        }
    },
    {
        date: "2026-04-21",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-21-ctBvC8nfnPEN41R2EJgohGZ1mhMTGC.mp3",
        book: {
            isbn: "9783037781050",
            title: "Designing Design",
            author: "Kenya Hara",
            category: "Design",
            desc: "A quiet, precise meditation on emptiness, information, and the emotional texture of objects. Hara's essays help sharpen restraint, simplicity, and the value of suggestion over noise."
        },
        quote: {
            text: "Design is not the answer. Design is the question.",
            source: "Kenya Hara"
        }
    },
    {
        date: "2026-04-22",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-22-Mgdhu3281LUky4s6uWn8pwAMT0SHc7.mp3",
        book: {
            isbn: "9781612198552",
            title: "How to Do Nothing",
            author: "Jenny Odell",
            category: "Culture",
            desc: "An argument for reclaiming attention from the capture machinery of platforms and productivity culture. Odell reframes withdrawal not as laziness but as a political and perceptual act."
        },
        quote: {
            text: "Attention is the beginning of devotion.",
            source: "Mary Oliver"
        }
    },
    {
        date: "2026-04-23",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-23-54hATXJOAGX9hDRLjPnIJnE0CFbMCX.mp3",
        book: {
            isbn: "9780872200524",
            title: "Ways of Worldmaking",
            author: "Nelson Goodman",
            category: "Philosophy",
            desc: "A compact philosophy classic about how representation, description, and symbol systems actively construct the worlds we inhabit. Useful when thinking about models, interfaces, and framing."
        },
        quote: {
            text: "Comprehension and creation go on together.",
            source: "Nelson Goodman"
        }
    },
    {
        date: "2026-04-24",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-24-yKjeVHPlH5j5NUYN3YWn3Lq68nKwFZ.mp3",
        book: {
            isbn: "9780761178972",
            title: "Show Your Work!",
            author: "Austin Kleon",
            category: "Creativity",
            desc: "A practical book about making your process visible without turning yourself into a brand caricature. Helpful for anyone trying to publish, document, and compound their work in public."
        },
        quote: {
            text: "In order to be found, you have to be findable.",
            source: "Austin Kleon"
        }
    },
    {
        date: "2026-04-25",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-25-WfiCwM88cgygc1xbuDWZhtJ9L1RMUu.mp3",
        book: {
            isbn: "9783721201451",
            title: "Grid Systems in Graphic Design",
            author: "Josef Müller-Brockmann",
            category: "Graphic Design",
            desc: "A disciplined manual on structure, proportion, spacing, and typographic order. It is not about stiffness for its own sake, but about building layouts that can hold complexity with calm."
        },
        quote: {
            text: "The grid system is an aid, not a guarantee.",
            source: "Josef Müller-Brockmann"
        }
    },
    {
        date: "2026-04-26",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-26-7COmAPSSM2Wrelu4GrnEjj1LXXcYmn.mp3",
        book: {
            isbn: "9780520256095",
            title: "Seeing Is Forgetting the Name of the Thing One Sees",
            author: "Lawrence Weschler",
            category: "Art",
            desc: "A beautiful portrait of artist Robert Irwin and the discipline of sustained perception. The book is really about attention, doubt, and the gradual training required to see more clearly."
        },
        quote: {
            text: "Seeing is forgetting the name of the thing one sees.",
            source: "Paul Valéry"
        }
    },
    {
        date: "2026-04-27",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-27-LzSFCPAJqRV5UQy7sNZ1MjQShzkVTB.mp3",
        book: {
            isbn: "9780465068784",
            title: "The Reflective Practitioner",
            author: "Donald A. Schön",
            category: "Practice",
            desc: "Schön explains how skilled professionals think in the middle of uncertain situations, not after the fact. A strong framework for understanding design critique, iteration, and tacit judgment."
        },
        quote: {
            text: "In a swampy lowland, problems are messy and confusing and incapable of technical solution.",
            source: "Donald A. Schön"
        }
    },
    {
        date: "2026-04-28",
        book: {
            isbn: "9780743235273",
            title: "The Creative Habit",
            author: "Twyla Tharp",
            category: "Creativity",
            desc: "A no-nonsense book about building routines that make creativity repeatable. Tharp demystifies inspiration by treating it as the product of preparation, ritual, and consistent work."
        },
        quote: {
            text: "Creativity is a habit, and the best creativity is a result of good work habits.",
            source: "Twyla Tharp"
        }
    },
    {
        date: "2026-04-29",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-29-DOyxfiFXtfy6y8Y0SFhIim2YKaduwD.mp3",
        book: {
            isbn: "9780918172020",
            title: "In Praise of Shadows",
            author: "Jun'ichirō Tanizaki",
            category: "Aesthetics",
            desc: "A short and elegant meditation on light, darkness, texture, and restraint in Japanese aesthetics. It is one of the best books for recalibrating taste away from brightness, excess, and obviousness."
        },
        quote: {
            text: "Were it not for shadows, there would be no beauty.",
            source: "Jun'ichirō Tanizaki"
        }
    },
    {
        date: "2026-04-30",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-04-30-KHSHIMLtuolh7q2aRDDHMUSFZGPJiH.mp3",
                book: {
            isbn: "9780918172020",
            title: "In Praise of Shadows",
            author: "Jun'ichirō Tanizaki",
            category: "Aesthetics",
            desc: "A short and elegant meditation on light, darkness, texture, and restraint in Japanese aesthetics. It is one of the best books for recalibrating taste away from brightness, excess, and obviousness."
        },
        quote: {
            text: "Were it not for shadows, there would be no beauty.",
            source: "Jun'ichirō Tanizaki"
        }
    },
    {
        date: "2026-05-01",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-01-CRMJsN3rkgPcoPXPdxzGUsXKHemS9Q.mp3",
        book: {
            isbn: "9780972652919",
            title: "The Nature of Order: Book One",
            author: "Christopher Alexander",
            category: "Architecture",
            desc: "Alexander's mature argument that living structure emerges from deep patterns of wholeness rather than style. Dense but unusually rewarding for anyone thinking about systems, form, and why some environments feel alive."
        },
        quote: {
            text: "The degree of life which a thing has can be measured objectively.",
            source: "Christopher Alexander"
        }
    },
    {
        date: "2026-05-02",
        book: {
            isbn: "9780374118785",
            title: "Building and Dwelling",
            author: "Richard Sennett",
            category: "Urbanism",
            desc: "Sennett explores the gap between the city as designed and the city as actually lived. It is a strong book about openness, repair, and how urban environments should make room for complexity rather than flatten it."
        },
        quote: {
            text: "The open city is a city in which differences can coexist without being forced into conformity.",
            source: "Richard Sennett"
        }
    },
    {
        date: "2026-05-03",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-03-9uIsw3lRPLzNa2OAwDOyXxeJPqISXJ.mp3",
        book: {
            isbn: "9780141183022",
            title: "The Library of Babel",
            author: "Jorge Luis Borges",
            category: "Fiction",
            desc: "A brief, dizzying fiction about infinity, knowledge, classification, and despair. Even in tiny doses Borges can permanently alter how you think about archives, systems, and meaning."
        },
        quote: {
            text: "The universe (which others call the Library) is composed of an indefinite, perhaps infinite number of hexagonal galleries.",
            source: "Jorge Luis Borges"
        }
    },
    {
        date: "2026-05-04",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-04-G6gOqsXUkcZyuZs8iB0bIVyL2CQ1wO.mp3",
        book: {
            isbn: "9781119941286",
            title: "The Eyes of the Skin",
            author: "Juhani Pallasmaa",
            category: "Architecture",
            desc: "A compact classic arguing that architecture has become too dominated by vision and too detached from the full body. Pallasmaa re-centers touch, atmosphere, materiality, and multisensory experience."
        },
        quote: {
            text: "The door handle is the handshake of the building.",
            source: "Juhani Pallasmaa"
        }
    },
    {
        date: "2026-05-05",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-05-ByCVncaoPRy5JI5DgYeSTg5eiGAjNH.mp3",
        book: {
            isbn: "9781324091011",
            title: "The Craftsman and the Critic",
            author: "Adam Gopnik",
            category: "Culture",
            desc: "A refined set of essays on taste, labor, making, and judgment. Gopnik is especially good at describing why standards matter without becoming sterile or pompous."
        },
        quote: {
            text: "Taste is never pure preference; it is preference educated by attention.",
            source: "Adam Gopnik"
        }
    },
    {
        date: "2026-05-06",
        book: {
            isbn: "9780071410946",
            title: "A Technique for Producing Ideas",
            author: "James Webb Young",
            category: "Creativity",
            desc: "A tiny, durable book on idea generation as a process of gathering, digesting, incubating, and recombining material. Short enough to reread often, useful enough to keep nearby."
        },
        quote: {
            text: "An idea is nothing more nor less than a new combination of old elements.",
            source: "James Webb Young"
        }
    },
    {
        date: "2026-05-07",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-07-JEM1gCaHddlCCEUc6O9wuwAQEVwInl.mp3",
        book: {
            isbn: "9780807063217",
            title: "The Ethics of Ambiguity",
            author: "Simone de Beauvoir",
            category: "Philosophy",
            desc: "Beauvoir's argument that freedom is real only when it is lived among other freedoms. Sharp, demanding, and especially relevant when thinking about responsibility in uncertain systems."
        },
        quote: {
            text: "To will oneself moral and to will oneself free are one and the same decision.",
            source: "Simone de Beauvoir"
        }
    },
    {
        date: "2026-05-08",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-08-VaHoeOinrwAgMEDlcDPoz3mdHcPtDe.mp3",
        book: {
            isbn: "9780156453806",
            title: "Invisible Cities",
            author: "Italo Calvino",
            category: "Fiction",
            desc: "A luminous sequence of imagined cities that doubles as a meditation on memory, desire, decay, and language. Excellent for anyone who likes books that sharpen perception instead of merely informing it."
        },
        quote: {
            text: "The city does not tell its past, but contains it like the lines of a hand.",
            source: "Italo Calvino"
        }
    },
    {
        date: "2026-05-09",
        audio: "https://qxtynvj1amcfkfqv.public.blob.vercel-storage.com/littlebook/audio/2026-05-09-zYEbZ4anHALbsddk9nd600Gm4BKus8.mp3",
        book: {
            isbn: "9780881792126",
            title: "The Elements of Typographic Style",
            author: "Robert Bringhurst",
            category: "Typography",
            desc: "A classic guide to typography that treats layout, rhythm, proportion, and language with unusual grace. It makes typography feel less like formatting and more like a form of thought."
        },
        quote: {
            text: "Typography exists to honor content.",
            source: "Robert Bringhurst"
        }
    },
    {
        date: "2026-05-10",
        book: {
            isbn: "9780691220550",
            title: "The Mushroom at the End of the World",
            author: "Anna Lowenhaupt Tsing",
            category: "Anthropology",
            desc: "A strange and brilliant book about precarity, capitalism, ecology, and what kinds of life remain possible in damaged worlds. It is one of the best examples of scholarship that still feels alive on the page."
        },
        quote: {
            text: "Precarity is the condition of our time.",
            source: "Anna Lowenhaupt Tsing"
        }
    }
];

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

// Persistent cover URL cache (survives page reloads)
const COVER_CACHE_KEY = 'littlebook_covers';
const coverUrlCache = (() => {
    try {
        return JSON.parse(localStorage.getItem(COVER_CACHE_KEY)) || {};
    } catch { return {}; }
})();
function _saveCoverCache() {
    try { localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(coverUrlCache)); } catch {}
}

async function fetchBestCoverUrl(isbn, title, author) {
    if (coverUrlCache[isbn]) return coverUrlCache[isbn];

    const isbn10 = isbn13to10(isbn);
    const ol = (id, size) => `https://covers.openlibrary.org/b/isbn/${id}-${size}.jpg?default=false`;

    const googlePromise = googleBooksCover(isbn);
    const olSearchPromise = (title && author) ? olSearchCover(title, author) : Promise.resolve(null);

    let url = await probeImage(ol(isbn, 'L'));
    if (url) { coverUrlCache[isbn] = url; _saveCoverCache(); return url; }

    if (isbn10) {
        url = await probeImage(ol(isbn10, 'L'));
        if (url) { coverUrlCache[isbn] = url; _saveCoverCache(); return url; }
    }

    const olSearchUrl = await olSearchPromise;
    if (olSearchUrl) {
        url = await probeImage(olSearchUrl);
        if (url) { coverUrlCache[isbn] = url; _saveCoverCache(); return url; }
    }

    const googleUrl = await googlePromise;
    if (googleUrl) {
        url = await probeImage(googleUrl);
        if (url) { coverUrlCache[isbn] = url; _saveCoverCache(); return url; }
    }

    url = await probeImage(ol(isbn, 'M'));
    if (url) { coverUrlCache[isbn] = url; _saveCoverCache(); return url; }
    if (isbn10) {
        url = await probeImage(ol(isbn10, 'M'));
        if (url) { coverUrlCache[isbn] = url; _saveCoverCache(); return url; }
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
    getLatestDate: getLatestDate,
    getNextDate: getNextDate,
    getAllDates: getAllDates
};
