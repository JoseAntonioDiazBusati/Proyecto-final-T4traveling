// Verificar que Express esté instalado
try {
  require.resolve('express');
} catch (e) {
  console.error('ERROR: Express no está instalado');
  console.error('Ejecuta: npm install express');
  process.exit(1);
}

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Puerto proporcionado por Render
const PORT = process.env.PORT || 8080;

// Directorio de archivos estáticos
const DIST_DIR = path.join(__dirname, 'dist/t4traveling/browser');

console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Working directory:', __dirname);
console.log('Static files directory:', DIST_DIR);

// Verificar que el directorio de build existe
if (!fs.existsSync(DIST_DIR)) {
  console.error(`ERROR: Build directory not found: ${DIST_DIR}`);
  console.error('Run: npm run build:prod');
  process.exit(1);
}

// Verificar que index.html existe
const indexPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`ERROR: index.html not found: ${indexPath}`);
  process.exit(1);
}

console.log('✓ Build directory found');
console.log('✓ index.html found');

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
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Serving files from ${DIST_DIR}`);
  console.log(`✓ Server ready at http://0.0.0.0:${PORT}`);
});
