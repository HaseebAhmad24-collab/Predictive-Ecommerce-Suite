import google.generativeai as genai
import os
import re
import time
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import func
import models

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Store Information
STORE_INFO = {
    "name": "TechMart",
    "owner": "Haseeb",
    "contact": "+92 300 1234567",
    "email": "support@techmart.com",
    "description": "Your trusted online store for smart tech products"
}

def get_chat_response(db: Session, user_message: str) -> str:
    """
    Enhanced chatbot with better error handling, retry logic, and optimized context.
    """
    if not GOOGLE_API_KEY:
        return "I am an AI assistant, but my brain (API Key) is missing. Please tell the admin to configure the GEMINI_API_KEY."

    # Retry logic with exponential backoff
    max_retries = 3
    retry_delay = 1  # seconds
    
    for attempt in range(max_retries):
        try:
            # 1. Build Product Context (Optimized)
            products = db.query(models.Product).all()
            
            if not products:
                product_context = "No products available at the moment.\n"
            else:
                product_context = "**Available Products:**\n"
                for p in products:
                    status = "✅ In Stock" if p.stock_quantity > 0 else "❌ Out of Stock"
                    product_context += f"• {p.name} - ${p.price} | Category: {p.category} | {status}\n"
                    product_context += f"  Description: {p.description}\n"

            # 2. Build Order Context (Only if needed - Optimized)
            order_context = ""
            user_message_upper = user_message.upper()
            
            # Check if user is asking about orders
            order_keywords = ["ORDER", "ORD-", "STATUS", "DELIVERY", "TRACKING", "SHIPMENT"]
            is_order_query = any(keyword in user_message_upper for keyword in order_keywords)
            
            if is_order_query:
                # Extract specific order ID if mentioned
                order_match = re.search(r'ORD-(\d+)', user_message_upper)
                
                if order_match:
                    # User asked about specific order
                    order_num = int(order_match.group(1))
                    specific_order = db.query(models.Order).filter(models.Order.id == order_num).first()
                    
                    if specific_order:
                        order_id = f"ORD-{str(specific_order.id).zfill(4)}"
                        order_context = f"\n**📦 Order Details for {order_id}:**\n"
                        order_context += f"• Status: {specific_order.status.upper()}\n"
                        order_context += f"• Customer: {specific_order.customer_name}\n"
                        order_context += f"• Email: {specific_order.customer_email}\n"
                        order_context += f"• Shipping Address: {specific_order.shipping_address}\n"
                        order_context += f"• Total Amount: ${specific_order.total_amount}\n"
                        order_context += f"• Order Date: {specific_order.created_at.strftime('%Y-%m-%d %H:%M')}\n"
                        order_context += f"• Items Ordered:\n"
                        for item in specific_order.items:
                            product_name = item.product.name if item.product else "Unknown Product"
                            order_context += f"  - {product_name} x{item.quantity} @ ${item.price_at_purchase}\n"
                    else:
                        order_context = f"\n⚠️ Order ORD-{str(order_num).zfill(4)} not found in database.\n"
                else:
                    # General order query - show recent orders (limit to 10 for efficiency)
                    recent_orders = db.query(models.Order).order_by(models.Order.created_at.desc()).limit(10).all()
                    if recent_orders:
                        order_context = "\n**📦 Recent Orders:**\n"
                        for o in recent_orders:
                            order_id = f"ORD-{str(o.id).zfill(4)}"
                            order_context += f"• {order_id} - {o.status.upper()} | Customer: {o.customer_name} | ${o.total_amount}\n"

            # 3. Construct Optimized System Prompt
            system_prompt = f"""You are a helpful AI Sales Assistant for {STORE_INFO['name']}, an e-commerce store.

**STORE INFORMATION:**
• Store Name: {STORE_INFO['name']}
• Owner: {STORE_INFO['owner']}
• Contact: {STORE_INFO['contact']}
• Email: {STORE_INFO['email']}
• About: {STORE_INFO['description']}

**PRODUCT CATALOG:**
{product_context}

**ORDER INFORMATION:**
{order_context if order_context else "No order information requested."}

**STORE POLICIES:**
• 🚚 Delivery: 3-5 business days
• 🔄 Returns: 7-day return policy for defective items
• 💳 Payment: Cash on Delivery (COD) and Credit Card
• 📞 Support: {STORE_INFO['contact']}

**ORDER STATUS GUIDE:**
• PENDING: Order received, awaiting payment
• PROCESSING: Payment confirmed, preparing shipment
• SHIPPED: Order dispatched, in transit
• DELIVERED: Successfully delivered
• CANCELLED: Order cancelled

**YOUR CAPABILITIES:**
1. ✅ Answer questions about products (name, price, category, stock)
2. ✅ Provide product recommendations based on budget/needs
3. ✅ Track orders using Order ID (format: ORD-XXXX)
4. ✅ Explain store policies (delivery, returns, payment)
5. ✅ Provide store contact information
6. ✅ Understand and respond in ENGLISH or ROMAN URDU (match user's language)

**RESPONSE RULES:**
• Be concise, friendly, and helpful
• Use emojis occasionally for better engagement
• If asked about order status, check the order information above
• If order not found, say: "Order nahi mila. Please verify Order ID ya contact support."
• For product price ranges, calculate from available products
• Match user's language (English or Roman Urdu)
• If unsure, say: "Main sure nahi hoon. Please contact {STORE_INFO['contact']} for details."

**EXAMPLES:**
User: "kis range me products hain?"
You: "Hamare products $34 se lekar $700 tak available hain! 😊"

User: "delivery policy kya hai?"
You: "Delivery 3-5 business days mein hoti hai. 🚚"

User: "ORD-0011 ka status?"
You: [Check order info above and provide status]

Now answer this query: {user_message}"""

            # 4. Configure Safety Settings for Better Reliability
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]

            # 5. Call Gemini API with configuration
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 500,
            }
            
            model = genai.GenerativeModel(
                model_name='gemini-2.5-flash',
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            response = model.generate_content(system_prompt)
            
            # Check if response was blocked
            if not response.text:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                    continue
                return "Sorry, main abhi soch nahi pa raha. Please thodi der baad try karein. 🤖"
            
            return response.text.strip()

        except Exception as e:
            print(f"Gemini API Error (Attempt {attempt + 1}/{max_retries}): {e}")
            
            # If not last attempt, retry with backoff
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
                continue
            
            # Last attempt failed
            return f"Sorry, main abhi kuch technical issue face kar raha hoon. Please {STORE_INFO['contact']} par contact karein. 🤖"
    
    return "Sorry, I am having trouble thinking right now. Please try again later."
