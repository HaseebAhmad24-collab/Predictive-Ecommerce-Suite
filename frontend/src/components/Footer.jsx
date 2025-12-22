import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Globe, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="aitech-footer glass-panel">
      <div className="container-pro">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="f-logo">
              AI<span className="text-gradient-pro">TECH</span>
            </Link>
            <p className="f-desc">
              Pioneering the future of digital commerce with AI-driven selection and predictive inventory systems. Experience excellence in every click.
            </p>
            <div className="f-socials">
              <a href="#" className="f-social-link"><Instagram size={18} /></a>
              <a href="#" className="f-social-link"><Twitter size={18} /></a>
              <a href="#" className="f-social-link"><Linkedin size={18} /></a>
              <a href="#" className="f-social-link"><Facebook size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h6>Curation</h6>
            <ul>
              <li><Link to="/shop">Store Catalog</Link></li>
              <li><Link to="/shop?category=Electronics">Electronics</Link></li>
              <li><Link to="/shop?category=Wearables">Wearables</Link></li>
              <li><Link to="/shop?category=Gadgets">Advanced Tech</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-links">
            <h6>Company</h6>
            <ul>
              <li><Link to="/about">Our Mission</Link></li>
              <li><Link to="/insights">AI Insights</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Press Kit</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h6>Infrastructure</h6>
            <ul>
              <li><Link to="/support">Global Support</Link></li>
              <li><Link to="/shipping">Tracking System</Link></li>
              <li><Link to="/privacy">Security Protocols</Link></li>
              <li><Link to="/admin/login">Affiliate Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-pro">
          <div className="f-legal">
            <span>&copy; {new Date().getFullYear()} AITECH Industries. All rights reserved.</span>
            <div className="f-legal-links">
              <Link to="/privacy">Privacy</Link>
              <span className="dot-sep">•</span>
              <Link to="/terms">Terms</Link>
              <span className="dot-sep">•</span>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
          <div className="f-badges">
            <ShieldCheck size={16} /> <span>SSL Protected</span>
            <Zap size={16} /> <span>Enterprise Ready</span>
            <Globe size={16} /> <span>Edge Enabled</span>
          </div>
        </div>
      </div>

      <style>{`
        .aitech-footer {
          margin-top: 8rem;
          padding: 6rem 0 3rem;
          border-top: 1px solid var(--color-border);
          position: relative;
          overflow: hidden;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 5rem;
        }

        .f-logo {
          font-size: 1.8rem;
          font-weight: 900;
          font-family: var(--font-display);
          text-decoration: none;
          color: white;
          margin-bottom: 1.5rem;
          display: block;
        }

        .f-desc {
          color: var(--color-text-secondary);
          line-height: 1.7;
          font-size: 0.95rem;
          max-width: 320px;
          margin-bottom: 2rem;
        }

        .f-socials {
          display: flex;
          gap: 1rem;
        }

        .f-social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
          text-decoration: none;
          transform: var(--gpu-accelerate);
        }

        .f-social-link:hover {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
          transform: translate3d(0, -5px, 0);
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
        }

        .footer-links h6 {
          color: white;
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 2rem;
        }

        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 1rem;
        }

        .footer-links a {
          color: var(--color-text-dim);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition-premium);
        }

        .footer-links a:hover {
          color: var(--color-primary);
          padding-left: 8px;
        }

        .footer-bottom-pro {
          padding-top: 3rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .f-legal {
          display: flex;
          align-items: center;
          gap: 2rem;
          color: var(--color-text-dim);
          font-size: 0.85rem;
        }

        .f-legal-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .f-legal-links a {
          color: var(--color-text-dim);
          text-decoration: none;
          transition: 0.2s;
        }

        .f-legal-links a:hover {
          color: white;
        }

        .dot-sep {
          opacity: 0.3;
        }

        .f-badges {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          color: var(--color-text-dim);
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .f-badges span { display: flex; align-items: center; gap: 0.5rem; }
        .f-badges svg { color: var(--color-primary); }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom-pro {
            flex-direction: column;
            text-align: center;
          }
          .f-legal {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
