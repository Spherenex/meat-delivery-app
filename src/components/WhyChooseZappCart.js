// src/components/WhyChooseZappCart.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/logo1.png';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const WhyChooseZappCart = () => {
  return (
    <div className="why-choose-container">
      <header className="why-choose-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        {/* <img src={logoImage} alt="ZappCart Logo" className="why-choose-logo" /> */}
      </header>

      <main className="why-choose-content">
        <div className="why-choose-banner">
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <h1>Why Choose ZappCart?</h1>
            <p>Fresh meat delivery, reimagined for today's busy lifestyle</p>
          </div>
        </div>

        <div className="benefits-container">
          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Fresh, Not Frozen</h2>
            </div>
            <div className="benefit-description">
              <p>We don't do cold storage or stale stock. Every order is cut fresh after you place it - just like your neighborhood butcher, but faster.</p>
              <div className="benefit-image">
                <img src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop" alt="Fresh, not frozen meat" />
              </div>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Hygiene First</h2>
            </div>
            <div className="benefit-description">
              <p>Our partner shops follow strict cleanliness protocols. All meat is handled with gloves, masks, and sealed in leak-proof, food-safe packaging.</p>
              <div className="benefit-image">
                <img src="https://recipes-nz.b-cdn.net/816fc286626c0835fac97a26d3e224e9e9c30f59-1400x854.jpg?auto=format&fit=max&q=75&w=700" alt="Hygienic meat handling" />
              </div>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Super-Fast Delivery</h2>
            </div>
            <div className="benefit-description">
              <p>Your meat is packed and out the door within minutes of cutting, reaching you in under 60 minutes in most areas.</p>
              <div className="benefit-image">
                <img src="https://5.imimg.com/data5/SELLER/Default/2023/9/340258448/ML/BK/TG/183776122/14-500x500.jpg" alt="Fast delivery service" />
              </div>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Trusted Local Partners</h2>
            </div>
            <div className="benefit-description">
              <p>We work with verified, experienced meat vendors in your area - handpicked for quality, hygiene, and consistency.</p>
              <div className="benefit-image">
                <img src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&auto=format&fit=crop" alt="Local butcher shop" />
              </div>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Seamless Ordering</h2>
            </div>
            <div className="benefit-description">
              <p>With our easy-to-use app, you can order fresh meat in just a few taps - no calls, no haggling, no confusion.</p>
              <div className="benefit-image">
                <img src="https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800&auto=format&fit=crop" alt="Mobile ordering app" />
              </div>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Friendly Support</h2>
            </div>
            <div className="benefit-description">
              <p>Have a question or issue? Our support team is just a WhatsApp or call away, always ready to help.</p>
              <div className="benefit-image">
                <img src="https://images.unsplash.com/photo-1529470839332-78ad660a6a82?w=800&auto=format&fit=crop" alt="Customer support" />
              </div>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-title">
              <h2>Satisfaction Guaranteed</h2>
            </div>
            <div className="benefit-description">
              <p>Not happy with your order? We'll make it right with a replacement or refund based on refund policy - no hassle, no stress.</p>
              <div className="benefit-image">
                <img src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop" alt="Satisfaction guaranteed" />
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to experience the ZappCart difference?</h2>
          <p>Download our app today and get your first order delivered in under 60 minutes!</p>
          <div className="cta-buttons">
            <a href="#" className="app-store-btn">Download on App Store</a>
            <a href="#" className="play-store-btn">Get it on Google Play</a>
          </div>
        </div>
      </main>

      <footer className="why-choose-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
        <Link to="/" className="footer-home-link">Return to Main Website</Link>
      </footer>

      <style jsx>{`
        .why-choose-container {
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          color: #333;
        }

        .why-choose-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }

        .back-link {
          display: flex;
          align-items: center;
          color: #e63946;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: #c1121f;
        }

        .back-link svg {
          margin-right: 8px;
        }

        .why-choose-logo {
          height: 50px;
        }

        .why-choose-banner {
          position: relative;
          height: 300px;
          background-image: url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          border-radius: 10px;
          margin: 30px 0;
          overflow: hidden;
        }

        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .banner-content {
          position: relative;
          z-index: 2;
          color: white;
          text-align: center;
          padding: 100px 20px;
        }

        .banner-content h1 {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .banner-content p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .benefits-container {
          margin: 50px 0;
        }

        .benefit-row {
          display: flex;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .benefit-title {
          flex: 0 0 30%;
          background-color: #1d3557;
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .benefit-title h2 {
          font-size: 1.4rem;
          margin: 0;
        }

        .benefit-description {
          flex: 0 0 70%;
          padding: 20px;
          display: flex;
          align-items: center;
          background-color: #f8f9fa;
        }

        .benefit-description p {
          flex: 1;
          margin: 0;
          padding-right: 20px;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .benefit-image {
          flex: 0 0 200px;
          height: 150px;
          border-radius: 8px;
          overflow: hidden;
        }

        .benefit-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cta-section {
          background-color: #e63946;
          color: white;
          padding: 40px;
          border-radius: 10px;
          text-align: center;
          margin: 50px 0;
        }

        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .cta-section p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .app-store-btn, .play-store-btn {
          background-color: white;
          color: #e63946;
          padding: 12px 24px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s;
        }

        .app-store-btn:hover, .play-store-btn:hover {
          background-color: #f8f9fa;
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .why-choose-footer {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #eee;
          margin-top: 30px;
          color: #666;
        }

        .footer-home-link {
          display: inline-block;
          margin-top: 10px;
          color: #e63946;
          text-decoration: none;
        }

        .footer-home-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .benefit-row {
            flex-direction: column;
          }

          .benefit-title, .benefit-description {
            flex: auto;
          }

          .benefit-description {
            flex-direction: column;
          }

          .benefit-description p {
            padding-right: 0;
            margin-bottom: 15px;
          }

          .benefit-image {
            width: 100%;
            flex: auto;
            margin-top: 15px;
          }

          .banner-content h1 {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 600px) {
          .why-choose-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .why-choose-logo {
            margin-top: 15px;
          }
          
          .banner-content h1 {
            font-size: 1.8rem;
          }
          
          .banner-content p {
            font-size: 1rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default WhyChooseZappCart;