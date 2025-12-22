import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../lib/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container-pro empty-cart-pro">
        <div className="empty-inner-v2 glass-panel">
          <div className="empty-visual">
            <ShoppingBag size={100} className="floating-icon" />
            <div className="glow-effect"></div>
          </div>
          <h2 className="section-h2">Your selection is <br /><span className="text-gradient-pro">awaiting innovation</span></h2>
          <p className="empty-p">
            It seems you haven't added any items to your digital inventory yet. Let's find something extraordinary.
          </p>

          <div className="empty-quick-links">
            <Link to="/shop?category=Electronics" className="quick-link-tile shadow-sm">
              <Zap size={18} /> <span>Electronics</span>
            </Link>
            <Link to="/shop?category=Wearables" className="quick-link-tile shadow-sm">
              <ShieldCheck size={18} /> <span>Wearables</span>
            </Link>
          </div>

          <Link to="/shop" className="btn-premium btn-primary-pro empty-cta">
            Browse Full Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pro cart-page-pro">
      <div className="cart-header-pro">
        <h2 className="section-h2">Your <span className="text-gradient-pro">Selection</span></h2>
        <span className="cart-count-label">{cartItems.length} Innovative Items</span>
      </div>

      <div className="cart-grid-pro">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="modern-cart-card glass-panel">
              <div className="cart-item-img">
                <img
                  src={item.image_url || `https://picsum.photos/seed/${item.id + 100}/500/500`}
                  alt={item.name}
                />
              </div>
              <div className="cart-item-info">
                <span className="item-cat">{item.category}</span>
                <h3>{item.name}</h3>
                <div className="item-price-pro">${item.price}</div>
              </div>
              <div className="cart-item-actions">
                <div className="qty-pro shadow-md">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="remove-trigger"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove from selection"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-pro">
          <div className="summary-inner glass-panel sticky-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="s-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="s-row">
                <span>Shipping</span>
                <span className="text-success-pro">Free</span>
              </div>
              <div className="s-row">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="s-row total-row">
              <span>Estimated Total</span>
              <span className="total-amount">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn-premium btn-primary-pro checkout-trigger"
              onClick={() => navigate('/checkout')}
            >
              Complete Purchase <Zap size={18} fill="currentColor" />
            </button>

            <div className="summary-trust">
              <ShieldCheck size={14} /> <span>SSL Secure Transaction</span>
            </div>

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear entire selection
            </button>
          </div>
        </div>
      </div>

      <style>{`
                .cart-page-pro {
                    padding: 4rem 0;
                    animation: fadeIn 0.8s ease-out;
                }

                .cart-header-pro {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 1rem;
                }

                .cart-count-label {
                    color: var(--color-text-dim);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.75rem;
                }

                .cart-grid-pro {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 2rem;
                }

                .cart-items-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .modern-cart-card {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    gap: 1.5rem;
                    border-radius: var(--radius-lg);
                    transition: var(--transition-fast);
                    will-change: transform;
                    transform: var(--gpu-accelerate);
                }

                .modern-cart-card:hover {
                    border-color: var(--color-primary);
                    transform: translate3d(5px, 0, 0);
                }

                .cart-item-img {
                    width: 70px;
                    height: 70px;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    background: var(--color-bg-accent);
                    flex-shrink: 0;
                }

                .cart-item-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .cart-item-info { flex: 1; }
                .item-cat { font-size: 0.6rem; font-weight: 800; color: var(--color-primary); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.25rem; }
                .cart-item-info h3 { font-size: 1.1rem; font-weight: 700; margin: 0; color: white; }
                .item-price-pro { font-size: 1rem; font-weight: 800; color: white; margin-top: 0.25rem; }

                .cart-item-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .qty-pro {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255,255,255,0.05);
                    padding: 0.4rem 0.6rem;
                    border-radius: 100px;
                    border: 1px solid var(--color-border);
                }

                .qty-pro button {
                    background: transparent;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    display: flex;
                    padding: 0.2rem;
                    transition: 0.2s;
                }

                .qty-pro button:hover { color: white; transform: scale(1.1); }
                .qty-pro span { min-width: 20px; text-align: center; font-weight: 800; color: white; font-size: 0.9rem; }

                .remove-trigger {
                    background: transparent;
                    border: none;
                    color: var(--color-text-dim);
                    cursor: pointer;
                    transition: var(--transition-fast);
                }

                .remove-trigger:hover { color: var(--color-danger); transform: rotate(15deg); }

                .sticky-summary {
                    position: sticky;
                    top: 100px;
                    padding: 1.75rem;
                    border-radius: var(--radius-xl);
                }

                .summary-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1.5rem; color: white; }
                .summary-rows { display: flex; flex-direction: column; gap: 1rem; }
                .s-row { display: flex; justify-content: space-between; color: var(--color-text-secondary); font-weight: 600; font-size: 0.9rem; }
                .text-success-pro { color: var(--color-success); font-weight: 800; }

                .summary-divider {
                    height: 1px;
                    background: var(--color-border);
                    margin: 1.5rem 0;
                }

                .total-row { color: white; }
                .total-amount { font-size: 1.4rem; font-weight: 900; }

                .checkout-trigger {
                    width: 100%;
                    margin-top: 1.5rem;
                    justify-content: center;
                    padding: 0.85rem;
                    font-size: 1rem;
                }

                .summary-trust {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 1.25rem;
                    color: var(--color-text-dim);
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .clear-cart-btn {
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: var(--color-text-dim);
                    font-size: 0.8rem;
                    margin-top: 1.5rem;
                    text-decoration: underline;
                    cursor: pointer;
                    font-weight: 600;
                    transition: 0.2s;
                }

                .clear-cart-btn:hover { color: var(--color-danger); }

                .empty-cart-pro {
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .empty-inner-v2 {
                    text-align: center;
                    padding: 4rem;
                    max-width: 550px;
                    border-radius: var(--radius-xl);
                    position: relative;
                    overflow: hidden;
                }

                .empty-visual {
                    position: relative;
                    margin-bottom: 2.5rem;
                    display: inline-block;
                }

                .floating-icon {
                    color: var(--color-primary);
                    animation: float 4s ease-in-out infinite;
                    position: relative;
                    z-index: 1;
                    filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.3));
                }

                .glow-effect {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 120px;
                    height: 120px;
                    background: var(--color-primary);
                    filter: blur(80px);
                    opacity: 0.2;
                    border-radius: 50%;
                }

                @keyframes float {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(0, -20px, 0); }
                }

                .empty-p { 
                    color: var(--color-text-secondary); 
                    margin-bottom: 2.5rem; 
                    font-size: 1rem; 
                    line-height: 1.6;
                }

                .empty-quick-links {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 3rem;
                }

                .quick-link-tile {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--color-border);
                    padding: 0.75rem 1.5rem;
                    border-radius: 100px;
                    text-decoration: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: var(--transition-fast);
                }

                .quick-link-tile:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: var(--color-primary);
                    transform: translate3d(0, -3px, 0);
                    color: white;
                }

                .empty-cta {
                    padding: 1rem 2.5rem;
                }

                @media (max-width: 968px) {
                    .cart-grid-pro { grid-template-columns: 1fr; }
                    .sticky-summary { position: static; }
                    .modern-cart-card { flex-direction: column; text-align: center; gap: 1.5rem; }
                    .cart-item-actions { justify-content: center; width: 100%; }
                }
            `}</style>
    </div>
  );
};

export default Cart;
