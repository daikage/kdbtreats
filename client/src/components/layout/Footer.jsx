import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__top">
          {/* Brand Col */}
          <div>
            <div className="footer__brand-name">KDB Treats</div>
            <p className="footer__brand-desc">
              Authentic Nigerian snacks, small chops, and grills. 
              Elevating the culture, one bite at a time.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="footer__col-title">Explore</h4>
            <div className="footer__col-links">
              <Link to="/" className="footer__col-link">Home</Link>
              <Link to="/menu" className="footer__col-link">Menu</Link>
              <Link to="/about" className="footer__col-link">Our Story</Link>
              <Link to="/contact" className="footer__col-link">Contact</Link>
              <Link to="/admin" className="footer__col-link">Admin</Link>
            </div>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="footer__col-title">Categories</h4>
            <div className="footer__col-links">
              <Link to="/menu?cat=small-chops" className="footer__col-link">Small Chops</Link>
              <Link to="/menu?cat=grills" className="footer__col-link">Grills & Suya</Link>
              <Link to="/menu?cat=pastries" className="footer__col-link">Pastries</Link>
              <Link to="/menu?cat=platters" className="footer__col-link">Party Platters</Link>
            </div>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="footer__col-title">Legal</h4>
            <div className="footer__col-links">
              <a href="#" className="footer__col-link">Terms of Service</a>
              <a href="#" className="footer__col-link">Privacy Policy</a>
              <a href="#" className="footer__col-link">Refund Policy</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {currentYear} KDB Treats. All rights reserved.</p>
          <p>Made with 💛 in Lagos</p>
        </div>
      </div>
    </footer>
  );
}
