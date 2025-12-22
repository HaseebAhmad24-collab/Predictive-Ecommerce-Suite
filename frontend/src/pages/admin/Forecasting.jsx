import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart3,
    AlertTriangle,
    Zap,
    RefreshCw,
    TrendingUp,
    Package,
    Eye,
    X,
    CheckCircle2,
    Calendar,
    Activity,
    Info
} from 'lucide-react';
import './Forecasting.css';

const Forecasting = () => {
    const [predictions, setPredictions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [training, setTraining] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productTrends, setProductTrends] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [predsRes, alertsRes] = await Promise.all([
                axios.get('http://localhost:8000/forecasting/predictions'),
                axios.get('http://localhost:8000/forecasting/alerts')
            ]);

            setPredictions(predsRes.data);
            setAlerts(alertsRes.data);
        } catch (error) {
            console.error('Error fetching forecasting data:', error);
        } finally {
            setLoading(false);
        }
    };

    const trainModels = async () => {
        try {
            setTraining(true);
            await axios.post('http://localhost:8000/forecasting/train');
            fetchData();
        } catch (error) {
            console.error('Error training models:', error);
        } finally {
            setTraining(false);
        }
    };

    const dismissAlert = async (alertId) => {
        try {
            await axios.put(`http://localhost:8000/forecasting/alerts/${alertId}/dismiss`);
            fetchData();
        } catch (error) {
            console.error('Error dismissing alert:', error);
        }
    };

    const viewProductDetails = async (productId) => {
        try {
            const trendsRes = await axios.get(`http://localhost:8000/forecasting/trends/${productId}`);
            setProductTrends(trendsRes.data);
            setSelectedProduct(productId);
        } catch (error) {
            console.error('Error fetching product trends:', error);
        }
    };

    const calculateTotalDemand = (predictions, days) => {
        if (!predictions || predictions.length === 0) return 0;
        return predictions.slice(0, days).reduce((sum, p) => sum + p.predicted_demand, 0).toFixed(1);
    };

    if (loading) return (
        <div className="forecasting-loading">
            <div className="loader glass">
                <Activity className="animate-pulse" />
                <span>Calibrating Forecasting Models...</span>
            </div>
        </div>
    );

    return (
        <div className="forecasting-view">
            <header className="view-header">
                <div>
                    <h1 className="text-gradient">Predictive Intelligence</h1>
                    <p className="subtitle">AI-driven demand forecasting and stock optimization</p>
                </div>
                <button
                    className={`btn-3d ${training ? 'shimmer' : ''}`}
                    onClick={trainModels}
                    disabled={training}
                >
                    {training ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                    <span>{training ? 'Processing AI...' : 'Synchronize Intelligence'}</span>
                </button>
            </header>

            {/* Stock Alerts Section */}
            {alerts.length > 0 && (
                <div className="alerts-section">
                    <div className="section-head">
                        <AlertTriangle size={20} className="text-warning" />
                        <h2>Inventory Anomalies</h2>
                    </div>
                    <div className="alerts-grid">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`alert-card-pro ${alert.alert_type}`}>
                                <div className="alert-header">
                                    <div className="alert-title-group">
                                        <div className="alert-icon-box">
                                            {alert.alert_type === 'critical' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                        </div>
                                        <div className="alert-title-main">
                                            <span className="alert-badge">{alert.alert_type === 'critical' ? '🔴 Restock Urgent' : '⚠️ Warning'}</span>
                                            <h3 className="alert-product-name">{alert.product_name || 'Product Alert'}</h3>
                                        </div>
                                    </div>
                                    <button className="dismiss-btn" onClick={() => dismissAlert(alert.id)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="alert-content">
                                    <p className="alert-description">{alert.message}</p>

                                    <div className="alert-details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Time Remaining</span>
                                            <span className="detail-value highlight">{alert.days_until_stockout} Days</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Recommended Refill</span>
                                            <span className="detail-value">{alert.recommended_order_qty} Units</span>
                                        </div>
                                    </div>

                                    <div className="alert-footer">
                                        <div className="action-hint">
                                            <Zap size={12} />
                                            <span>Recommendation: Place order now to avoid stockout.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Predictions Section */}
            <div className="predictions-section card-pro">
                <div className="predictions-header">
                    <div className="section-head">
                        <TrendingUp size={20} className="text-primary" />
                        <h2>Global Demand Analysis</h2>
                    </div>
                </div>
                {predictions.length === 0 ? (
                    <div className="empty-forecasting">
                        <BarChart3 size={64} className="empty-icon" />
                        <p>Predictive engine is idle. Run synchronization to generate forecasts.</p>
                    </div>
                ) : (
                    <div className="table-responsive predictions-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Inventory Item</th>
                                    <th>Status</th>
                                    <th>Week 1 Forecast</th>
                                    <th>Week 2 Forecast</th>
                                    <th>Month Total</th>
                                    <th>AI Model</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictions.map(pred => (
                                    <tr key={pred.product_id} className="table-row">
                                        <td>
                                            <div className="product-cell">
                                                <div className="p-icon glass">
                                                    <Package size={16} />
                                                </div>
                                                <span className="p-name">{pred.product_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="stock-cell">
                                                <div className={`stock-indicator ${pred.current_stock < 10 ? 'red' : 'green'}`}></div>
                                                <span>{pred.current_stock} available</span>
                                            </div>
                                        </td>
                                        <td className="demand-val">{calculateTotalDemand(pred.predictions, 7)}</td>
                                        <td className="demand-val">{calculateTotalDemand(pred.predictions, 14)}</td>
                                        <td className="demand-val highlight">{calculateTotalDemand(pred.predictions, 30)}</td>
                                        <td>
                                            <div className="model-chip glass">
                                                {pred.predictions[0]?.model_used === 'random_forest' ? 'FOREST_AI' : 'LINEAR_CORE'}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="icon-btn-glow" onClick={() => viewProductDetails(pred.product_id)}>
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && productTrends && (
                <div className="premium-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="modal-3d-content glass-heavy" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-info">
                                <BarChart3 className="text-primary" />
                                <h2>{productTrends.product_name} Intelligence</h2>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedProduct(null)}><X /></button>
                        </div>

                        <div className="modal-body">
                            <div className="visual-analytics">
                                <div className="chart-container glass">
                                    <div className="chart-header">
                                        <h3>Historical Velocity (60 Days)</h3>
                                        <Calendar size={14} />
                                    </div>
                                    <div className="bar-chart-3d">
                                        {productTrends.trends.map((trend, idx) => {
                                            const maxSales = Math.max(...productTrends.trends.map(t => t.sales), 1);
                                            const height = (trend.sales / maxSales) * 100;
                                            return (
                                                <div key={idx} className="bar-wrapper" title={`${new Date(trend.date).toLocaleDateString()}: ${trend.sales} units`}>
                                                    <div className="bar-3d" style={{ height: `${Math.max(5, height)}%` }}>
                                                        <div className="bar-top"></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="stats-row">
                                    <div className="insight-card glass">
                                        <CheckCircle2 size={24} className="text-success" />
                                        <div className="i-info">
                                            <span className="i-label">Cumulative Volume</span>
                                            <span className="i-val">{productTrends.trends.reduce((sum, t) => sum + t.sales, 0)} Units</span>
                                        </div>
                                    </div>
                                    <div className="insight-card glass">
                                        <Activity size={24} className="text-primary" />
                                        <div className="i-info">
                                            <span className="i-label">Average Daily Flow</span>
                                            <span className="i-val">{(productTrends.trends.reduce((sum, t) => sum + t.sales, 0) / productTrends.trends.length).toFixed(1)} Units</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forecasting;

