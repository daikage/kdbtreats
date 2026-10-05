import React, { useEffect, useRef } from 'react';
import { menuItems, formatPrice } from '../../data/menu';
import { useCart } from '../../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedTreats() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const { addItem, openCart } = useCart();
  
  const featured = menuItems.filter(item => item.isFeatured).slice(0, 6);

  useEffect(() => {
    // Only apply horizontal scroll on desktop
    if (window.innerWidth < 768) return;

    const container = containerRef.current;
    const track = trackRef.current;
    
    // Calculate how far to move left
    const walk = track.scrollWidth - window.innerWidth + 100; // 100 padding

    gsap.to(track, {
      x: -walk,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${walk}`
      }
    });
  }, []);

  const handleAdd = (item) => {
    addItem(item);
    openCart();
  };

  return (
    <section ref={containerRef} className="featured section">
      <div className="container">
        <div className="featured__header">
          <div className="featured__label">Signature Menu</div>
          <h2 className="featured__title">Customer Favorites</h2>
        </div>
      </div>

      <div className="featured__track-wrapper">
        <div ref={trackRef} className="featured__track" style={{ paddingLeft: 'var(--sp-lg)' }}>
          {featured.map((item) => (
            <div key={item.id} className="featured__card">
              <div className="featured__card-img-wrap">
                <img src={item.image} alt={item.name} className="featured__card-img" />
                <div className="featured__card-badge">Best Seller</div>
              </div>
              <div className="featured__card-body">
                <h3 className="featured__card-name">{item.name}</h3>
                <p className="featured__card-desc">{item.description}</p>
                <div className="featured__card-footer">
                  <span className="featured__card-price">{formatPrice(item.price)}</span>
                  <button 
                    className="featured__card-add"
                    onClick={() => handleAdd(item)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
