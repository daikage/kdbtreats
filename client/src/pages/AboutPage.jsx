import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import ScrollReveal from '../components/ui/ScrollReveal';
import SplitText from '../components/ui/SplitText';
import ParallaxImage from '../components/ui/ParallaxImage';
import { timelineEvents } from '../data/menu';

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="about-page">
        {/* Story Section 1 */}
        <section className="section">
          <div className="container">
            <div className="story-section">
              <div className="story-section__content">
                <ScrollReveal animation="fade-up">
                  <div className="story-section__label">Our Heritage</div>
                  <h2 className="story-section__title">
                    <SplitText text="Born in Lagos, Made for the *World*" />
                  </h2>
                  <p className="story-section__text">
                    KDA Treats started with a simple belief: authentic Nigerian flavors shouldn't be hard to find.
                    What began as a small home kitchen making puff puff for weekend family gatherings has blossomed
                    into a full-scale culinary experience.
                  </p>
                  <p className="story-section__text">
                    We source our spices directly from local markets, ensuring every bite of our suya and every
                    crunch of our chin chin carries the true essence of home.
                  </p>
                </ScrollReveal>
              </div>
              <div className="story-section__image-wrap">
                <ParallaxImage src="/images/about-1.jpg" alt="Chef preparing treats" speed={0.2} />
                <div className="story-section__image-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* Story Section 2 (Reversed) */}
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="story-section story-section--reversed">
              <div className="story-section__content">
                <ScrollReveal animation="fade-up">
                  <div className="story-section__label">Quality First</div>
                  <h2 className="story-section__title">
                    No Shortcuts. Just *Good Food*.
                  </h2>
                  <p className="story-section__text">
                    In a world of fast food and automated production, we still believe in the art of handcrafting.
                    Our dough is kneaded daily, our meats are marinated overnight in our secret yaji spice blend,
                    and everything is made to order.
                  </p>
                </ScrollReveal>
              </div>
              <div className="story-section__image-wrap">
                <ParallaxImage src="/images/about-2.jpg" alt="Fresh ingredients" speed={0.2} />
                <div className="story-section__image-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section timeline">
          <div className="container">
            <ScrollReveal animation="fade-up">
              <h2 className="heading-display" style={{ textAlign: 'center', marginBottom: 'var(--sp-4xl)' }}>
                Our <span className="accent">Journey</span>
              </h2>
            </ScrollReveal>

            <div style={{ position: 'relative' }}>
              <div className="timeline__line" />
              <div className="timeline__items">
                {timelineEvents.map((event, i) => (
                  <ScrollReveal key={i} animation={i % 2 === 0 ? 'fade-right' : 'fade-left'} delay={0.2}>
                    <div className="timeline__item">
                      <div className="timeline__item-spacer" />
                      <div className="timeline__item-dot" />
                      <div className="timeline__item-content">
                        <div className="timeline__item-year">{event.year}</div>
                        <h3 className="timeline__item-title">{event.title}</h3>
                        <p className="timeline__item-desc">{event.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
