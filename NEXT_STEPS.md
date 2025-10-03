# 🎉 Backend Deployed Successfully! Next Steps

Now that your backend is deployed on Render, follow these steps to complete the setup.

---

## Step 1: Get Your Render Backend URL

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click on your deployed service (e.g., `focaloid-backend`)
3. Copy the URL at the top (looks like: `https://focaloid-backend.onrender.com`)

**Example URL:**
```
https://focaloid-backend-abc123.onrender.com
```

---

## Step 2: Test Your Backend Deployment

### Test the Health Endpoint
```bash
# Replace with your actual Render URL
curl https://your-backend-name.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "db_loaded": true,
  "llm_ready": true
}
```

### Test the Chat Endpoint
```bash
curl -X POST https://your-backend-name.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Cash Before Cover in Nigeria?","country":"Nigeria"}'
```

**If you get a response with an answer, your backend is working! ✅**

⚠️ **Note:** The first request might take 30-60 seconds because:
- Service might be waking up from sleep (free tier)
- HuggingFace model needs to download on first use

---

## Step 3: Configure Frontend to Use Render Backend

### Create `.env` file in frontend directory

```bash
cd frontend
```

Create a new file named `.env`:

```env
VITE_CHAT_API_URL=https://your-backend-name.onrender.com/chat
```

**Replace `your-backend-name` with your actual Render service name!**

### Example:
If your Render URL is `https://focaloid-backend-abc123.onrender.com`, then:
```env
VITE_CHAT_API_URL=https://focaloid-backend-abc123.onrender.com/chat
```

---

## Step 4: Update CORS Settings on Render

Your backend needs to allow requests from your frontend.

### If testing locally first:

1. Go to your Render service dashboard
2. Click **"Environment"** tab
3. Add a new environment variable:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `http://localhost:5173,http://127.0.0.1:5173`
4. Click **"Save Changes"**
5. Service will auto-redeploy

### When you deploy frontend to production:

Update the `ALLOWED_ORIGINS` to include your production URL:
```
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173,http://127.0.0.1:5173
```

Examples:
- Vercel: `https://focaloid-chatbot.vercel.app`
- Netlify: `https://focaloid-chatbot.netlify.app`
- Render: `https://focaloid-frontend.onrender.com`

---

## Step 5: Test Frontend Locally with Render Backend

```bash
# Make sure you're in the frontend directory
cd frontend

# Install dependencies (if not done already)
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173` and:

1. ✅ Select a country from the modal
2. ✅ Ask a question like: "What is Cash Before Cover in Nigeria?"
3. ✅ Wait for the response (might take 30-60s on first request)
4. ✅ Verify you get a proper answer from the backend

**Troubleshooting:**
- Check browser console for errors
- Check Network tab to see API requests
- Verify `.env` file is in `frontend/` directory
- Make sure you added `ALLOWED_ORIGINS` in Render

---

## Step 6: Deploy Frontend (Optional)

You have several options to deploy your React frontend:

### Option A: Vercel (Recommended for React/Vite)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Add Environment Variable in Vercel:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add: `VITE_CHAT_API_URL` = `https://your-backend.onrender.com/chat`

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

5. **Update CORS:**
   - Add your Vercel URL to `ALLOWED_ORIGINS` in Render backend

### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Add Environment Variable:**
   - Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_CHAT_API_URL` = `https://your-backend.onrender.com/chat`

5. **Update CORS in Render backend**

### Option C: Render (Keep everything in one place)

1. **In Render Dashboard:**
   - New + → Static Site
   - Connect your repository
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Add Environment Variable:**
   - Key: `VITE_CHAT_API_URL`
   - Value: `https://your-backend.onrender.com/chat`

3. **Update CORS in backend:**
   - Add your frontend Render URL to `ALLOWED_ORIGINS`

---

## Step 7: Final Checklist

Before considering your deployment complete:

