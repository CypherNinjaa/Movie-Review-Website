// Sample movie data
const sampleMovies = [
	{
		id: 1,
		title: "The Shawshank Redemption",
		genre: "Drama",
		rating: 9.3,
		year: 1994,
		director: "Frank Darabont",
		description:
			"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
		cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
		duration: "142 min",
		poster: "https://via.placeholder.com/300x450/4a90e2/ffffff?text=Shawshank",
	},
	{
		id: 2,
		title: "The Godfather",
		genre: "Crime, Drama",
		rating: 9.2,
		year: 1972,
		director: "Francis Ford Coppola",
		description:
			"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
		cast: ["Marlon Brando", "Al Pacino", "James Caan"],
		duration: "175 min",
		poster: "https://via.placeholder.com/300x450/8b4513/ffffff?text=Godfather",
	},
	{
		id: 3,
		title: "The Dark Knight",
		genre: "Action, Crime",
		rating: 9.0,
		year: 2008,
		director: "Christopher Nolan",
		description:
			"When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest psychological tests.",
		cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
		duration: "152 min",
		poster:
			"https://via.placeholder.com/300x450/2c3e50/ffffff?text=Dark+Knight",
	},
	{
		id: 4,
		title: "Pulp Fiction",
		genre: "Crime, Drama",
		rating: 8.9,
		year: 1994,
		director: "Quentin Tarantino",
		description:
			"The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
		cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
		duration: "154 min",
		poster:
			"https://via.placeholder.com/300x450/e74c3c/ffffff?text=Pulp+Fiction",
	},
	{
		id: 5,
		title: "Forrest Gump",
		genre: "Drama, Romance",
		rating: 8.8,
		year: 1994,
		director: "Robert Zemeckis",
		description:
			"The presidencies of Kennedy and Johnson through the eyes of an Alabama man with an IQ of 75.",
		cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
		duration: "142 min",
		poster:
			"https://via.placeholder.com/300x450/27ae60/ffffff?text=Forrest+Gump",
	},
	{
		id: 6,
		title: "Inception",
		genre: "Action, Sci-Fi",
		rating: 8.7,
		year: 2010,
		director: "Christopher Nolan",
		description:
			"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
		cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
		duration: "148 min",
		poster: "https://via.placeholder.com/300x450/9b59b6/ffffff?text=Inception",
	},
];

// Sample reviews data
const sampleReviews = [
	{
		id: 1,
		movieTitle: "The Shawshank Redemption",
		rating: 5,
		reviewText:
			"An absolute masterpiece that explores themes of hope, friendship, and redemption. Morgan Freeman's narration is perfect.",
		reviewer: "MovieLover2023",
		date: "2025-07-15",
	},
	{
		id: 2,
		movieTitle: "The Dark Knight",
		rating: 5,
		reviewText:
			"Heath Ledger's Joker is legendary. The movie perfectly balances action with deep psychological themes.",
		reviewer: "BatmanFan",
		date: "2025-07-14",
	},
	{
		id: 3,
		movieTitle: "Inception",
		rating: 4,
		reviewText:
			"Mind-bending and visually stunning. Nolan creates a complex but rewarding narrative about dreams within dreams.",
		reviewer: "SciFiEnthusiast",
		date: "2025-07-13",
	},
	{
		id: 4,
		movieTitle: "Pulp Fiction",
		rating: 5,
		reviewText:
			"Tarantino's non-linear storytelling at its finest. Brilliant dialogue and unforgettable characters.",
		reviewer: "CinemaAddict",
		date: "2025-07-12",
	},
];

