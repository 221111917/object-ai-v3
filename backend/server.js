const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: '10mb'}));

// Simple log endpoint
app.post('/api/log', (req, res) => {
  const log = { ts: new Date().toISOString(), body: req.body };
  fs.appendFileSync(path.join(__dirname, 'detections.log'), JSON.stringify(log) + '\n');
  res.json({ status: 'ok' });
});

// Optional endpoint to receive a frame for server-side inference (not implemented here)
// You can implement YOLOv8 server and forward predictions here.
app.post('/api/detect', async (req, res) => {
  // Expected: { image: "<base64-data>" }
  // Currently unimplemented: return helpful message for deploy.
  res.status(501).json({ error: "Server-side inference not enabled in this package. See README for instructions to enable YOLOv8 server." });
});

// Serve frontend build if present
const buildDir = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res) => res.sendFile(path.join(buildDir, 'index.html')));
} else {
  app.get('/', (req, res) => res.send('Backend ready. Run frontend (npm run dev) for development.'));
}

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
