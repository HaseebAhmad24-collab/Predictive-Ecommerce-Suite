import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import api from '../../lib/api';

const StatCard = ({ title, value, icon, color }) => (
    <div className="premium-card">
        <div className="card-inner-flex">
            <div className="stat-content">
                <p className="stat-label">{title}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className="stat-icon-container" style={{
                background: `rgba(${color}, 0.1)`,
                color: `rgb(${color})`
            }}>
                {icon}
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        monthlySales: 0,
        totalOrders: 0,
        totalProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/stats');
            const data = response.data;

            setStats({
                totalProducts: data.total_products,
                totalOrders: data.total_orders,
                totalSales: data.total_sales,
                monthlySales: data.monthly_sales
            });

            setRecentOrders(data.recent_orders);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // 30s polling
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="dashboard-loading">
            <div className="loader glass">
                <Activity className="animate-pulse" />
                <span>Synchronizing Data...</span>
            </div>
        </div>
    );

    return (
        <div className="dashboard-view">
            <header className="dashboard-header">
                <div>
                    <h1 className="text-gradient">Performance Monitor</h1>
                    <p className="subtitle">Real-time business insights and analytics</p>
                </div>
                <div className="revenue-goal glass">
                    <div className="goal-info">
                        <span className="goal-label">Monthly Goal ($5k)</span>
                        <span className="goal-percent">{Math.min(100, (stats.monthlySales / 5000 * 100)).toFixed(1)}%</span>
                    </div>
                    <div className="goal-bar-bg">
                        <div className="goal-bar-fill" style={{ width: `${Math.min(100, (stats.monthlySales / 5000 * 100))}%` }}></div>
                    </div>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalSales.toLocaleString()}`}
                    icon={<DollarSign size={24} />}
                    color="99, 102, 241"
                    trend="up"
                    trendValue="12.5"
                />
                <StatCard
                    title="Monthly Sales"
                    value={`$${stats.monthlySales.toLocaleString()}`}
                    icon={<TrendingUp size={24} />}
                    color="34, 197, 94"
                    trend="up"
                    trendValue="8.2"
                />
                <StatCard
                    title="Gross Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingBag size={24} />}
                    color="234, 179, 8"
                    trend="up"
                    trendValue="5.4"
                />
                <StatCard
                    title="Inventory SKUs"
                    value={stats.totalProducts}
                    icon={<Package size={24} />}
                    color="244, 63, 94"
                />
            </div>

            <div className="dashboard-main-grid">
                <div className="recent-activity premium-card">
                    <div className="section-head">
                        <h3>Transactional Streams</h3>
                        <button className="view-all">See Full Log</button>
                    </div>
                    <div className="table-responsive">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Client</th>
                                    <th>Volume</th>
                                    <th>State</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="activity-row">
                                        <td className="ref-id">TX-{order.id.toString().padStart(4, '0')}</td>
                                        <td className="client-info">{order.customer_name}</td>
                                        <td className="volume">${order.total_amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-pill ${order.status}`}>{order.status}</span>
                                        </td>
                                        <td className="time">{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="insights-panel glass">
                    <h3>Strategic Insights</h3>
                    <div className="insight-item">
                        <div className="insight-icon"><Activity size={18} /></div>
                        <div className="insight-text">
                            <p className="i-title">High Flux Detected</p>
                            <p className="i-desc">Demand for 'Quantum Smartwatch' up by 15% this week.</p>
                        </div>
                    </div>
                    <div className="insight-item">
                        <div className="insight-icon"><ShoppingBag size={18} /></div>
                        <div className="insight-text">
                            <p className="i-title">Order Fulfillment</p>
                            <p className="i-desc">98% of orders processed within 24 hours.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-view {
                    animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }

                .revenue-goal {
                    width: 300px;
                    padding: 1rem 1.25rem;
                    border-radius: var(--radius-lg);
                }

                .goal-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .goal-bar-bg {
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .goal-bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, var(--color-primary), var(--color-accent));
                    box-shadow: 0 0 10px var(--color-primary-glow);
                    transition: width 1s ease-out;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .card-3d-effect {
                    perspective: 1000px;
                }

                .card-inner-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .stat-label {
                    color: var(--color-text-dim);
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 0.75rem;
                    color: white;
                }

                .trend-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .trend-indicator.up { color: var(--color-success); }
                .trend-indicator.down { color: var(--color-danger); }

                .stat-icon-container {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .card-decoration {
                    position: absolute;
                    bottom: 0;
                    left: 1.5rem;
                    right: 1.5rem;
                    height: 2px;
                    opacity: 0.3;
                    filter: blur(2px);
                }

                .dashboard-main-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }

                .section-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .view-all {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-primary);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .premium-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .premium-table th {
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-text-dim);
                    text-transform: uppercase;
                    padding: 1rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .activity-row td {
                    padding: 1.25rem 1rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .ref-id { font-family: monospace; color: var(--color-text-dim); }
                .client-info { font-weight: 600; }
                .volume { font-weight: 700; color: var(--color-text-primary); }

                .status-pill {
                    padding: 0.35rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .status-pill.pending { background: rgba(234, 179, 8, 0.1); color: #eab308; }
                .status-pill.completed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }

                .insights-panel {
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                }

                .insights-panel h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .insight-item {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .insight-icon {
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .i-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.2rem; }
                .i-desc { font-size: 0.8rem; color: var(--color-text-dim); line-height: 1.4; }

                .dashboard-loading {
                    height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loader {
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;

