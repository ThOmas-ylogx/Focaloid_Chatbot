# Deploying Focaloid Backend to Render

This guide will walk you through deploying your FastAPI backend to Render.

## Prerequisites

1. A [Render account](https://render.com/) (free tier works)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. OpenAI API key

## Deployment Steps

### Step 1: Push Your Code to Git

Make sure your backend code is in a Git repository:

```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### Step 2: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button → Select **"Web Service"**
3. Connect your Git repository
4. Select your repository and branch (usually `main`)

### Step 3: Configure Your Web Service

Fill in the following settings:

- **Name**: `focaloid-backend` (or your preferred name)
- **Region**: Choose closest to your users (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan**: `Free` (or your preferred plan)

### Step 4: Set Environment Variables

In the **Environment Variables** section, add:

1. **OPENAI_API_KEY**
   - Value: Your OpenAI API key
   - **Important**: Keep this secret!

2. **ALLOWED_ORIGINS** (Optional, for production)
   - Value: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - Multiple origins: `https://your-frontend.vercel.app,https://other-domain.com`

3. **PYTHON_VERSION** (Optional)
   - Value: `3.11.0`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your application
3. Wait for the build to complete (first deployment may take 5-10 minutes)
4. Once deployed, you'll get a URL like: `https://focaloid-backend.onrender.com`

### Step 6: Test Your Deployment

Test the health endpoint:

```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "db_loaded": true,
  "llm_ready": true
}
```

Test the chat endpoint:

```bash
curl -X POST https://your-app-name.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How to file a car insurance claim in Nigeria?",
    "country": "Nigeria"
  }'
```

### Step 7: Update Frontend Configuration

Update your frontend's API URL to point to your Render deployment:

In `frontend/src/utils/api.js`, change:
```javascript
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

Don't forget to add your frontend URL to the `ALLOWED_ORIGINS` environment variable in Render!

## Important Notes

### Free Tier Limitations

⚠️ **Render Free Tier Important Notes:**
- Services spin down after 15 minutes of inactivity
- First request after spin down will take 30-60 seconds (cold start)
- 750 hours/month of free usage
- Consider upgrading to Starter ($7/month) for always-on service

### Vector Store Persistence

Your ChromaDB vector store is included in your deployment and will persist. However:
- The data is read from `vectorstore/chroma_db` directory
- Make sure this directory is committed to your Git repository
- For large datasets, consider using a persistent disk or external vector store

### Model Downloads

The HuggingFace model (`sentence-transformers/all-MiniLM-L6-v2`) will be downloaded on first startup:
- This happens during the first request, not during build
- Expect the first request to take 30-60 seconds
- Subsequent requests will be faster as the model is cached

## Troubleshooting

### Build Failures

**Issue**: `ModuleNotFoundError` during build
- **Solution**: Make sure all dependencies are in `requirements.txt`

**Issue**: Build takes too long / times out
- **Solution**: Consider using a smaller PyTorch build or CPU-only version

### Runtime Errors

**Issue**: `OpenAI API key not found`
- **Solution**: Check environment variables in Render dashboard

**Issue**: `No existing Chroma vector store found`
- **Solution**: Make sure `vectorstore/chroma_db` directory is committed to Git

**Issue**: CORS errors from frontend
- **Solution**: Add your frontend URL to `ALLOWED_ORIGINS` environment variable

### Performance Issues

**Issue**: Slow response times
- **Solution**: 
  - Upgrade to Starter plan for better performance
  - Optimize vector search parameters
  - Reduce model size or use faster embeddings

**Issue**: Cold starts (first request after inactivity)
- **Solution**: 
  - Upgrade to paid plan to keep service always on
  - Use a ping service to keep it warm (e.g., UptimeRobot)

## Alternative: Using Render Blueprint (render.yaml)

Instead of manual configuration, you can use the included `render.yaml` file:

1. Push `render.yaml` to your repository root (or backend folder)
2. In Render dashboard, select **"New +" → "Blueprint"**
3. Connect your repository
4. Render will auto-detect and use the `render.yaml` configuration
5. You still need to add environment variables manually

## Monitoring & Logs

- View logs in Render dashboard under **"Logs"** tab
- Monitor performance under **"Metrics"** tab
- Set up custom alerts for downtime or errors

## Cost Optimization

1. **Free Tier**: Good for testing and low-traffic apps
2. **Starter ($7/mo)**: Always-on, better for production
3. **Standard ($25/mo)**: More resources, better performance

## Security Best Practices

✅ **Do:**
- Use environment variables for API keys
- Enable HTTPS (automatic on Render)
- Restrict CORS to specific origins
- Keep dependencies updated

❌ **Don't:**
- Commit API keys to Git
- Allow all origins in CORS (`"*"`) in production
- Expose internal endpoints publicly

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Need help?** Check the logs in Render dashboard or reach out to Render support!

