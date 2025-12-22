from sqlalchemy.orm import Session
import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def update_order_status(db: Session, order_id: int, status: str):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order

def create_order(db: Session, order: schemas.OrderCreate):
    # 1. Deduct stock and validate availability
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise Exception(f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise Exception(f"Not enough stock for {product.name}")
        
        product.stock_quantity -= item.quantity
    
    # 2. Create Order
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        shipping_address=order.shipping_address,
        total_amount=order.total_amount,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # 3. Create Order Items
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=product.price
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    # Retrieve order
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        return False
    
    # Delete associated order items first (if cascade is not set in models, but safe to do explicit)
    db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).delete()
    
    # Delete order
    db.delete(db_order)
    db.commit()
    return True
