# Frontend Environment Setup

## Quick Setup

Create a `.env` file in the `frontend/` directory with your backend API URL.

### Step 1: Create `.env` file

In the `frontend/` directory, create a new file named `.env`:

```bash
cd frontend
# On Windows:
type nul > .env
# On Mac/Linux:
touch .env
```

### Step 2: Add your Render backend URL

Open `.env` and add:

```env
VITE_CHAT_API_URL=https://your-backend-name.onrender.com/chat
```

**Replace `your-backend-name` with your actual Render service URL!**

### Example

If your Render backend URL is `https://focaloid-backend-abc123.onrender.com`, then your `.env` should be:

```env
VITE_CHAT_API_URL=https://focaloid-backend-abc123.onrender.com/chat
```

⚠️ **Important:** Don't forget the `/chat` at the end!

### Step 3: Restart your dev server

If your dev server is running, restart it to load the new environment variable:

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## Environment Variables Explained

- **VITE_CHAT_API_URL**: The full URL to your backend chat endpoint
  - Local: `http://127.0.0.1:8000/chat`
  - Production: `https://your-backend.onrender.com/chat`

## Different Environments

### Local Development (Backend on localhost)

```env
VITE_CHAT_API_URL=http://127.0.0.1:8000/chat
```

### Local Frontend + Production Backend

```env
VITE_CHAT_API_URL=https://your-backend.onrender.com/chat
```

### Production (both deployed)

This will be set in your hosting platform (Vercel/Netlify/Render) environment variables, not in a file.

## Troubleshooting

### ❌ Changes not reflected

- Restart the dev server
- Clear browser cache
- Check file is named exactly `.env` (not `.env.txt`)

### ❌ Environment variable undefined

- Make sure the variable starts with `VITE_`
- Restart dev server after creating/editing `.env`
- File must be in `frontend/` directory, not root

### ❌ CORS errors

Make sure you've added your frontend URL to `ALLOWED_ORIGINS` in your Render backend environment variables.

## Security Note

⚠️ The `.env` file is git-ignored and should NOT be committed to version control.

However, environment variables starting with `VITE_` are **exposed to the browser** and are not secret. Don't put sensitive data here!

