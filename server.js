const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Create submissions table if it doesn't exist
async function initializeDatabase() {
  const { data, error } = await supabase.from('submissions').select('count', { count: 'exact', head: true });
  
  if (error && error.code === '42P01') {
    // Table doesn't exist, attempt to create via SQL
    console.log('📊 Note: Submissions table should exist in Supabase. Create it with:');
    console.log('   CREATE TABLE submissions (id BIGSERIAL PRIMARY KEY, username TEXT NOT NULL, timestamp TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());');
  }
}

initializeDatabase().catch(err => {
  console.error('Database initialization note:', err);
});

const CORRECT_WORDS = ['steel', 'hamster', 'casual', 'nose', 'raise', 'right', 'cherry', 'various', 'trick', 'purse', 'session', 'bag'];

// Verify recovery phrase
app.post('/api/verify', async (req, res) => {
  const { username, words } = req.body;

  if (!username || !words || words.length !== 12) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  // Check if words are correct
  const isCorrect = words.every((word, index) => word.toLowerCase().trim() === CORRECT_WORDS[index].toLowerCase());

  if (isCorrect) {
    try {
      const timestamp = new Date().toISOString();
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('submissions')
        .insert([{ username, timestamp }]);
      
      if (error) {
        console.error('Error saving submission:', error);
        return res.status(500).json({ success: false, message: 'Error saving submission' });
      }
      
      // Get rank from Supabase
      const { data: ranks, error: rankError } = await supabase
        .from('submissions')
        .select('id', { count: 'exact' })
        .lte('timestamp', timestamp);
      
      const rank = rankError ? 1 : (ranks?.length || 1);
      res.json({ success: true, message: 'All words correct!', rank });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, message: 'Error verifying submission' });
    }
  } else {
    res.json({ success: false, message: 'One or more words are incorrect' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('username, timestamp')
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return res.json([]);
    }
    
    const leaderboard = (data || []).map((row, index) => ({
      username: row.username,
      timestamp: row.timestamp,
      time: new Date(row.timestamp).toLocaleTimeString(),
      rank: index + 1
    }));
    
    res.json(leaderboard);
  } catch (err) {
    console.error('Error:', err);
    res.json([]);
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔐 Recovery Phrase Verifier running at http://localhost:${PORT}`);
  console.log(`📊 Database: Supabase PostgreSQL`);
  console.log(`🌐 Connected to: ${SUPABASE_URL}`);
});
