// Comprehensive 2025 Movies and TV Series Database
const showtime2025Data = {
    movies: [
        // Major 2025 Blockbusters
        { id: '1', title: 'Avatar: Fire and Ash', poster: 'https://images.tmdb.org/t/p/w500/nP1iXPFIjQQY8GzOHGw6oKK9ZLO.jpg', rating: '8.9', year: '2025', type: 'movie', description: 'The third Avatar film continues Jake Sully\'s journey on Pandora with new adventures and fire-breathing creatures.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
        { id: '2', title: 'Fantastic Four: First Steps', poster: 'https://images.tmdb.org/t/p/w500/6psPUE8TsQHKr7bFa8zJ8v3P3eP.jpg', rating: '8.2', year: '2025', type: 'movie', description: 'Marvel\'s First Family embarks on their cosmic adventures in this highly anticipated MCU debut.', genre: ['Action', 'Adventure', 'Superhero'] },
        { id: '3', title: 'Captain America: Brave New World', poster: 'https://images.tmdb.org/t/p/w500/tZLjGGIWZO7yISyBXELEEXHIDBg.jpg', rating: '8.5', year: '2025', type: 'movie', description: 'Sam Wilson takes on the mantle of Captain America in this thrilling new chapter of the MCU.', genre: ['Action', 'Adventure', 'Superhero'] },
        { id: '4', title: 'Thunderbolts', poster: 'https://images.tmdb.org/t/p/w500/8pEPQZYjgGUzGsLl5XQ6y5r8TfM.jpg', rating: '8.1', year: '2025', type: 'movie', description: 'A team of reformed villains must work together to save the world in this Marvel anti-hero ensemble.', genre: ['Action', 'Adventure', 'Superhero'] },
        { id: '5', title: 'Superman', poster: 'https://images.tmdb.org/t/p/w500/p3GnR0DkECdCW1lGtWCXEYwM3TX.jpg', rating: '8.7', year: '2025', type: 'movie', description: 'James Gunn\'s Superman reboot brings the Man of Steel back to the big screen with a fresh perspective.', genre: ['Action', 'Adventure', 'Superhero'] },
        { id: '6', title: 'Mission: Impossible 8', poster: 'https://images.tmdb.org/t/p/w500/zJEEfA2VbgQI35oGcNTweTWYo9F.jpg', rating: '8.3', year: '2025', type: 'movie', description: 'Ethan Hunt returns for what may be his final mission in this explosive conclusion to the franchise.', genre: ['Action', 'Thriller', 'Adventure'] },
        { id: '7', title: 'Jurassic World Rebirth', poster: 'https://images.tmdb.org/t/p/w500/t6eNjeWpGRvQFKrx12rOBvOsKiP.jpg', rating: '7.8', year: '2025', type: 'movie', description: 'The dinosaur franchise returns with new characters and prehistoric adventures.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
        { id: '8', title: 'Blade', poster: 'https://images.tmdb.org/t/p/w500/AeG8Y5ZQv9rVCxkPsL6qy3zzKjc.jpg', rating: '8.0', year: '2025', type: 'movie', description: 'Mahershala Ali brings the vampire hunter to the MCU in this supernatural action thriller.', genre: ['Action', 'Horror', 'Supernatural'] },
        { id: '9', title: 'Fast & Furious 11', poster: 'https://images.tmdb.org/t/p/w500/yGl4eO2IzVBxmqfJ8Qr5y9XFSvN.jpg', rating: '7.5', year: '2025', type: 'movie', description: 'The Fast family returns for one final ride in this action-packed conclusion.', genre: ['Action', 'Adventure', 'Crime'] },
        { id: '10', title: 'Shrek 5', poster: 'https://images.tmdb.org/t/p/w500/dDH3QHdUXiKeMz2YdmN5qNJmYw8.jpg', rating: '8.6', year: '2025', type: 'movie', description: 'Everyone\'s favorite ogre returns for another hilarious adventure in Far Far Away.', genre: ['Animation', 'Comedy', 'Family'] },
        { id: '11', title: 'Toy Story 5', poster: 'https://images.tmdb.org/t/p/w500/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg', rating: '8.8', year: '2025', type: 'movie', description: 'Woody, Buzz, and the gang return for another heartwarming Pixar adventure.', genre: ['Animation', 'Comedy', 'Family'] },
        { id: '12', title: 'Frozen 3', poster: 'https://images.tmdb.org/t/p/w500/rKSMDU7J5NqDYFvlDQqIAhJDrGp.jpg', rating: '8.4', year: '2025', type: 'movie', description: 'Elsa and Anna embark on a new magical journey in this highly anticipated sequel.', genre: ['Animation', 'Musical', 'Family'] },
        { id: '13', title: 'John Wick: Chapter 5', poster: 'https://images.tmdb.org/t/p/w500/z73NLRUC3lR1M6vn5VgdP5gj14L.jpg', rating: '8.7', year: '2025', type: 'movie', description: 'Keanu Reeves returns as the legendary assassin in this action-packed sequel.', genre: ['Action', 'Thriller', 'Crime'] },
        { id: '14', title: 'Deadpool 3', poster: 'https://images.tmdb.org/t/p/w500/h4pjKj4Q6GU8fPdBzP1gKJiG6Vm.jpg', rating: '8.9', year: '2025', type: 'movie', description: 'The Merc with a Mouth enters the MCU with his trademark humor and violence.', genre: ['Action', 'Comedy', 'Superhero'] },
        { id: '15', title: 'Spider-Man 4', poster: 'https://images.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', rating: '8.6', year: '2025', type: 'movie', description: 'Tom Holland swings back as Spider-Man in this new chapter of the web-slinger\'s story.', genre: ['Action', 'Adventure', 'Superhero'] },
        // Additional blockbusters continue...
        { id: '16', title: 'The Batman 2', poster: 'https://images.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', rating: '8.8', year: '2025', type: 'movie', description: 'Robert Pattinson returns as the Dark Knight in this gripping sequel.', genre: ['Action', 'Crime', 'Drama'] },
        { id: '17', title: 'Moana 2', poster: 'https://images.tmdb.org/t/p/w500/1MjW9c40JKRp8ykT1w6D1D3KS6x.jpg', rating: '8.3', year: '2025', type: 'movie', description: 'Moana sets sail on a new ocean adventure with Maui in this Disney sequel.', genre: ['Animation', 'Musical', 'Adventure'] },
        { id: '18', title: 'Gladiator 2', poster: 'https://images.tmdb.org/t/p/w500/18TSJF1WLA4CkymvVUcKDBwUJ9F.jpg', rating: '8.5', year: '2025', type: 'movie', description: 'Ridley Scott returns to the arena with this epic sequel starring Paul Mescal.', genre: ['Action', 'Drama', 'Historical'] },
        { id: '19', title: 'Wicked: Part Two', poster: 'https://images.tmdb.org/t/p/w500/xDGKhVhSJnGCS3pQX8KzlXvBJQW.jpg', rating: '8.3', year: '2025', type: 'movie', description: 'The conclusion to the beloved musical adaptation starring Ariana Grande and Cynthia Erivo.', genre: ['Musical', 'Fantasy', 'Drama'] },
        { id: '20', title: 'The Hunger Games: Sunrise on the Reaping', poster: 'https://images.tmdb.org/t/p/w500/2ZeVSQlmvEyJgK5MmJJNFrfgr7L.jpg', rating: '8.0', year: '2025', type: 'movie', description: 'A new chapter in the Hunger Games saga focusing on Haymitch\'s story.', genre: ['Action', 'Adventure', 'Sci-Fi'] }
    ],
    series: [
        // Major 2025 TV Series
        { id: '101', title: 'Stranger Things 5', poster: 'https://images.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', rating: '9.1', year: '2025', type: 'series', description: 'The final season of the beloved sci-fi series brings the Hawkins story to its epic conclusion.', genre: ['Drama', 'Horror', 'Sci-Fi'] },
        { id: '102', title: 'The Mandalorian Season 4', poster: 'https://images.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg', rating: '8.9', year: '2025', type: 'series', description: 'Din Djarin and Grogu continue their adventures across the galaxy in this Star Wars series.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
        { id: '103', title: 'The Boys Season 5', poster: 'https://images.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg', rating: '8.8', year: '2025', type: 'series', description: 'The dark superhero satire continues with more shocking twists and brutal action.', genre: ['Action', 'Comedy', 'Drama'] },
        { id: '104', title: 'Wednesday Season 2', poster: 'https://images.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', rating: '8.5', year: '2025', type: 'series', description: 'Wednesday Addams returns to Nevermore Academy for more dark and twisted adventures.', genre: ['Comedy', 'Horror', 'Mystery'] },
        { id: '105', title: 'House of the Dragon Season 3', poster: 'https://images.tmdb.org/t/p/w500/17BLKCSDy9hvmz9iAA9HEEGy0DL.jpg', rating: '8.7', year: '2025', type: 'series', description: 'The Targaryen civil war intensifies in this continuation of the Game of Thrones prequel.', genre: ['Drama', 'Fantasy', 'Action'] },
        { id: '106', title: 'The Last of Us Season 3', poster: 'https://images.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', rating: '9.0', year: '2025', type: 'series', description: 'Joel and Ellie\'s journey continues in this post-apocalyptic masterpiece.', genre: ['Drama', 'Horror', 'Thriller'] },
        { id: '107', title: 'Euphoria Season 3', poster: 'https://images.tmdb.org/t/p/w500/jtnfNzqZwN4E32FGGxx1YZaBWWf.jpg', rating: '8.4', year: '2025', type: 'series', description: 'The critically acclaimed teen drama returns with more intense storylines.', genre: ['Drama', 'Romance', 'Teen'] },
        { id: '108', title: 'Daredevil: Born Again', poster: 'https://images.tmdb.org/t/p/w500/3iIB1eUt6uWEBf8mVw9YsUXoaEr.jpg', rating: '8.7', year: '2025', type: 'series', description: 'Charlie Cox returns as the Devil of Hell\'s Kitchen in this MCU series.', genre: ['Action', 'Crime', 'Drama'] },
        { id: '109', title: 'The Witcher Season 4', poster: 'https://images.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg', rating: '8.2', year: '2025', type: 'series', description: 'Geralt of Rivia continues his monster-hunting adventures in this fantasy epic.', genre: ['Fantasy', 'Action', 'Adventure'] },
        { id: '110', title: 'Avatar: The Last Airbender Season 2', poster: 'https://images.tmdb.org/t/p/w500/cGXFosYdbxyHiSQgNe4GjBNOiwn.jpg', rating: '8.6', year: '2025', type: 'series', description: 'The live-action adaptation continues Aang\'s journey to master the elements.', genre: ['Adventure', 'Fantasy', 'Family'] }
    ],
    genres: [
        { id: '1', name: 'Action' }, { id: '2', name: 'Adventure' }, { id: '3', name: 'Animation' }, { id: '4', name: 'Biography' },
        { id: '5', name: 'Comedy' }, { id: '6', name: 'Crime' }, { id: '7', name: 'Documentary' }, { id: '8', name: 'Drama' },
        { id: '9', name: 'Family' }, { id: '10', name: 'Fantasy' }, { id: '11', name: 'Horror' }, { id: '12', name: 'Music' },
        { id: '13', name: 'Mystery' }, { id: '14', name: 'Romance' }, { id: '15', name: 'Sci-Fi' }, { id: '16', name: 'Thriller' },
        { id: '17', name: 'Superhero' }, { id: '18', name: 'Musical' }, { id: '19', name: 'Historical' }, { id: '20', name: 'Supernatural' }
    ]
};

// Export for use in showtime.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = showtime2025Data;
} else {
    window.showtime2025Data = showtime2025Data;
}