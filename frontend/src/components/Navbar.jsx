import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ShieldCheck } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Real-time navigation for filtering
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    if (!showSearch) setShowSearch(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar-pro main-glass">
      <div className="container-pro nav-content">
        <Link to="/" className="nav-logo-pro">
          AI<span className="text-gradient-pro">TECH</span>
        </Link>

        <div className="nav-links-pro">
          <Link to="/" className="nav-link-pro">Home</Link>
          <Link to="/shop" className="nav-link-pro">Catalog</Link>
          <Link to="/about" className="nav-link-pro">Insights</Link>
        </div>

        <div className="nav-actions-pro">
          <div className={`search-container-pro ${showSearch ? 'active' : ''}`}>
            <input
              type="text"
              placeholder="Search innovation..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input-pro"
              onBlur={() => !searchQuery && setShowSearch(false)}
              autoFocus={showSearch}
            />
            <button className="icon-btn-pro" onClick={() => setShowSearch(!showSearch)}>
              <Search size={20} />
            </button>
          </div>

          <Link to="/cart" className="icon-btn-pro cart-btn-pro" title="Shopping Bag">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge-pro">{cartCount}</span>}
          </Link>

          <div className="nav-divider"></div>

          <Link to="/admin/login" className="icon-btn-pro" title="Admin Portal">
            <ShieldCheck size={20} />
          </Link>

          <Link to="/profile" className="icon-btn-pro profile-trigger" title="Account">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
