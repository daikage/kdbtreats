import React from 'react';
import { Link } from 'react-router-dom';
import { categories, menuItems } from '../../data/menu';
import ScrollReveal from '../ui/ScrollReveal';

export default function CategoriesPreview() {
  const displayCategories = categories.filter(c => c.id !== 'all').slice(0, 4);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);

    // 3D Tilt
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -20;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section className="categories section">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <h2 className="heading-display" style={{ textAlign: 'center', marginBottom: 'var(--sp-3xl)' }}>
            Explore our <span className="accent">Menu</span>
          </h2>
        </ScrollReveal>

        <div className="categories__grid">
          {displayCategories.map((cat, i) => {
            const count = menuItems.filter(item => item.category === cat.id).length;
            return (
              <ScrollReveal key={cat.id} animation="fade-up" delay={i * 0.1}>
                <Link 
                  to={`/menu?cat=${cat.id}`} 
                  className="categories__card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ display: 'block' }} // Ensure link takes full space
                >
                  <span className="categories__card-icon">{cat.icon}</span>
                  <h3 className="categories__card-name">{cat.name}</h3>
                  <p className="categories__card-count">{count} Items</p>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
