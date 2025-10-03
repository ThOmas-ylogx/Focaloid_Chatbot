# ⚡ Quick Deploy Checklist - Frontend to Render

Use this as your step-by-step checklist while deploying.

---

## 🎯 Before You Start

- [ ] Backend already deployed on Render
- [ ] Backend URL ready (e.g., `https://your-backend.onrender.com`)
- [ ] Code pushed to Git (GitHub/GitLab/Bitbucket)
- [ ] Logged into Render dashboard

---

## 📝 Step-by-Step Deployment

### ☑️ Step 1: Create Static Site (2 min)

1. [ ] Go to https://dashboard.render.com
2. [ ] Click **"New +"** button
3. [ ] Select **"Static Site"**
4. [ ] Select your repository
5. [ ] Click **"Connect"**

---

### ☑️ Step 2: Configure Settings (3 min)

Copy these exact values:

```
Name:              focaloid-frontend
Branch:            main
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: dist
```

**Checklist:**
- [ ] Name entered
- [ ] Branch is `main`
- [ ] Root Directory is `frontend`
- [ ] Build Command is correct
- [ ] Publish Directory is `dist`

---

### ☑️ Step 3: Add Environment Variable (2 min)

1. [ ] Click **"Advanced"** button
2. [ ] Click **"Add Environment Variable"**
3. [ ] Add these values:

```
Key:   VITE_CHAT_API_URL
Value: https://YOUR-BACKEND-NAME.onrender.com/chat
```

⚠️ **IMPORTANT:**
- [ ] Replaced `YOUR-BACKEND-NAME` with your actual backend URL
- [ ] Included `/chat` at the end
- [ ] No trailing slash after `/chat`

**Example:**
If backend is `https://focaloid-backend-xyz.onrender.com`
Then value is: `https://focaloid-backend-xyz.onrender.com/chat`

---

### ☑️ Step 4: Deploy (1 min)

1. [ ] Review all settings one more time
2. [ ] Click **"Create Static Site"**
3. [ ] Wait for build (watch the logs)
4. [ ] Build completes successfully (5-10 minutes)
5. [ ] Copy your frontend URL

**Your Frontend URL:**
```
https://__________________.onrender.com
```
Write it down! ↑

---

### ☑️ Step 5: Update Backend CORS (3 min)

⚠️ **CRITICAL STEP - Don't skip this!**

1. [ ] Go back to Render dashboard
2. [ ] Click on your **backend service**
3. [ ] Click **"Environment"** tab
4. [ ] Look for `ALLOWED_ORIGINS`

**If it exists:**
- [ ] Click "Edit"
- [ ] Add your frontend URL to the value (comma-separated)
- [ ] Should look like: `https://your-frontend.onrender.com,http://localhost:5173,http://127.0.0.1:5173`

**If it doesn't exist:**
- [ ] Click **"Add Environment Variable"**
- [ ] Key: `ALLOWED_ORIGINS`
- [ ] Value: `https://your-frontend.onrender.com,http://localhost:5173,http://127.0.0.1:5173`

5. [ ] Click **"Save Changes"**
6. [ ] Wait for backend to redeploy (~2 minutes)

---

### ☑️ Step 6: Test Your App (5 min)

1. [ ] Open your frontend URL in browser
2. [ ] Page loads without errors
3. [ ] Country selection modal appears
4. [ ] Select "Nigeria" (or "Cameroon")
5. [ ] Modal closes, country is selected
6. [ ] Type: "What is Cash Before Cover in Nigeria?"
7. [ ] Click send
8. [ ] Wait 30-60 seconds (backend waking up - normal for first request)
9. [ ] You receive an answer!
10. [ ] Ask another question (should be faster)

---

## ✅ Success Checklist

All of these should be TRUE:

- [ ] Frontend URL loads in browser
- [ ] No errors in browser console (press F12)
- [ ] Country selection works
- [ ] Can type and send messages
- [ ] Receive answers from AI
- [ ] No CORS errors
- [ ] Backend health check works: `https://your-backend.onrender.com/health`

---

## 🎉 If All Checks Pass:

**CONGRATULATIONS! Your app is fully deployed!** 🚀

### Share Your URLs:

```
🌐 Live Application:
   https://your-frontend.onrender.com

🔧 Backend API:
   https://your-backend.onrender.com

💚 Health Check:
   https://your-backend.onrender.com/health
```

---

## ❌ If Something's Wrong:

### Problem: Frontend loads but can't send messages

**Check:**
- [ ] Browser console for errors (F12)
- [ ] `VITE_CHAT_API_URL` is correct in Render environment variables
- [ ] Backend CORS includes frontend URL
- [ ] Backend is running (test health endpoint)

**Fix:** See `RENDER_FULL_DEPLOYMENT_GUIDE.md` troubleshooting section

### Problem: Blank page

**Check:**
- [ ] Build succeeded in Render logs
- [ ] Publish directory is `dist` not `build`
- [ ] Browser console for errors

**Fix:** Redeploy or check build logs

### Problem: CORS Error

**Fix:**
- [ ] Add frontend URL to backend `ALLOWED_ORIGINS`
- [ ] Format: `https://frontend.onrender.com,http://localhost:5173`
- [ ] No spaces, comma-separated
- [ ] Wait for backend to redeploy

---

## 📋 URLs to Save

After successful deployment, fill these in:

```
===========================================
         MY DEPLOYED APPLICATION
===========================================

Frontend:
https://________________________________

Backend:
https://________________________________

Health Check:
https://________________________________/health

Deployed On:
_____ / _____ / _____

Environment Variables Set:
☐ OPENAI_API_KEY (backend)
☐ ALLOWED_ORIGINS (backend)
☐ VITE_CHAT_API_URL (frontend)

===========================================
```

---

## 🔄 Making Updates Later

When you make code changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically detect and redeploy! ✨

---

## 📞 Need More Help?

- **Full Guide**: `RENDER_FULL_DEPLOYMENT_GUIDE.md`
- **Frontend Details**: `frontend/RENDER_DEPLOYMENT.md`
- **Backend Details**: `backend/DEPLOYMENT.md`
- **Render Support**: https://render.com/docs

---

**Good luck with your deployment! 🍀**

