const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static client files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store (for demo). For production use DB if persistence needed.
const history = []; // each item: { timestampISO, minuteLabel, value }

// Helper: generate secure 0..9
function generateSecureDigit() {
  return crypto.randomInt(0, 10);
}

// Compute minute label like "2025-12-11 14:05"
function minuteLabelFromDate(d) {
  const pad = (n)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Current state
let current = {
  minuteLabel: null,
  value: null,
  generatedAt: null
};

// Function to advance to a new minute value (called at minute boundary)
function produceForMinute(now = new Date()) {
  const label = minuteLabelFromDate(now);
  if (current.minuteLabel === label) return; // already produced
  const val = generateSecureDigit();
  current = {
    minuteLabel: label,
    value: val,
    generatedAt: now.toISOString()
  };
  history.unshift({
    timestampISO: now.toISOString(),
    minuteLabel: label,
    value: val
  });
  // keep history reasonable
  if (history.length > 500) history.pop();
  console.log(`Generated for ${label}: ${val}`);
}

// Scheduler: check every 500ms, and when seconds === 0 produce
setInterval(() => {
  const now = new Date();
  if (now.getSeconds() === 0) {
    produceForMinute(now);
  }
}, 500);

// On startup, produce initial value for current minute
produceForMinute(new Date());

// API endpoints
app.get('/api/current', (req, res) => {
  res.json({
    minuteLabel: current.minuteLabel,
    value: current.value,
    generatedAt: current.generatedAt,
    serverTime: new Date().toISOString()
  });
});

app.get('/api/history', (req, res) => {
  const limit = Number(req.query.limit) || 50;
  res.json(history.slice(0, limit));
});

// Fallback: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
