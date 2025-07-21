const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../db/models/User');
const Movie = require('../../db/models/Movie');

const router = express.Router();

// Initialize sample data (development only)
router.post('/init', async (req, res) => {
    try {
        // Check if we're in development mode
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ 
                success: false, 
                message: 'This endpoint is only available in development mode' 
            });
        }

        // Create admin user if doesn't exist
        let admin = await User.findOne({ email: 'admin@cinemavault.com' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            admin = new User({
                name: 'Admin User',
                email: 'admin@cinemavault.com',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created');
        }

        // Create sample user if doesn't exist
        let user = await User.findOne({ email: 'user@cinemavault.com' });
        if (!user) {
            const hashedPassword = await bcrypt.hash('user123', 12);
            user = new User({
                name: 'Demo User',
                email: 'user@cinemavault.com',
                password: hashedPassword,
                role: 'user'
            });
            await user.save();
            console.log('Sample user created');
        }

        // Create sample movies if they don't exist
        const sampleMovies = [
            {
                title: "The Shawshank Redemption",
                genre: ["Drama"],
                director: "Frank Darabont",
                year: 1994,
                synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                cast: [
                    { name: "Tim Robbins", role: "Andy Dufresne" },
                    { name: "Morgan Freeman", role: "Ellis Boyd 'Red' Redding" }
                ],
                crew: {
                    producer: "Niki Marvin",
                    music: "Thomas Newman",
                    cinematography: "Roger Deakins"
                },
                duration: 142,
                poster: "/images/placeholder-movie.svg",
                addedBy: admin._id
            },
            {
                title: "The Dark Knight",
                genre: ["Action", "Crime", "Drama"],
                director: "Christopher Nolan",
                year: 2008,
                synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                cast: [
                    { name: "Christian Bale", role: "Bruce Wayne / Batman" },
                    { name: "Heath Ledger", role: "The Joker" },
                    { name: "Aaron Eckhart", role: "Harvey Dent / Two-Face" }
                ],
                crew: {
                    producer: "Emma Thomas",
                    music: "Hans Zimmer",
                    cinematography: "Wally Pfister"
                },
                duration: 152,
                poster: "/images/placeholder-movie.svg",
                addedBy: admin._id
            },
            {
                title: "Pulp Fiction",
                genre: ["Crime", "Drama"],
                director: "Quentin Tarantino",
                year: 1994,
                synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                cast: [
                    { name: "John Travolta", role: "Vincent Vega" },
                    { name: "Samuel L. Jackson", role: "Jules Winnfield" },
                    { name: "Uma Thurman", role: "Mia Wallace" }
                ],
                crew: {
                    producer: "Lawrence Bender",
                    music: "Various Artists",
                    cinematography: "Andrzej Sekula"
                },
                duration: 154,
                poster: "/images/placeholder-movie.svg",
                addedBy: admin._id
            },
            {
                title: "Inception",
                genre: ["Action", "Sci-Fi", "Thriller"],
                director: "Christopher Nolan",
                year: 2010,
                synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                cast: [
                    { name: "Leonardo DiCaprio", role: "Dom Cobb" },
                    { name: "Marion Cotillard", role: "Mal" },
                    { name: "Tom Hardy", role: "Eames" }
                ],
                crew: {
                    producer: "Emma Thomas",
                    music: "Hans Zimmer",
                    cinematography: "Wally Pfister"
                },
                duration: 148,
                poster: "/images/placeholder-movie.svg",
                addedBy: admin._id
            },
            {
                title: "The Godfather",
                genre: ["Crime", "Drama"],
                director: "Francis Ford Coppola",
                year: 1972,
                synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                cast: [
                    { name: "Marlon Brando", role: "Don Vito Corleone" },
                    { name: "Al Pacino", role: "Michael Corleone" },
                    { name: "James Caan", role: "Sonny Corleone" }
                ],
                crew: {
                    producer: "Albert S. Ruddy",
                    music: "Nino Rota",
                    cinematography: "Gordon Willis"
                },
                duration: 175,
                poster: "/images/placeholder-movie.svg",
                addedBy: admin._id
            },
            {
                title: "Finding Nemo",
                genre: ["Animation", "Adventure", "Comedy"],
                director: "Andrew Stanton",
                year: 2003,
                synopsis: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
                cast: [
                    { name: "Albert Brooks", role: "Marlin (voice)" },
                    { name: "Ellen DeGeneres", role: "Dory (voice)" },
                    { name: "Alexander Gould", role: "Nemo (voice)" }
                ],
                crew: {
                    producer: "Graham Walters",
                    music: "Thomas Newman",
                    cinematography: "Sharon Calahan"
                },
                duration: 100,
                poster: "/images/placeholder-movie.svg",
                addedBy: admin._id
            }
        ];

        let createdMovies = 0;
        for (const movieData of sampleMovies) {
            const existingMovie = await Movie.findOne({ 
                title: movieData.title,
                year: movieData.year 
            });
            
            if (!existingMovie) {
                const movie = new Movie(movieData);
                await movie.save();
                createdMovies++;
            }
        }

        res.json({
            success: true,
            message: 'Sample data initialized successfully',
            data: {
                adminUser: 'admin@cinemavault.com (password: admin123)',
                sampleUser: 'user@cinemavault.com (password: user123)',
                moviesCreated: createdMovies,
                totalMovies: await Movie.countDocuments()
            }
        });

    } catch (error) {
        console.error('Init sample data error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not initialize sample data' 
        });
    }
});

module.exports = router;