// Enhanced news data with extended descriptions for better readability
const newsData = [
    {
        id: 1,
        title: "NBA 2K26 Summer League: Dylan Harper, Spurs defeat Cooper Flagg, Mavs",
        description: "The highly anticipated matchup between the top two NBA draft picks delivered exceptional basketball entertainment as Dylan Harper led the San Antonio Spurs to victory. Harper showcased his versatility and court vision, scoring 16 points while demonstrating the skills that made him the second overall pick. Meanwhile, Cooper Flagg, the number one draft selection, put up an impressive 31 points for the Dallas Mavericks but couldn't prevent his team's defeat in this thrilling Summer League contest.",
        image: "https://cdn.nba.com/manage/2025/07/GettyImages-2224186764-scaled-e1752358240557.jpg",
        source: "NBA.com",
        category: "general",
        publishedAt: "2025-07-12T23:37:00Z",
        url: "https://www.nba.com/news/nba-2k26-summer-league-mavericks-spurs"
    },
    {
        id: 2,
        title: "4 southern states, UT report over 33% of 25L HIV cases",
        description: "A comprehensive health report reveals that four southern Indian states along with one Union Territory account for more than one-third of the country's 2.5 million HIV cases. The data highlights significant regional health disparities and underscores the urgent need for targeted prevention and treatment programs. Additionally, the report indicates that approximately 19,960 pregnant women across India required specialized prevention services to prevent mother-to-child transmission, emphasizing the importance of maternal health initiatives in HIV prevention strategies.",
        image: "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTBjNjMwNTcwLTVmNmYtMTFmMC05MTIyLTg5YjRhMjgyZWQzNS5qcGc=",
        source: "The Tribune",
        category: "general",
        publishedAt: "2025-07-12T23:27:00Z",
        url: "https://www.tribuneindia.com/news/india/4-southern-states-ut-report-over-33-of-25l-hiv-cases/"
    },
    {
        id: 3,
        title: "The ACT government promised to rebuild, but these huts in Namadgi National Park remain in ruins",
        description: "More than five years after the devastating Black Summer bushfires swept through Australia, two historically significant heritage huts in the ACT's Namadgi National Park continue to stand as burnt-out, fenced-off ruins. Despite repeated government promises to construct new structures in commemoration of the original buildings, local communities and heritage advocates remain frustrated by the lack of progress. The delay has sparked broader discussions about heritage preservation priorities and the government's commitment to rebuilding culturally important sites destroyed by natural disasters.",
        image: "https://live-production.wcms.abc-cdn.net.au/540468421f3fba0464ac9c949580eb36?impolicy=wcms_watermark_news&cropH=2813&cropW=5000&xPos=0&yPos=84&width=862&height=485&imformat=generic",
        source: "ABC News",
        category: "general",
        publishedAt: "2025-07-12T23:16:00Z",
        url: "https://www.abc.net.au/news/2025-07-13/namadgi-huts-remain-in-ruins-after-black-summer-fires/105521172"
    },
    {
        id: 4,
        title: "Donald Trump threatens to revoke Rosie O'Donnell's US citizenship",
        description: "In a controversial statement that has captured widespread media attention, President Donald Trump has threatened to revoke comedian and television personality Rosie O'Donnell's US citizenship. The unprecedented threat has raised serious constitutional questions about executive power and citizenship rights. O'Donnell responded defiantly to the president's remarks by posting a photograph of Trump alongside convicted sex offender Jeffrey Epstein on her Instagram account, intensifying the public feud between the two prominent figures and drawing further scrutiny to their long-standing animosity.",
        image: "https://e3.365dm.com/25/07/1600x900/skynews-donald-trump_6963725.jpg?20250712223157",
        source: "Sky News",
        category: "general",
        publishedAt: "2025-07-12T23:12:00Z",
        url: "https://news.sky.com/story/donald-trump-threatens-to-revoke-rosie-odonnells-us-citizenship-13395988"
    },
    {
        id: 5,
        title: "Numerous Fossils Reveal Jurassic Fish Killed in Same, Bizarre Way",
        description: "A remarkable paleontological discovery has uncovered multiple fish fossils from the Jurassic period, all showing evidence of dying in an identical and highly unusual manner. Scientists have identified what appears to be a choking hazard that repeatedly affected these ancient marine creatures, providing unprecedented insights into prehistoric aquatic ecosystems. The findings suggest a specific environmental or behavioral pattern that led to repeated fatal incidents, offering researchers a unique window into ancient marine life dynamics and the challenges these creatures faced millions of years ago.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwYzAtNTAgNDAtOTAgOTAtOTBzOTAgNDAgOTAgOTAtNDAgOTAtOTAgOTAtOTAtNDAtOTAtOTB6IiBmaWxsPSIjNjY3ZWVhIi8+CjxwYXRoIGQ9Ik0xNzAgMTIwbDIwIDIwLTE1IDE1LTIwLTIweiIgZmlsbD0id2hpdGUiLz4KPHN2ZyB4PSIzMDAiIHk9IjI1MCI+CjxwYXRoIGQ9Ik0tMTAgMGwxMCAxMGwxMC0xMHoiIGZpbGw9IiM2NjdlZWEiLz4KPC9zdmc+CjwvZz48L3N2Zz4K",
        source: "Yahoo News",
        category: "general",
        publishedAt: "2025-07-12T23:02:00Z",
        url: "https://www.yahoo.com/news/numerous-fossils-reveal-jurassic-fish-220030620.html"
    },
    {
        id: 6,
        title: "10 Fascinating Facts About Our Solar System",
        description: "Our Solar System continues to reveal incredible mysteries and paradoxes that challenge our understanding of cosmic dynamics. From the massive gravitational influence of our central star to the complex interactions between Kuiper Belt objects and dwarf planets, recent discoveries have unveiled fascinating gravitational insights. These findings demonstrate how planetary bodies interact in ways that create both predictable patterns and unexpected cosmic phenomena, helping scientists better understand the fundamental forces that govern our celestial neighborhood and provide clues about the formation and evolution of planetary systems throughout the universe.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTEyMjMzIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iMzAiIGZpbGw9IiNmZmQ3MDAiLz4KPGNpcmNsZSBjeD0iMTIwIiBjeT0iMTUwIiByPSI4IiBmaWxsPSIjNjY3ZWVhIi8+CjxjaXJjbGUgY3g9IjI4MCIgY3k9IjE1MCIgcj0iMTIiIGZpbGw9IiNlNzRjM2MiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMDAiIHI9IjMiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjgwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
        source: "World Atlas",
        category: "general",
        publishedAt: "2025-07-12T23:02:00Z",
        url: "https://www.worldatlas.com/space/10-fascinating-facts-about-our-solar-system.html"
    },
    {
        id: 7,
        title: "New process turns wheat straw and oat husks into sustainable clothing",
        description: "European researchers have achieved a groundbreaking breakthrough in sustainable fashion by developing an innovative process that transforms agricultural waste into high-quality textile fibers. The revolutionary technique converts wheat straw and oat husks—materials traditionally discarded as farm waste—into durable, comfortable fabric suitable for clothing production. This development represents a significant step toward circular economy principles in the fashion industry, offering an environmentally friendly alternative to conventional textile production while providing farmers with additional revenue streams from their agricultural byproducts.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmOGZmIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzJkN2E0YSIvPgo8cGF0aCBkPSJNMTIwIDEyMGgyMHYyMGgtMjB6IiBmaWxsPSIjZmZkNzAwIi8+CjxwYXRoIGQ9Ik0xNjAgMTIwaDIwdjIwaC0yMHoiIGZpbGw9IiNmZmQ3MDAiLz4KPHBhdGggZD0iTTIwMCAxMjBoMjB2MjBoLTIweiIgZmlsbD0iI2ZmZDcwMCIvPgo8cGF0aCBkPSJNMjQwIDEyMGgyMHYyMGgtMjB6IiBmaWxsPSIjZmZkNzAwIi8+CjxwYXRoIGQ9Ik0xNDAgMTYwaDIwdjIwaC0yMHoiIGZpbGw9IiNmZmQ3MDAiLz4KPHBhdGggZD0iTTE4MCAxNjBoMjB2MjBoLTIweiIgZmlsbD0iI2ZmZDcwMCIvPgo8cGF0aCBkPSJNMjIwIDE2MGgyMHYyMGgtMjB6IiBmaWxsPSIjZmZkNzAwIi8+Cjwvc3ZnPgo=",
        source: "ABC News",
        category: "general",
        publishedAt: "2025-07-12T22:00:00Z",
        url: "https://www.abc.net.au/news/2025-07-13/wheat-straw-and-oat-husks-turned-into-clothes/105489812"
    },
    {
        id: 8,
        title: "Gaza hospital says 24 people killed near aid site as witnesses blame IDF",
        description: "Tragic casualties have been reported near a humanitarian aid distribution site in Gaza, with local hospital officials confirming that 24 people have been killed in what witnesses describe as military action. Eyewitness accounts indicate that Israeli Defense Forces opened fire as civilians were attempting to access food supplies, creating a devastating situation for already vulnerable populations. The Israeli military has disputed these claims, stating that there were no known injuries from their operations, highlighting the complex and often contradictory nature of information emerging from the conflict zone.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U3NGMzYyIvPgo8cGF0aCBkPSJNMTUwIDEyNWwyNSAyNS0yNSAyNXoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMjUgMTI1bDI1IDI1LTI1IDI1eiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTc1IiB5PSIxMzUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
        source: "BBC News",
        category: "world",
        publishedAt: "2025-07-12T22:00:00Z",
        url: "https://www.bbc.com/news/articles/cp90v2ng70yo"
    },
    {
        id: 9,
        title: "How the 'manosphere' is fuelling teen misogyny inside Australian schools",
        description: "Australian educational institutions are grappling with a concerning rise in misogynistic attitudes among teenage boys, largely attributed to the influence of online 'manosphere' communities. These digital spaces are bombarding young males with toxic messaging about masculinity and harmful stereotypes about women, creating significant challenges for educators and administrators. Teachers report feeling overwhelmed by the increasing prevalence of these attitudes in classrooms, as they struggle to counteract the pervasive influence of online content that promotes unhealthy relationship dynamics and regressive gender roles among impressionable students.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTUwIDEyNWwyNSAyNS0yNSAyNXoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMjUgMTI1bDI1IDI1LTI1IDI1eiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTc1IiB5PSIxMzUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
        source: "ABC News",
        category: "general",
        publishedAt: "2025-07-12T22:00:00Z",
        url: "https://www.abc.net.au/news/2025-07-13/hijacking-adolescence-fuelling-teen-misogyny-inside-schools/105523184"
    },
    {
        id: 10,
        title: "The crucial importance of fuel switches and what pilots discussed in final moments",
        description: "A detailed aviation safety report has revealed critical information about the tragic AI 171 Air India crash in Ahmedabad, highlighting the crucial role of fuel control systems in aircraft safety. The investigation shows that the Boeing 787-8 aircraft's engine fuel control switches unexpectedly transitioned from 'RUN' to 'CUTOFF' position within seconds of each other immediately after takeoff, leading to catastrophic engine failure. This incident represents one of the most severe aviation disasters involving an Indian airline in four decades, prompting comprehensive reviews of fuel system protocols and pilot emergency response procedures.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwbDUwLTUwaDEwMGw1MCA1MHYxMDBIMTAweiIgZmlsbD0iIzMzNzNkYyIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZmZkNzAwIi8+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNmZmQ3MDAiLz4KPHJlY3QgeD0iMTgwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZDcwMCIvPgo8L3N2Zz4K",
        source: "Indian Express",
        category: "general",
        publishedAt: "2025-07-12T22:00:00Z",
        url: "https://indianexpress.com/article/business/aviation/air-india-ahmedabad-plane-crash-preliminary-report-key-takeaways-10121494/"
    },

    {
        id: 14,
        title: "28 Palestinians including children killed in Israeli airstrikes in Gaza",
        description: "Devastating airstrikes in the Gaza Strip have resulted in the tragic deaths of 28 Palestinians, including several children, according to local health authorities and international observers. The Israeli military has confirmed conducting extensive operations in the region, stating that their forces struck approximately 250 targets throughout Gaza over the past 48 hours as part of ongoing military campaigns. The casualties highlight the severe humanitarian crisis affecting civilian populations in the densely populated territory, with international aid organizations expressing grave concerns about the safety of non-combatants caught in the conflict zone.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U3NGMzYyIvPgo8cGF0aCBkPSJNMTUwIDEyNWwyNSAyNS0yNSAyNXoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMjUgMTI1bDI1IDI1LTI1IDI1eiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTc1IiB5PSIxMzUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
        source: "St. Louis Post-Dispatch",
        category: "world",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.stltoday.com/news/nation-world/article_807da50a-8e12-41ad-b1c8-1660df014de4.html"
    },
    {
        id: 15,
        title: "Weekly Numerology Horoscope For July 14-20: Destiny Number 5 Predictions",
        description: "This comprehensive weekly numerology forecast provides detailed insights for individuals with Destiny Number 5, covering the period from July 14 to July 20. The predictions encompass multiple life aspects including career advancement opportunities, romantic relationships and love compatibility, health and wellness guidance, and financial planning strategies. Additionally, the forecast includes specific recommendations for your lucky colors and fortunate days of the week, along with important cautionary advice to help you navigate potential challenges. These numerological insights are designed to help you make informed decisions and maximize positive outcomes throughout the week.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTEyMjMzIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9InRyYW5zcGFyZW50IiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNMTgwIDEzMGg0MHYyMGgtNDB6IiBmaWxsPSIjZmZkNzAwIi8+CjxwYXRoIGQ9Ik0xODAgMTUwaDIwdjIwaC0yMHoiIGZpbGw9IiNmZmQ3MDAiLz4KPHBhdGggZD0iTTIwMCAxNTBoMjB2MjBoLTIweiIgZmlsbD0iI2ZmZDcwMCIvPgo8cGF0aCBkPSJNMTgwIDE3MGg0MHYyMGgtNDB6IiBmaWxsPSIjZmZkNzAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyNTAiIHI9IjIiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
        source: "Zee News",
        category: "entertainment",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://zeenews.india.com/culture/weekly-numerology-horoscope-for-july-14-20-destiny-number-5-how-this-week-will-turn-in-terms-of-love-finance-health-more-2930795.html"
    },
    {
        id: 16,
        title: "Outcry over plans to reopen quarry at beauty spot",
        description: "Local communities and environmental advocates have voiced strong opposition to controversial plans that would extend the operational life of Burley Hill Quarry, located within an officially designated Area of Outstanding Natural Beauty. The proposed expansion has sparked intense debate about balancing economic interests with environmental conservation, as residents fear the quarry operations will permanently damage the scenic landscape and disrupt local ecosystems. Environmental groups argue that the quarry's continued operation contradicts the fundamental principles of protecting areas recognized for their exceptional natural beauty, while supporters cite economic benefits and job creation as justification for the extension.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmOGZmIi8+CjxwYXRoIGQ9Ik0wIDIwMGw0MDAtMTAwdjEwMEgweiIgZmlsbD0iIzJkN2E0YSIvPgo8cGF0aCBkPSJNMTAwIDE1MGwxMDAtNTBsMTAwIDUwLTEwMCA1MHoiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTEyMCAxNzBsNjAtMzBsNjAgMzAtNjAgMzB6IiBmaWxsPSIjYWFhIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI2ZmZDcwMCIvPgo8L3N2Zz4K",
        source: "BBC News",
        category: "other",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.bbc.com/news/articles/cly8rl2p4y8o"
    },
    {
        id: 17,
        title: "UP TGT Admit Card 2025 To Be Released Soon",
        description: "The Uttar Pradesh Secondary Education Service Selection Board (UPSESSB) is preparing to release the admit cards for the Trained Graduate Teacher (TGT) examination scheduled for 2025. Candidates who have successfully registered for the UP TGT examination can expect to download their hall tickets from the official website at upsessb.pariksha.nic.in in the coming days. The admit card will contain crucial information including the examination date, time, venue details, and specific instructions for candidates. Applicants are advised to regularly check the official website and keep their registration details ready for a smooth download process once the admit cards become available.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTMwIDEyMGg0MHYyMGgtNDB6IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTMwIDE1MGg2MHYyMGgtNjB6IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTMwIDE3MGg0MHYyMGgtNDB6IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyNDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjZmZkNzAwIi8+CjxwYXRoIGQ9Ik0yMzAgMTQwaDIwdjIwaC0yMHoiIGZpbGw9IiMzMzczZGMiLz4KPC9zdmc+Cg==",
        source: "Daily Jagran",
        category: "top",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.thedailyjagran.com/education/up-tgt-admit-card-2025-to-be-out-soon-at-upsessbparikshanicin-check-exam-dates-step-to-download-admit-card-here-10252095"
    },
    {
        id: 18,
        title: "New European Entry And Exit System for Britons Coming to Mallorca",
        description: "British travelers planning visits to Mallorca will soon encounter a new digital border control system as part of enhanced European Union security measures. The European Entry and Exit System (EES) will register comprehensive data from third-country nationals, including advanced biometric information such as facial recognition scans and fingerprint records, as they enter and exit the Schengen area. This technological upgrade aims to streamline border processes while enhancing security protocols, though travelers should expect potentially longer processing times initially. The system represents a significant modernization of EU border controls and will affect all British citizens visiting popular Mediterranean destinations like Mallorca.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmOGZmIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwbDUwLTUwaDEwMGw1MCA1MHYxMDBIMTAweiIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTUwIDEyMGg0MHYyMGgtNDB6IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTUwIDE1MGg2MHYyMGgtNjB6IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTUwIDE4MGg0MHYyMGgtNDB6IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyNDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjZmZkNzAwIi8+CjxwYXRoIGQ9Ik0yMzAgMTQwaDIwdjIwaC0yMHoiIGZpbGw9IiMzMzczZGMiLz4KPC9zdmc+Cg==",
        source: "Majorca Daily Bulletin",
        category: "other",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.majorcadailybulletin.com/holiday/airport/2025/07/12/134691/new-european-entry-and-exit-system-for-britons-will-place-mallorca-this-year.html"
    },
    {
        id: 19,
        title: "'Communist Is Not a Slur': Dipankar Bhattacharya Responds Ahead of Bihar Elections",
        description: "Communist Party of India (Marxist-Leninist) leader Dipankar Bhattacharya has delivered a passionate defense of communist ideology in the lead-up to the Bihar state elections, asserting that 'Hindustan belongs to all of us' regardless of political affiliation. In a comprehensive interview, the CPI(ML) chief addressed critical issues including patriotism, political alliances, and the representation of Muslim communities in Indian politics. Bhattacharya emphasized that communist principles remain relevant in contemporary Indian politics and rejected attempts to use communist ideology as a political attack. His statements come as various parties position themselves ahead of the crucial Bihar electoral contest.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U3NGMzYyIvPgo8cGF0aCBkPSJNMTUwIDEyNWwyNSAyNS0yNSAyNXoiIGZpbGw9IiNmZmQ3MDAiLz4KPHBhdGggZD0iTTIyNSAxMjVsMjUgMjUtMjUgMjV6IiBmaWxsPSIjZmZkNzAwIi8+CjxyZWN0IHg9IjE3NSIgeT0iMTM1IiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIGZpbGw9IiNmZmQ3MDAiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iNzAiIHI9IjIwIiBmaWxsPSIjZmZkNzAwIi8+CjxwYXRoIGQ9Ik0xODAgNTBsMjAgMjAgMjAtMjB6IiBmaWxsPSIjZTc0YzNjIi8+Cjwvc3ZnPgo=",
        source: "The Quint",
        category: "top",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.thequint.com/videos/news-videos/2025-bihar-politics-dipankar-bhattacharya-interview-cpiml-bihar-elections-aimim-communists"
    },
    {
        id: 20,
        title: "BJP Will Form Government In Kerala In 2026: Amit Shah's Bold Declaration",
        description: "Union Home Minister Amit Shah has made a confident political prediction, declaring that the Bharatiya Janata Party (BJP) will successfully form the government in Kerala following the 2026 state elections. During a public address, Shah directly criticized both the ruling Left Democratic Front (LDF) and the opposition United Democratic Front (UDF), suggesting that voters are ready for a significant political change in the state. This bold statement represents the BJP's ambitious expansion strategy into traditionally non-BJP states, as the party seeks to broaden its electoral base beyond its current strongholds. The declaration has intensified political discussions about the BJP's growing influence in South Indian politics.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmNjYwMCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxODAiIHk9IjEzNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSI3MCIgcj0iMjAiIGZpbGw9IiNmZmQ3MDAiLz4KPHBhdGggZD0iTTE4MCA1MGwyMCAyMCAyMC0yMHoiIGZpbGw9IiNmZjY2MDAiLz4KPC9zdmc+Cg==",
        source: "Free Press Journal",
        category: "top",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.freepressjournal.in/india/bjp-will-form-govt-in-kerala-in-2026-amit-shah-targets-ldf-udf-video"
    },
    {
        id: 21,
        title: "Delhi Fire: Major Blaze Engulfs Sadar Bazar Market",
        description: "A significant fire emergency has erupted in Delhi's historic Sadar Bazar market area, prompting an immediate large-scale response from the city's fire department. More than ten fire engines have been deployed to the scene to combat the blaze, which has caused considerable concern among local residents and business owners. The fire has affected multiple commercial establishments in one of Delhi's busiest wholesale markets, raising questions about fire safety protocols and emergency preparedness in crowded commercial areas. Emergency services are working intensively to contain the fire and prevent it from spreading to adjacent buildings and structures.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPgo8cGF0aCBkPSJNMTIwIDEyMGwyMCAzMCAyMC0zMCAyMCAzMCAyMC0zMCAyMCAzMCAyMC0zMHYzMEgxMjB6IiBmaWxsPSIjZmY2NjAwIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwbDEwIDIwIDEwLTIwIDEwIDIwIDEwLTIwIDEwIDIwIDEwLTIwdjIwSDE1MHoiIGZpbGw9IiNmZmQ3MDAiLz4KPHBhdGggZD0iTTE4MCA4MGwxMCAyMCAxMC0yMCAxMCAyMCAxMC0yMHYyMEgxODB6IiBmaWxsPSIjZTc0YzNjIi8+Cjwvc3ZnPgo=",
        source: "Times of India",
        category: "food",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://timesofindia.indiatimes.com/india/delhi-fire-blaze-breaks-out-in-sadar-bazar-more-than-10-fire-engines-on-site/articleshow/122404628.cms"
    },
    {
        id: 22,
        title: "Ben Affleck and Jennifer Garner Share Rare Family Outing at Red Sox Game",
        description: "Former Hollywood couple Ben Affleck and Jennifer Garner demonstrated their commitment to co-parenting by enjoying a rare public family outing at Boston's iconic Fenway Park. The divorced actors, who were married for nearly a decade before separating in 2015, attended a Red Sox game alongside their children Fin (16) and Samuel (13), showcasing their positive relationship as co-parents. Throughout the game, the two were observed laughing and engaging in friendly conversation, emphasizing their successful transition from married couple to collaborative parenting partners. This public appearance highlights their continued dedication to providing a stable, loving environment for their three children despite their romantic relationship ending years ago.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmOGZmIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNzAiIGZpbGw9IiM5ZGMzZTYiLz4KPHBhdGggZD0iTTE2MCAyMDBsMjAtMjAgMjAtMjAgMjAgMjAgMjAgMjB6IiBmaWxsPSIjMmQ3YTRhIi8+CjxjaXJjbGUgY3g9IjE3MCIgY3k9IjEzMCIgcj0iMTUiIGZpbGw9IiM2NjdlZWEiLz4KPGNpcmNsZSBjeD0iMjMwIiBjeT0iMTMwIiByPSIxNSIgZmlsbD0iIzY2N2VlYSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMDAiIHI9IjEwIiBmaWxsPSIjZmZkNzAwIi8+CjxjaXJjbGUgY3g9IjE4NSIgY3k9IjE2NSIgcj0iOCIgZmlsbD0iIzMzNzNkYyIvPgo8Y2lyY2xlIGN4PSIyMTUiIGN5PSIxNjUiIHI9IjgiIGZpbGw9IiMzMzczZGMiLz4KPC9zdmc+Cg==",
        source: "NBC DFW",
        category: "entertainment",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://www.nbcdfw.com/entertainment/entertainment-news/ben-affleck-jennifer-garner-rare-family-outing-red-sox-game/3884073/"
    },
    {
        id: 23,
        title: "Bag the Future: World Paper Bag Day Celebrates Sustainable Packaging",
        description: "World Paper Bag Day, observed annually on July 12, shines a spotlight on the environmental significance of humble paper bags and their role in sustainable packaging solutions. While paper bags might seem like ordinary everyday items, they represent a crucial component in the global effort to reduce plastic waste and promote eco-friendly alternatives. The day serves as an important reminder that individual consumer choices, no matter how small they appear, can have substantial collective environmental impact. Environmental advocates emphasize that choosing paper bags over plastic alternatives contributes to reducing pollution, supporting recyclable materials, and encouraging businesses to adopt more sustainable packaging practices.",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmOGZmIi8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI2Q2OWU2NyIvPgo8cmVjdCB4PSIxNTAiIHk9IjEwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2MyOGI1NCIvPgo8cGF0aCBkPSJNMTcwIDEwMGgxMHYtMjBoMTB2MjBoMTB2LTIwaDEwdjIwaDEwdjMwSDE3MHoiIGZpbGw9IiNjMjhiNTQiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTcwIiByPSIyMCIgZmlsbD0iIzJkN2E0YSIvPgo8cGF0aCBkPSJNMTkwIDE2NWgyMHYxMGgtMjB6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
        source: "The CSR Journal",
        category: "top",
        publishedAt: "2025-07-12T15:00:00Z",
        url: "https://thecsrjournal.in/bag-the-future-why-paper-bags-deserve-a-day/"
    }
];
