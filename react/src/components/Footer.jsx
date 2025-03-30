import React from 'react'
import logo from '../assets/logo.png'
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer-mains">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={logo} alt="Eco Travel Planner Logo" />
              <span>EcoBuddy</span>
            </div>
            <div className="footer-links">
              <div className="links-column">
                <h4>Features</h4>
                <ul>
                  <li>Route Optimization</li>
                  <li>Itinerary Planner</li>
                  <li>Eco Hotels</li>
                  <li>Activities</li>
                </ul>
              </div>
              <div className="links-column">
                <h4>Company</h4>
                <ul>
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Blog</li>
                  <li>Press</li>
                </ul>
              </div>
              <div className="links-column">
                <h4>Support</h4>
                <ul>
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for eco-travel tips and offers</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} EcoTravel. All rights reserved.</p>
            <div className="social-icons">
              <span>Facebook</span>
              <span>Twitter</span>
              <span>Instagram</span>
              <span>LinkedIn</span>
            </div>
          </div>
        </footer>
      );
}

export default Footer