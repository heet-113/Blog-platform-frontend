# Blog Platform Frontend

React-based frontend for the Blog Platform application.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Build for Production
```bash
npm run build
```

## Deploy to GitHub Pages

### 1. Update `package.json`
Change the `homepage` field to your GitHub Pages URL:
```json
"homepage": "https://yourusername.github.io/blog-platform"
```

### 2. Install gh-pages
```bash
npm install --save-dev gh-pages
```

### 3. Deploy
```bash
npm run deploy
```

## Features

- User registration and authentication
- Create, edit, and delete blog posts
- Comment on posts
- User-friendly interface
- Responsive design

## Project Structure

```
src/
├── components/      # Reusable components (Navbar, etc.)
├── pages/          # Page components (Home, Login, PostDetail, etc.)
├── App.js          # Main app component
├── App.css         # Global styles
└── index.js        # Entry point
```

## Browser Support

- Chrome
- Firefox
- Safari
- Edge