// DOM Elements
const movieGrid = document.getElementById("movieGrid");
const topRatedGrid = document.getElementById("topRatedGrid");
const reviewsGrid = document.getElementById("reviewsGrid");
const searchInput = document.getElementById("movieSearch");
const searchBtn = document.getElementById("searchBtn");
const reviewModal = document.getElementById("reviewModal");
const movieModal = document.getElementById("movieModal");
const addReviewBtn = document.getElementById("addReviewBtn");
const reviewForm = document.getElementById("reviewForm");
const starRating = document.getElementById("starRating");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// State
let currentRating = 0;
let reviews = [...sampleReviews];
let filteredMovies = [...sampleMovies];

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
	renderMovies();
	renderTopRated();
	renderReviews();
	setupEventListeners();
	setupSmoothScrolling();
});

// Setup event listeners
function setupEventListeners() {
	// Mobile menu toggle
	hamburger.addEventListener("click", () => {
		navMenu.classList.toggle("active");
	});

	// Close mobile menu when clicking on a link
	document.querySelectorAll(".nav-link").forEach((link) => {
		link.addEventListener("click", () => {
			navMenu.classList.remove("active");
		});
	});

	// Search functionality
	searchBtn.addEventListener("click", handleSearch);
	searchInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	});

	// Modal controls
	addReviewBtn.addEventListener("click", () => {
		reviewModal.style.display = "block";
	});

	// Close modals
	document.querySelectorAll(".close").forEach((closeBtn) => {
		closeBtn.addEventListener("click", (e) => {
			e.target.closest(".modal").style.display = "none";
		});
	});

	// Close modal when clicking outside
	window.addEventListener("click", (e) => {
		if (e.target.classList.contains("modal")) {
			e.target.style.display = "none";
		}
	});

	// Star rating functionality
	setupStarRating();

	// Review form submission
	reviewForm.addEventListener("submit", handleReviewSubmission);

	// Header scroll effect
	window.addEventListener("scroll", () => {
		const header = document.querySelector(".header");
		if (window.scrollY > 100) {
			header.style.background = "rgba(0, 0, 0, 0.98)";
		} else {
			header.style.background = "rgba(0, 0, 0, 0.95)";
		}
	});
}

// Render movies in the grid
function renderMovies() {
	movieGrid.innerHTML = "";
	filteredMovies.forEach((movie) => {
		const movieCard = createMovieCard(movie);
		movieGrid.appendChild(movieCard);
	});
}

// Render top rated movies
function renderTopRated() {
	const topMovies = [...sampleMovies]
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 3);

	topRatedGrid.innerHTML = "";
	topMovies.forEach((movie) => {
		const movieCard = createMovieCard(movie, true);
		topRatedGrid.appendChild(movieCard);
	});
}

// Create movie card element
function createMovieCard(movie, isTopRated = false) {
	const card = document.createElement("div");
	card.className = "movie-card";
	card.innerHTML = `
        <div class="movie-poster">
            <div class="rating-badge">
                <i class="fas fa-star"></i>
                ${movie.rating}
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-genre">${movie.genre} • ${movie.year}</p>
            <p class="movie-description">${movie.description.substring(
							0,
							120
						)}...</p>
            <div class="movie-actions">
                <button class="btn btn-primary" onclick="showMovieDetails(${
									movie.id
								})">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
                <button class="btn btn-outline" onclick="openReviewModal('${
									movie.title
								}')">
                    <i class="fas fa-star"></i>
                    Review
                </button>
            </div>
        </div>
    `;

	return card;
}

