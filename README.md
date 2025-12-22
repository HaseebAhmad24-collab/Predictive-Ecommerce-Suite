# AI-Driven E-Commerce & Inventory Management System

## 🚀 Project Overview
This project is a high-performance, AI-integrated e-commerce platform designed for modern retailers. It combines a seamless shopping experience with a powerful, data-driven Administrative Panel that leverages machine learning to automate business intelligence. 

The core of this project lies in its two primary AI implementations: **Conversational Customer Support** and **Predictive Inventory Forecasting**.

---

## 🤖 Feature 1: Intelligent AI Chatbot
The platform features a 24/7 conversational assistant designed to enhance user engagement and provide instant support.

### Technical Implementation:
- **Core Engine**: Powered by **Google Gemini Pro API**.
- **Context Awareness**: Capable of multi-turn conversations with history persistence.
- **Functionality**:
    - Real-time response generation.
    - Conversation history management (delete/clear).
    - Seamless integration into the Shop UI via a persistent widget.

---

## 📊 Feature 2: Machine Learning Demand Forecasting
The Admin Panel includes a state-of-the-art forecasting suite that helps business owners predict future demand and minimize inventory stockouts.

### Technical Implementation:
- **Hybrid ML Approach**: The system utilizes a dual-model architecture from the `scikit-learn` library:
    1. **Linear Regression**: Ideal for identifying consistent growth trends and seasonality.
    2. **Random Forest Regressor**: A robust ensemble method capable of capturing complex, non-linear patterns in sales data.
- **Automated Model Selection**: For every product, the system automatically trains both models and selects the "Champion" based on the lowest **RMSE (Root Mean Squared Error)** and **MAE (Mean Absolute Error)**.
- **Advanced Feature Engineering**:
    - **Temporal Features**: Day of week, Month, Weekend indicators, and Trend lines.
    - **Lag Analysis**: 7, 14, and 30-day historical sales lags to capture momentum.
    - **Rolling Statistics**: 7-day and 14-day moving averages and standard deviation to measure volatility.
- **Growth Realism Filter**: To ensure business-grade reliability, we implemented a **1.8x Growth Cap** on historical peak sales, preventing unrealistic spikes and stabilized projections.

---

## 🚨 Automated Stock Alert System
Integrated directly with the ML engine, the system provides proactive business intelligence:
- **Days Until Stockout**: Dynamically calculates how long current inventory will last based on forecasted daily demand.
- **Smart Recommendations**: Suggests exact reorder quantities to meet predicted demand for the next 30 days.
- **Tiered Alerts**:
    - 🔴 **Critical**: Less than 7 days of stock remaining.
    - 🟡 **Warning**: Less than 14 days of stock remaining.
    - 🔵 **Info**: Approaching reorder threshold (<30 days).

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Lucide Icons, Glassmorphism UI, Framer Motion animations.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite/PostgreSQL.
- **Machine Learning**: Pandas, NumPy, Scikit-learn.
- **AI Integration**: Google Generative AI (Gemini).

---

## 🛤️ Future Roadmap
- [ ] **Prophet Integration**: Adding Meta's Prophet model for multi-year seasonality.
- [ ] **Image Recognition**: AI-based product tagging and categorical sorting.
- [ ] **Sentiment Analysis**: Analyzing customer reviews to adjust demand forecasts.
- [ ] **Automated Procurement**: Integrating with supplier APIs for one-click reordering.

---
**Developed with focus on Scalability, Accuracy, and User Experience.**
