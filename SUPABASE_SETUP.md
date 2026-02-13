
# 🚀 Supabase Setup Guide

Follow these steps to get your Supabase database running with this project.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email ✉️

## Step 2: Create a New Project

1. Click **"New Project"**
2. **Project Name**: `recovery-verifier` (or any name)
3. **Database Password**: Create a strong password (save this!)
4. **Region**: Select closest to your location
5. Click **"Create new project"** (wait ~1 minute for setup)

## Step 3: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. **Clear the default text** and paste this:

```sql
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_timestamp ON submissions(timestamp);
```

4. Click **"Run"** (button at bottom right)
5. You should see ✅ "Success. No rows returned."

## Step 4: Get Your API Credentials

1. Go to **Project Settings** (bottom left, gear icon)
2. Click **"API"** in the sidebar
3. You'll see three important things:

   **Project URL** (example):
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   Copy this.

   **API Keys** section - find **Anon public**:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Copy this.

## Step 5: Add .env File

1. In your project folder, create a file named `.env` (just `.env` - no extension)
2. Paste this and fill in your credentials:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
PORT=3000
```

Replace:
- `https://your-project.supabase.co` with your actual Project URL
- `your-anon-key` with your actual Anon Key

**❌ DON'T commit this file to GitHub!** (.gitignore already has it)

## Step 6: Start Your Server

```bash
npm start
```

You should see:
```
🔐 Recovery Phrase Verifier running at http://localhost:3000
📊 Database: Supabase PostgreSQL
🌐 Connected to: https://xxxxx.supabase.co
```

## Step 7: Test It Out

1. Open http://localhost:3000
2. Enter a Discord username
3. Enter the recovery words:
   steel, hamster, casual, nose, raise, right, cherry, various, trick, purse, session, bag
4. Click "Verify Phrase"
5. You should see ✅ **"All words correct!"**

## Step 8: Check Your Data

To view all submissions:

```bash
npm run leaderboard
```

You'll see a table with all submissions.

## 🎉 You're All Set!

Your recovery phrase verifier is now running with a **persistent cloud database**!

- ✅ Data survives server restarts
- ✅ Access from anywhere
- ✅ Ready to deploy to Vercel, Railway, or anywhere else

## Deployment (Vercel, Railway, etc.)

When deploying to a hosting platform:

1. Set environment variables:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase Anon Key

2. The same code will work! No changes needed.

## Troubleshooting

**"Missing Supabase credentials"** error?
- Check your `.env` file exists
- Make sure `SUPABASE_URL` and `SUPABASE_KEY` are correct (no extra spaces)
- Restart the server: `npm start`

**"Table does not exist" error?**
- Go back to Supabase SQL Editor
- Run the SQL from Step 3 again

**"Connection refused"?**
- Check your internet connection
- Make sure Supabase project is active
- Check your credentials are correct

## Need Help?

- Supabase Docs: https://supabase.com/docs
- GitHub: Create an issue in your repo
- Discord: Join Supabase Discord community
