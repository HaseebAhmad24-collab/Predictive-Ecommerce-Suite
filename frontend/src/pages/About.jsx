import React from 'react';

const About = () => {
    return (
        <div className="container about-page">
            <div className="card about-card">
                <h2 className="section-title">About AIStore</h2>
                <p className="about-text">
                    Welcome to **AIStore**, a cutting-edge e-commerce platform built to demonstrate the power of
                    **React** and **Python FastAPI**.
                </p>
                <p className="about-text">
                    Our mission is to provide a seamless shopping experience integrated with advanced Artificial Intelligence
                    features like smart chatbots and demand forecasting.
                </p>
                <div className="about-features">
                    <div className="about-feature">
                        <h3>🚀 Fast Performance</h3>
                        <p>Powered by Vite and FastAPI for lightning-fast speeds.</p>
                    </div>
                    <div className="about-feature">
                        <h3>🔒 Secure</h3>
                        <p>Built with enterprise-grade security standards.</p>
                    </div>
                    <div className="about-feature">
                        <h3>🤖 AI Ready</h3>
                        <p>Designed from the ground up to support intelligent agents.</p>
                    </div>
                </div>
            </div>

            <style>{`
        .about-page {
          padding: 4rem 1rem;
          max-width: 900px;
        }
        .about-card {
          padding: 3rem;
        }
        .about-text {
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }
        .about-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          border-top: 1px solid var(--color-border);
          padding-top: 3rem;
        }
        .about-feature h3 {
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }
      `}</style>
        </div>
    );
};

export default About;
