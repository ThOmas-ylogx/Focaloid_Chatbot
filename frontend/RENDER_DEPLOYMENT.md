# Deploy Frontend to Render - Complete Guide

This guide will help you deploy your React/Vite frontend to Render as a static site.

---

## Prerequisites

✅ Backend already deployed on Render  
✅ Backend URL (e.g., `https://focaloid-backend-xyz.onrender.com`)  
✅ Code pushed to Git repository (GitHub/GitLab/Bitbucket)

---

## Deployment Methods

Choose one of these methods:

### Method 1: Using Render Dashboard (Recommended for First Time)
### Method 2: Using Blueprint (render.yaml) - Faster setup

---

## Method 1: Dashboard Deployment (Step by Step)

### Step 1: Push Your Code to Git

Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "Prepare frontend for Render deployment"
git push origin main
```

### Step 2: Create Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Static Site"**
4. Connect your Git repository (if not already connected)
5. Select your repository
6. Click **"Connect"**

### Step 3: Configure the Static Site

Fill in these settings:

**Basic Settings:**
- **Name**: `focaloid-frontend` (or your preferred name)
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Advanced Settings (Click "Advanced"):**

**Environment Variables:**
Click **"Add Environment Variable"** and add:
- **Key**: `VITE_CHAT_API_URL`
- **Value**: `https://your-backend-name.onrender.com/chat`

⚠️ **Important**: Replace `your-backend-name` with your actual backend Render URL!

Example:
```
VITE_CHAT_API_URL=https://focaloid-backend-abc123.onrender.com/chat
```

**Auto-Deploy:**
- ✅ Keep "Auto-Deploy" enabled (deploys automatically on git push)

### Step 4: Create Static Site

1. Review your settings
2. Click **"Create Static Site"**
3. Wait for the build to complete (5-10 minutes first time)

### Step 5: Get Your Frontend URL

Once deployed, you'll get a URL like:
```
https://focaloid-frontend.onrender.com
```

Copy this URL - you'll need it for the next step!

### Step 6: Update Backend CORS

**This is crucial!** Your backend needs to allow requests from your new frontend URL.

1. Go to your **backend service** in Render dashboard
2. Click **"Environment"** tab
3. Find `ALLOWED_ORIGINS` (or add it if it doesn't exist)
4. Update the value to include your frontend URL:

```
https://focaloid-frontend.onrender.com,http://localhost:5173,http://127.0.0.1:5173
```

⚠️ **Important:** 
- Use commas to separate multiple URLs (no spaces!)
- Replace with your actual frontend Render URL
- Keep localhost URLs for local development

4. Click **"Save Changes"**
5. Backend will automatically redeploy

### Step 7: Test Your Deployment

1. Open your frontend URL in a browser: `https://focaloid-frontend.onrender.com`
2. Select a country from the modal
3. Ask a question: "What is Cash Before Cover in Nigeria?"
4. Wait for response (may take 30-60s if backend was sleeping)
5. Verify you get a proper answer

✅ **If you get an answer, congratulations! Your app is fully deployed!** 🎉

---

## Method 2: Blueprint Deployment (Using render.yaml)

### Quick Setup

The `render.yaml` file is already created in your frontend directory.

### Step 1: Push to Git

```bash
git add .
git commit -m "Add Render blueprint for frontend"
git push origin main
```

### Step 2: Create from Blueprint

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will detect the `render.yaml` in the frontend folder
5. Click **"Apply"**

### Step 3: Add Environment Variable

Blueprint doesn't auto-fill environment variables, so:

1. Go to your new static site
2. Click **"Environment"** tab
3. Add:
   - **Key**: `VITE_CHAT_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/chat`
4. Trigger a manual redeploy

### Step 4: Update Backend CORS

Same as Method 1, Step 6 above.

---

## Configuration Details

### Build Command Explained

```bash
npm install && npm run build
```

- `npm install`: Installs all dependencies
- `npm run build`: Creates optimized production build in `dist/` folder

### Publish Directory: `dist`

Vite builds your app into the `dist/` directory. This is what Render will serve.

### Routes Configuration

The `render.yaml` includes:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

This enables **client-side routing** for React Router. All routes redirect to `index.html`.

---

## Post-Deployment Checklist

- [ ] Frontend builds successfully
- [ ] Frontend URL is accessible
- [ ] No console errors in browser
- [ ] Country selection modal works
- [ ] Chat functionality works
- [ ] Answers are being received from backend
- [ ] Backend CORS includes frontend URL
- [ ] Both backend and frontend URLs saved

---

## Custom Domain (Optional)

Want to use your own domain? (e.g., `focaloid.yourdomain.com`)

### For Frontend:

1. Go to your static site in Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `focaloid.yourdomain.com`)
4. Follow Render's DNS instructions
5. Add DNS records in your domain provider

### Update CORS:

