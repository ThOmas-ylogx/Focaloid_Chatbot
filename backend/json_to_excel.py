"""
Convert JSON results to Excel format
Creates an Excel file with question number, question, country, and answer columns
"""
import json
import pandas as pd
import sys

def json_to_excel(json_file, excel_file=None):
    """
    Convert JSON results to Excel format
    
    Args:
        json_file: Path to input JSON file
        excel_file: Path to output Excel file (optional)
    """
    # Read JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Prepare data for Excel
    excel_data = []
    for i, item in enumerate(data, start=1):
        excel_data.append({
            'Question Number': i,
            'Question': item.get('question', ''),
            'Country': item.get('country', ''),
            'Answer': item.get('answer', '')
        })
    
    # Create DataFrame
    df = pd.DataFrame(excel_data)
    
    # Set default output file name if not provided
    if excel_file is None:
        excel_file = json_file.replace('.json', '.xlsx')
        if excel_file == json_file:
            excel_file = 'output.xlsx'
    
    # Write to Excel
    df.to_excel(excel_file, index=False, sheet_name='Questions and Answers')
    
    print(f"✅ Excel file created successfully: {excel_file}")
    print(f"📊 Total rows: {len(excel_data)}")
    print(f"\nColumns:")
    print(f"  - Question Number")
    print(f"  - Question")
    print(f"  - Country")
    print(f"  - Answer")
    
    return excel_file

def main():
    if len(sys.argv) < 2:
        print("Usage: python json_to_excel.py <input_json_file> [output_excel_file]")
        print("\nExample:")
        print("  python json_to_excel.py cameroon_questions_results.json")
        print("  python json_to_excel.py cameroon_questions_results.json output.xlsx")
        sys.exit(1)
    
    json_file = sys.argv[1]
    excel_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        json_to_excel(json_file, excel_file)
    except FileNotFoundError:
        print(f"❌ Error: File '{json_file}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()





