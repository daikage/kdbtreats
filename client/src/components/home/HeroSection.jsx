import React from 'react';
import SplitText from '../ui/SplitText';
import MagneticButton from '../ui/MagneticButton';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__bg-gradient" />
        <img
          src="/images/hero-bg.jpg"
          alt="KDA Treats Spreads"
          className="hero__bg-image"
          style={{ transform: 'scale(1.05)' }} // Let parallax handle movement if added
        />
      </div>

      <div className="hero__floaters">
        <div className="hero__float-item">🍢</div>
        <div className="hero__float-item">🥐</div>
        <div className="hero__float-item">🔥</div>
        <div className="hero__float-item">🍹</div>
        <div className="hero__float-item">🍿</div>
        <div className="hero__float-item">🌶️</div>
      </div>

      <div className="hero__content">
        <div className="hero__tag">Authentic Nigerian Flavors</div>
        <h1 className="hero__title">
          <SplitText text="Taste the *Culture*" />
        </h1>
        <p className="hero__subtitle" style={{ opacity: 1 }}> {/* simplified for now without initial opacity 0 */}
          Elevate your gatherings with our premium selection of small chops,
          smoky grills, and irresistible snacks. Handcrafted in Lagos,
          delivered fresh to your door.
        </p>

        <div className="hero__cta-group" style={{ opacity: 1 }}>
          <MagneticButton as={Link} to="/menu" className="btn--primary btn--lg">
            Order Now
          </MagneticButton>
          <MagneticButton as={Link} to="/about" className="btn--outline btn--lg">
            Our Story
          </MagneticButton>
        </div>
      </div>

      <div className="hero__scroll-indicator" style={{ opacity: 1 }}>
        <span className="hero__scroll-text">Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