- [ ] Backend health endpoint returns `{"status":"healthy"}`
- [ ] Backend chat endpoint returns proper answers
- [ ] Frontend `.env` file has correct `VITE_CHAT_API_URL`
- [ ] CORS is configured in Render backend (`ALLOWED_ORIGINS`)
- [ ] Frontend can connect to backend locally
- [ ] Questions get answered properly in UI
- [ ] (Optional) Frontend is deployed to production
- [ ] (If deployed) Production frontend URL is in `ALLOWED_ORIGINS`
- [ ] Both local and production work

---

## Common Issues & Solutions

### ❌ CORS Error in Browser Console

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Go to Render backend → Environment tab
2. Add/update `ALLOWED_ORIGINS` with your frontend URL
3. Make sure URLs don't have trailing slashes
4. Wait for automatic redeploy (or trigger manual deploy)

### ❌ Network Error / Request Failed

**Possible causes:**
1. Backend is waking up from sleep (wait 30-60 seconds, try again)
2. Wrong API URL in `.env` file
3. Backend crashed (check Render logs)

**Solution:**
- Test backend directly with curl first
- Check Render logs for errors
- Verify `.env` file URL is correct (including `/chat` at the end)

### ❌ Slow First Response (30-60 seconds)

**This is normal!** On Render free tier:
- Service sleeps after 15 minutes of inactivity
- First request wakes it up (cold start)
- Subsequent requests are fast

**Solutions:**
- Upgrade to Starter plan ($7/month) for always-on
- Use a ping service to keep it awake
- Accept it as a trade-off for free hosting

### ❌ Backend Crashes After Some Time

**Check Render logs for:**
- Memory issues (if using >512MB)
- OpenAI API errors (check API key, quota)
- Database connection issues

---

## Cost Summary

### Current Setup (Recommended for Testing)
- **Backend:** Render Free Tier ($0/month)
  - ✅ 750 hours/month
  - ⚠️ Sleeps after 15 min inactivity
  - ⚠️ 512MB RAM limit
  
- **Frontend:** Free options
  - Vercel: Free tier (generous limits)
  - Netlify: Free tier (100GB bandwidth/month)
  - Render Static: Free

- **OpenAI API:** Pay per use (~$0.01-0.05 per query)

**Total: ~$0-5/month** (mostly OpenAI usage)

### Production Setup (Recommended)
- **Backend:** Render Starter ($7/month)
  - ✅ Always on (no cold starts)
  - ✅ 2GB RAM
  - ✅ Better performance

- **Frontend:** Free tier is usually fine
- **OpenAI:** ~$10-50/month depending on usage

**Total: ~$17-57/month**

---

## Performance Tips

1. **Keep backend warm** (free tier):
   - Use [UptimeRobot](https://uptimerobot.com/) to ping `/health` every 5 minutes
   - Prevents cold starts

2. **Optimize OpenAI costs:**
   - Use `gpt-4o-mini` (already set, cheapest option)
   - Reduce `max_tokens` if answers are too long
   - Cache frequent queries

3. **Monitor usage:**
   - Check Render metrics dashboard
   - Monitor OpenAI usage in OpenAI dashboard
   - Set up usage alerts

---

## What's Next?

Now that everything is deployed:

1. **Add Features:**
   - Conversation history
   - Export chat as PDF
   - Multiple document types
   - User authentication

2. **Improve UX:**
   - Loading indicators
   - Error messages
   - Retry logic
   - Offline detection

3. **Monitor & Maintain:**
   - Set up error tracking (Sentry)
   - Monitor API costs
   - Update dependencies regularly
   - Backup vector database

4. **Scale:**
   - Upgrade to paid plans when needed
   - Add CDN for frontend
   - Optimize vector search
   - Add caching layer

---

## Need Help?

- **Backend Issues:** Check `backend/DEPLOYMENT.md` or `backend/RENDER_QUICK_FIX.md`
- **Render Docs:** https://render.com/docs
- **Vite Docs:** https://vitejs.dev/
- **Deployment Issues:** Check Render logs and browser console

**Congratulations on your deployment! 🚀**

