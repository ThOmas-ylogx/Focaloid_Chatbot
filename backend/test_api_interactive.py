"""
Interactive API Testing Tool for Focaloid Chatbot
Run this to easily test random questions on the API
"""
import requests
import json
from typing import Optional

# -------------------------------
# Configuration
# -------------------------------
API_URL = "http://127.0.0.1:8000/chat"

# Sample questions you can test
SAMPLE_QUESTIONS = [
    "How to file a car insurance claim?",
    "What documents are needed for health insurance?",
    "How long does it take to process a claim?",
    "What is covered under basic insurance?",
    "How do I renew my insurance policy?",
    "What is the claim settlement process?",
    "Can I transfer my insurance policy?",
    "What are the insurance premium payment options?",
]

SAMPLE_COUNTRIES = [
    "Nigeria",
    "Kenya",
    "South Africa",
    "Ghana",
    "Uganda",
]

# -------------------------------
# Helper Functions
# -------------------------------
def test_question(question: str, country: Optional[str] = None):
    """Test a single question against the API"""
    payload = {
        "question": question,
        "country": country
    }
    
    print(f"\n{'='*70}")
    print(f"🔍 TESTING QUESTION")
    print(f"{'='*70}")
    print(f"Question: {question}")
    print(f"Country: {country or 'None (no filter)'}")
    print(f"{'='*70}\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS!\n")
            print(f"📝 Answer:")
            print(f"   {data.get('answer', 'N/A')}\n")
            
            if data.get('source_metadata'):
                print(f"📚 Source Metadata:")
                metadata = data['source_metadata']
                for key, value in metadata.items():
                    if key != 'Answer' and key != 'Comment':  # Don't repeat the answer
                        print(f"   {key}: {value}")
            print(f"\n{'='*70}\n")
            return data
        else:
            print(f"❌ ERROR: Request failed with status code {response.status_code}")
            print(response.text)
            print(f"\n{'='*70}\n")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to the API.")
        print("   Make sure the backend server is running on http://127.0.0.1:8000")
        print(f"\n{'='*70}\n")
        return None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        print(f"\n{'='*70}\n")
        return None

def interactive_mode():
    """Run in interactive mode - ask questions one by one"""
    print("\n" + "="*70)
    print("🤖 INTERACTIVE API TESTING MODE")
    print("="*70)
    print("Type your questions and get instant answers!")
    print("Commands: 'quit' or 'exit' to stop, 'samples' to see sample questions")
    print("="*70 + "\n")
    
    while True:
        question = input("💬 Your question (or command): ").strip()
        
        if question.lower() in ['quit', 'exit', 'q']:
            print("\n👋 Goodbye!")
            break
        
        if question.lower() == 'samples':
            print("\n📋 Sample Questions:")
            for i, q in enumerate(SAMPLE_QUESTIONS, 1):
                print(f"   {i}. {q}")
            print()
            continue
        
        if not question:
            print("⚠️  Please enter a question.\n")
            continue
        
        country = input("🌍 Country (press Enter to skip): ").strip()
        country = country if country else None
        
        test_question(question, country)

def batch_test_mode():
    """Test multiple sample questions at once"""
    print("\n" + "="*70)
    print("📦 BATCH TESTING MODE")
    print("="*70)
    print("Testing all sample questions with different countries...")
    print("="*70 + "\n")
    
    results = []
    
    # Test a few combinations
    test_cases = [
        (SAMPLE_QUESTIONS[0], SAMPLE_COUNTRIES[0]),
        (SAMPLE_QUESTIONS[1], SAMPLE_COUNTRIES[1]),
        (SAMPLE_QUESTIONS[2], SAMPLE_COUNTRIES[0]),
        (SAMPLE_QUESTIONS[3], None),  # Without country filter
    ]
    
    for question, country in test_cases:
        result = test_question(question, country)
        results.append(result)
        input("Press Enter to continue to next test...")
    
    print("\n" + "="*70)
    print("📊 BATCH TEST SUMMARY")
    print("="*70)
    print(f"Total tests: {len(results)}")
    print(f"Successful: {sum(1 for r in results if r is not None)}")
    print(f"Failed: {sum(1 for r in results if r is None)}")
    print("="*70 + "\n")

def quick_test():
    """Quick single test with a sample question"""
    print("\n" + "="*70)
    print("⚡ QUICK TEST MODE")
    print("="*70 + "\n")
    
    question = SAMPLE_QUESTIONS[0]
    country = SAMPLE_COUNTRIES[0]
    test_question(question, country)

# -------------------------------
# Main Menu
# -------------------------------
def main():
    print("\n" + "="*70)
    print("🚀 FOCALOID CHATBOT - API TESTING TOOL")
    print("="*70)
    print("\nChoose a testing mode:\n")
    print("  1. Interactive Mode - Ask questions one by one")
    print("  2. Quick Test - Test one sample question")
    print("  3. Batch Test - Test multiple sample questions")
    print("  4. Custom Single Test - Specify question and country")
    print("  5. Exit")
    print("\n" + "="*70 + "\n")
    
    choice = input("Enter your choice (1-5): ").strip()
    
    if choice == '1':
        interactive_mode()
    elif choice == '2':
        quick_test()
    elif choice == '3':
        batch_test_mode()
    elif choice == '4':
        question = input("\n💬 Enter your question: ").strip()
        country = input("🌍 Enter country (or press Enter to skip): ").strip()
        country = country if country else None
        test_question(question, country)
    elif choice == '5':
        print("\n👋 Goodbye!")
    else:
        print("\n⚠️  Invalid choice. Please run again and choose 1-5.")

if __name__ == "__main__":
    main()


