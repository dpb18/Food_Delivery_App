import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Store
} from 'lucide-react';

export const CartView = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartRestaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    discountAmount,
    cartTax,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    availableCoupons
  } = useCart();

  const { showToast, customerSession, setAuthModal } = useApp();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    const res = applyCoupon(code);
    if (res.success) {
      showToast(`🎉 Coupon "${res.coupon.code}" applied! You saved ₹${discountAmount.toFixed(0)}`, 'success');
      setCouponInput('');
    } else {
      showToast(`⚠️ ${res.message}`, 'error');
    }
  };

  if (!customerSession) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconCircle}>
          <ShoppingBag size={48} color="#ff5238" />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginTop: '1.25rem', fontWeight: '800' }}>
          Sign In to Access Your Cart
        </h2>
        <p style={{ color: '#9ca3af', maxWidth: '420px', margin: '0.5rem auto 1.75rem auto', lineHeight: '1.5' }}>
          Please sign in with your customer account to view items in your cart, apply coupons, and proceed to checkout.
        </p>
        <button
          onClick={() => setAuthModal({ isOpen: true, targetPortal: 'customer' })}
          className="btn btn-primary"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconCircle}>
          <ShoppingBag size={48} color="#ff5238" />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginTop: '1.25rem', fontWeight: '800' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: '#9ca3af', maxWidth: '420px', margin: '0.5rem auto 1.75rem auto' }}>
          Looks like you haven't added anything to your cart yet. Discover dishes from top-rated restaurants near you!
        </p>
        <Link to="/" className="btn btn-primary">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <div style={styles.headerRow}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Continue Ordering</span>
        </button>
        <h1 style={styles.pageTitle}>Review Your Cart ({cart.length} items)</h1>
      </div>

      <div className="responsive-two-col">
        {/* Left Column: Cart Items & Coupon Holder */}
        <div style={styles.leftCol}>
          {/* Restaurant Banner */}
          {cartRestaurant && (
            <div className="glass-card" style={styles.restaurantBanner}>
              <img
                src={cartRestaurant.image}
                alt={cartRestaurant.name}
                style={styles.storeThumb}
              />
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Store size={15} color="#ff5238" />
                  <h3 style={{ fontSize: '1.15rem' }}>{cartRestaurant.name}</h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                  {cartRestaurant.address}
                </p>
              </div>
              <button onClick={clearCart} style={styles.clearBtn} title="Clear cart">
                <Trash2 size={16} color="#f87171" />
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="glass-card" style={styles.itemsCard}>
            <div style={styles.itemsHeader}>
              <h3>Dishes in Your Order</h3>
              <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Freshly prepared</span>
            </div>

            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  {/* Item Image & Diet Badge */}
                  <div style={styles.itemThumbWrap}>
                    <img src={item.image} alt={item.name} style={styles.itemThumb} />
                    <div style={styles.dietBadge}>
                      <div className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
                    </div>
                  </div>

                  {/* Name & Price */}
                  <div style={{ flexGrow: 1, padding: '0 0.75rem' }}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <div style={styles.itemPriceText}>₹{item.price}</div>
                  </div>

                  {/* Quantity Selector */}
                  <div style={styles.qtyControl}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={styles.qtyBtn}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={styles.qtyVal}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={styles.qtyBtn}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div style={styles.itemTotalCol}>
                    <div style={styles.itemTotalVal}>₹{item.price * item.quantity}</div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={styles.itemDeleteBtn}
                      title="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COUPON HOLDER SECTION */}
          <div className="glass-card" style={styles.couponCard}>
            <div style={styles.couponHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={18} color="#ff5238" />
                <h3 style={{ fontSize: '1.05rem' }}>Coupons & Special Offers</h3>
              </div>
              {appliedCoupon && (
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> {appliedCoupon.code} Applied
                </span>
              )}
            </div>

            {/* Input Promo Code Bar */}
            <div style={styles.promoInputRow}>
              <input
                type="text"
                placeholder="Enter promo or coupon code..."
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                style={styles.promoInput}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleApplyCoupon(couponInput)}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                Apply
              </button>
            </div>

            {couponError && <div style={styles.couponError}>⚠️ {couponError}</div>}

            {/* Active Coupon Banner */}
            {appliedCoupon && (
              <div style={styles.activeCouponBanner}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="#10b981" />
                  <div>
                    <strong style={{ color: '#34d399' }}>{appliedCoupon.code}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#d1d5db' }}>
                      {appliedCoupon.description}
                    </div>
                  </div>
                </div>
                <button onClick={removeCoupon} style={styles.removeCouponBtn}>
                  Remove
                </button>
              </div>
            )}

            {/* Available Coupons List */}
            <div style={styles.availableCouponsList}>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '700' }}>
                AVAILABLE OFFERS FOR YOU:
              </div>
              <div style={styles.couponChipsGrid}>
                {availableCoupons.map((c) => {
                  const isApplied = appliedCoupon?.code === c.code;

                  return (
                    <div
                      key={c.code}
                      onClick={() => !isApplied && handleApplyCoupon(c.code)}
                      style={{
                        ...styles.couponChip,
                        borderColor: isApplied ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: isApplied
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.couponCodeBadge}>{c.code}</span>
                        <span style={{ fontSize: '0.72rem', color: '#ff7a65', fontWeight: '700' }}>
                          {isApplied ? 'Applied ✓' : 'TAP TO APPLY'}
                        </span>
                      </div>
                      <p style={styles.couponChipDesc}>{c.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Bill Summary & Place Order CTA */}
        <div className="sticky-col-mobile" style={styles.rightCol}>
          <div className="glass-card" style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Bill Details</h3>

            <div style={styles.billRows}>
              <div style={styles.billRow}>
                <span>Item Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ ...styles.billRow, color: '#34d399' }}>
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={styles.billRow}>
                <span>Delivery Partner Fee</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <strong style={{ color: '#10b981' }}>FREE</strong>
                  ) : (
                    `₹${cartDeliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div style={styles.billRow}>
                <span>Govt Taxes & Kitchen Packaging</span>
                <span>₹{cartTax.toFixed(2)}</span>
              </div>

              <div style={styles.totalRow}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>TOTAL AMOUNT</div>
                  <div style={styles.finalTotalVal}>₹{cartTotal.toFixed(2)}</div>
                </div>
                {discountAmount > 0 && (
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                    Saved ₹{discountAmount.toFixed(0)}
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button leading to Place Order Page */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={styles.proceedBtn}
            >
              <span>Proceed to Place Order</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(0.85rem, 2.5vw, 1.5rem)',
    minHeight: '80vh'
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '6rem 1.5rem',
    maxWidth: '480px',
    margin: '0 auto'
  },
  emptyIconCircle: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#d1d5db',
    padding: '0.45rem 0.85rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem'
  },
  pageTitle: {
    fontSize: 'clamp(1.35rem, 4vw, 1.85rem)',
    fontWeight: '800'
  },
  cartGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
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
    top: '100px'
  },
  restaurantBanner: {
    padding: '1.25rem',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  storeThumb: {
    width: '54px',
    height: '54px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  clearBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.5rem',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  itemsCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  itemsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '0.75rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: '1rem'
  },
  itemThumbWrap: {
    position: 'relative',
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    overflow: 'hidden',
    flexShrink: 0
  },
  itemThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  dietBadge: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    borderRadius: '4px',
    padding: '2px'
  },
  itemName: {
    fontSize: '0.98rem',
    fontWeight: '700'
  },
  itemPriceText: {
    fontSize: '0.85rem',
    color: '#ff7a65',
    fontWeight: '700',
    marginTop: '2px'
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  qtyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '0.4rem 0.65rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  qtyVal: {
    fontSize: '0.88rem',
    fontWeight: '800',
    padding: '0 0.45rem',
    fontFamily: 'var(--font-heading)'
  },
  itemTotalCol: {
    textAlign: 'right',
    minWidth: '70px'
  },
  itemTotalVal: {
    fontSize: '1.05rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)'
  },
  itemDeleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    marginTop: '4px'
  },
  couponCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  couponHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  promoInputRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  promoInput: {
    flexGrow: 1,
    background: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    outline: 'none'
  },
  couponError: {
    color: '#f87171',
    fontSize: '0.8rem',
    marginBottom: '0.75rem'
  },
  activeCouponBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid #10b981',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem'
  },
  removeCouponBtn: {
    background: 'transparent',
    border: 'none',
    color: '#f87171',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  availableCouponsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1rem'
  },
  couponChipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
    gap: '0.85rem'
  },
  couponChip: {
    border: '1px solid',
    borderRadius: '14px',
    padding: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  couponCodeBadge: {
    fontFamily: 'var(--font-heading)',
    fontWeight: '800',
    fontSize: '0.95rem',
    letterSpacing: '0.05em',
    color: '#fff'
  },
  couponChipDesc: {
    fontSize: '0.78rem',
    color: '#9ca3af',
    marginTop: '0.35rem',
    lineHeight: '1.3'
  },
  summaryCard: {
    padding: '1.75rem',
    borderRadius: '22px'
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.75rem'
  },
  billRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#d1d5db'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
    paddingTop: '1rem',
    marginTop: '0.5rem'
  },
  finalTotalVal: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)'
  },
  proceedBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.05rem',
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '1.25rem',
    lineHeight: '1.4',
    textAlign: 'center',
    justifyContent: 'center'
  }
};
