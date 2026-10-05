import React from 'react';
import Marquee from '../ui/Marquee';
import { testimonials } from '../../data/menu';
import ScrollReveal from '../ui/ScrollReveal';

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <h2 className="heading-display" style={{ textAlign: 'center', marginBottom: 'var(--sp-4xl)' }}>
            What They <span className="accent">Say</span>
          </h2>
        </ScrollReveal>
      </div>

      <Marquee>
        {testimonials.map((t) => (
          <div key={t.id} className="testimonials__card">
            <p className="testimonials__quote">{t.quote}</p>
            <div className="testimonials__author">
              <div className="testimonials__avatar">{t.initials}</div>
              <div>
                <div className="testimonials__name">{t.author}</div>
                <div className="testimonials__stars">
                  {'★'.repeat(t.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
