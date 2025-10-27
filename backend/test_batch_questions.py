"""
Batch Question Testing Script
Tests multiple questions and adds answers to the JSON
"""
import requests
import json
import time
from typing import List, Dict

# API Configuration
API_URL = "http://127.0.0.1:8000/chat"
TIMEOUT = 30  # seconds

def test_question_batch(questions: List[Dict]) -> List[Dict]:
    """
    Test a batch of questions and add answers to each
    
    Args:
        questions: List of dicts with 'question' and 'country' keys
    
    Returns:
        List of dicts with added 'answer' and 'source_metadata' keys
    """
    results = []
    total = len(questions)
    
    print(f"\n{'='*80}")
    print(f"🚀 BATCH TESTING: {total} questions")
    print(f"{'='*80}\n")
    
    for i, item in enumerate(questions, 1):
        question = item.get('question', '')
        country = item.get('country', None)
        
        print(f"[{i}/{total}] Testing: {question[:70]}{'...' if len(question) > 70 else ''}")
        print(f"         Country: {country}")
        
        payload = {
            "question": question,
            "country": country
        }
        
        try:
            response = requests.post(API_URL, json=payload, timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                
                # Add answer and metadata to the original item
                result = {
                    **item,  # Keep original question and country
                    "answer": data.get('answer', 'No answer provided'),
                    "source_metadata": data.get('source_metadata', {})
                }
                
                print(f"         ✅ Success")
                print(f"         Answer: {data.get('answer', 'N/A')[:100]}{'...' if len(str(data.get('answer', ''))) > 100 else ''}")
            else:
                result = {
                    **item,
                    "answer": f"Error: API returned status {response.status_code}",
                    "source_metadata": {},
                    "error": response.text
                }
                print(f"         ❌ Failed - Status {response.status_code}")
        
        except requests.exceptions.ConnectionError:
            result = {
                **item,
                "answer": "Error: Could not connect to API. Make sure backend is running.",
                "source_metadata": {},
                "error": "Connection Error"
            }
            print(f"         ❌ Connection Error")
        
        except requests.exceptions.Timeout:
            result = {
                **item,
                "answer": "Error: Request timed out",
                "source_metadata": {},
                "error": "Timeout"
            }
            print(f"         ❌ Timeout")
        
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
        
        # Small delay to avoid overwhelming the API
        if i < total:
            time.sleep(0.5)
    
    return results

def main():
    # Your questions
    questions = [
        { "question": "Are there any mandatory tariffs that apply to certain lines of business or specific coverages in your country?", "country": "Nigeria" },
        { "question": "Does your country operate any compulsory or optional reinsurance pools or state reinsurance schemes?", "country": "Nigeria" },
        { "question": "If yes, please specify which lines of business or covers are affected.", "country": "Nigeria" },
        { "question": "Is there a minimum retention level you must maintain when ceding premiums to reinsurers?", "country": "Nigeria" },
        { "question": "If yes, please indicate the required retention percentage.", "country": "Nigeria" },
        { "question": "Are you required to involve a mandatory intermediary or state reinsurer before ceding the policy to Generali?", "country": "Nigeria" },
        { "question": "If yes, please provide the name of the reinsurer.", "country": "Nigeria" },
        { "question": "If yes, please specify the overrider commission percentage applicable to the reinsurer.", "country": "Nigeria" },
        { "question": "If yes, please specify the retention percentage applicable to the reinsurer.", "country": "Nigeria" },
        { "question": "Do you need to apply a Reinsurance Tax (RI Tax) when ceding premiums back to Generali?", "country": "Nigeria" },
        { "question": "If yes, please specify the applicable rate or amount for the RI Tax.", "country": "Nigeria" },
        { "question": "If yes, please specify the basis for RI Tax calculation (gross or net premium).", "country": "Nigeria" },
        { "question": "Does the Cash Before Cover principle apply in your country?", "country": "Nigeria" },
        { "question": "What are your standard premium payment terms, measured in days from the invoice date?", "country": "Nigeria" },
        { "question": "What are your standard policy cancellation terms if the premium remains unpaid within the payment period?", "country": "Nigeria" },
        { "question": "What are your general policy cancellation terms (number of days' notice)?", "country": "Nigeria" },
        { "question": "Are you permitted to issue policies retroactively, i.e., backdating the effective coverage date?", "country": "Nigeria" },
        { "question": "Can you issue a policy certificate or proof of insurance before issuing the full policy document?", "country": "Nigeria" },
        { "question": "Can you issue a policy before signing the Slip or Reinsurance Covernote?", "country": "Nigeria" },
        { "question": "Is it mandatory to use a broker to issue policies in your country?", "country": "Nigeria" },
        { "question": "In addition to the local currency, in which other currencies can you issue policies?", "country": "Nigeria" },
        { "question": "Can you participate in a Centralized Premium Collection (CPC) arrangement?", "country": "Nigeria" },
        { "question": "If yes, can you receive only deductions such as overrider fees, brokerage, and local taxes directly?", "country": "Nigeria" },
        { "question": "How often are Reinsurance Bordereaux submitted to Generali (monthly, quarterly, etc.)?", "country": "Nigeria" },
        { "question": "After the closing of the reporting period, how many days do you take to send Premium and Claims Bordereaux?", "country": "Nigeria" },
        { "question": "Please provide the name of your bank.", "country": "Nigeria" },
        { "question": "Please provide your bank account number.", "country": "Nigeria" },
        { "question": "Please specify the currency of your bank account.", "country": "Nigeria" },
        { "question": "What is the policy jurisdiction for Casualty and Financial Lines policies?", "country": "Nigeria" },
        { "question": "If you exclude Pandemic, Infectious, or Communicable Diseases (e.g., COVID-19), please provide the exclusion wording.", "country": "Nigeria" },
        { "question": "For Property policies covering Business Interruption under Public Authority clauses, do you exclude pandemic-related losses as triggers?", "country": "Nigeria" },
        { "question": "If yes, please provide the wording of the Public Authority clause.", "country": "Nigeria" },
        { "question": "Do your policies include a Sanctions Clause?", "country": "Nigeria" },
        { "question": "If yes, please share the wording of your Sanctions Clause.", "country": "Nigeria" },
        { "question": "Do you have a sanctions screening process or tool to comply with international and local sanctions requirements?", "country": "Nigeria" },
        { "question": "For Marine Cargo, is local insurance compulsory under specific Incoterms?", "country": "Nigeria" },
        { "question": "For Marine Cargo, is there any compulsory local insurance requirement for import, export, or domestic transit?", "country": "Nigeria" },
        { "question": "Do you need broker confirmation of the policy draft before issuance as per local regulation?", "country": "Nigeria" },
        { "question": "Are you able to work with Third-Party Administrators (TPAs)?", "country": "Nigeria" },
        { "question": "Do you maintain a list of approved TPAs that you work with?", "country": "Nigeria" },
        { "question": "Can you delegate claims authority to a TPA or to Generali as the reinsurer?", "country": "Nigeria" },
        { "question": "Is an English-language, non-binding version of the policy available upon request?", "country": "Nigeria" },
        { "question": "Do you require specific documentation, such as KYC, before issuing a local policy?", "country": "Nigeria" },
        { "question": "Can you issue Property policies on an All Risks basis?", "country": "Nigeria" },
        { "question": "If you exclude Cyber risk, please provide the exclusion wording.", "country": "Nigeria" }
    ]
    
    # Test all questions
    results = test_question_batch(questions)
    
    # Save results to file
    output_file = "test_results_with_answers.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"{'='*80}")
    print(f"✅ BATCH TEST COMPLETE")
    print(f"{'='*80}")
    print(f"Total questions: {len(questions)}")
    print(f"Successful: {sum(1 for r in results if 'error' not in r)}")
    print(f"Failed: {sum(1 for r in results if 'error' in r)}")
    print(f"\n📁 Results saved to: {output_file}")
    print(f"{'='*80}\n")
    
    # Print a sample result
    if results:
        print("📋 Sample Result (first question):")
        print(json.dumps(results[0], indent=2))

if __name__ == "__main__":
    main()





