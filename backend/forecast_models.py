from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class DemandForecast(Base):
    """Stores ML-generated demand predictions for products"""
    __tablename__ = "demand_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    forecast_date = Column(DateTime)  # Date for which prediction is made
    predicted_demand = Column(Float)  # Predicted quantity
    confidence_lower = Column(Float)  # Lower confidence bound
    confidence_upper = Column(Float)  # Upper confidence bound
    model_used = Column(String)  # 'linear_regression' or 'random_forest'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    product = relationship("Product")


class StockAlert(Base):
    """Stores inventory alerts based on predictions"""
    __tablename__ = "stock_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    alert_type = Column(String)  # 'critical', 'warning', 'info'
    message = Column(String)
    recommended_order_qty = Column(Integer)
    days_until_stockout = Column(Integer)
    status = Column(String, default="active")  # 'active', 'dismissed', 'resolved'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    product = relationship("Product")


class SalesHistory(Base):
    """Aggregated daily sales data for ML training"""
    __tablename__ = "sales_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    date = Column(DateTime, index=True)
    quantity_sold = Column(Integer, default=0)
    revenue = Column(Float, default=0.0)
    
    # Relationship
    product = relationship("Product")
