# GitHub Copilot Workshop Participants Directory

A clean, modern web application to showcase GitHub Copilot workshop participants with their GitHub profile information.

![Workshop Directory](https://img.shields.io/badge/Workshop-GitHub%20Copilot-blue?style=for-the-badge&logo=github)

## 🚀 Features

- **📊 GitHub Integration**: Automatically fetches participant data from GitHub API
- **🎨 Modern Design**: Clean, responsive design inspired by modern portfolio websites
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ Fast Loading**: Optimized performance with proper loading states
- **♿ Accessible**: Built with accessibility best practices
- **🔧 Configurable**: Easy to customize through config.json

## 📋 Project Structure

```
BLR-070625/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with CSS custom properties
├── script.js           # JavaScript functionality
├── config.json         # Configuration file with participant usernames
└── README.md          # This file
```

## ⚙️ Configuration

Edit the `config.json` file to customize your workshop:

```json
{
  "title": "GitHub Copilot Workshop Participants",
  "description": "Meet the amazing developers in our GitHub Copilot workshop - Bangalore, June 7, 2025",
  "participants": [
    "octocat",
    "torvalds",
    "gaearon",
    "sindresorhus",
    "addyosmani"
  ]
}
```

### Configuration Options

- **title**: Workshop title displayed on the page
- **description**: Subtitle/description text
- **participants**: Array of GitHub usernames to display

## 🛠️ How to Use

1. **Clone or download** this project to your local machine
2. **Edit** `config.json` with your workshop details and participant GitHub usernames
3. **Open** `index.html` in a web browser
4. **Share** the link with your workshop participants!

### For Local Development

If you want to run this locally with a web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎨 Customization

### Adding Participants

Simply add GitHub usernames to the `participants` array in `config.json`:

```json
{
  "participants": [
    "username1",
    "username2",
    "username3"
  ]
}
```

### Styling

The app uses CSS custom properties (variables) for easy theming. Key variables in `styles.css`:

```css
:root {
  --primary-color: #2563eb;      /* Main accent color */
  --background-color: #f8fafc;   /* Page background */
  --card-background: #ffffff;    /* Card backgrounds */
  --text-color: #1e293b;        /* Main text color */
  --text-muted: #64748b;        /* Secondary text */
}
```

## 🌟 Features in Detail

### GitHub API Integration
- Fetches real-time data including profile pictures, names, bios, and statistics
- Handles rate limiting gracefully
- Shows repository count, followers, and following stats

### Modern UI/UX
- Card-based layout with hover effects
- Smooth animations and transitions
- Loading states and error handling
- Staggered card animations for visual appeal

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### Performance
- Lazy loading of images
- Efficient API calls with error handling
- Minimal bundle size (no external dependencies)
- Optimized for Core Web Vitals

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid, Flexbox, and Custom Properties
- **Vanilla JavaScript**: ES6+ features, async/await, fetch API
- **GitHub REST API**: User data retrieval

### Browser Support
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers

### API Rate Limits
- GitHub API allows 60 requests/hour without authentication
- For workshops with many participants, consider implementing GitHub OAuth

## 🚨 Troubleshooting

### Common Issues

**Participants not loading:**
- Check that usernames in `config.json` are correct
- Verify internet connection
- Check browser console for errors

**Rate limit exceeded:**
- Wait an hour for the rate limit to reset
- Reduce number of participants temporarily
- Consider implementing GitHub authentication

**Styling issues:**
- Ensure all files are in the same directory
- Check that `styles.css` is loading properly
- Verify browser compatibility

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📞 Support

For workshop-related questions or technical support, please create an issue in the repository.

---

**Made with ❤️ for the GitHub Copilot Workshop - Bangalore 2025**
