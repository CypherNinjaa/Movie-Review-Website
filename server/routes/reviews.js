const express = require('express');
const Review = require('../../db/models/Review');
const Movie = require('../../db/models/Movie');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get reviews for a movie (public)
router.get('/movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const reviews = await Review.find({ 
            movie: movieId, 
            status: 'active' 
        })
        .populate('user', 'name email')
        .populate('movie', 'title')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const total = await Review.countDocuments({ 
            movie: movieId, 
            status: 'active' 
        });

        res.json({
            success: true,
            reviews,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get movie reviews error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch reviews' 
        });
    }
});

// Get user's reviews (authenticated)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ 
            user: req.user.userId,
            status: { $ne: 'hidden' }
        })
        .populate('movie', 'title poster year genre')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const total = await Review.countDocuments({ 
            user: req.user.userId,
            status: { $ne: 'hidden' }
        });

        res.json({
            success: true,
            reviews,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch your reviews' 
        });
    }
});

// Create or update review (authenticated)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { movieId, rating, review, title, spoilerWarning } = req.body;

        // Validate input
        if (!movieId || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide movie ID and rating' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Check if movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            });
        }

        // Check if user already reviewed this movie
        let existingReview = await Review.findOne({ 
            user: req.user.userId, 
            movie: movieId 
        });

        if (existingReview) {
            // Update existing review
            const oldRating = existingReview.rating;
            
            existingReview.rating = rating;
            existingReview.review = review?.trim() || '';
            existingReview.title = title?.trim() || '';
            existingReview.spoilerWarning = spoilerWarning || false;
            existingReview.status = 'active';

            await existingReview.save();

            // Update movie rating
            movie.updateRating(rating, oldRating);
            await movie.save();

            await existingReview.populate(['user', 'movie']);

            res.json({
                success: true,
                message: 'Review updated successfully',
                review: existingReview
            });

        } else {
            // Create new review
            const newReview = new Review({
                user: req.user.userId,
                movie: movieId,
                rating,
                review: review?.trim() || '',
                title: title?.trim() || '',
                spoilerWarning: spoilerWarning || false
            });

            await newReview.save();

            // Update movie rating
            movie.updateRating(rating);
            await movie.save();

            await newReview.populate(['user', 'movie']);

            res.status(201).json({
                success: true,
                message: 'Review created successfully',
                review: newReview
            });
        }

    } catch (error) {
        console.error('Create/update review error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not save review' 
        });
    }
});

// Get single review (public)
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findOne({ 
            _id: req.params.id, 
            status: 'active' 
        })
        .populate('user', 'name')
        .populate('movie', 'title poster year');

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Review not found' 
            });
        }

        res.json({
            success: true,
            review
        });

    } catch (error) {
        console.error('Get review error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch review' 
        });
    }
});

// Delete review (authenticated user only their own)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findOne({ 
            _id: req.params.id, 
            user: req.user.userId 
        });

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Review not found or you are not authorized to delete it' 
            });
        }

        const movie = await Movie.findById(review.movie);
        if (movie) {
            // Update movie rating by removing this rating
            movie.updateRating(0, review.rating);
            await movie.save();
        }

        await Review.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not delete review' 
        });
    }
});

// Mark review as helpful (authenticated)
router.post('/:id/helpful', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Review not found' 
            });
        }

        // Prevent users from marking their own reviews as helpful
        if (review.user.toString() === req.user.userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot mark your own review as helpful' 
            });
        }

        const wasHelpful = review.toggleHelpful(req.user.userId);
        await review.save();

        res.json({
            success: true,
            message: wasHelpful ? 'Review marked as helpful' : 'Review unmarked as helpful',
            helpfulCount: review.helpful.count,
            isHelpful: wasHelpful
        });

    } catch (error) {
        console.error('Toggle helpful error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not update helpful status' 
        });
    }
});

// Report review (authenticated)
router.post('/:id/report', authMiddleware, async (req, res) => {
    try {
        const { reason } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                message: 'Review not found' 
            });
        }

        // Prevent users from reporting their own reviews
        if (review.user.toString() === req.user.userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot report your own review' 
            });
        }

        // Check if user already reported this review
        if (review.reported.users.includes(req.user.userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already reported this review' 
            });
        }

        review.reportReview(req.user.userId, reason);
        await review.save();

        res.json({
            success: true,
            message: 'Review reported successfully'
        });

    } catch (error) {
        console.error('Report review error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not report review' 
        });
    }
});

// Get all reviews (admin only)
router.get('/admin/all', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin (this could be moved to middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        const { page = 1, limit = 20, status } = req.query;
        
        const query = {};
        if (status) {
            query.status = status;
        }

        const reviews = await Review.find(query)
            .populate('user', 'name email')
            .populate('movie', 'title')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Review.countDocuments(query);

        res.json({
            success: true,
            reviews,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Could not fetch reviews' 
        });
    }
});

module.exports = router;