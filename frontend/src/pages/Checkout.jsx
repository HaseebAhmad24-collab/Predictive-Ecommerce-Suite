import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useToast } from '../lib/ToastContext';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import api from '../lib/api';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'cod'
    });

    const [loading, setLoading] = useState(false);

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2>Your cart is empty</h2>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                    Go Shopping
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload according to backend schema
            const orderPayload = {
                customer_name: formData.fullName,
                customer_email: formData.email,
                shipping_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
                total_amount: cartTotal,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await api.post('/orders/', orderPayload);
            const orderId = response.data.id;

            clearCart();
            addToast("Order placed successfully!", "success");
            navigate('/order-success', { state: { orderId: orderId } });


        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.detail
                ? `Error: ${error.response.data.detail}`
                : "Failed to place order. Please try again.";
            addToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container checkout-page">
            <h2 className="section-title">Checkout</h2>

            <div className="checkout-grid">
                {/* Left Column: Form */}
                <div className="checkout-form-container card">
                    <h3>Shipping Information</h3>
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 AI Boulevard"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    required
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <h3 style={{ marginTop: '2rem' }}>Payment Method</h3>
                        <div className="payment-options">
                            <div
                                className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                            >
                                <Truck size={24} />
                                <span>Cash on Delivery</span>
                            </div>
                            <div
                                className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                            >
                                <CreditCard size={24} />
                                <span>Credit Card (Mock)</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Order Summary */}
                <div className="order-summary card">
                    <h3>Your Order</h3>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="divider"></div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        className="btn btn-primary place-order-btn"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>

                    <p className="security-note">
                        <CheckCircle size={16} style={{ color: 'var(--color-success)', marginRight: '5px' }} />
                        Secure Checkout
                    </p>
                </div>
            </div>

            <style>{`
                .checkout-page { padding: 3rem 1rem; }
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 2rem;
                    margin-top: 2rem;
                }
                @media (max-width: 900px) {
                    .checkout-grid { grid-template-columns: 1fr; }
                    .order-summary { order: -1; margin-bottom: 2rem; }
                }

                .form-group { margin-bottom: 1rem; }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                }
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                    color: white;
                }
                .form-group input:focus {
                    outline: none;
                    border-color: var(--color-primary);
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .payment-options { display: flex; gap: 1rem; margin-top: 1rem; }
                .payment-option {
                    flex: 1;
                    border: 1px solid var(--color-border);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .payment-option.selected {
                    border-color: var(--color-primary);
                    background: rgba(59, 130, 246, 0.1);
                }
                .payment-option:hover { background: rgba(255,255,255,0.05); }

                .summary-items { margin-bottom: 1.5rem; }
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                }
                .divider { height: 1px; background: var(--color-border); margin: 1rem 0; }
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-bottom: 1.5rem;
                }
                .place-order-btn { width: 100%; justify-content: center; }
                .security-note {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 1rem;
                    font-size: 0.8rem;
                    color: var(--color-text-secondary);
                }
            `}</style>
        </div>
    );
};

export default Checkout;
