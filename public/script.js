// Correct recovery words
const CORRECT_WORDS = ['steel', 'hamster', 'casual', 'nose', 'raise', 'right', 'cherry', 'various', 'trick', 'purse', 'session', 'bag'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createWordInputs();
  setupEventListeners();
  loadTheme();
  pollLeaderboard();
  // Poll leaderboard every 2 seconds
  setInterval(pollLeaderboard, 2000);
});

// Create 12 word input fields
function createWordInputs() {
  const container = document.getElementById('wordsContainer');
  for (let i = 0; i < 12; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'word-input-wrapper';
    wrapper.dataset.index = i;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Word ${i + 1}`;
    input.autocomplete = 'off';
    input.dataset.wordIndex = i;
    
    const numberSpan = document.createElement('span');
    numberSpan.className = 'word-number';
    numberSpan.textContent = (i + 1).toString().padStart(2, '0');
    
    const statusSpan = document.createElement('span');
    statusSpan.className = 'word-status';
    statusSpan.textContent = '';
    
    wrapper.appendChild(numberSpan);
    wrapper.appendChild(input);
    wrapper.appendChild(statusSpan);
    container.appendChild(wrapper);
    
    // Real-time validation
    input.addEventListener('input', () => validateWord(i));
  }
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('submitBtn').addEventListener('click', submitPhrase);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Allow Enter key to submit
  document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitPhrase();
  });
  
  // Focus next input on space
  const inputs = document.querySelectorAll('.word-input-wrapper input');
  inputs.forEach((input, index) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });
  });
}

// Validate individual word
function validateWord(index) {
  const input = document.querySelector(`input[data-word-index="${index}"]`);
  const wrapper = input.closest('.word-input-wrapper');
  const word = input.value.toLowerCase().trim();
  
  // Clear status during typing
  if (word === '') {
    wrapper.classList.remove('correct', 'incorrect');
    return;
  }
  
  // Check if word matches
  if (word === CORRECT_WORDS[index]) {
    wrapper.classList.remove('incorrect');
    wrapper.classList.add('correct');
    wrapper.querySelector('.word-status').textContent = '✅';
  } else {
    wrapper.classList.remove('correct');
    wrapper.classList.add('incorrect');
    wrapper.querySelector('.word-status').textContent = '❌';
  }
}

// Submit recovery phrase
async function submitPhrase() {
  const username = document.getElementById('username').value.trim();
  const resultDisplay = document.getElementById('result');
  
  if (!username) {
    showResult('Please enter your Discord username', false);
    return;
  }
  
  // Get all word inputs
  const inputs = document.querySelectorAll('.word-input-wrapper input');
  const words = Array.from(inputs).map(input => input.value.toLowerCase().trim());
  
  // Validate all words are filled
  if (words.some(word => word === '')) {
    showResult('Please enter all 12 words', false);
    return;
  }
  
  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, words })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showResult(`🎉 Success! You're #${data.rank} on the leaderboard!`, true);
      // Clear form
      setTimeout(() => {
        clearForm();
      }, 2000);
    } else {
      showResult(data.message, false);
    }
  } catch (error) {
    showResult('Error verifying phrase. Please try again.', false);
    console.error(error);
  }
}

// Show result message
function showResult(message, success) {
  const resultDisplay = document.getElementById('result');
  resultDisplay.innerHTML = `<span class="emoji">${success ? '✅' : '❌'}</span><span>${message}</span>`;
  resultDisplay.className = `result-display show ${success ? 'success' : 'error'}`;
}

// Clear form
function clearForm() {
  document.getElementById('username').value = '';
  document.querySelectorAll('.word-input-wrapper input').forEach(input => {
    input.value = '';
  });
  document.querySelectorAll('.word-input-wrapper').forEach(wrapper => {
    wrapper.classList.remove('correct', 'incorrect');
  });
  document.getElementById('result').classList.remove('show');
}

// Theme toggle
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeToggleButton();
}

function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  updateThemeToggleButton();
}

function updateThemeToggleButton() {
  const button = document.getElementById('themeToggle');
  const isDark = document.body.classList.contains('dark-mode');
  button.textContent = isDark ? '☀️' : '🌙';
}

// Poll leaderboard
async function pollLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    const leaderboard = await response.json();
    displayLeaderboard(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

// Display leaderboard
function displayLeaderboard(leaderboard) {
  const leaderboardDisplay = document.getElementById('leaderboard');
  
  if (leaderboard.length === 0) {
    leaderboardDisplay.innerHTML = `
      <div class="leaderboard-placeholder">
        <p>Waiting for first submission...</p>
      </div>
    `;
    return;
  }
  
  leaderboardDisplay.innerHTML = leaderboard.map((entry, index) => `
    <div class="leaderboard-entry">
      <div class="leaderboard-rank">#${index + 1}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-username">${escapeHtml(entry.username)}</div>
        <div class="leaderboard-time">${formatTime(entry.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
