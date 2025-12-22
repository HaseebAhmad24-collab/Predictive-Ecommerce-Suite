import sys
import os

# Add the parent directory to sys.path to resolve imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine
from backend import models, schemas, crud

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if products exist
    count = db.query(models.Product).count()
    if count > 0:
        print(f"Database already seeded with {count} products!")
        db.close()
        return

    products = [
        schemas.ProductCreate(
            name="AI Smart 4K TV",
            description="Experience the future of entertainment with AI upscaling.",
            price=1200.00,
            stock_quantity=50,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1593784997437-27e4497e70e9?auto=format&fit=crop&w=600&q=80"
        ),
        schemas.ProductCreate(
            name="Neural Noise Cancelling Headphones",
            description="Headphones that adapt to your environment using AI.",
            price=350.00,
            stock_quantity=100,
            category="Audio",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
        ),
        schemas.ProductCreate(
            name="Quantum Smartwatch",
            description="Track your health with medical-grade precision.",
            price=299.99,
            stock_quantity=75,
            category="Wearables",
            image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
        ),
        schemas.ProductCreate(
            name="Holographic Projector",
            description="Portable 3D display for the modern professional.",
            price=899.50,
            stock_quantity=30,
            category="Gadgets",
            image_url="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=600&q=80"
        ),
        schemas.ProductCreate(
            name="Smart Lounge Chair",
            description="Ergonomic design with auto-adjustment features.",
            price=450.00,
            stock_quantity=20,
            category="Furniture",
            image_url="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=600&q=80"
        )
    ]

    for product in products:
        crud.create_product(db=db, product=product)
        print(f"Added: {product.name}")

    # Create Admin User
    admin_email = "admin@example.com"
    admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not admin:
        print("Creating admin user...")
        fake_hashed_password = "admin123" + "notreallyhashed" # In a real app, use proper hashing
        db_admin = models.User(
            email=admin_email, 
            hashed_password=fake_hashed_password, 
            is_admin=True
        )
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        print("Admin user created: admin@example.com / admin123")
    else:
        print("Admin user already exists.")

    db.close()

if __name__ == "__main__":
    try:
        seed_data()
        print("Seeding completed successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

