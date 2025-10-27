"""
Simple API Test Script
Quick way to test the Focaloid Chatbot API
"""
import requests
import json

# -------------------------------
# Backend API URL
# -------------------------------
API_URL = "http://127.0.0.1:8000/chat"  # Update if running on a different host/port

# -------------------------------
# Test Cases
# -------------------------------
test_cases = [
    {
        "question": "How to file a car insurance claim in Nigeria?",
        "country": "Nigeria"
    },
    {
        "question": "What documents are needed for health insurance?",
        "country": "Kenya"
    },
    {
        "question": "What is covered under basic insurance?",
        "country": None  # Test without country filter
    },
    {
        "question": "How do I renew my insurance policy?",
        "country": "South Africa"
    },
]

# -------------------------------
# Run Tests
# -------------------------------
print("\n" + "="*70)
print("🤖 RUNNING API TESTS")
print("="*70 + "\n")

for i, payload in enumerate(test_cases, 1):
    print(f"Test {i}/{len(test_cases)}")
    print(f"Question: {payload['question']}")
    print(f"Country: {payload.get('country', 'None (no filter)')}")
    print("-" * 70)
    
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS")
            print(f"\nAnswer: {data.get('answer', 'N/A')}\n")
            
            if data.get('source_metadata'):
                print("Source Metadata:")
                metadata = data['source_metadata']
                for key, value in metadata.items():
                    if key not in ['Answer', 'Comment']:  # Don't repeat the answer
                        print(f"  {key}: {value}")
        else:
            print(f"❌ FAILED - Status code: {response.status_code}")
            print(response.text)
    
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to the API")
        print("Make sure the backend is running: cd backend && python main.py")
        break
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    print("="*70 + "\n")

print("🏁 All tests completed!\n")
