"""
Flexible Batch Testing Script
Reads questions from JSON file and outputs results with answers
"""
import requests
import json
import time
import sys
from typing import List, Dict

# API Configuration
API_URL = "http://127.0.0.1:8000/chat"
TIMEOUT = 30  # seconds

def test_questions_from_json(input_file: str, output_file: str = None, delay: float = 0.5):
    """
    Read questions from JSON file, test them, and save results with answers
    
    Args:
        input_file: Path to input JSON file
        output_file: Path to output JSON file (optional, defaults to input_file with _results suffix)
        delay: Delay between requests in seconds
    """
    # Read input file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            questions = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in '{input_file}': {e}")
        return
    
    # Validate input
    if not isinstance(questions, list):
        print("❌ Error: JSON must be a list of question objects")
        return
    
    # Set default output file
    if output_file is None:
        output_file = input_file.replace('.json', '_results.json')
        if output_file == input_file:
            output_file = 'results.json'
    
    total = len(questions)
    results = []
    
    print(f"\n{'='*80}")
    print(f"🚀 BATCH TESTING FROM FILE: {input_file}")
    print(f"📊 Total questions: {total}")
    print(f"{'='*80}\n")
    
    for i, item in enumerate(questions, 1):
        question = item.get('question', '')
        country = item.get('country', None)
        
        if not question:
            print(f"[{i}/{total}] ⚠️  Skipping: No question provided")
            results.append({**item, "answer": "Error: No question provided", "error": "No question"})
            continue
        
        print(f"[{i}/{total}] {question[:70]}{'...' if len(question) > 70 else ''}")
        print(f"         Country: {country or 'None'}")
        
        payload = {
            "question": question,
            "country": country
        }
        
        try:
            response = requests.post(API_URL, json=payload, timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                
                result = {
                    **item,
                    "answer": data.get('answer', 'No answer provided'),
                    "source_metadata": data.get('source_metadata', {})
                }
                
                answer_preview = str(data.get('answer', 'N/A'))[:80]
                print(f"         ✅ {answer_preview}{'...' if len(str(data.get('answer', ''))) > 80 else ''}")
            else:
                result = {
                    **item,
                    "answer": f"Error: API returned status {response.status_code}",
                    "source_metadata": {},
                    "error": f"HTTP {response.status_code}"
                }
                print(f"         ❌ Failed - Status {response.status_code}")
        
        except requests.exceptions.ConnectionError:
            result = {
                **item,
                "answer": "Error: Could not connect to API. Make sure backend is running.",
                "source_metadata": {},
                "error": "Connection Error"
            }
            print(f"         ❌ Connection Error - Is backend running?")
        
        except requests.exceptions.Timeout:
            result = {
                **item,
                "answer": "Error: Request timed out",
                "source_metadata": {},
                "error": "Timeout"
            }
            print(f"         ❌ Timeout after {TIMEOUT}s")
        
        except Exception as e:
            result = {
                **item,
                "answer": f"Error: {str(e)}",
                "source_metadata": {},
                "error": str(e)
            }
            print(f"         ❌ Error: {str(e)}")
        
        results.append(result)
        print()
        
        # Delay between requests
        if i < total and delay > 0:
            time.sleep(delay)
    
    # Save results
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"{'='*80}")
        print(f"✅ BATCH TEST COMPLETE")
        print(f"{'='*80}")
        print(f"Total questions: {total}")
        print(f"Successful: {sum(1 for r in results if 'error' not in r)}")
        print(f"Failed: {sum(1 for r in results if 'error' in r)}")
        print(f"\n📁 Results saved to: {output_file}")
        print(f"{'='*80}\n")
        
    except Exception as e:
        print(f"\n❌ Error saving results: {e}")
        print("Results:")
        print(json.dumps(results, indent=2, ensure_ascii=False))

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_from_json.py <input_json_file> [output_json_file]")
        print("\nExample:")
        print("  python test_from_json.py questions.json")
        print("  python test_from_json.py questions.json results.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    test_questions_from_json(input_file, output_file)

if __name__ == "__main__":
    main()





