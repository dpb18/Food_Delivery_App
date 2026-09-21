import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Check,
  ShieldCheck,
  ShoppingBag,
  Trash2
} from 'lucide-react';

export const CheckoutView = () => {
  const {
    cart,
    cartRestaurant,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTax,
    cartTotal,
    currentUser,
    placeOrder,
    setCurrentView
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState(
    currentUser.addresses[0]?.id || 1
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder(paymentMethod);
      setIsProcessing(false);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconCircle}>
          <ShoppingBag size={48} color="#ff5238" />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginTop: '1.25rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#9ca3af', maxWidth: '400px', margin: '0.5rem auto 1.5rem auto' }}>
          Explore our top-rated restaurants and add delicious dishes to start your order!
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentView('home')}
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button
        onClick={() => setCurrentView('home')}
        style={styles.backBtn}
      >
        <ArrowLeft size={16} />
        <span>Continue Shopping</span>
      </button>

      <h1 style={styles.pageTitle}>Review & Place Order</h1>

      <div style={styles.checkoutGrid}>
        {/* Left Column: Delivery Address & Payment Method */}
        <div style={styles.leftCol}>
          {/* Address Section */}
          <div className="glass-card" style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <MapPin size={20} color="#ff5238" />
              <h3>1. Select Delivery Address</h3>
            </div>

            <div style={styles.addressesList}>
              {currentUser.addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    ...styles.addressCard,
                    borderColor:
                      selectedAddressId === addr.id
                        ? '#ff5238'
                        : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor:
                      selectedAddressId === addr.id
                        ? 'rgba(255, 82, 56, 0.08)'
                        : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div style={styles.radioIndicator}>
                    {selectedAddressId === addr.id && <div style={styles.radioDot} />}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>{addr.label}</strong>
                      {addr.isDefault && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={styles.addrText}>{addr.streetAddress}, {addr.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="glass-card" style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <CreditCard size={20} color="#10b981" />
              <h3>2. Choose Payment Method</h3>
            </div>

            <div style={styles.paymentMethods}>
              {[
                { id: 'UPI', label: 'UPI / Google Pay / PhonePe', icon: '⚡' },
                { id: 'CARD', label: 'Credit or Debit Card', icon: '💳' },
                { id: 'COD', label: 'Cash on Delivery (COD)', icon: '💵' }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  style={{
                    ...styles.paymentOption,
                    borderColor:
                      paymentMethod === method.id
                        ? '#10b981'
                        : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor:
                      paymentMethod === method.id
                        ? 'rgba(16, 185, 129, 0.08)'
                        : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
                  <span style={{ fontWeight: '600', flexGrow: 1 }}>{method.label}</span>
                  {paymentMethod === method.id && <Check size={18} color="#10b981" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Bill */}
        <div style={styles.rightCol}>
          <div className="glass-card" style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>{cartRestaurant?.name}</h3>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  {cartRestaurant?.address}
                </span>
              </div>
              <button
                onClick={clearCart}
                style={styles.clearCartBtn}
                title="Clear Cart"
              >
                <Trash2 size={16} color="#f87171" />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} style={styles.cartItemRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
                    <div>
                      <div style={styles.itemName}>{item.name}</div>
                      <div style={styles.itemUnitPrice}>₹{item.price} each</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {/* Quantity controls */}
                    <div style={styles.miniQtyControl}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={styles.miniQtyBtn}
                      >
                        -
                      </button>
                      <span style={styles.miniQtyVal}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={styles.miniQtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <div style={styles.itemTotal}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div style={styles.billBreakdown}>
              <div style={styles.billRow}>
                <span>Item Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={styles.billRow}>
                <span>Delivery Partner Fee</span>
                <span>₹{cartDeliveryFee.toFixed(2)}</span>
              </div>
              <div style={styles.billRow}>
                <span>Govt Taxes & Restaurant Packaging</span>
                <span>₹{cartTax.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span>To Pay</span>
                <span style={styles.finalTotal}>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              className="btn btn-primary"
              style={styles.placeOrderBtn}
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              <ShieldCheck size={18} />
              <span>{isProcessing ? 'Processing Secure Order...' : `Pay ₹${cartTotal.toFixed(2)} & Place Order`}</span>
            </button>

            <div style={styles.safetyNotice}>
              🔒 100% Secure Checkout • Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '80vh'
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '5rem 1.5rem',
    maxWidth: '500px',
    margin: '0 auto'
  },
  emptyIconCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#d1d5db',
    padding: '0.45rem 0.85rem',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '2rem'
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  rightCol: {
    position: 'sticky',
    top: '120px'
  },
  sectionCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginBottom: '1.25rem',
    fontSize: '1.15rem'
  },
  addressesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  addressCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  radioIndicator: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid #ff5238',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px',
    flexShrink: 0
  },
  radioDot: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#ff5238'
  },
  addrText: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
    lineHeight: '1.4'
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.9rem 1.1rem',
    borderRadius: '14px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  summaryCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '1rem',
    marginBottom: '1rem'
  },
  clearCartBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '0.4rem',
    cursor: 'pointer'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    maxHeight: '260px',
    overflowY: 'auto',
    marginBottom: '1.25rem',
    paddingRight: '0.25rem'
  },
  cartItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem'
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  itemUnitPrice: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  miniQtyControl: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  miniQtyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '0.2rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  miniQtyVal: {
    fontSize: '0.82rem',
    fontWeight: '700',
    padding: '0 0.4rem'
  },
  itemTotal: {
    fontWeight: '700',
    fontSize: '0.95rem',
    minWidth: '55px',
    textAlign: 'right'
  },
  billBreakdown: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#9ca3af',
    fontSize: '0.88rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff',
    borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
    paddingTop: '0.75rem',
    marginTop: '0.4rem'
  },
  finalTotal: {
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)'
  },
  placeOrderBtn: {
    width: '100%',
    padding: '0.9rem',
    fontSize: '1.05rem',
    marginTop: '1.25rem'
  },
  safetyNotice: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.85rem'
  }
};
