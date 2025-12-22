import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;
    const formattedOrderId = orderId ? `ORD-${orderId.toString().padStart(4, '0')}` : null;

    return (
        <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
            <div style={{
                display: 'inline-flex',
                padding: '2rem',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.1)',
                marginBottom: '2rem'
            }}>
                <CheckCircle size={64} color="var(--color-success)" />
            </div>

            <h1 className="section-title">Order Placed Successfully!</h1>

            {formattedOrderId && (
                <div style={{
                    margin: '1rem 0 2rem',
                    padding: '1rem 2rem',
                    background: 'var(--color-bg-secondary)',
                    display: 'inline-block',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                }}>
                    <span style={{ color: 'var(--color-text-secondary)', marginRight: '0.5rem' }}>Order ID:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--color-primary)' }}>
                        {formattedOrderId}
                    </span>
                </div>
            )}

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/shop" className="btn btn-primary">
                    Continue Shopping <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
