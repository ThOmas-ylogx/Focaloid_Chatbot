# Batch Testing Your Questions

I've created everything you need to test all 45 questions and get answers back in JSON format!

## 📁 Files Created

1. **nigeria_questions.json** - Your 45 questions in JSON format
2. **test_batch_questions.py** - Standalone script with questions embedded
3. **test_from_json.py** - Flexible script that reads from any JSON file

## 🚀 Quick Start

### Step 1: Start the Backend

In one terminal:
```bash
cd backend
python main.py
```

Or:
```bash
cd backend
uvicorn main:app --reload
```

### Step 2: Run the Batch Test

In another terminal, choose ONE of these options:

#### Option A: Using the JSON file (Recommended!)
```bash
cd backend
python test_from_json.py nigeria_questions.json
```

This will create `nigeria_questions_results.json` with all answers!

#### Option B: Using the embedded script
```bash
cd backend
python test_batch_questions.py
```

This will create `test_results_with_answers.json` with all answers!

#### Option C: Custom output file name
```bash
cd backend
python test_from_json.py nigeria_questions.json my_custom_results.json
```

## 📊 What You'll Get

The output JSON will look like this:

```json
[
  {
    "question": "Are there any mandatory tariffs that apply...",
    "country": "Nigeria",
    "answer": "The actual answer from your API...",
    "source_metadata": {
      "Country": "Nigeria",
      "Question": "Original question from database",
      "Answer": "Full answer",
      "Comment": "Additional info"
    }
  },
  ...
]
```

## ⏱️ Timing

- **45 questions** with 0.5s delay between each
- **Total time**: ~22-30 seconds
- Progress shown in real-time

## 🔧 Customization

### Change the delay between requests:
Edit `test_from_json.py` line 13:
```python
TIMEOUT = 30  # Change timeout if needed
```

Or in the function call, modify the delay parameter (currently 0.5 seconds).

### Use your own questions:
Just create a JSON file with this format:
```json
[
  { "question": "Your question?", "country": "Nigeria" },
  { "question": "Another question?", "country": "Kenya" }
]
```

Then run:
```bash
python test_from_json.py your_questions.json
```

## 🎯 Expected Output

During execution, you'll see:
```
================================================================================
🚀 BATCH TESTING FROM FILE: nigeria_questions.json
📊 Total questions: 45
================================================================================

[1/45] Are there any mandatory tariffs that apply to certain lines...
         Country: Nigeria
         ✅ Answer preview here...

[2/45] Does your country operate any compulsory or optional reinsura...
         Country: Nigeria
         ✅ Answer preview here...

...

================================================================================
✅ BATCH TEST COMPLETE
================================================================================
Total questions: 45
Successful: 43
Failed: 2

📁 Results saved to: nigeria_questions_results.json
================================================================================
```

## 🐛 Troubleshooting

### "Connection Error"
- Make sure backend is running: `cd backend && python main.py`
- Check health: `curl http://127.0.0.1:8000/health`

### "No relevant documents found"
- This is normal if the database doesn't have specific info
- The API will return this message in the answer field

### Timeout Errors
- Increase TIMEOUT in the script (default is 30 seconds)
- Check if your OpenAI API key is valid

## 💡 Tips

1. **Run in background**: The script shows progress, so keep the terminal visible
2. **Check results file**: Open the JSON file to see all answers
3. **Re-run failed tests**: You can extract failed items and test them separately
4. **Use VS Code**: Open the results JSON in VS Code for nice formatting

## 📋 Example: View Results

```bash
# View in terminal (if you have jq)
cat nigeria_questions_results.json | jq

# Or just open in VS Code
code nigeria_questions_results.json
```

---

**Ready to go!** Just start your backend and run the script! 🚀





