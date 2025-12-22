import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Trash2, ShoppingBag, User, MapPin, Calendar, CreditCard, Activity } from 'lucide-react';
import api from '../../lib/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const { globalSearch } = useOutletContext();
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/?limit=50');
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // 30s polling
        return () => clearInterval(interval);
    }, []);

    const filteredOrders = orders.filter(order => {
        const query = globalSearch.toLowerCase();
        const formattedId = `ORD-${order.id.toString().padStart(4, '0')}`.toLowerCase();

        return (
            formattedId.includes(query) ||
            order.customer_name?.toLowerCase().includes(query) ||
            order.customer_email?.toLowerCase().includes(query) ||
            order.status.toLowerCase().includes(query)
        );
    });

    return (
        <div className="admin-orders-view">
            <header className="view-header">
                <div>
                    <h1 className="text-gradient">Order Flux</h1>
                    <p className="subtitle">Monitor and manage customer transactions</p>
                </div>
                <div className="stats-pill glass">
                    <ShoppingBag size={18} />
                    <span>Active Orders: <strong>{orders.filter(o => o.status === 'pending').length}</strong></span>
                </div>
            </header>

            <div className="orders-grid-container premium-card">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Sequence ID</th>
                            <th>Customer</th>
                            <th>Allocation</th>
                            <th>Financials</th>
                            <th>Status</th>
                            <th>Timeline</th>
                            <th className="text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="table-row">
                                <td className="ref-id">TX-{order.id.toString().padStart(4, '0')}</td>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar glass">
                                            <User size={16} />
                                        </div>
                                        <div className="user-info">
                                            <span className="u-name">{order.customer_name}</span>
                                            <span className="u-email">{order.customer_email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="address-cell">
                                        <MapPin size={14} />
                                        <span>{order.shipping_address?.substring(0, 20)}...</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="financial-cell">
                                        <CreditCard size={14} />
                                        <span>${order.total_amount.toFixed(2)}</span>
                                    </div>
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={async (e) => {
                                            try {
                                                const newStatus = e.target.value;
                                                await api.put(`/orders/${order.id}/status`, { status: newStatus });
                                                setOrders(orders.map(o =>
                                                    o.id === order.id ? { ...o, status: newStatus } : o
                                                ));
                                            } catch (error) {
                                                console.error("Failed to update status", error);
                                            }
                                        }}
                                        className={`premium-select ${order.status}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="time-cell">
                                        <Calendar size={14} />
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="text-right">
                                    <button
                                        className="icon-btn danger"
                                        onClick={async () => {
                                            if (window.confirm("Purge this transaction?")) {
                                                try {
                                                    await api.delete(`/orders/${order.id}`);
                                                    setOrders(orders.filter(o => o.id !== order.id));
                                                } catch (err) {
                                                    console.error("Deletion failed", err);
                                                }
                                            }
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && !loading && (
                    <div className="empty-state">
                        <Activity size={48} className="empty-icon" />
                        <p>No transactions match your search parameters.</p>
                    </div>
                )}
            </div>

            <style>{`
                .admin-orders-view {
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .view-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem; }
                .subtitle { color: var(--color-text-dim); font-size: 0.95rem; }
                .stats-pill { background: var(--color-bg-primary); padding: 0.5rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 0.85rem; }
                
                .modern-table { width: 100%; border-collapse: collapse; background: var(--color-bg-primary); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--color-border); }
                .modern-table th { background: #1e293b; padding: 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-dim); font-weight: 700; border-bottom: 1px solid var(--color-border); }
                .modern-table td { padding: 1rem; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
                .table-row:hover { background: rgba(255, 255, 255, 0.02); }

                .ref-id { font-family: monospace; color: var(--color-text-dim); }
                .user-cell { display: flex; align-items: center; gap: 0.75rem; }
                .user-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--color-bg-secondary); display: flex; align-items: center; justify-content: center; color: var(--color-primary); }
                .u-name { font-weight: 600; display: block; }
                .u-email { font-size: 0.75rem; color: var(--color-text-dim); }

                .financial-cell { font-weight: 700; color: var(--color-success); }
                .premium-select { background: var(--color-bg-secondary) !important; border: 1px solid var(--color-border) !important; color: white !important; padding: 0.4rem 0.8rem !important; border-radius: 6px !important; font-size: 0.8rem !important; cursor: pointer; }

                .premium-select.pending { color: #eab308; border-color: rgba(234, 179, 8, 0.3); }
                .premium-select.delivered { color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }
                .premium-select.cancelled { color: #f43f5e; border-color: rgba(244, 63, 94, 0.3); }

                .premium-select option { background: #0f172a; color: white; }

                .status-badge {
                    padding: 0.4rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
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

export default AdminOrders;
