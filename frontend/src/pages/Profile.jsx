import React from 'react';
import { User, Settings, Package, LogOut } from 'lucide-react';

const Profile = () => {
    return (
        <div className="container profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    <User size={48} />
                </div>
                <div className="profile-info">
                    <h2>Guest User</h2>
                    <p>guest@example.com</p>
                </div>
            </div>

            <div className="profile-grid">
                <div className="card menu-card">
                    <button className="menu-item active">
                        <User size={20} /> Personal Information
                    </button>
                    <button className="menu-item">
                        <Package size={20} /> My Orders
                    </button>
                    <button className="menu-item">
                        <Settings size={20} /> Settings
                    </button>
                    <button className="menu-item danger">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>

                <div className="card content-card">
                    <h3>Personal Information</h3>
                    <form className="profile-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value="Guest User" readOnly />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value="guest@example.com" readOnly />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="+1 234 567 890" />
                        </div>
                        <button className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>

            <style>{`
        .profile-page {
          padding: 4rem 1rem;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent);
          padding: 2rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .profile-avatar {
          background: var(--color-primary);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-glow);
        }
        .profile-info h2 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }
        .profile-info p {
          color: var(--color-text-secondary);
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }
        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem;
          color: var(--color-text-secondary);
          text-align: left;
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
        }
        .menu-item:hover, .menu-item.active {
          background-color: rgba(255,255,255,0.05);
          color: var(--color-text-primary);
        }
        .menu-item.active {
          border-left: 3px solid var(--color-primary);
        }
        .menu-item.danger {
          color: var(--color-danger);
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 500px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }
        .form-group input {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--color-border);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          color: var(--color-text-primary);
          font-family: inherit;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      `}</style>
        </div>
    );
};

export default Profile;
