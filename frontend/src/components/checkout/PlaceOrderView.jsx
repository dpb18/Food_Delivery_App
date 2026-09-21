import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Phone,
  User,
  Home,
  FileText,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const PlaceOrderView = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartRestaurant,
    cartSubtotal,
    cartDeliveryFee,
    discountAmount,
    cartTax,
    cartTotal,
    appliedCoupon,
    clearCart
  } = useCart();

  const { customerSession, saveOrder, setOrders, showToast, login } = useApp();

  // Address Form State
  const [fullName, setFullName] = useState(customerSession?.fullName || '');
  const [phone, setPhone] = useState(customerSession?.phone || '');
  const [streetAddress, setStreetAddress] = useState(
    customerSession?.addresses?.[0]?.streetAddress || ''
  );
  const [city, setCity] = useState(customerSession?.addresses?.[0]?.city || 'Bengaluru');
  const [pincode, setPincode] = useState('560038');
  const [instructions, setInstructions] = useState('Please leave at the doorstep and ring the bell');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Sync with customer session if user logs in on this page
  useEffect(() => {
    if (customerSession) {
      if (customerSession.fullName) setFullName(customerSession.fullName);
      if (customerSession.phone) setPhone(customerSession.phone);
      if (customerSession.addresses?.[0]?.streetAddress) {
        setStreetAddress(customerSession.addresses[0].streetAddress);
      }
      if (customerSession.addresses?.[0]?.city) {
        setCity(customerSession.addresses[0].city);
      }
    }
  }, [customerSession]);

  // Animated Tick Mark State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [countdown, setCountdown] = useState(3);

  // Auto-redirect to My Orders after animated tick mark
  useEffect(() => {
    let timer;
    if (isOrderPlaced) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/my-orders');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOrderPlaced, navigate]);

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    if (!customerSession) {
      showToast('⚠️ You must be signed in to place an order!', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/cart');
      return;
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrderId = Math.floor(80000 + Math.random() * 19999);

    const newOrder = {
      id: newOrderId,
      customerId: customerSession?.id || 1,
      customerName: fullName,
      customerPhone: phone,
      restaurantId: cartRestaurant?.id || 1,
      restaurantName: cartRestaurant?.name || 'The Burger Foundry',
      restaurantAddress: cartRestaurant?.address || 'Indiranagar, Bengaluru',
      restaurantLat: cartRestaurant?.lat || 12.9719,
      restaurantLng: cartRestaurant?.lng || 77.6412,
      deliveryAddress: {
        streetAddress,
        city,
        pincode,
        instructions,
        lat: 12.9784,
        lng: 77.6408
      },
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
        subtotal: i.price * i.quantity,
        isVeg: i.isVeg
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      discountAmount,
      taxAmount: cartTax,
      totalAmount: cartTotal,
      couponApplied: appliedCoupon?.code || null,
      status: 'PLACED',
      deliveryOtp: generatedOtp,
      otpVerified: false,
      deliveryPartnerId: null,
      deliveryPartnerName: null,
      paymentMethod,
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-30 mins'
    };

    // Save order into global state and persist to Spring Boot MySQL backend
    if (saveOrder) {
      saveOrder(newOrder);
    } else if (setOrders) {
      setOrders((prev) => [newOrder, ...prev]);
    }
    setPlacedOrderId(newOrderId);
    setIsOrderPlaced(true);
    clearCart();
  };

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>No items to place an order</h2>
        <button
          className="btn btn-primary"
          style={{ marginTop: '1.25rem' }}
          onClick={() => navigate('/')}
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  // Guard: User must be signed in to place an order
  if (!customerSession && !isOrderPlaced) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate('/cart')} style={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to Cart</span>
        </button>

        <div className="glass-card" style={styles.authGateCard}>
          <div style={styles.authGateIcon}>
            <ShieldCheck size={40} color="#ff5238" />
          </div>
          <h2 style={styles.authGateTitle}>Sign In Required to Place Order</h2>
          <p style={styles.authGateDesc}>
            You must be logged in to confirm your delivery address, receive your secret 4-digit OTP handoff,
            and track your delivery partner in real-time.
          </p>

          <div style={styles.authGateActions}>
            <button
              type="button"
              onClick={() => {
                const res = login('dhiraj@example.com', 'customer123', 'customer');
                if (res.success) {
                  showToast('Signed in as Dhiraj! You can now place your order.', 'success');
                }
              }}
              style={styles.authQuickBtn}
            >
              <Sparkles size={16} color="#fbbf24" fill="#fbbf24" />
              <span>⚡ Quick Sign In as Dhiraj (1-Click Demo)</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/user')}
              className="btn btn-primary"
            >
              Sign In or Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={() => navigate('/cart')} style={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Cart</span>
      </button>

      <h1 style={styles.title}>Place Your Order</h1>

      <form onSubmit={handleConfirmOrder} style={styles.checkoutGrid}>
        {/* Left Column: Address & Details Form */}
        <div style={styles.leftCol}>
          {/* Address Details */}
          <div className="glass-card" style={styles.card}>
            <div style={styles.cardHeader}>
              <MapPin size={20} color="#ff5238" />
              <h3>1. Delivery Address & Contact</h3>
            </div>

            <div style={styles.formFieldsGrid}>
              <div>
                <label style={styles.label}>Recipient Name *</label>
                <div style={styles.inputWrap}>
                  <User size={16} color="#9ca3af" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.textInput}
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Phone Number (For Delivery Calls) *</label>
                <div style={styles.inputWrap}>
                  <Phone size={16} color="#9ca3af" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.textInput}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Complete Street Address *</label>
                <div style={styles.inputWrap}>
                  <Home size={16} color="#9ca3af" />
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    style={styles.textInput}
                    placeholder="House/Flat No., Building Name, Street"
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={styles.plainInput}
                />
              </div>

              <div>
                <label style={styles.label}>Postal / Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={styles.plainInput}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Delivery Instructions (Optional)</label>
                <div style={styles.inputWrap}>
                  <FileText size={16} color="#9ca3af" />
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    style={styles.textInput}
                    placeholder="e.g. Leave with security, ring bell twice"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-card" style={styles.card}>
            <div style={styles.cardHeader}>
              <CreditCard size={20} color="#10b981" />
              <h3>2. Select Payment Mode</h3>
            </div>

            <div style={styles.paymentOptions}>
              {[
                { id: 'UPI', label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)', icon: '⚡' },
                { id: 'CARD', label: 'Credit or Debit Card (Visa, Mastercard)', icon: '💳' },
                { id: 'COD', label: 'Cash on Delivery (Pay upon arrival)', icon: '💵' }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    ...styles.paymentOption,
                    borderColor: paymentMethod === m.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: paymentMethod === m.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                  <span style={{ fontWeight: '600', flexGrow: 1 }}>{m.label}</span>
                  {paymentMethod === m.id && <CheckCircle2 size={18} color="#10b981" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div style={styles.rightCol}>
          <div className="glass-card" style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Final Order Summary</h3>

            {/* Restaurant Info */}
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '1.05rem' }}>{cartRestaurant?.name}</strong>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                {cart.length} food items
              </div>
            </div>

            {/* Brief item list */}
            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div>
                    <span style={{ fontWeight: '700' }}>{item.quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price Table */}
            <div style={styles.billTable}>
              <div style={styles.billRow}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ ...styles.billRow, color: '#34d399' }}>
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={styles.billRow}>
                <span>Delivery Fee</span>
                <span>{cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee.toFixed(2)}`}</span>
              </div>
              <div style={styles.billRow}>
                <span>Taxes & Fees</span>
                <span>₹{cartTax.toFixed(2)}</span>
              </div>
              <div style={styles.finalTotalRow}>
                <span>Total Due</span>
                <span style={styles.finalPrice}>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={styles.confirmBtn}>
              <ShieldCheck size={18} />
              <span>Confirm & Place Order</span>
            </button>
          </div>
        </div>
      </form>

      {/* ANIMATED TICK MARK SUCCESS MODAL */}
      {isOrderPlaced && (
        <div style={styles.successBackdrop}>
          <div style={styles.successModal}>
            {/* Animated SVG Checkmark */}
            <div style={styles.svgWrapper}>
              <svg className="animated-check" viewBox="0 0 52 52" style={styles.svgCheck}>
                <circle
                  className="check-circle"
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <path
                  className="check-tick"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27l8 8 16-16"
                />
              </svg>
            </div>

            <h2 style={styles.successHeading}>Order Placed Successfully!</h2>
            <p style={styles.successSub}>
              Your gourmet order <strong>#{placedOrderId}</strong> has been received by{' '}
              {cartRestaurant?.name || 'the kitchen'}.
            </p>

            <div style={styles.otpReminderBox}>
              <Sparkles size={18} color="#f59e0b" />
              <div>
                <strong style={{ color: '#fbbf24' }}>Kitchen Preparing Your Feast</strong>
                <p style={{ fontSize: '0.78rem', color: '#d1d5db', marginTop: '2px' }}>
                  You can track live preparation and courier updates directly on My Orders.
                </p>
              </div>
            </div>

            <div style={styles.redirectNotice}>
              Redirecting to My Orders in <strong>{countdown}s</strong>...
            </div>

            <button
              onClick={() => navigate('/my-orders')}
              className="btn btn-emerald"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              View My Orders Now
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS for Checkmark Animation */}
      <style>{`
        @keyframes stroke-circle {
          0% { stroke-dashoffset: 157; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes stroke-tick {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scale-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .animated-check .check-circle {
          stroke-dasharray: 157;
          stroke-dashoffset: 157;
          animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .animated-check .check-tick {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke-tick 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
        }
        .animated-check {
          animation: scale-pop 0.4s ease-in-out 0.9s both;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '80vh'
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
    marginBottom: '1.25rem',
    fontSize: '0.85rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '2rem'
  },
  checkoutGrid: {
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
  card: {
    padding: '1.75rem',
    borderRadius: '22px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '0.85rem'
  },
  formFieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    color: '#d1d5db',
    fontWeight: '600',
    marginBottom: '0.35rem'
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.7rem 0.85rem'
  },
  textInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)'
  },
  plainInput: {
    width: '100%',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.7rem 0.85rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem'
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.95rem 1.15rem',
    borderRadius: '14px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  summaryCard: {
    padding: '1.75rem',
    borderRadius: '22px'
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.75rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#d1d5db',
    marginBottom: '1rem',
    maxHeight: '180px',
    overflowY: 'auto'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  billTable: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem'
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: '#d1d5db'
  },
  finalTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
    paddingTop: '0.85rem',
    marginTop: '0.35rem'
  },
  finalPrice: {
    fontSize: '1.65rem',
    fontWeight: '900',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)'
  },
  confirmBtn: {
    width: '100%',
    padding: '0.95rem',
    fontSize: '1.05rem',
    marginTop: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },

  /* ANIMATED TICK MARK STYLES */
  successBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 14, 0.92)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '1.5rem'
  },
  successModal: {
    backgroundColor: '#0f1624',
    border: '1.5px solid #10b981',
    borderRadius: '24px',
    maxWidth: '480px',
    width: '100%',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    boxShadow: '0 0 50px rgba(16, 185, 129, 0.35)'
  },
  svgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.25rem'
  },
  svgCheck: {
    width: '84px',
    height: '84px'
  },
  successHeading: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '0.5rem'
  },
  successSub: {
    color: '#9ca3af',
    fontSize: '0.92rem',
    lineHeight: '1.5',
    marginBottom: '1.25rem'
  },
  otpReminderBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '14px',
    padding: '1rem',
    textAlign: 'left',
    marginBottom: '1.25rem'
  },
  redirectNotice: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    marginBottom: '0.5rem'
  },
  authGateCard: {
    padding: '3.5rem 2rem',
    textAlign: 'center',
    maxWidth: '560px',
    margin: '2rem auto',
    borderRadius: '20px'
  },
  authGateIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 82, 56, 0.12)',
    border: '1px solid rgba(255, 82, 56, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto'
  },
  authGateTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 0.75rem 0'
  },
  authGateDesc: {
    fontSize: '0.92rem',
    color: '#9ca3af',
    lineHeight: '1.6',
    margin: '0 0 2rem 0'
  },
  authGateActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    alignItems: 'center'
  },
  authQuickBtn: {
    width: '100%',
    maxWidth: '340px',
    padding: '0.85rem 1.25rem',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: '12px',
    color: '#fef08a',
    fontSize: '0.9rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
