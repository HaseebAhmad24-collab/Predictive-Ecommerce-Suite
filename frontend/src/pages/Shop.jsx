import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../lib/CartContext';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/');
                let data = response.data;

                if (searchQuery) {
                    const lowerQuery = searchQuery.toLowerCase();
                    data = data.filter(p =>
                        p.name.toLowerCase().includes(lowerQuery) ||
                        p.description.toLowerCase().includes(lowerQuery) ||
                        p.category.toLowerCase().includes(lowerQuery)
                    );
                }

                setProducts(data);
            } catch (err) {
                console.error("Backend offline or empty", err);
                setError("Could not connect to the store backend.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery]);

    return (
        <div className="container shop-page">
            <h2 className="section-title">Latest Collection</h2>

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading AI-Curated Products...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                    <br /><small>Please ensure the backend server is running.</small>
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="empty-state">
                    <p>No products found in the catalog.</p>
                </div>
            )}

            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <div className="product-image-container">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="product-image" />
                                ) : (
                                    <div className="product-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="product-info">
                            <p className="category">{product.category}</p>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h3>{product.name}</h3>
                            </Link>

                            <div className="product-footer">
                                <p className="price">${product.price}</p>
                                <button
                                    className="btn-add-cart"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}</div>
        </div>
    );
};

export default Shop;
