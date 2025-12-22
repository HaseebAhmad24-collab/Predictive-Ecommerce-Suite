import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend.models import User, Order, Product
from backend import crud, schemas

def test_system():
    db = SessionLocal()
    print("--- DIAGNOSTIC START ---")
    
    # 1. Check Admin User
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if admin:
        print(f"[OK] Admin found: {admin.email}")
        print(f"     Is Admin? {admin.is_admin}")
        print(f"     Password Match? {admin.hashed_password == 'admin123notreallyhashed'}")
    else:
        print("[FAIL] Admin user NOT found!")

    # 2. Check Products
    products = db.query(Product).all()
    print(f"[OK] Products found: {len(products)}")

    # 3. Create Test Order
    if products:
        try:
            print("--- Attempting to create test order ---")
            p = products[0]
            order_data = schemas.OrderCreate(
                customer_name="Test Bot",
                customer_email="bot@test.com",
                shipping_address="123 Test Lane",
                total_amount=p.price,
                items=[schemas.OrderItemCreate(product_id=p.id, quantity=1)]
            )
            # We need to manually invoke the crud logic since we aren't running via API
            # But getting here means models are loaded correctly
            print("[OK] Order schemas loaded correctly.")
        except Exception as e:
            print(f"[FAIL] Schema Error: {e}")

    print("--- DIAGNOSTIC END ---")
    db.close()

if __name__ == "__main__":
    test_system()
