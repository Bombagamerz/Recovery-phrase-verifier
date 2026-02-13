# 🔐 Crypto Wallet Recovery Phrase Verifier

A modern, secure recovery phrase verification system with real-time leaderboard. Users verify their recovery phrase and compete on a live leaderboard.

## Features

✅ **Recovery Phrase Verification** - Enter 12 recovery words in the correct order
🏆 **Live Leaderboard** - Real-time ranking of successful submissions
🌓 **Light/Dark Mode** - Beautiful theme toggle
🎨 **Modern Crypto UI** - Clean, minimal, and secure-feeling design
💾 **Discord Username** - Track submissions by Discord username
⚡ **Real-time Updates** - Leaderboard updates every 2 seconds

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Open in Browser

Visit `http://localhost:3000` in your web browser.

## How It Works

1. **Enter Discord Username** - Provide your Discord username
2. **Enter 12 Recovery Words** - Type the words in the correct order (one per field):
   - steel, hamster, casual, nose, raise, right, cherry, various, trick, purse, session, bag
3. **Submit** - Click "Verify Phrase" button
4. **View Leaderboard** - See your ranking in the live leaderboard

## The Correct Recovery Words (in order)

1. steel
2. hamster
3. casual
4. nose
5. raise
6. right
7. cherry
8. various
9. trick
10. purse
11. session
12. bag

## Features

### Verification
- Real-time validation as you type
- Visual feedback (✅ for correct words, ❌ for incorrect)
- Submit button validates all fields are filled

### Leaderboard
- Displays rank, username, and submission time
- Updates automatically every 2 seconds
- Shows relative time (e.g., "5m ago")
- Emoji medals for top 3 (#1 🥇 #2 🥈 #3 🥉)

### UI Customization
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Eye-friendly dark theme
- Smooth transitions between themes
- Responsive design for mobile and desktop

## API Endpoints

### POST /api/verify
Verify a recovery phrase submission.

**Request:**
```json
{
  "username": "Discord#1234",
  "words": ["steel", "hamster", "casual", "nose", "raise", "right", "cherry", "various", "trick", "purse", "session", "bag"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "All words correct!",
  "rank": 1
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "One or more words are incorrect"
}
```

### GET /api/leaderboard
Get the current leaderboard.

**Response:**
```json
[
  {
    "username": "CryptoFan#5678",
    "timestamp": "2026-02-13T10:30:45.123Z",
    "time": "10:30:45 AM",
    "rank": 1
  },
  {
    "username": "BitcoinLover#1234",
    "timestamp": "2026-02-13T10:31:20.456Z",
    "time": "10:31:20 AM",
    "rank": 2
  }
]
```

## File Structure

```
recovery-phrase-verifier/
├── server.js                 # Express backend server
├── package.json             # Node.js dependencies
├── public/                  # Frontend files
│   ├── index.html          # Main HTML
│   ├── styles.css          # Styling & themes
│   └── script.js           # Frontend logic
└── README.md               # This file
```

## Technologies Used

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Styling**: Custom CSS with CSS Grid
- **Database**: In-memory storage (leaderboard)

## Customization

### Change the Recovery Words
Edit the `CORRECT_WORDS` array in `server.js` (line 13):
```javascript
const CORRECT_WORDS = ['word1', 'word2', 'word3', ...];
```

Also update it in `public/script.js` (line 3):
```javascript
const CORRECT_WORDS = ['word1', 'word2', 'word3', ...];
```

### Change Port
Edit `server.js` line 9:
```javascript
const PORT = 3000; // Change this number
```

### Styling
All styles are in `public/styles.css`. The design uses:
- CSS Grid for responsive layout
- CSS Variables for theme colors
- Gradient backgrounds
- Smooth animations

## Security Notes

- Input is sanitized to prevent XSS attacks
- Comments are echoed with HTML escaping
- Recovery words are compared case-insensitively
- No sensitive data is stored server-side

## Future Enhancements

- Persist leaderboard to database (SQLite, MongoDB)
- User authentication
- Multiple rooms/events
- Score tracking over time
- Discord API integration
- Email notifications
- Rate limiting

## License

MIT
