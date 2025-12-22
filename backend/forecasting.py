"""
Demand Forecasting Engine using Linear Regression and Random Forest
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sqlalchemy.orm import Session
import models
import forecast_models


class DemandForecaster:
    """ML-based demand forecasting for inventory management"""
    
    def __init__(self, db: Session):
        self.db = db
        self.lr_model = LinearRegression()
        self.rf_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        self.best_model = None
        self.best_model_name = None
        
    def prepare_sales_history(self, product_id: int, days: int = 60) -> pd.DataFrame:
        """
        Extract and prepare sales history for a product
        """
        # Get orders from last 'days' days
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Query order items for this product
        order_items = self.db.query(
            models.OrderItem
        ).join(
            models.Order
        ).filter(
            models.OrderItem.product_id == product_id,
            models.Order.created_at >= cutoff_date
        ).all()
        
        # Aggregate by date
        sales_by_date = {}
        for item in order_items:
            date = item.order.created_at.date()
            if date not in sales_by_date:
                sales_by_date[date] = 0
            sales_by_date[date] += item.quantity
        
        # Create date range and fill missing dates with 0
        start_date = cutoff_date.date()
        end_date = datetime.utcnow().date()
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')
        
        df = pd.DataFrame({'date': date_range})
        df['sales'] = df['date'].apply(lambda x: sales_by_date.get(x.date(), 0))
        
        return df
    
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create features for ML models
        """
        df = df.copy()
        
        # Time-based features
        df['day_of_week'] = df['date'].dt.dayofweek  # 0=Monday, 6=Sunday
        df['month'] = df['date'].dt.month
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        df['day_of_month'] = df['date'].dt.day
        
        # Lag features (previous sales)
        df['sales_lag_7'] = df['sales'].shift(7).fillna(0)
        df['sales_lag_14'] = df['sales'].shift(14).fillna(0)
        df['sales_lag_30'] = df['sales'].shift(30).fillna(0)
        
        # Rolling statistics
        df['rolling_mean_7'] = df['sales'].rolling(window=7, min_periods=1).mean()
        df['rolling_mean_14'] = df['sales'].rolling(window=14, min_periods=1).mean()
        df['rolling_std_7'] = df['sales'].rolling(window=7, min_periods=1).std().fillna(0)
        
        # Trend (days since start)
        df['trend'] = range(len(df))
        
        return df
    
    def train_models(self, df: pd.DataFrame):
        """
        Train both Linear Regression and Random Forest models
        """
        # Drop rows with NaN (from lag features)
        df = df.dropna()
        
        if len(df) < 20:  # Need minimum data
            raise ValueError("Insufficient data for training. Need at least 20 days of sales history.")
        
        # Features and target
        feature_cols = ['day_of_week', 'month', 'is_weekend', 'day_of_month',
                       'sales_lag_7', 'sales_lag_14', 'sales_lag_30',
                       'rolling_mean_7', 'rolling_mean_14', 'rolling_std_7', 'trend']
        
        X = df[feature_cols]
        y = df['sales']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        
        # Train Linear Regression
        self.lr_model.fit(X_train, y_train)
        lr_pred = self.lr_model.predict(X_test)
        lr_rmse = np.sqrt(mean_squared_error(y_test, lr_pred))
        lr_mae = mean_absolute_error(y_test, lr_pred)
        lr_r2 = r2_score(y_test, lr_pred)
        
        # Train Random Forest
        self.rf_model.fit(X_train, y_train)
        rf_pred = self.rf_model.predict(X_test)
        rf_rmse = np.sqrt(mean_squared_error(y_test, rf_pred))
        rf_mae = mean_absolute_error(y_test, rf_pred)
        rf_r2 = r2_score(y_test, rf_pred)
        
        # Select best model (lower RMSE is better)
        if lr_rmse <= rf_rmse:
            self.best_model = self.lr_model
            self.best_model_name = "linear_regression"
            print(f"✅ Linear Regression selected (RMSE: {lr_rmse:.2f}, MAE: {lr_mae:.2f}, R²: {lr_r2:.2f})")
        else:
            self.best_model = self.rf_model
            self.best_model_name = "random_forest"
            print(f"✅ Random Forest selected (RMSE: {rf_rmse:.2f}, MAE: {rf_mae:.2f}, R²: {rf_r2:.2f})")
        
        return {
            'lr_rmse': lr_rmse, 'lr_mae': lr_mae, 'lr_r2': lr_r2,
            'rf_rmse': rf_rmse, 'rf_mae': rf_mae, 'rf_r2': rf_r2,
            'best_model': self.best_model_name
        }
    
    def predict_future(self, df: pd.DataFrame, days_ahead: int = 30) -> pd.DataFrame:
        """
        Generate future predictions
        """
        predictions = []
        last_date = df['date'].max()
        
        # Use last row as base for predictions
        last_row = df.iloc[-1].copy()
        
        for i in range(1, days_ahead + 1):
            future_date = last_date + timedelta(days=i)
            
            # Create features for future date
            features = {
                'day_of_week': future_date.dayofweek,
                'month': future_date.month,
                'is_weekend': 1 if future_date.dayofweek >= 5 else 0,
                'day_of_month': future_date.day,
                'sales_lag_7': last_row['sales'] if i <= 7 else predictions[-7]['predicted_demand'],
                'sales_lag_14': last_row['sales_lag_7'] if i <= 14 else predictions[-14]['predicted_demand'],
                'sales_lag_30': last_row['sales_lag_14'] if i <= 30 else predictions[-30]['predicted_demand'],
                'rolling_mean_7': last_row['rolling_mean_7'],
                'rolling_mean_14': last_row['rolling_mean_14'],
                'rolling_std_7': last_row['rolling_std_7'],
                'trend': last_row['trend'] + i
            }
            
            # Predict
            X_future = pd.DataFrame([features])
            pred = self.best_model.predict(X_future)[0]
            
            # --- REALISM FILTER (Growth Damping) ---
            # Agreed with user: 1.8x cap on historical peak sales
            # to provide growth room without unrealistic spikes.
            max_hist_daily = df['sales'].max() if not df.empty else 1
            growth_cap = max(max_hist_daily * 1.8, 10) # 1.8x cap with floor of 10
            
            pred = min(max(0, pred), growth_cap) # No negative, no unrealistic spikes
            # ---------------------------------------
            
            # Confidence interval (±1 std deviation)
            std = last_row['rolling_std_7']
            
            predictions.append({
                'date': future_date,
                'predicted_demand': round(pred, 2),
                'confidence_lower': max(0, round(pred - std, 2)),
                'confidence_upper': round(pred + std, 2)
            })
        
        return pd.DataFrame(predictions)
    
    def generate_forecasts(self, product_id: int, forecast_days: int = 30):
        """
        Complete forecasting pipeline for a product
        """
        try:
            # Step 1: Prepare data
            df = self.prepare_sales_history(product_id, days=60)
            
            if df['sales'].sum() == 0:
                print(f"⚠️ No sales history for product {product_id}")
                return None
            
            # Step 2: Engineer features
            df = self.engineer_features(df)
            
            # Step 3: Train models
            metrics = self.train_models(df)
            
            # Step 4: Generate predictions
            predictions_df = self.predict_future(df, days_ahead=forecast_days)
            
            # Step 5: Save to database
            self.save_forecasts(product_id, predictions_df)
            
            return {
                'product_id': product_id,
                'model_used': self.best_model_name,
                'metrics': metrics,
                'predictions': predictions_df.to_dict('records')
            }
            
        except Exception as e:
            print(f"❌ Error forecasting for product {product_id}: {e}")
            return None
    
    def save_forecasts(self, product_id: int, predictions_df: pd.DataFrame):
        """
        Save predictions to database
        """
        # Delete old forecasts for this product
        self.db.query(forecast_models.DemandForecast).filter(
            forecast_models.DemandForecast.product_id == product_id
        ).delete()
        
        # Insert new forecasts
        for _, row in predictions_df.iterrows():
            forecast = forecast_models.DemandForecast(
                product_id=product_id,
                forecast_date=row['date'],
                predicted_demand=row['predicted_demand'],
                confidence_lower=row['confidence_lower'],
                confidence_upper=row['confidence_upper'],
                model_used=self.best_model_name
            )
            self.db.add(forecast)
        
        self.db.commit()
    
    def generate_stock_alerts(self, product_id: int):
        """
        Generate stock alerts based on predictions
        """
        product = self.db.query(models.Product).filter(models.Product.id == product_id).first()
        if not product:
            return
        
        # Get predictions for next 30 days
        forecasts = self.db.query(forecast_models.DemandForecast).filter(
            forecast_models.DemandForecast.product_id == product_id
        ).order_by(forecast_models.DemandForecast.forecast_date).limit(30).all()
        
        if not forecasts:
            return
        
        # Calculate total predicted demand
        total_demand_7 = sum([f.predicted_demand for f in forecasts[:7]])
        total_demand_14 = sum([f.predicted_demand for f in forecasts[:14]])
        total_demand_30 = sum([f.predicted_demand for f in forecasts[:30]])
        
        current_stock = product.stock_quantity
        
        # Calculate days until stockout
        avg_daily_demand = total_demand_30 / 30 if total_demand_30 > 0 else 0
        days_until_stockout = current_stock / avg_daily_demand if avg_daily_demand > 0 else 999
        
        # Delete old alerts for this product
        self.db.query(forecast_models.StockAlert).filter(
            forecast_models.StockAlert.product_id == product_id,
            forecast_models.StockAlert.status == "active"
        ).delete()
        
        # Generate alert if needed
        alert_type = None
        message = None
        recommended_qty = 0
        
        if days_until_stockout < 7:
            alert_type = "critical"
            message = f"🚨 CRITICAL: {product.name} will run out in {int(days_until_stockout)} days!"
            recommended_qty = int(total_demand_30)
        elif days_until_stockout < 14:
            alert_type = "warning"
            message = f"⚠️ WARNING: {product.name} stock low. {int(days_until_stockout)} days remaining."
            recommended_qty = int(total_demand_30)
        elif days_until_stockout < 30:
            alert_type = "info"
            message = f"ℹ️ INFO: {product.name} - Consider reordering soon."
            recommended_qty = int(total_demand_30)
        
        if alert_type:
            alert = forecast_models.StockAlert(
                product_id=product_id,
                alert_type=alert_type,
                message=message,
                recommended_order_qty=recommended_qty,
                days_until_stockout=int(days_until_stockout)
            )
            self.db.add(alert)
            self.db.commit()


def train_all_products(db: Session):
    """
    Train forecasting models for all products
    """
    forecaster = DemandForecaster(db)
    products = db.query(models.Product).all()
    
    results = []
    for product in products:
        print(f"\n📊 Training model for: {product.name}")
        result = forecaster.generate_forecasts(product.id, forecast_days=30)
        if result:
            forecaster.generate_stock_alerts(product.id)
            results.append(result)
    
    return results
