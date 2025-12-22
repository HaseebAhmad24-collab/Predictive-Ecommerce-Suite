import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../lib/ToastContext';
import axios from 'axios';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Using direct axios call or we could add to api.js
            const response = await axios.post('http://localhost:8000/admin/login', {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_email', response.data.user_email);
                // User suggested fix:
                localStorage.setItem('isAdminLoggedIn', 'true');
                // Initialize session activity to prevent immediate timeout
                localStorage.setItem('last_activity', Date.now().toString());

                addToast("Welcome back, Admin!", "success");
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail
                || error.message
                || "Login failed. Check server connection.";
            addToast(`Error: ${msg}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '1rem',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Portal</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Please sign in to continue</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white'
                            }}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingRight: '2.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'white'
                                }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <p>Demo Credentials: admin@example.com / admin123</p>
                        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Session expires after 10 minutes of inactivity.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
