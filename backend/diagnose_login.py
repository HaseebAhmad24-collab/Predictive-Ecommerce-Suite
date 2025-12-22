import requests
import sys

def test_login():
    url = "http://localhost:8000/admin/login"
    payload = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    print(f"Testing Login to: {url}")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("[SUCCESS] Login working correctly from Python side.")
        else:
            print("[FAIL] Login failed.")
            
    except Exception as e:
        print(f"[CRITICAL FAIL] Could not connect to backend: {e}")
        print("Is the backend server running?")

if __name__ == "__main__":
    test_login()
