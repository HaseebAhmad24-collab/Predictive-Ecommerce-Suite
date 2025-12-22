import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Search, Package, DollarSign, Layers, Image as ImageIcon, X, PackageSearch } from 'lucide-react';
import api from '../../lib/api';
import { useToast } from '../../lib/ToastContext';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { globalSearch } = useOutletContext();
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: '',
        image_url: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct({ ...product });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setCurrentProduct({ name: '', description: '', price: '', stock_quantity: '', category: '', image_url: '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
                addToast('Product deleted successfully', 'success');
            } catch (error) {
                console.error("Failed to delete product", error);
                addToast('Failed to delete product', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...currentProduct,
                price: parseFloat(currentProduct.price),
                stock_quantity: parseInt(currentProduct.stock_quantity)
            };

            if (isEditMode) {
                await api.put(`/products/${currentProduct.id}`, productData);
                addToast('Product updated successfully', 'success');
            } else {
                await api.post('/products/', productData);
                addToast('Product created successfully', 'success');
            }

            setIsModalOpen(false);
            setCurrentProduct({ name: '', description: '', price: '', stock_quantity: '', category: '', image_url: '' });
            fetchProducts();
        } catch (error) {
            console.error("Failed to save product", error);
            addToast('Failed to save product', 'error');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(globalSearch.toLowerCase())
    );

    return (
        <div className="admin-products-view">
            <header className="view-header">
                <div>
                    <h1 className="text-gradient">Products Inventory</h1>
                    <p className="subtitle">Manage your stock and product catalog</p>
                </div>
                <button className="btn-3d btn-glow" onClick={handleOpenAddModal}>
                    <Plus size={20} /> Add New Product
                </button>
            </header>

            <div className="stats-row">
                <div className="stat-pill glass">
                    <Package size={18} />
                    <span>Total: <strong>{products.length}</strong></span>
                </div>
                <div className="stat-pill glass">
                    <Layers size={18} />
                    <span>Categories: <strong>{[...new Set(products.map(p => p.category))].length}</strong></span>
                </div>
            </div>

            <div className="products-grid-container premium-card">
                {filteredProducts.length > 0 ? (
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>Product Info</th>
                                <th>Category</th>
                                <th>Pricing</th>
                                <th>Inventory</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="table-row">
                                    <td className="img-cell">
                                        <div className="product-thumb glass">
                                            {product.image_url ?
                                                <img src={product.image_url} alt={product.name} /> :
                                                <Package size={20} className="placeholder-icon" />
                                            }
                                        </div>
                                    </td>
                                    <td>
                                        <div className="info-cell">
                                            <span className="p-name">{product.name}</span>
                                            <span className="p-desc">{product.description?.substring(0, 45)}...</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-tag">{product.category}</span>
                                    </td>
                                    <td>
                                        <div className="price-tag">
                                            <DollarSign size={14} />
                                            <span>{product.price}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`stock-status ${product.stock_quantity < 10 ? 'critical' : 'healthy'}`}>
                                            <div className="status-dot"></div>
                                            <span>{product.stock_quantity} in stock</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-group">
                                            <button className="icon-btn" onClick={() => handleEdit(product)}>
                                                <Edit size={18} />
                                            </button>
                                            <button className="icon-btn danger" onClick={() => handleDelete(product.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <PackageSearch size={64} className="empty-icon" />
                        <h2>No products matched</h2>
                        <p>Try adjusting your search query or add a new product item.</p>
                    </div>
                )}
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div className="premium-modal-overlay">
                    <div className="premium-modal-content glass-heavy">
                        <header className="modal-header">
                            <div>
                                <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                                <p>{isEditMode ? 'Modify existing product details' : 'Fill in the details for your new stock item'}</p>
                            </div>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="field-group full">
                                    <label><Package size={14} /> Product Name</label>
                                    <input
                                        required
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                        value={currentProduct.name}
                                        onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="field-group">
                                    <label><DollarSign size={14} /> Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        value={currentProduct.price}
                                        onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                    />
                                </div>
                                <div className="field-group">
                                    <label><Layers size={14} /> Category</label>
                                    <input
                                        required
                                        placeholder="e.g. Electronics"
                                        value={currentProduct.category}
                                        onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                    />
                                </div>
                                <div className="field-group">
                                    <label><Package size={14} /> Initial Stock</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        value={currentProduct.stock_quantity}
                                        onChange={e => setCurrentProduct({ ...currentProduct, stock_quantity: e.target.value })}
                                    />
                                </div>
                                <div className="field-group">
                                    <label><ImageIcon size={14} /> Image URL</label>
                                    <input
                                        placeholder="https://images.unsplash.com/..."
                                        value={currentProduct.image_url}
                                        onChange={e => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                    />
                                </div>
                                <div className="field-group full">
                                    <label>Description</label>
                                    <textarea
                                        required
                                        rows="2"
                                        placeholder="Write a brief description..."
                                        value={currentProduct.description}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <footer className="modal-footer">
                                <button type="button" className="btn-3d" onClick={() => setIsModalOpen(false)}>Discard</button>
                                <button type="submit" className="btn-3d btn-glow">
                                    {isEditMode ? 'Update Product' : 'Finalize & Add'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-products-view {
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .view-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2.5rem;
                }

                .view-header h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                }

                .subtitle {
                    color: var(--color-text-dim);
                    font-size: 1.1rem;
                }

                .stats-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.6rem 1.25rem;
                    border-radius: var(--radius-full);
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                }

                .filters-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-lg);
                    margin-bottom: 2rem;
                    max-width: 500px;
                }

                .premium-search {
                    background: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    width: 100%;
                    color: white !important;
                }

                .premium-search:focus {
                    box-shadow: none !important;
                }

                .products-grid-container {
                    padding: 0;
                    overflow: visible;
                }

                .modern-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .modern-table th {
                    padding: 1.25rem 1.5rem;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--color-text-dim);
                    border-bottom: 1px solid var(--color-border);
                }

                .table-row {
                    transition: var(--transition-premium);
                }

                .table-row:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .modern-table td {
                    padding: 1.25rem 1.5rem;
                    vertical-align: middle;
                    border-bottom: 1px solid var(--color-border);
                }

                .product-thumb {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .product-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .placeholder-icon {
                    color: var(--color-text-dim);
                }

                .info-cell {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .p-name {
                    font-weight: 700;
                    color: var(--color-text-primary);
                }

                .p-desc {
                    font-size: 0.8rem;
                    color: var(--color-text-dim);
                }

                .category-tag {
                    padding: 0.4rem 0.75rem;
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--color-primary);
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }

                .price-tag {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-weight: 700;
                    color: var(--color-success);
                    font-size: 1.1rem;
                }

                .stock-status {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .healthy { color: var(--color-success); }
                .healthy .status-dot { background: var(--color-success); box-shadow: 0 0 10px var(--color-success); }
                
                .critical { color: var(--color-danger); }
                .critical .status-dot { background: var(--color-danger); box-shadow: 0 0 10px var(--color-danger); }

                .action-group {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                }

                .icon-btn {
                    padding: 0.6rem;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--color-border);
                    color: var(--color-text-secondary);
                    transition: var(--transition-premium);
                }

                .icon-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    transform: scale(1.1);
                }

                .icon-btn.danger:hover {
                    background: rgba(244, 63, 94, 0.1);
                    color: var(--color-danger);
                    border-color: rgba(244, 63, 94, 0.2);
                }

                .text-right { text-align: right; }

                /* Modal Specifics */
                .premium-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                }

                .premium-modal-content {
                    width: 100%;
                    max-width: 520px;
                    border-radius: var(--radius-xl);
                    padding: 1.75rem 2rem;
                    box-shadow: 0 0 50px rgba(0,0,0,0.5);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.25rem;
                }

                .modal-header h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.15rem;
                }

                .modal-header p {
                    color: var(--color-text-dim);
                    font-size: 0.9rem;
                }

                .close-modal {
                    color: var(--color-text-dim);
                    transition: var(--transition-premium);
                }

                .close-modal:hover {
                    color: white;
                    transform: rotate(90deg);
                }

                .modal-form .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem 1.25rem;
                }

                .field-group.full { grid-column: span 2; }

                .field-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.4rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    letter-spacing: 0.5px;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid var(--color-border);
                }

                .empty-state {
                    padding: 4rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .empty-icon { color: #334155; animation: pulse 2s infinite; }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default AdminProducts;
