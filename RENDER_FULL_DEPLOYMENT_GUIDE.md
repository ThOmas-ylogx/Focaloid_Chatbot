# 🚀 Complete Render Deployment Guide - Backend + Frontend

This is your complete guide to deploy both backend and frontend on Render.

---

## ✅ What We're Deploying

1. **Backend** (FastAPI + ChromaDB + OpenAI) → Web Service
2. **Frontend** (React + Vite) → Static Site

---

## 📋 Prerequisites

- [x] Render account (sign up at [render.com](https://render.com))
- [x] Git repository (GitHub/GitLab/Bitbucket) with your code
- [x] OpenAI API key
- [ ] 30 minutes of your time

---

## Part 1: Deploy Backend (If Not Done Already)

### Quick Steps:

1. **Push code to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Dashboard → New + → Web Service
   - Connect repository
   - Configure:
     - Root Directory: `backend`
     - Build Command: `pip install --no-cache-dir -r requirements.txt`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1`

3. **Add Environment Variable**
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

4. **Deploy & Get URL**
   - Wait 8-12 minutes
   - Copy your backend URL: `https://your-backend.onrender.com`

5. **Test Backend**
   ```bash
   curl https://your-backend.onrender.com/health
   ```

✅ If you see `{"status":"healthy"}`, backend is ready!

📚 **Detailed Guide**: See `backend/DEPLOYMENT.md`

---

## Part 2: Deploy Frontend

### Method A: Dashboard Deployment (Easiest)

#### Step 1: Go to Render Dashboard

1. Visit [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"**
3. Select **"Static Site"**
4. Connect your repository (if not connected)
5. Select your repo → Click **"Connect"**

#### Step 2: Configure Static Site

**Basic Settings:**
```
Name:              focaloid-frontend
Branch:            main
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: dist
```

**Environment Variables** (Click "Advanced" → "Add Environment Variable"):
```
Key:   VITE_CHAT_API_URL
Value: https://your-backend-name.onrender.com/chat
```

⚠️ **Replace `your-backend-name` with your actual backend URL!**

**Example:**
If your backend is `https://focaloid-backend-abc123.onrender.com`, then:
```
VITE_CHAT_API_URL=https://focaloid-backend-abc123.onrender.com/chat
```

#### Step 3: Create Static Site

1. Click **"Create Static Site"**
2. Wait for build (5-10 minutes)
3. Once complete, you'll get a URL like: `https://focaloid-frontend.onrender.com`

#### Step 4: Update Backend CORS ⚠️ IMPORTANT!

Your backend needs to allow requests from your frontend.

1. Go back to **backend service** in Render
2. Click **"Environment"** tab
3. Add or update `ALLOWED_ORIGINS`:

```
Key:   ALLOWED_ORIGINS
Value: https://focaloid-frontend.onrender.com,http://localhost:5173,http://127.0.0.1:5173
```

**Important:**
- Use commas (no spaces!)
- Replace with your actual frontend URL
- Keep localhost for local development

4. Click **"Save Changes"** (backend will redeploy automatically)

#### Step 5: Test Everything! 🎉

1. Open your frontend URL: `https://focaloid-frontend.onrender.com`
2. Select a country (Nigeria or Cameroon)
3. Ask: "What is Cash Before Cover in Nigeria?"
4. Wait 30-60 seconds for first response (backend waking up)
5. Verify you get a proper answer

✅ **If it works, you're done! Congratulations!** 🎊

---

### Method B: Blueprint Deployment (Advanced)

The `frontend/render.yaml` is already created.

#### Quick Steps:

1. Push to Git:
   ```bash
   git add .
   git commit -m "Add frontend blueprint"
   git push origin main
   ```

2. Render Dashboard → New + → **Blueprint**

3. Select your repository

4. Render detects the YAML and applies it

5. Add environment variable manually:
   - Go to the new static site → Environment
   - Add `VITE_CHAT_API_URL` with your backend URL

6. Update backend CORS (same as Method A, Step 4)

---

## 🎯 Final Checklist

After deployment, verify everything:

### Backend Checks:
- [ ] Backend URL accessible
- [ ] Health endpoint works: `/health`
- [ ] Chat endpoint responds: `/chat`
- [ ] No errors in Render logs

### Frontend Checks:
- [ ] Frontend URL loads successfully
- [ ] No console errors (F12 in browser)
- [ ] Country selection modal appears
- [ ] Can select a country
- [ ] Chat interface loads

### Integration Checks:
- [ ] Can send messages
- [ ] Receive responses from backend
- [ ] No CORS errors
- [ ] Responses are relevant and accurate
- [ ] Multiple questions work

---

## 📝 Save These URLs

After deployment, save these for reference:

```
===========================================
YOUR DEPLOYED APPLICATION
===========================================

Backend URL:
https://[your-backend-name].onrender.com

Frontend URL:
https://[your-frontend-name].onrender.com

Health Check:
https://[your-backend-name].onrender.com/health

Render Dashboard:
https://dashboard.render.com

===========================================
```

---

## ⚙️ Configuration Reference

### Backend Environment Variables:
```
OPENAI_API_KEY = your_openai_key_here
ALLOWED_ORIGINS = https://your-frontend.onrender.com,http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables:
```
VITE_CHAT_API_URL = https://your-backend.onrender.com/chat
```

---

## 🐛 Troubleshooting

### Problem: CORS Error

**Symptoms:** 
- Frontend loads but API calls fail
- Browser console shows: "blocked by CORS policy"

**Solution:**
1. Check backend `ALLOWED_ORIGINS` includes frontend URL
2. Make sure there are no trailing slashes
3. Wait for backend to redeploy after changing env vars
4. Clear browser cache and try again

### Problem: Blank Frontend Page

**Symptoms:**
- URL loads but page is blank
- No errors visible

**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `VITE_CHAT_API_URL` is set correctly
4. Check build logs in Render dashboard
5. Verify publish directory is `dist`

### Problem: Slow/No Response

**Symptoms:**
- Messages sent but no response
- Takes very long time

**Solution:**
1. First request after sleep: 30-60s is normal (free tier)
2. Check backend is running: visit `/health` endpoint
3. Check backend logs for errors
4. Verify OpenAI API key is valid
5. Check OpenAI quota/billing

### Problem: Build Failed

**Backend Build Failed:**
- Check requirements.txt syntax
- Verify Python version compatibility
- Check Render build logs for specific error

**Frontend Build Failed:**
- Run `npm run build` locally to test
- Fix any TypeScript/ESLint errors
- Verify all dependencies in package.json
- Check Node version compatibility

---

## 💰 Cost Breakdown

### Free Tier (Good for Testing):
```
Backend (Web Service - Free):  $0/month
  - 750 hours/month free
  - Spins down after 15 min inactivity
  - 512MB RAM

Frontend (Static Site):        $0/month
  - Completely free
  - 100GB bandwidth/month
  - Global CDN included

OpenAI API:                    ~$0.01-0.10/query
  - Pay per use
  - gpt-4o-mini is cheapest

TOTAL: ~$0-5/month (mostly OpenAI)
```

### Production Recommended:
```
Backend (Starter Plan):        $7/month
  - Always on (no cold starts)
  - 2GB RAM
  - Better performance

Frontend (Static Site):        $0/month
  - Still free!

OpenAI API:                    ~$10-50/month
  - Depends on usage

TOTAL: ~$17-57/month
```

---

## 🔄 Updating Your App

### After Making Code Changes:

```bash
# 1. Make your changes
# 2. Test locally
npm run dev  # frontend
# or
uvicorn main:app --reload  # backend

# 3. Commit and push
git add .
git commit -m "Added new feature"
git push origin main

# 4. Render auto-deploys (if enabled)
# Check dashboard for build progress
```

### Updating Environment Variables:

1. Go to Render dashboard
2. Select your service
3. Environment tab
4. Add/Edit variables
5. Save (triggers redeploy)

---

## 🎓 What You've Built

Congratulations! You now have a production-ready:

✅ **AI-Powered Chatbot** using GPT-4 mini  
✅ **Vector Database** with ChromaDB for semantic search  
✅ **FastAPI Backend** with proper CORS and security  
✅ **React Frontend** with modern UI/UX  
✅ **Fully Deployed** on Render with HTTPS  
✅ **Country-Specific** insurance Q&A system  

---

## 📚 Additional Resources

- **Backend Details**: `backend/DEPLOYMENT.md`
- **Frontend Details**: `frontend/RENDER_DEPLOYMENT.md`
- **Memory Fix**: `backend/RENDER_QUICK_FIX.md`
- **Environment Setup**: `frontend/ENV_SETUP.md`

- **Render Docs**: https://render.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Vite Docs**: https://vitejs.dev

---

## 🚀 Next Steps

### Immediate:
1. ✅ Test your deployed app thoroughly
2. ✅ Share the URL with stakeholders
3. ✅ Monitor usage in Render dashboard

### Short Term:
- Add conversation history
- Improve UI/UX based on feedback
- Add more countries to database
- Implement user authentication
- Add analytics

### Long Term:
- Upgrade to paid plans when needed
- Add custom domain
- Implement caching for faster responses
- Add admin dashboard
- Scale as needed

---

## 🆘 Need Help?

1. **Check the logs** in Render dashboard
2. **Review documentation** in this repo
3. **Render Support**: https://render.com/docs
4. **Community Forum**: https://community.render.com

---

**You did it! Your app is live! 🎉🚀**

Share your frontend URL and start helping users with insurance questions!

