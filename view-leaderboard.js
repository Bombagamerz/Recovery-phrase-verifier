const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('\n=== 🏆 Recovery Phrase Leaderboard ===\n');

// Initialize Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch and display all submissions
async function displayLeaderboard() {
  try {
    const { data: rows, error } = await supabase
      .from('submissions')
      .select('username, timestamp')
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('❌ Error querying database:', error);
      process.exit(1);
    }
    
    if (!rows || rows.length === 0) {
      console.log('No submissions yet.\n');
    } else {
      console.log(`Rank | Username | Submission Time`);
      console.log(`-----|----------|-------------------`);
      
      rows.forEach((row, index) => {
        const date = new Date(row.timestamp);
        const timeStr = date.toLocaleString();
        const rankStr = (index + 1).toString().padEnd(4);
        const usernameStr = row.username.padEnd(8);
        console.log(`${rankStr} | ${usernameStr} | ${timeStr}`);
      });
      
      console.log(`\nTotal submissions: ${rows.length}\n`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

displayLeaderboard();
