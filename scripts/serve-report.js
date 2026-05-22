const http = require('http');
const fs = require('fs');
const path = require('path');

const reportArg = process.argv[2] || 'allure-report';
const port = Number(process.argv[3] || 5050);
const root = path.resolve(process.cwd(), reportArg);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Report directory not found: ${root}`);
  console.error('Usage: node scripts/serve-report.js <report-directory> <port>');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    send(res, 200, data, contentTypes[extension] || 'application/octet-stream');
  });
});

server.listen(port, () => {
  console.log(`Serving ${root}`);
  console.log(`Open http://localhost:${port}`);
});
