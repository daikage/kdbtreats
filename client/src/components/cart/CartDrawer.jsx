import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/menu';
import { openWhatsAppCheckout } from '../../utils/whatsapp';
import { api } from '../../utils/api';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    customerName,
    customerAddress,
    customerNote,
    setCustomerInfo
  } = useCart();

  const [isClient, setIsClient] = useState(false);
  const [checkoutState, setCheckoutState] = useState('idle'); // idle | saving | done | error
  const [orderRef, setOrderRef] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset checkout feedback whenever the drawer is reopened.
  useEffect(() => {
    if (isOpen) {
      setCheckoutState('idle');
      setOrderRef(null);
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!items.length || !customerName || !customerAddress) return;
    setCheckoutState('saving');

    try {
      // Persist the order server-side first, then hand off to WhatsApp.
      const { order } = await api.createOrder({
        customerName,
        customerAddress,
        customerNote,
        items: items.map((i) => ({ itemId: Number(i.id), quantity: i.quantity })),
      });

      setOrderRef(order.id);
      openWhatsAppCheckout({
        items,
        totalPrice,
        customerName,
        customerAddress,
        customerNote,
      });

      clearCart();
      closeCart();
      setCheckoutState('done');
    } catch (err) {
      // Backend unreachable — still let the customer order via WhatsApp.
      console.error('Order API failed:', err);
      openWhatsAppCheckout({
        items,
        totalPrice,
        customerName,
        customerAddress,
        customerNote,
      });
      clearCart();
      closeCart();
      setCheckoutState('error');
    }
  };

  if (!isClient) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your Order
            <span className="cart-drawer__count">
              ({items.reduce((acc, item) => acc + item.quantity, 0)} items)
            </span>
          </h2>
          <button 
            className="cart-drawer__close" 
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">🛒</div>
            <p className="cart-drawer__empty-text">Your cart is empty.</p>
            <button className="cart-drawer__empty-cta btn btn--outline" onClick={closeCart}>
              Start Ordering
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item__img" />
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <div className="cart-item__price">{formatPrice(item.price)}</div>
                    <div className="cart-item__controls">
                      <button 
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="cart-item__qty">{item.quantity}</span>
                      <button 
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button 
                        className="cart-item__remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__customer">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="cart-drawer__input"
                  value={customerName}
                  onChange={(e) => setCustomerInfo({ customerName: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Delivery Address" 
                  className="cart-drawer__input"
                  value={customerAddress}
                  onChange={(e) => setCustomerInfo({ customerAddress: e.target.value })}
                />
                <textarea 
                  placeholder="Any special requests? (e.g., extra pepper)" 
                  className="cart-drawer__input cart-drawer__textarea"
                  value={customerNote}
                  onChange={(e) => setCustomerInfo({ customerNote: e.target.value })}
                />
              </div>

              <div className="cart-drawer__subtotal">
                <span className="cart-drawer__subtotal-label">Subtotal</span>
                <span className="cart-drawer__subtotal-value">{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-drawer__total">
                <span className="cart-drawer__total-label">Total</span>
                <span className="cart-drawer__total-value">{formatPrice(totalPrice)}</span>
              </div>

              <button
                className="cart-drawer__checkout"
                onClick={handleCheckout}
                disabled={!customerName || !customerAddress || checkoutState === 'saving'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {checkoutState === 'saving'
                  ? 'Placing order...'
                  : checkoutState === 'done'
                    ? `Order received (Ref #${orderRef})`
                    : checkoutState === 'error'
                      ? 'Order saved via WhatsApp'
                      : customerName && customerAddress
                        ? 'Order via WhatsApp'
                        : 'Enter details to order'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
