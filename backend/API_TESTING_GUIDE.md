# API Testing Guide

This guide provides multiple ways to easily test the Focaloid Chatbot API.

## API Endpoint

**URL:** `http://127.0.0.1:8000/chat` (local) or your deployed URL  
**Method:** POST  
**Content-Type:** application/json

### Request Format
```json
{
  "question": "Your question here",
  "country": "Country name (optional)"
}
```

### Response Format
```json
{
  "query": "Your question",
  "country": "Country filter used",
  "answer": "The answer from the system",
  "source_metadata": {
    "Country": "Nigeria",
    "Question": "Original question from database",
    "Answer": "Answer text",
    "Comment": "Additional comments"
  }
}
```

---

## Method 1: Interactive Python Script (Recommended!) ⭐

The easiest way to test random questions interactively:

```bash
cd backend
python test_api_interactive.py
```

This gives you:
- **Interactive Mode**: Ask questions one by one
- **Quick Test**: Test a sample question instantly
- **Batch Test**: Test multiple questions automatically
- **Custom Test**: Specify your own question and country

---

## Method 2: Using curl (Command Line)

### Basic Test
```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How to file a car insurance claim?", "country": "Nigeria"}'
```

### Without Country Filter
```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is covered under basic insurance?"}'
```

### Pretty Print Response (with jq)
```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How to renew insurance?", "country": "Kenya"}' | jq
```

---

## Method 3: Using Python `requests` Library

### Simple Test (existing api_test.py)
```bash
cd backend
python api_test.py
```

### Custom Python Script
```python
import requests

response = requests.post(
    "http://127.0.0.1:8000/chat",
    json={
        "question": "Your question here",
        "country": "Nigeria"  # Optional
    }
)

print(response.json())
```

---

## Method 4: Using Postman or Thunder Client

### Setup in Postman:
1. Create new POST request
2. URL: `http://127.0.0.1:8000/chat`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "question": "How to file a claim?",
     "country": "Nigeria"
   }
   ```
5. Click "Send"

---

## Method 5: Browser-Based Testing (HTTPie)

Install HTTPie:
```bash
pip install httpie
```

Test:
```bash
http POST http://127.0.0.1:8000/chat question="How to file a claim?" country="Nigeria"
```

---

## Sample Test Questions

### Insurance Claims
- "How to file a car insurance claim?"
- "What documents are needed for insurance claims?"
- "How long does claim processing take?"

### Policy Information
- "What is covered under basic insurance?"
- "How do I renew my insurance policy?"
- "Can I transfer my insurance policy?"

### General Questions
- "What are the premium payment options?"
- "What is the claim settlement process?"
- "How to update my insurance details?"

---

## Sample Countries
- Nigeria
- Kenya
- South Africa
- Ghana
- Uganda
- Tanzania
- Rwanda

---

## Testing Checklist

Before testing, ensure:
- ✅ Backend server is running (`cd backend && python main.py` or `uvicorn main:app --reload`)
- ✅ Environment variables are set (`.env` file with `OPENAI_API_KEY`)
- ✅ Vector database is initialized (check `vectorstore/chroma_db/` exists)
- ✅ CORS is configured if testing from frontend

---

## Health Check

Check if the API is running:
```bash
curl http://127.0.0.1:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "db_loaded": true,
  "llm_ready": true
}
```

---

## Troubleshooting

### Connection Error
- Make sure backend is running: `cd backend && python main.py`
- Check the port (default is 8000)

### Empty or "nan" Answers
- The question might not match any data in the vector database
- Try using a country filter
- Check if vector database has data: `ls backend/vectorstore/chroma_db/`

### CORS Errors (from frontend)
- Check `ALLOWED_ORIGINS` in backend `.env`
- Default allows: `http://localhost:5173,http://127.0.0.1:5173`

---

## Quick Start (TL;DR)

**Fastest way to test:**
```bash
cd backend
python test_api_interactive.py
```

Choose option 2 for a quick test or option 1 for interactive testing!


