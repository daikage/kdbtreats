import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const location = useLocation();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);

  // Scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Animate mobile menu links on open
  useEffect(() => {
    if (isMobileOpen && mobileLinksRef.current.length > 0) {
      gsap.fromTo(
        mobileLinksRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }
  }, [isMobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${isScrolled ? 'is-scrolled' : ''}`}
        id="main-nav"
      >
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" data-cursor-hover>
            KDA<span>Treats</span>
          </Link>

          {/* Desktop links */}
          <div className="navbar__links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar__link ${isActive(link.to) ? 'active' : ''}`}
                data-cursor-hover
              >
                {link.label}
              </Link>
            ))}
            <button
              className="navbar__cart-btn"
              onClick={toggleCart}
              data-cursor-hover
              aria-label="Open cart"
              id="cart-toggle"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Cart
              {totalItems > 0 && (
                <span className="navbar__cart-badge" key={totalItems}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`navbar__hamburger ${isMobileOpen ? 'is-open' : ''}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={mobileMenuRef}
        className={`navbar__mobile-menu ${isMobileOpen ? 'is-open' : ''}`}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            className="navbar__mobile-link"
            ref={(el) => (mobileLinksRef.current[i] = el)}
            onClick={() => setIsMobileOpen(false)}
            data-cursor-hover
          >
            {link.label}
          </Link>
        ))}
        <button
          className="btn btn--primary btn--lg"
          ref={(el) => (mobileLinksRef.current[navLinks.length] = el)}
          onClick={() => {
            setIsMobileOpen(false);
            toggleCart();
          }}
          data-cursor-hover
        >
          🛒 Cart {totalItems > 0 && `(${totalItems})`}
        </button>
      </div>
    </>
  );
}
