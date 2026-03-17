import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.db');
const JWT_SECRET = process.env.JWT_SECRET || 'fast-yt-downloader-secret';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    coins INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by INTEGER,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    duration_seconds INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('ad_url', 'https://www.effectivegatecpm.com/kcb07k9mh?key=c15467c9cd495f026d96803fae10177a');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Public Settings
  app.get('/api/settings/ad-url', (req, res) => {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get('ad_url') as any;
    res.json({ ad_url: setting?.value || '' });
  });

  // API Routes
  app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name, referralCode } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const myReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      let referredBy = null;
      if (referralCode) {
        const referrer = db.prepare('SELECT id FROM users WHERE referral_code = ?').get(referralCode) as any;
        if (referrer) {
          referredBy = referrer.id;
          // Award referrer 5 coins
          db.prepare('UPDATE users SET coins = coins + 5 WHERE id = ?').run(referredBy);
        }
      }

      const isAdmin = email === 'smostafizurrr952@gmail.com' ? 1 : 0;
      const result = db.prepare('INSERT INTO users (email, password, name, referral_code, referred_by, is_admin) VALUES (?, ?, ?, ?, ?, ?)').run(email, hashedPassword, name, myReferralCode, referredBy, isAdmin);
      
      const token = jwt.sign({ id: result.lastInsertRowid }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, email, name, coins: 0, referral_code: myReferralCode } });
    } catch (error) {
      res.status(400).json({ error: 'User already exists or invalid data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, coins: user.coins, referral_code: user.referral_code, is_admin: user.is_admin } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.get('/api/user/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = db.prepare('SELECT id, email, name, coins, referral_code, is_admin FROM users WHERE id = ?').get(decoded.id);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.post('/api/user/update-coins', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { seconds } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Log usage
      db.prepare('INSERT INTO usage_logs (user_id, duration_seconds) VALUES (?, ?)').run(decoded.id, seconds);
      
      // Calculate total seconds from logs
      const totalSecondsRow = db.prepare('SELECT SUM(duration_seconds) as total FROM usage_logs WHERE user_id = ?').get(decoded.id) as any;
      const totalSeconds = totalSecondsRow.total || 0;
      
      // 1 coin per 15 minutes (900 seconds)
      const totalUsageCoinsEarned = Math.floor(totalSeconds / 900);
      
      // We need to know how many coins were already awarded for usage to avoid double counting
      // For this demo, we'll store 'usage_coins_awarded' in the user table
      // Let's check if that column exists, if not we'll just use a simple increment logic for now
      // Actually, let's just update the user's coins by the difference
      
      const user = db.prepare('SELECT coins, id FROM users WHERE id = ?').get(decoded.id) as any;
      // In a real app, we'd track this more precisely. 
      // For now, let's just award 1 coin if the new total seconds crosses a 900s boundary
      const previousTotal = totalSeconds - seconds;
      const previousCoins = Math.floor(previousTotal / 900);
      const currentCoins = Math.floor(totalSeconds / 900);
      
      if (currentCoins > previousCoins) {
        const coinsToAdd = currentCoins - previousCoins;
        db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(coinsToAdd, decoded.id);
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const admin = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(decoded.id) as any;
      if (!admin?.is_admin) return res.status(403).json({ error: 'Forbidden' });
      
      const users = db.prepare('SELECT id, email, name, coins, referral_code FROM users').all();
      res.json(users);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.post('/api/admin/update-user-coins', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { userId, coins } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const admin = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(decoded.id) as any;
      if (!admin?.is_admin) return res.status(403).json({ error: 'Forbidden' });
      
      db.prepare('UPDATE users SET coins = ? WHERE id = ?').run(coins, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.post('/api/admin/update-ad-url', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { adUrl } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const admin = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(decoded.id) as any;
      if (!admin?.is_admin) return res.status(403).json({ error: 'Forbidden' });
      
      db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('ad_url', adUrl);
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
