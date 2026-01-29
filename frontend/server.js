const express = require('express');
const path = require('path');
const app = express();

// Puerto proporcionado por Render
const PORT = process.env.PORT || 8080;

// Directorio de archivos estáticos
const DIST_DIR = path.join(__dirname, 'dist/t4traveling/browser');

console.log('Starting server...');
console.log('Static files directory:', DIST_DIR);

// Servir archivos estáticos
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // No cachear index.html
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Todas las rutas devuelven index.html (SPA routing)
app.get('*', (req, res) => {
  console.log('Request:', req.url);
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Serving files from ${DIST_DIR}`);
});
