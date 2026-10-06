import React from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';
import TextScramble from '../ui/TextScramble';

export default function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__bg">
        <img src="/images/cta-bg.jpg" alt="KDA Treats Background" />
      </div>
      <div className="cta-banner__overlay" />

      <div className="container">
        <div className="cta-banner__content">
          <h2 className="cta-banner__title">
            <TextScramble text="Ready for a Treat?" />
          </h2>
          <p className="cta-banner__subtitle">
            Whether it's a quick snack or a party platter, we've got you covered.
            Order now and experience the taste of authentic Nigerian culture.
          </p>
          <MagneticButton as={Link} to="/menu" className="btn--primary btn--lg">
            View Full Menu
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
