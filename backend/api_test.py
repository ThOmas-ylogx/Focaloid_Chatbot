import requests
import json

# -------------------------------
# Backend API URL
# -------------------------------
API_URL = "http://127.0.0.1:8000/chat"  # Update if running on a different host/port

# -------------------------------
# Example query
# -------------------------------
payload = {
    "question": "How to file a car insurance claim in Nigeria?",
    "country": "Nigeria"
}

# -------------------------------
# Send POST request
# -------------------------------
response = requests.post(API_URL, json=payload)

# -------------------------------
# Print results
# -------------------------------
if response.status_code == 200:
    data = response.json()
    print(data)
    # print("Query:", data.get("query"))
    # print("\nRetrieved Documents:")
    # for doc in data.get("retrieved_documents", []):
    #     print(f"- {doc['content']} (Country: {doc['metadata'].get('Country')})")
    # print("\nAnswer from LLM:")
    # print(data.get("answer"))
else:
    print(f"Request failed with status code {response.status_code}")
    print(response.text)
