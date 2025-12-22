"""
Generate demo sales data for demand forecasting
"""
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
import models
from database import SessionLocal

def generate_demo_sales_data(days: int = 60):
    """
    Generate realistic sales data for the last 'days' days
    """
    db = SessionLocal()
    
    # Curated list of realistic names
    CUSTOMER_NAMES = [
        "Haseeb Ahmed", "Sarah Khan", "Zeeshan Ali", "Ayesha Malik", 
        "Omar Farooq", "Fatima Zahra", "Bilal Sheikh", "Sana Javed",
        "Hamza Siddiqui", "Anam Yousaf", "Usman Ghani", "Maria B",
        "John Doe", "Jane Smith", "Alex Johnson", "Emily Brown"
    ]
    
    CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "London", "New York"]

    try:
        # Cleanup PREVIOUS demo data to fix slowness
        print("Cleaning up old demo data...")
        db.query(models.OrderItem).delete()
        db.query(models.Order).delete()
        db.commit()

        products = db.query(models.Product).all()
        
        if not products:
            print("No products found. Please run seed.py first.")
            return
        
        print(f"Found {len(products)} products. Generating {days} days of sales data...")
        
        # Generate orders for each day
        start_date = datetime.utcnow() - timedelta(days=days)
        
        for day_offset in range(days):
            order_date = start_date + timedelta(days=day_offset)
            
            # Determine number of orders for this day (More orders on weekends)
            is_weekend = order_date.weekday() >= 5
            base_orders = random.randint(4, 10) if is_weekend else random.randint(2, 6)
            
            for _ in range(base_orders):
                name = random.choice(CUSTOMER_NAMES)
                email = f"{name.lower().replace(' ', '.')}@example.com"
                city = random.choice(CITIES)
                address = f"House {random.randint(1, 400)}, Sector {random.choice(['A', 'B', 'G', 'F'])}, {city}"

                # Create order
                order = models.Order(
                    customer_name=name,
                    customer_email=email,
                    shipping_address=address,
                    total_amount=0,
                    status=random.choice(["pending", "delivered", "delivered", "delivered", "pending"]), # Bias towards delivered
                    created_at=order_date
                )
                db.add(order)
                db.flush()  # Get order ID
                
                # Select 1-4 random products for this order
                num_items = random.randint(1, 4)
                selected_products = random.sample(products, min(num_items, len(products)))

                total = 0
                for product in selected_products:
                    quantity = random.randint(1, 2)
                    price = product.price
                    
                    order_item = models.OrderItem(
                        order_id=order.id,
                        product_id=product.id,
                        quantity=quantity,
                        price_at_purchase=price
                    )
                    db.add(order_item)
                    total += price * quantity
                
                order.total_amount = total
        
        db.commit()
        print(f"Generated demo sales data for {days} days!")
        
    except Exception as e:
        print(f"Error generating demo data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    generate_demo_sales_data(days=60)
