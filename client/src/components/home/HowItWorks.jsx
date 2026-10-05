import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';

export default function HowItWorks() {
  const steps = [
    {
      icon: '📱',
      title: 'Browse & Select',
      desc: 'Explore our rich menu of authentic Nigerian snacks, grills, and party platters. Add your favorites to the cart.',
    },
    {
      icon: '💬',
      title: 'Order via WhatsApp',
      desc: 'No complicated checkout. Review your cart and send your order directly to our WhatsApp with one tap.',
    },
    {
      icon: '🛵',
      title: 'Fast Delivery',
      desc: 'Sit back and relax. We prepare your treats fresh and deliver them straight to your door across Lagos.',
    },
  ];

  return (
    <section className="how-it-works section">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <h2 className="heading-display" style={{ textAlign: 'center', marginBottom: 'var(--sp-4xl)' }}>
            How to <span className="accent">Order</span>
          </h2>
        </ScrollReveal>

        <div className="how-it-works__steps">
          {steps.map((step, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={i * 0.2}>
              <div className="how-it-works__step">
                <div className="how-it-works__step-number">{i + 1}</div>
                <div className="how-it-works__step-icon">{step.icon}</div>
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-desc">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
