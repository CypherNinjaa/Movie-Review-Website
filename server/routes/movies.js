const express = require('express');
const Movie = require('../../db/models/Movie');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Get all movies (public)
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            genre, 
            search, 
            sortBy = 'createdAt',
            sortOrder = 'desc' 
        } = req.query;

        const query = { status: 'active' };

        // Add genre filter
        if (genre && genre !== 'all') {
            query.genre = { $in: [new RegExp(genre, 'i')] };
        }

        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { synopsis: { $regex: search, $options: 'i' } },
                { 'cast.name': { $regex: search, $options: 'i' } },
                { director: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const movies = await Movie.find(query)
            .populate('addedBy', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Movie.countDocuments(query);

        res.json({
            success: true,
            movies,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get movies error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch movies' 
        });
    }
});

// Get single movie by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findOne({ 
            _id: req.params.id, 
            status: 'active' 
        }).populate('addedBy', 'name email');

        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            });
        }

        res.json({
            success: true,
            movie
        });

    } catch (error) {
        console.error('Get movie error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch movie' 
        });
    }
});

// Create new movie (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            title,
            genre,
            director,
            year,
            synopsis,
            cast,
            crew,
            poster,
            duration,
            language,
            country,
            budget
        } = req.body;

        // Validate required fields
        if (!title || !genre || !director || !year) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide title, genre, director, and year' 
            });
        }

        // Check if movie already exists
        const existingMovie = await Movie.findOne({ 
            title: { $regex: new RegExp('^' + title + '$', 'i') },
            year: year
        });

        if (existingMovie) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie with this title and year already exists' 
            });
        }

        const newMovie = new Movie({
            title: title.trim(),
            genre: Array.isArray(genre) ? genre : [genre],
            director: director.trim(),
            year,
            synopsis: synopsis?.trim() || '',
            cast: cast || [],
            crew: crew || {},
            poster: poster || '',
            duration: duration || 0,
            language: language || 'English',
            country: country || 'USA',
            budget: budget || '',
            addedBy: req.user.userId
        });

        await newMovie.save();

        await newMovie.populate('addedBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Movie created successfully',
            movie: newMovie
        });

    } catch (error) {
        console.error('Create movie error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not create movie' 
        });
    }
});

// Update movie (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            });
        }

        const allowedUpdates = [
            'title', 'genre', 'director', 'year', 'synopsis', 
            'cast', 'crew', 'poster', 'duration', 'language', 
            'country', 'budget', 'status'
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        Object.assign(movie, updates);
        await movie.save();

        await movie.populate('addedBy', 'name email');

        res.json({
            success: true,
            message: 'Movie updated successfully',
            movie
        });

    } catch (error) {
        console.error('Update movie error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not update movie' 
        });
    }
});

// Delete movie (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            });
        }

        // Soft delete by setting status to inactive
        movie.status = 'inactive';
        await movie.save();

        res.json({
            success: true,
            message: 'Movie deleted successfully'
        });

    } catch (error) {
        console.error('Delete movie error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not delete movie' 
        });
    }
});

// Get movies by category/genre (public)
router.get('/category/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const query = { 
            status: 'active',
            genre: { $in: [new RegExp(genre, 'i')] }
        };

        const movies = await Movie.find(query)
            .populate('addedBy', 'name email')
            .sort({ 'ratings.average': -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Movie.countDocuments(query);

        res.json({
            success: true,
            genre,
            movies,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get movies by category error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch movies for this category' 
        });
    }
});

// Get featured/top-rated movies (public)
router.get('/featured/top', async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const movies = await Movie.find({ 
            status: 'active',
            'ratings.count': { $gte: 1 } // Only movies with at least 1 rating
        })
        .populate('addedBy', 'name email')
        .sort({ 'ratings.average': -1, 'ratings.count': -1 })
        .limit(parseInt(limit))
        .exec();

        res.json({
            success: true,
            movies
        });

    } catch (error) {
        console.error('Get featured movies error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch featured movies' 
        });
    }
});

module.exports = router;