// Show movie details modal
function showMovieDetails(movieId) {
	const movie = sampleMovies.find((m) => m.id === movieId);
	if (!movie) return;

	const movieDetailsContent = document.getElementById("movieDetailsContent");
	movieDetailsContent.innerHTML = `
        <div class="movie-detail-header">
            <div class="movie-detail-poster">
                <div style="width: 200px; height: 300px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">🎬</div>
            </div>
            <div class="movie-detail-info">
                <h2>${movie.title}</h2>
                <div class="movie-meta">
                    <span class="rating">
                        <i class="fas fa-star" style="color: #ffd700;"></i>
                        ${movie.rating}/10
                    </span>
                    <span>${movie.year}</span>
                    <span>${movie.duration}</span>
                </div>
                <p class="genre">${movie.genre}</p>
                <p class="director"><strong>Director:</strong> ${
									movie.director
								}</p>
                <p class="cast"><strong>Cast:</strong> ${movie.cast.join(
									", "
								)}</p>
            </div>
        </div>
        <div class="movie-description">
            <h3>Plot Summary</h3>
            <p>${movie.description}</p>
        </div>
        <div class="movie-actions" style="margin-top: 2rem;">
            <button class="btn btn-primary" onclick="openReviewModal('${
							movie.title
						}')">
                <i class="fas fa-star"></i>
                Write Review
            </button>
        </div>
    `;

	// Add CSS for movie details
	const style = document.createElement("style");
	style.textContent = `
        .movie-detail-header {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        .movie-detail-info h2 {
            margin-bottom: 1rem;
            color: #333;
        }
        .movie-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        .movie-meta span {
            background: #f0f0f0;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.9rem;
        }
        .rating {
            background: #fff3cd !important;
            color: #856404;
        }
        .genre, .director, .cast {
            margin-bottom: 0.8rem;
            line-height: 1.6;
        }
        .movie-description h3 {
            margin-bottom: 1rem;
            color: #333;
        }
        @media (max-width: 768px) {
            .movie-detail-header {
                flex-direction: column;
                text-align: center;
            }
            .movie-detail-poster {
                align-self: center;
            }
        }
    `;
	document.head.appendChild(style);

	movieModal.style.display = "block";
}

// Handle search functionality
function handleSearch() {
	const searchTerm = searchInput.value.toLowerCase().trim();

	if (searchTerm === "") {
		filteredMovies = [...sampleMovies];
	} else {
		filteredMovies = sampleMovies.filter(
			(movie) =>
				movie.title.toLowerCase().includes(searchTerm) ||
				movie.genre.toLowerCase().includes(searchTerm) ||
				movie.director.toLowerCase().includes(searchTerm)
		);
	}

	renderMovies();

	// Scroll to movies section
	document.getElementById("movies").scrollIntoView({
		behavior: "smooth",
	});
}

// Setup star rating functionality
function setupStarRating() {
	const stars = starRating.querySelectorAll("i");

	stars.forEach((star, index) => {
		star.addEventListener("mouseover", () => {
			highlightStars(index + 1);
		});

		star.addEventListener("click", () => {
			currentRating = index + 1;
			document.getElementById("ratingValue").value = currentRating;
			setStarRating(currentRating);
		});
	});

	starRating.addEventListener("mouseleave", () => {
		setStarRating(currentRating);
	});
}

// Highlight stars on hover
function highlightStars(rating) {
	const stars = starRating.querySelectorAll("i");
	stars.forEach((star, index) => {
		if (index < rating) {
			star.classList.add("active");
		} else {
			star.classList.remove("active");
		}
	});
}

// Set star rating
function setStarRating(rating) {
	const stars = starRating.querySelectorAll("i");
	stars.forEach((star, index) => {
		if (index < rating) {
			star.classList.add("active");
		} else {
			star.classList.remove("active");
		}
	});
}

// Open review modal with movie title
function openReviewModal(movieTitle = "") {
	document.getElementById("movieTitle").value = movieTitle;
	reviewModal.style.display = "block";
}

// Handle review form submission
function handleReviewSubmission(e) {
	e.preventDefault();

	const movieTitle = document.getElementById("movieTitle").value;
	const reviewerName = document.getElementById("reviewerName").value;
	const reviewText = document.getElementById("reviewText").value;
	const rating = parseInt(document.getElementById("ratingValue").value);

	if (rating === 0) {
		alert("Please select a rating");
		return;
	}

	// Create new review
	const newReview = {
		id: reviews.length + 1,
		movieTitle,
		rating,
		reviewText,
		reviewer: reviewerName,
		date: new Date().toISOString().split("T")[0],
	};

	// Add to reviews array
	reviews.unshift(newReview);

	// Re-render reviews
	renderReviews();

	// Reset form
	reviewForm.reset();
	currentRating = 0;
	setStarRating(0);

	// Close modal
	reviewModal.style.display = "none";

	// Show success message
	showNotification("Review submitted successfully!");
}

