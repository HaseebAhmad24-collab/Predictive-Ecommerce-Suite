from database import SessionLocal
import models
from datetime import datetime, timedelta
import pandas as pd

def debug_product_history(product_name="Gaming Mouse "):
    db = SessionLocal()
    try:
        product = db.query(models.Product).filter(models.Product.name == product_name).first()
        if not product:
            print(f"Product '{product_name}' not found.")
            return

        cutoff_date = datetime.utcnow() - timedelta(days=60)
        items = db.query(models.OrderItem).join(models.Order).filter(
            models.OrderItem.product_id == product.id,
            models.Order.created_at >= cutoff_date
        ).all()

        sales_by_date = {}
        for item in items:
            date = item.order.created_at.date()
            sales_by_date[date] = sales_by_date.get(date, 0) + item.quantity

        df = pd.DataFrame(list(sales_by_date.items()), columns=['Date', 'Sales']).sort_values('Date')
        print(f"--- Sales History for {product_name} ---")
        if not df.empty:
            print(df.tail(20))
            print(f"Total Sales (60 Days): {df['Sales'].sum()}")
            print(f"Average Daily Sales: {df['Sales'].mean():.2f}")
        else:
            print("No sales history found.")

    finally:
        db.close()

if __name__ == "__main__":
    debug_product_history()
