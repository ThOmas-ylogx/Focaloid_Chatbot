# 🧪 API Testing Guide - Quick Start

## TL;DR - Fastest Ways to Test

### Option 1: Interactive Python Tool (Recommended!) ⭐
```bash
cd backend
python test_api_interactive.py
```
Choose an option and start testing! This is the most user-friendly way.

### Option 2: Simple Python Script
```bash
cd backend
python api_test.py
```
Runs 4 pre-configured test cases automatically.

### Option 3: Windows Batch File (Double-click!)
```
Double-click: backend/test_api.bat
```
Or run from command prompt:
```cmd
cd backend
test_api.bat
```

### Option 4: Bash Script (Mac/Linux/Git Bash)
```bash
cd backend
chmod +x test_api.sh
./test_api.sh
```

### Option 5: Direct curl Command
```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"How to file a claim?\", \"country\": \"Nigeria\"}"
```

---

## What Each Tool Does

| Tool | Best For | Interactive? |
|------|----------|--------------|
| `test_api_interactive.py` | Testing random questions, exploring | ✅ Yes |
| `api_test.py` | Quick batch test of 4 questions | ❌ No |
| `test_api.bat` | Windows users, quick test | ❌ No |
| `test_api.sh` | Mac/Linux/Git Bash, quick test | ❌ No |
| curl commands | One-off tests, scripting | ❌ No |

---

## Prerequisites

1. **Backend must be running:**
   ```bash
   cd backend
   python main.py
   ```
   Or:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Check if backend is healthy:**
   ```bash
   curl http://127.0.0.1:8000/health
   ```
   Should return: `{"status": "healthy", "db_loaded": true, "llm_ready": true}`

---

## Sample Questions to Try

- "How to file a car insurance claim?"
- "What documents are needed for health insurance?"
- "How long does claim processing take?"
- "What is covered under basic insurance?"
- "How do I renew my insurance policy?"
- "Can I transfer my insurance policy?"
- "What are the insurance premium payment options?"

## Sample Countries

- Nigeria
- Kenya
- South Africa
- Ghana
- Uganda
- Tanzania
- Rwanda

---

## Troubleshooting

**Connection Error:**
- Make sure backend is running: `cd backend && python main.py`

**"No relevant documents found":**
- Try adding a country filter
- Check if your question matches the insurance domain
- Verify vector database exists: `ls backend/vectorstore/chroma_db/`

**CORS Error (if testing from browser):**
- Update `ALLOWED_ORIGINS` in backend `.env` file

---

## Full Documentation

For more advanced usage and detailed information, see:
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - Complete testing guide with all methods

---

## Quick Test Right Now

If your backend is running, try this in Python:

```python
import requests

response = requests.post(
    "http://127.0.0.1:8000/chat",
    json={
        "question": "How to file a car insurance claim?",
        "country": "Nigeria"
    }
)

print(response.json()['answer'])
```

Or in your terminal:
```bash
python test_api_interactive.py
```

Happy testing! 🚀


