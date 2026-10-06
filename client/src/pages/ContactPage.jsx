import React, { useState } from 'react';
import PageTransition from '../components/layout/PageTransition';
import ScrollReveal from '../components/ui/ScrollReveal';
import MagneticButton from '../components/ui/MagneticButton';
import { api, WHATSAPP_NUMBER } from '../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorText('');

    try {
      await api.sendMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      // Server unreachable or rejected the payload — offer WhatsApp instead.
      setStatus('error');
      setErrorText(err.message);
    }
  };

  const handleWhatsAppFallback = () => {
    const msg = `Hello KDA Treats! My name is ${formData.name}. My email is ${formData.email}.\n\nMessage: ${formData.message}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <PageTransition>
      <main className="contact-page">
        <section className="page-hero">
          <div className="page-hero__bg" />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <ScrollReveal animation="fade-up">
              <h1 className="page-hero__title">Get in Touch</h1>
              <p className="page-hero__subtitle">
                Have a question about an order? Need catering for a large event?
                We're here to help.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="contact-grid">
              {/* Form */}
              <ScrollReveal animation="fade-right">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form__group">
                    <input
                      type="text"
                      id="name"
                      className="contact-form__input"
                      placeholder=" "
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <label htmlFor="name" className="contact-form__label">Your Name</label>
                  </div>

                  <div className="contact-form__group">
                    <input
                      type="email"
                      id="email"
                      className="contact-form__input"
                      placeholder=" "
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <label htmlFor="email" className="contact-form__label">Email Address</label>
                  </div>

                  <div className="contact-form__group">
                    <textarea
                      id="message"
                      className="contact-form__input contact-form__textarea"
                      placeholder=" "
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                    <label htmlFor="message" className="contact-form__label">How can we help?</label>
                  </div>

                  <MagneticButton
                    type="submit"
                    className="btn--primary btn--lg"
                    style={{ alignSelf: 'flex-start' }}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </MagneticButton>

                  {status === 'success' && (
                    <p style={{ color: 'var(--KDA-gold)', marginTop: '1rem' }}>
                      Thanks! Your message has been received — we&apos;ll reply shortly.
                    </p>
                  )}

                  {status === 'error' && (
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ color: '#e06c6c' }}>
                        Couldn&apos;t send your message ({errorText}).
                      </p>
                      <button
                        type="button"
                        className="btn btn--outline"
                        onClick={handleWhatsAppFallback}
                        style={{ marginTop: '0.75rem' }}
                      >
                        Send via WhatsApp instead
                      </button>
                    </div>
                  )}
                </form>
              </ScrollReveal>

              {/* Info Cards */}
              <div className="contact-info">
                <ScrollReveal animation="fade-left" delay={0.1}>
                  <div className="contact-info__card">
                    <div className="contact-info__icon">📍</div>
                    <div className="contact-info__label">Location</div>
                    <div className="contact-info__value">
                      123 Treats Avenue,<br />
                      Lekki Phase 1, Lagos, Nigeria
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-left" delay={0.2}>
                  <div className="contact-info__card">
                    <div className="contact-info__icon">📞</div>
                    <div className="contact-info__label">Phone / WhatsApp</div>
                    <div className="contact-info__value">
                      <a href="tel:+2348000000000">+234 800 000 0000</a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-left" delay={0.3}>
                  <div className="contact-info__card">
                    <div className="contact-info__icon">✉️</div>
                    <div className="contact-info__label">Email</div>
                    <div className="contact-info__value">
                      <a href="mailto:hello@KDAtreats.com">hello@KDAtreats.com</a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={0.4}>
                  <div className="contact-whatsapp">
                    <h3 className="contact-whatsapp__title">Quick Response?</h3>
                    <p className="contact-whatsapp__text">
                      For immediate assistance or urgent orders, reach out to us directly on WhatsApp.
                    </p>
                    <MagneticButton
                      as="a"
                      href="https://wa.me/2348000000000"
                      target="_blank"
                      className="btn--outline"
                      style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
                    >
                      Chat on WhatsApp
                    </MagneticButton>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
