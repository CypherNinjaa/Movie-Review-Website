const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100
    },
    helpful: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    reported: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        reasons: [String]
    },
    status: {
        type: String,
        enum: ['active', 'hidden', 'pending'],
        default: 'active'
    },
    spoilerWarning: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Indexes for queries
reviewSchema.index({ movie: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ 'helpful.count': -1 });

// Virtual for review length
reviewSchema.virtual('reviewLength').get(function() {
    return this.review ? this.review.length : 0;
});

// Method to check if user found review helpful
reviewSchema.methods.isHelpfulBy = function(userId) {
    return this.helpful.users.includes(userId);
};

// Method to toggle helpful status
reviewSchema.methods.toggleHelpful = function(userId) {
    const userIndex = this.helpful.users.indexOf(userId);
    
    if (userIndex > -1) {
        // Remove from helpful
        this.helpful.users.splice(userIndex, 1);
        this.helpful.count = Math.max(0, this.helpful.count - 1);
        return false;
    } else {
        // Add to helpful
        this.helpful.users.push(userId);
        this.helpful.count += 1;
        return true;
    }
};

// Method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
    if (!this.reported.users.includes(userId)) {
        this.reported.users.push(userId);
        this.reported.count += 1;
        if (reason) {
            this.reported.reasons.push(reason);
        }
        
        // Auto-hide if too many reports
        if (this.reported.count >= 5) {
            this.status = 'hidden';
        }
    }
};

// Pre-save middleware to update movie ratings
reviewSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('rating')) {
        try {
            const Movie = mongoose.model('Movie');
            const movie = await Movie.findById(this.movie);
            
            if (movie) {
                // If this is an update, get the old rating
                let oldRating = null;
                if (!this.isNew) {
                    const oldReview = await this.constructor.findById(this._id);
                    oldRating = oldReview ? oldReview.rating : null;
                }
                
                movie.updateRating(this.rating, oldRating);
                await movie.save();
            }
        } catch (error) {
            console.error('Error updating movie rating:', error);
        }
    }
    next();
});

// Post-remove middleware to update movie ratings when review is deleted
reviewSchema.post('remove', async function() {
    try {
        const Movie = mongoose.model('Movie');
        const movie = await Movie.findById(this.movie);
        
        if (movie) {
            movie.updateRating(0, this.rating); // Remove the rating
            await movie.save();
        }
    } catch (error) {
        console.error('Error updating movie rating after review removal:', error);
    }
});

module.exports = mongoose.model('Review', reviewSchema);