// Render reviews
function renderReviews() {
	reviewsGrid.innerHTML = "";
	reviews.slice(0, 6).forEach((review) => {
		const reviewCard = createReviewCard(review);
		reviewsGrid.appendChild(reviewCard);
	});
}

// Create review card element
function createReviewCard(review) {
	const card = document.createElement("div");
	card.className = "review-card";

	const stars = Array(5)
		.fill()
		.map(
			(_, i) =>
				`<i class="fas fa-star${
					i < review.rating ? "" : " star-empty"
				}" style="color: ${i < review.rating ? "#ffd700" : "#ddd"}"></i>`
		)
		.join("");

	card.innerHTML = `
        <div class="review-header">
            <h4 class="review-movie">${review.movieTitle}</h4>
            <div class="review-rating">${stars}</div>
        </div>
        <p class="review-text">"${review.reviewText}"</p>
        <p class="review-author">— ${review.reviewer}</p>
    `;

	return card;
}

// Show notification
function showNotification(message) {
	const notification = document.createElement("div");
	notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
	notification.textContent = message;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.style.animation = "slideOutRight 0.3s ease";
		setTimeout(() => {
			document.body.removeChild(notification);
		}, 300);
	}, 3000);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute("href"));
			if (target) {
				target.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		});
	});
}

// Add slide animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .star-empty {
        color: #ddd !important;
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
	threshold: 0.1,
	rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.style.animation = "fadeInUp 0.6s ease forwards";
		}
	});
}, observerOptions);

// Observe elements for animation
window.addEventListener("load", () => {
	document
		.querySelectorAll(".movie-card, .review-card, .feature")
		.forEach((el) => {
			observer.observe(el);
		});
});

// Contact form handler
document.addEventListener("DOMContentLoaded", function () {
	const contactForm = document.querySelector(".contact-form");
	if (contactForm) {
		contactForm.addEventListener("submit", function (e) {
			e.preventDefault();
			showNotification(
				"Message sent successfully! We'll get back to you soon."
			);
			this.reset();
		});
	}
});

// Add loading states
function showLoading(element) {
	element.innerHTML = '<div class="loading"></div>';
}

// Random quote generator for hero section
const movieQuotes = [
	"Discover Your Next Favorite Movie",
	"Where Cinema Comes Alive",
	"Your Guide to Great Movies",
	"Explore the World of Cinema",
	"Find Movies You'll Love",
];

// Update hero title occasionally
setInterval(() => {
	const heroTitle = document.querySelector(".hero h1");
	if (heroTitle) {
		const randomQuote =
			movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
		heroTitle.textContent = randomQuote;
	}
}, 10000);

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
	// Press 'S' to focus search
	if (e.key === "s" || e.key === "S") {
		if (!e.ctrlKey && !e.altKey && !e.target.matches("input, textarea")) {
			e.preventDefault();
			searchInput.focus();
		}
	}

	// Press 'R' to open review modal
	if (e.key === "r" || e.key === "R") {
		if (!e.ctrlKey && !e.altKey && !e.target.matches("input, textarea")) {
			e.preventDefault();
			reviewModal.style.display = "block";
		}
	}

	// Press 'Escape' to close modals
	if (e.key === "Escape") {
		document.querySelectorAll(".modal").forEach((modal) => {
			modal.style.display = "none";
		});
	}
});

// Add some easter eggs
let clickCount = 0;
document.querySelector(".logo").addEventListener("click", function () {
	clickCount++;
	if (clickCount === 5) {
		showNotification("🎬 You found the easter egg! You're a true movie lover!");
		clickCount = 0;
	}
});

console.log(
	'🎬 Welcome to CineRate! Press "S" to search, "R" to write a review, or click the logo 5 times for a surprise!'
);
