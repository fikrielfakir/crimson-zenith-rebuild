import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 5000) : 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/static', express.static(join(__dirname, 'public')));

// In production, serve the built frontend files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
}

// Create a simple placeholder image API that returns demo images
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  // For demo purposes, serve one of our hero images based on dimensions
  const demoImages = [
    'discover-hero.jpg',
    'book-hero.jpg', 
    'gallery-hero.jpg',
    'news-hero.jpg',
    'events-hero.jpg',
    'clubs-hero.jpg'
  ];
  
  // Simple hash based on dimensions to consistently return same image for same size
  const imageIndex = (parseInt(width) + parseInt(height)) % demoImages.length;
  const selectedImage = demoImages[imageIndex];
  const imagePath = join(__dirname, 'public', selectedImage);
  
  // Check if image exists, otherwise return a default
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    // Return a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e2e8f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b" font-family="Arial, sans-serif" font-size="16">
          ${width} × ${height}
        </text>
      </svg>
    `;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Image server running' });
});

// In production, handle client-side routing
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Serving built frontend and API');
  } else {
    console.log('Development mode: API server only');
  }
  console.log(`Placeholder API available at http://localhost:${PORT}/api/placeholder/WIDTH/HEIGHT`);
});