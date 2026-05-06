const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'visits.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      visit_time DATETIME DEFAULT (datetime('now', 'localtime')),
      user_agent TEXT
    )
  `);
});

// Record a visit
app.post('/api/visit', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  db.run(
    'INSERT INTO visits (ip, user_agent) VALUES (?, ?)',
    [ip, userAgent],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const stats = {};

  // Total visits
  db.get('SELECT COUNT(*) as count FROM visits', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalVisits = row.count;

    // Daily visits (today)
    db.get("SELECT COUNT(*) as count FROM visits WHERE date(visit_time) = date('now', 'localtime')", (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.todayVisits = row.count || 0;

      // Recent 50 visits
      db.all('SELECT ip, visit_time FROM visits ORDER BY visit_time DESC LIMIT 50', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.recentVisits = rows;

        // Daily breakdown for last 14 days
        db.all(`
          SELECT date(visit_time) as date, COUNT(*) as count 
          FROM visits 
          WHERE visit_time >= date('now', 'localtime', '-14 days')
          GROUP BY date(visit_time)
          ORDER BY date DESC
        `, (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.dailyStats = rows;
          res.json(stats);
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
