# 🎬 CineRate - Movie Review Website

A modern, responsive movie rating and review website built with HTML, CSS, and JavaScript. CineRate allows users to discover movies, read reviews, and write their own reviews with an intuitive star rating system.

## ✨ Features

### 🎯 Core Features

- **Movie Discovery**: Browse featured and top-rated movies
- **Search Functionality**: Find movies by title, genre, or director
- **Review System**: Write and read movie reviews with 5-star ratings
- **Responsive Design**: Works perfectly on all devices
- **Interactive UI**: Smooth animations and transitions

### 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Mobile-First**: Fully responsive navigation with hamburger menu
- **Star Rating**: Interactive star rating system for reviews
- **Modal Windows**: Pop-up windows for movie details and review forms
- **Smooth Scrolling**: Seamless navigation between sections

### 🚀 Interactive Elements

- **Floating Action Button**: Quick access to write reviews
- **Search Bar**: Real-time movie search with Enter key support
- **Movie Cards**: Hover effects and detailed movie information
- **Navigation**: Smooth scrolling navigation with active states
- **Keyboard Shortcuts**:
  - Press 'S' to focus search
  - Press 'R' to open review modal
  - Press 'Escape' to close modals

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**:
  - Flexbox and Grid layouts
  - CSS animations and transitions
  - Custom gradients and effects
  - Responsive design with media queries
- **JavaScript (ES6+)**:
  - DOM manipulation
  - Event handling
  - Local data management
  - Interactive components

## 📁 Project Structure

```
Movie-Review-Website/
├── index.html          # Main HTML file
├── style.css           # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## 🚀 Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/CypherNinjaa/Movie-Review-Website.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd Movie-Review-Website
   ```

3. **Open in your browser**:

   - Simply open `index.html` in any modern web browser
   - Or use a local server (recommended):

     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve
     ```

4. **Access the website**:
   - Direct: Open `index.html` file
   - Local server: `http://localhost:8000`

## 🎯 How to Use

### Browsing Movies

- Scroll through the **Featured Movies** section
- Check out **Top Rated Movies** for the best content
- Use the search bar to find specific movies

### Writing Reviews

1. Click the **floating "+" button** (bottom right)
2. Or click **"Review"** button on any movie card
3. Fill in the review form:
   - Movie title (auto-filled if clicked from a movie)
   - Your name
   - Star rating (click on stars)
   - Review text
4. Submit your review

### Viewing Movie Details

- Click **"Details"** on any movie card
- View comprehensive movie information
- Access cast, director, and plot details

### Navigation

- Use the **top navigation menu** to jump to sections
- **Mobile users**: Click the hamburger menu (☰)
- **Keyboard users**: Use keyboard shortcuts

## 🎨 Customization

### Colors

The website uses a modern color scheme that can be easily customized in `style.css`:

```css
:root {
	--primary-color: #ff6b6b;
	--secondary-color: #667eea;
	--accent-color: #764ba2;
	--text-color: #333;
	--background-color: #f8f9fa;
}
```

### Adding Movies

Add new movies to the `sampleMovies` array in `script.js`:

```javascript
{
    id: 7,
    title: "Your Movie Title",
    genre: "Genre",
    rating: 8.5,
    year: 2024,
    director: "Director Name",
    description: "Movie description...",
    cast: ["Actor 1", "Actor 2"],
    duration: "120 min",
    poster: "image-url"
}
```

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎭 Features Showcase

### Interactive Elements

- **Hover Effects**: Movie cards lift and glow on hover
- **Smooth Animations**: All transitions use CSS animations
- **Loading States**: Visual feedback for user actions
- **Responsive Images**: Placeholder gradients for movie posters

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Semantic HTML structure
- **High Contrast**: Good color contrast ratios
- **Mobile Optimized**: Touch-friendly interface

### Easter Eggs

- Click the logo 5 times for a surprise! 🎬
- Console messages for developers
- Random hero title rotation

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] Movie database API integration
- [ ] Advanced filtering options
- [ ] User profiles and favorites
- [ ] Movie recommendations
- [ ] Comment system for reviews
- [ ] Social sharing features
- [ ] Movie trailers integration

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**CypherNinjaa**

- GitHub: [@CypherNinjaa](https://github.com/CypherNinjaa)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for Poppins font family
- Inspiration from modern movie websites
- Open source community

---

**Made with ❤️ and lots of ☕**

_Happy movie reviewing! 🍿_
