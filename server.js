const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for leaderboard
const leaderboard = [];
const CORRECT_WORDS = ['steel', 'hamster', 'casual', 'nose', 'raise', 'right', 'cherry', 'various', 'trick', 'purse', 'session', 'bag'];

// Verify recovery phrase
app.post('/api/verify', (req, res) => {
  const { username, words } = req.body;

  if (!username || !words || words.length !== 12) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  // Check if words are correct
  const isCorrect = words.every((word, index) => word.toLowerCase().trim() === CORRECT_WORDS[index].toLowerCase());

  if (isCorrect) {
    // Add to leaderboard
    const submission = {
      username,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      rank: leaderboard.length + 1
    };
    leaderboard.unshift(submission);
    res.json({ success: true, message: 'All words correct!', rank: submission.rank });
  } else {
    res.json({ success: false, message: 'One or more words are incorrect' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sorted = leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
  res.json(sorted);
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔐 Recovery Phrase Verifier running at http://localhost:${PORT}`);
});
