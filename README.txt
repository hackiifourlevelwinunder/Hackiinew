Secure PRNG Minute Server (ZIP)
==============================

Files:
- server.js        : Node.js + Express server (generates secure 0-9 every minute)
- package.json     : npm metadata
- public/index.html: Client UI (accesses /api/current and /api/history)

Quick start (local):
1. Extract this ZIP.
2. cd secure_prng_server
3. npm install
4. node server.js
5. Open http://localhost:3000

Deploy (Render.com):
1. Push this repo to GitHub.
2. Create a Web Service on Render, connect the repo.
3. Render will run `npm start`. Make sure PORT is set by platform.

Notes:
- This server uses crypto.randomInt for cryptographically secure randomness.
- It intentionally does NOT reveal future values (ethical / non-cheating).
- For persistence across restarts, add a database (not included).