After adding custom domain, update backend `ALLOWED_ORIGINS`:
```
https://focaloid.yourdomain.com,https://focaloid-frontend.onrender.com
```

---

## Troubleshooting

### ❌ Build Failed

**Issue**: `npm run build` fails

**Common Causes:**
- Missing dependencies
- TypeScript errors
- ESLint errors
- Environment variable issues

**Solution:**
1. Check build logs in Render dashboard
2. Try building locally first: `npm run build`
3. Fix any errors shown
4. Commit and push fixes

### ❌ Blank Page After Deployment

**Issue**: Site loads but shows blank page

**Solutions:**
1. **Check browser console** for errors (F12)
2. **Check environment variables** - is `VITE_CHAT_API_URL` set correctly?
3. **Check build logs** - did build complete successfully?
4. **Check publish directory** - should be `dist` not `build`

### ❌ API Calls Not Working

**Issue**: CORS errors or network errors

**Solutions:**
1. **Check environment variable**: `VITE_CHAT_API_URL` must match backend URL exactly
2. **Check CORS**: Frontend URL must be in backend's `ALLOWED_ORIGINS`
3. **Check backend is running**: Visit `https://your-backend.onrender.com/health`
4. **Wait for backend**: First call takes 30-60s (cold start)

### ❌ 404 on Page Refresh

**Issue**: Refreshing page gives 404 error

**Solution:**
The routes configuration in `render.yaml` should fix this. If not:
1. Check `render.yaml` has the routes section
2. Redeploy with the routes configuration

### ❌ Changes Not Reflecting

**Issue**: Made changes but not showing on deployed site

**Solutions:**
1. **Check if build completed** - view logs
2. **Clear browser cache** - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. **Check you pushed to git** - `git status` and `git push`
4. **Trigger manual deploy** - in Render dashboard

---

## Updating Your Deployment

### After Making Code Changes:

```bash
# Make your changes
# Then commit and push
git add .
git commit -m "Updated feature X"
git push origin main

# Render will automatically detect and deploy
```

### Build Time:
- Initial build: 5-10 minutes
- Subsequent builds: 2-5 minutes

### After Changing Environment Variables:

1. Update in Render dashboard
2. Click **"Save"**
3. Trigger manual redeploy (or it may auto-deploy)

---

## Performance & Monitoring

### Free Tier Features:
- ✅ 100 GB bandwidth/month
- ✅ Global CDN included
- ✅ Auto SSL certificate
- ✅ Auto-deploy from Git
- ✅ Preview deployments for branches

### Monitoring:
- View deploy history in dashboard
- Check bandwidth usage
- Monitor build times
- View access logs

---

## Cost

### Static Site Hosting:
**FREE** ✅

Static sites on Render are completely free with:
- Unlimited builds
- 100 GB bandwidth/month
- Global CDN
- SSL certificate
- Custom domain support

### Total Cost (Backend + Frontend):
- **Free tier**: $0/month (both services free)
- **Recommended for production**: $7/month (backend Starter + frontend free)

---

## Best Practices

### 1. Environment Variables
- ✅ Always use environment variables for API URLs
- ❌ Never hardcode URLs in your code
- ✅ Different values for different branches (staging/production)

### 2. Git Workflow
- ✅ Use feature branches
- ✅ Test locally before pushing
- ✅ Use meaningful commit messages
- ✅ Enable auto-deploy for main branch

### 3. Performance
- ✅ Build is already optimized by Vite
- ✅ Use code splitting (already enabled in React)
- ✅ Lazy load routes if app grows
- ✅ Monitor bundle size

### 4. Security
- ✅ HTTPS enabled by default
- ✅ Security headers included in render.yaml
- ✅ Never expose API keys in frontend
- ✅ Keep dependencies updated

---

## Support & Resources

- [Render Static Sites Docs](https://render.com/docs/static-sites)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [React Router](https://reactrouter.com/)

---

## Quick Reference Card

### URLs to Save:
```
Backend:  https://[your-backend].onrender.com
Frontend: https://[your-frontend].onrender.com
Health:   https://[your-backend].onrender.com/health
```

### Environment Variables:
```
Backend (ALLOWED_ORIGINS):
https://[your-frontend].onrender.com,http://localhost:5173

Frontend (VITE_CHAT_API_URL):
https://[your-backend].onrender.com/chat
```

### Deploy Commands:
```bash
# Push changes
git add .
git commit -m "Your message"
git push origin main

# Build locally (to test)
npm run build
npm run preview
```

---

## Next Steps After Deployment

1. **Test thoroughly** - Try different questions and countries
2. **Share with users** - Your app is live!
3. **Monitor usage** - Check Render dashboard
4. **Gather feedback** - Improve based on user input
5. **Add features** - Conversation history, export, etc.

---

**Congratulations! Your full-stack app is now deployed! 🚀🎉**

