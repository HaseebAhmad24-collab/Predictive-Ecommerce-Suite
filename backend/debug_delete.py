import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_delete_order():
    print("1. Creating a dummy order to delete...")
    # Create a dummy order first so we have something to delete
    order_payload = {
        "customer_name": "Delete Test User",
        "customer_email": "delete@test.com",
        "shipping_address": "Test Delete Address",
        "total_amount": 10.0,
        "items": [] # Empty items for simplicity if allowed, otherwise backend might complain.
        # Wait, schemas.OrderCreate expects items.
    }
    # Actually, create_order expects items. Let's list products to find a valid product ID.
    try:
        products = requests.get(f"{BASE_URL}/products/").json()
        if not products:
            print("No products found to create order with.")
            # Can't easily test if we can't create.
            # But let's try to delete a non-existent order to check 404.
            print("2. Attempting to delete non-existent order ID 99999...")
            del_resp = requests.delete(f"{BASE_URL}/orders/99999")
            print(f"Delete 99999 status: {del_resp.status_code}")
            if del_resp.status_code == 404:
                print("PASS: Backend correctly returned 404 for missing order.")
            elif del_resp.status_code == 405:
                print("FAIL: Method Not Allowed. DELETE endpoint not registered?")
            else:
                print(f"FAIL: Unexpected status {del_resp.status_code}")
            return

        p_id = products[0]['id']
        order_payload['items'] = [{"product_id": p_id, "quantity": 1}]
        
        create_resp = requests.post(f"{BASE_URL}/orders/", json=order_payload)
        if create_resp.status_code != 200:
            print(f"Failed to create dummy order: {create_resp.text}")
            return
        
        order_id = create_resp.json()['id']
        print(f"Created dummy order ID: {order_id}")
        
        print(f"3. Deleting order ID {order_id}...")
        del_resp = requests.delete(f"{BASE_URL}/orders/{order_id}")
        
        print(f"Delete status: {del_resp.status_code}")
        print(f"Delete response: {del_resp.text}")
        
        if del_resp.status_code == 200:
            print("PASS: Order deleted successfully.")
        elif del_resp.status_code == 405:
            print("FAIL: Method Not Allowed. DELETE endpoint missing.")
        else:
            print(f"FAIL: Failed to delete. Status: {del_resp.status_code}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_delete_order()
