import requests
import json
import sys

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# Test chatbot endpoint
url = "http://localhost:8000/chat/message"
payload = {
    "message": "hi"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
except Exception as e:
    print(f"Error: {e}")
