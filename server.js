import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Read index.html once at startup
const indexPath = join(__dirname, 'dist', 'index.html');
let indexTemplate = readFileSync(indexPath, 'utf-8');

// ─── Security headers middleware ──────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://apis.google.com https://www.recaptcha.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src 'self' https://www.google.com https://www.recaptcha.net https://kisanseva-app.firebaseapp.com https://*.firebaseapp.com",
      "img-src 'self' data: blob: https://www.gstatic.com",
      `connect-src 'self' ${process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || ''} https://kisanseva-backend-d6034e449591.herokuapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://www.google.com https://www.recaptcha.net`,
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')
  );

  if (isProd) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

// ─── Static assets — long cache, immutable ───────────────────────────────────
app.use(
  '/assets',
  express.static(join(__dirname, 'dist', 'assets'), {
    index: false,
    maxAge: '1y',
    immutable: true,
  })
);

// Other static files — short cache
app.use(
  express.static(join(__dirname, 'dist'), {
    index: false,
    maxAge: '1h',
  })
);

// ─── SPA fallback — serve index.html with runtime config ─────────────────────
app.get('/{*splat}', (_req, res) => {
  const runtimeConfig = `<script>window.__RUNTIME_CONFIG__=${JSON.stringify({
    API_BASE_URL: process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || '',
  })};</script>`;

  const html = indexTemplate.replace('</head>', `${runtimeConfig}</head>`);

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.type('html').send(html);
});

app.listen(PORT, () => {
  console.log(`KisanSeva frontend server running on port ${PORT}`);
});
