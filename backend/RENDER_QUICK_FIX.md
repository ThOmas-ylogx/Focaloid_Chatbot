# Quick Fix for Render Memory Error

## Problem
`Ran out of memory (used over 512MB)` during deployment on Render free tier.

## Root Cause
PyTorch (full version) is ~800MB+ which exceeds Render's free tier 512MB limit.

## Solution Applied ✅

### 1. **Optimized requirements.txt**
- Changed from `torch==2.8.0` (full version, ~800MB)
- To `torch==2.5.1+cpu` (CPU-only, ~200MB)
- Added `--extra-index-url https://download.pytorch.org/whl/cpu`

### 2. **Updated render.yaml**
- Added `--no-cache-dir` to pip install (reduces memory during build)
- Set `--workers 1` (single worker to save memory)
- Added cache directories: `TRANSFORMERS_CACHE` and `SENTENCE_TRANSFORMERS_HOME`

### 3. **Created runtime.txt**
- Specifies Python 3.11.0 explicitly

## Steps to Deploy Now

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Fix: Optimize for Render free tier memory limits"
   git push origin main
   ```

2. **In Render Dashboard:**
   - Go to your web service
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - OR it will auto-deploy if you have auto-deploy enabled

3. **Wait for build** (5-10 minutes)

4. **Verify deployment:**
   ```bash
   curl https://your-app.onrender.com/health
   ```

## Manual Configuration (If using Dashboard instead of Blueprint)

If you're not using the `render.yaml` file:

**Build Command:**
```bash
pip install --no-cache-dir -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
```

**Environment Variables:**
- `OPENAI_API_KEY` = your_key_here
- `TRANSFORMERS_CACHE` = /tmp/transformers_cache
- `SENTENCE_TRANSFORMERS_HOME` = /tmp/sentence_transformers

## If Still Having Memory Issues

### Option 1: Upgrade to Starter Plan (Recommended)
- Cost: $7/month
- RAM: 512MB → 2GB
- Always-on (no cold starts)
- Much better for production

### Option 2: Further Optimization (Advanced)
Try an even more minimal installation:

**Create a new file `requirements-minimal.txt`:**
```
fastapi==0.117.1
uvicorn[standard]==0.34.0
python-dotenv==1.0.0
openai==1.108.1
chromadb==1.1.0
langchain==0.3.27
langchain_community==0.3.29
langchain_chroma==0.2.6

# Skip heavy ML dependencies
# Use OpenAI embeddings instead of local HuggingFace
```

Then update your code to use OpenAI embeddings instead of HuggingFace (costs a bit more but no PyTorch needed).

### Option 3: Use Alternative Services
- **Railway**: Similar to Render, might have better free tier
- **Fly.io**: 256MB RAM free tier (but different pricing model)
- **Heroku**: No free tier anymore, but Eco dynos are $5/month

## Memory Usage Breakdown

| Package | Size | Notes |
|---------|------|-------|
| PyTorch (full) | ~800MB | ❌ Too large for free tier |
| PyTorch (CPU) | ~200MB | ✅ Used in optimized version |
| sentence-transformers | ~50MB | ✅ Needed for embeddings |
| chromadb | ~30MB | ✅ Vector store |
| langchain | ~20MB | ✅ LLM framework |
| fastapi + uvicorn | ~10MB | ✅ Web framework |
| Other dependencies | ~50MB | ✅ Various |
| **Total (optimized)** | **~360MB** | ✅ **Fits in 512MB** |

## Why This Works

1. **CPU-only PyTorch** is 75% smaller than full version
2. **No CUDA/GPU** dependencies (not needed on Render anyway)
3. **Single worker** reduces memory overhead
4. **No pip cache** during install saves space
5. **Temp cache directories** (`/tmp`) auto-cleaned by Render

## Expected Build Time
- First build: 8-12 minutes (downloading packages)
- Subsequent builds: 3-5 minutes (with cache)
- First request after deploy: 30-60 seconds (model download)

## Verify It Works

After successful deployment:

```bash
# Check health
curl https://your-app.onrender.com/health

# Expected response:
# {"status":"healthy","db_loaded":true,"llm_ready":true}

# Test chat
curl -X POST https://your-app.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the retention percentage in Nigeria?","country":"Nigeria"}'
```

## Still Need Help?

Check the logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Look for memory usage messages
4. Share the error message for more help

---

**TL;DR**: Switched to CPU-only PyTorch (~200MB vs ~800MB). Commit changes and redeploy. Should work on free tier now! 🚀

