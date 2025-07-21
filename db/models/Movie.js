const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: [String],
        required: true
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 5
    },
    poster: {
        type: String,
        default: ''
    },
    synopsis: {
        type: String,
        default: ''
    },
    cast: [{
        name: String,
        role: String
    }],
    crew: {
        producer: String,
        music: String,
        cinematography: String,
        writer: String
    },
    budget: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    language: {
        type: String,
        default: 'English'
    },
    country: {
        type: String,
        default: 'USA'
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        },
        distribution: {
            five: { type: Number, default: 0 },
            four: { type: Number, default: 0 },
            three: { type: Number, default: 0 },
            two: { type: Number, default: 0 },
            one: { type: Number, default: 0 }
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ year: 1 });
movieSchema.index({ 'ratings.average': -1 });
movieSchema.index({ createdAt: -1 });

// Virtual for formatted year
movieSchema.virtual('formattedYear').get(function() {
    return this.year.toString();
});

// Method to update average rating
movieSchema.methods.updateRating = function(newRating, oldRating = null) {
    const distribution = this.ratings.distribution;
    
    // Remove old rating if updating
    if (oldRating) {
        const oldKey = ['one', 'two', 'three', 'four', 'five'][oldRating - 1];
        distribution[oldKey] = Math.max(0, distribution[oldKey] - 1);
        this.ratings.count = Math.max(0, this.ratings.count - 1);
    }
    
    // Add new rating
    const newKey = ['one', 'two', 'three', 'four', 'five'][newRating - 1];
    distribution[newKey] += 1;
    this.ratings.count += 1;
    
    // Calculate new average
    const total = (distribution.one * 1) + 
                  (distribution.two * 2) + 
                  (distribution.three * 3) + 
                  (distribution.four * 4) + 
                  (distribution.five * 5);
    
    this.ratings.average = this.ratings.count > 0 ? 
        Math.round((total / this.ratings.count) * 10) / 10 : 0;
};

module.exports = mongoose.model('Movie', movieSchema);