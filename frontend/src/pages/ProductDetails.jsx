import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../lib/CartContext';
import { ArrowLeft, ShoppingCart, Tag } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Use the dedicated endpoint for better performance and reliability
                const response = await api.get(`/products/${id}`);
                // API returns the product object directly (schema Product)
                if (response.data) {
                    setProduct(response.data);
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
                const msg = err.response?.status === 404
                    ? "Product not found."
                    : "Failed to load product details. Please check connection.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="spinner"></div>
        </div>
    );

    if (error || !product) return (
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Product Not Found</h2>
            <button className="btn btn-secondary" onClick={() => navigate('/shop')}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Shop
            </button>
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <button
                onClick={() => navigate('/shop')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    marginBottom: '2rem'
                }}
            >
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <div className="product-details-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1fr) 1fr',
                gap: '4rem',
                alignItems: 'start'
            }}>
                {/* Image Section */}
                <div style={{
                    background: 'white', // White background for better product visibility
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    height: '350px', // Fixed height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain', // Ensures image fits without cropping
                                display: 'block'
                            }}
                        />
                    ) : (
                        <div style={{
                            color: 'var(--color-text-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <span>No Image Available</span>
                        </div>
                    )}
                </div>
                {/* Info Section */}
                <div className="product-info-details">
                    <span style={{
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '0.875rem'
                    }}>
                        {product.category}
                    </span>

                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        marginTop: '0.5rem',
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {product.name}
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <span style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: 'var(--color-success)'
                        }}>
                            ${product.price}
                        </span>
                        {product.stock_quantity > 0 ? (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: 'var(--color-success)',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                In Stock
                            </span>
                        ) : (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'var(--color-danger)',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                Out of Stock
                            </span>
                        )}
                    </div>

                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        marginBottom: '2.5rem'
                    }}>
                        {product.description}
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity <= 0}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <ShoppingCart size={24} />
                        Add to Cart
                    </button>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Tag size={16} />
                                <span>Free Shipping</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Tag size={16} />
                                <span>30 Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .product-details-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetails;
