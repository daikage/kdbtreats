import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import ScrollReveal from '../components/ui/ScrollReveal';
import CounterNumber from '../components/ui/CounterNumber';
import { menuItems, categories, formatPrice } from '../data/menu';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, openCart, items: cartItems, totalPrice } = useCart();

  // Filter logic
  const filteredItems = menuItems.filter(item => {
    const matchesCat = catParam === 'all' || item.category === catParam;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCategoryClick = (id) => {
    setSearchParams({ cat: id });
  };

  const handleAdd = (item) => {
    addItem(item);
  };

  const isItemInCart = (id) => cartItems.some(i => i.id === id);

  return (
    <PageTransition>
      <main className="menu-page">
        {/* Page Hero */}
        <section className="page-hero">
          <div className="page-hero__bg" />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <ScrollReveal animation="fade-up">
              <h1 className="page-hero__title">Our Menu</h1>
              <p className="page-hero__subtitle">
                Explore our rich selection of authentic Nigerian treats, 
                made fresh to order with premium ingredients.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <div className="container">
          {/* Filters & Search */}
          <div className="menu-filter">
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`menu-filter__btn ${catParam === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div className="menu-search">
            <span className="menu-search__icon">🔍</span>
            <input 
              type="text" 
              className="menu-search__input" 
              placeholder="Search for puff puff, suya..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Grid */}
          <div className="menu-grid">
            {filteredItems.length === 0 ? (
              <div className="menu-empty">
                <div className="menu-empty__icon">🍽️</div>
                <h3 className="menu-empty__text">No treats found matching your criteria.</h3>
              </div>
            ) : (
              filteredItems.map((item, i) => (
                <ScrollReveal key={item.id} animation="fade-up" delay={(i % 4) * 0.1}>
                  <div className="menu-item">
                    <div className="menu-item__img-wrap">
                      <img src={item.image} alt={item.name} className="menu-item__img" />
                      
                      {/* Spice Indicator */}
                      {item.spiceLevel > 0 && (
                        <div className="menu-item__spice" title={`Spice Level: ${item.spiceLevel}`}>
                          {Array.from({ length: item.spiceLevel }).map((_, idx) => (
                            <span key={idx} className="menu-item__spice-pepper">🌶️</span>
                          ))}
                        </div>
                      )}

                      {!item.isAvailable && (
                        <div className="menu-item__unavailable">
                          <span className="menu-item__unavailable-text">Sold Out</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="menu-item__body">
                      <h3 className="menu-item__name">{item.name}</h3>
                      <p className="menu-item__desc">{item.description}</p>
                      
                      <div className="menu-item__footer">
                        <span className="menu-item__price">
                          <CounterNumber value={item.price} prefix="₦" />
                        </span>
                        
                        <button 
                          className={`menu-item__add-btn ${isItemInCart(item.id) ? 'added' : ''}`}
                          onClick={() => handleAdd(item)}
                          disabled={!item.isAvailable}
                        >
                          {isItemInCart(item.id) ? '✓ Added' : '+ Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>

        {/* Sticky Cart Bar for Mobile/Quick Access */}
        <div className={`cart-bar ${cartItems.length > 0 ? 'visible' : ''}`}>
          <div className="cart-bar__info">
            <span className="cart-bar__count">{cartItems.reduce((a, c) => a + c.quantity, 0)} Items</span>
            <span className="cart-bar__total">{formatPrice(totalPrice)}</span>
          </div>
          <button className="btn btn--primary" onClick={openCart}>
            View Cart
          </button>
        </div>
      </main>
    </PageTransition>
  );
}
