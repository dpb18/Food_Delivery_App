import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapView } from '../common/MapView';
import {
  Bike,
  Power,
  Navigation,
  Phone,
  IndianRupee,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export const DeliveryPartnerView = () => {
  const {
    deliveryPartner,
    toggleDeliveryStatus,
    orders,
    acceptDeliveryOrder,
    verifyOrderOtpAndDeliver
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active delivery accepted by this rider
  const activeDelivery = orders.find(
    (o) => o.status === 'OUT_FOR_DELIVERY' && (o.deliveryPartnerId === deliveryPartner.id || !o.deliveryPartnerId)
  );

  // Orders assigned to this partner or ready for pickup
  const readyOrders = orders.filter(
    (o) =>
      (o.status === 'READY_FOR_PICKUP' || o.status === 'PREPARING') &&
      (!o.deliveryPartnerId || o.deliveryPartnerId === deliveryPartner.id)
  );

  // Completed deliveries for history
  const deliveredOrders = orders.filter(
    (o) => o.status === 'DELIVERED'
  );

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length !== 4) {
      setOtpError('Please enter a 4-digit OTP code');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    setTimeout(() => {
      const result = verifyOrderOtpAndDeliver(activeDelivery.id, enteredOtp);
      setIsVerifying(false);
      if (result.success) {
        setEnteredOtp('');
      } else {
        setOtpError(result.message || 'Incorrect OTP code');
      }
    }, 500);
  };

  return (
    <div style={styles.container}>
      {/* Top Rider Status Banner */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={styles.riderAvatar}>
            <Bike size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={styles.riderName}>{deliveryPartner.fullName}</h1>
              <span className="badge badge-emerald">
                {deliveryPartner.vehicleType} • {deliveryPartner.vehicleNumber}
              </span>
            </div>
            <div style={styles.riderPhone}>{deliveryPartner.phone}</div>
          </div>
        </div>

        {/* Online / Offline Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleDeliveryStatus}
            style={{
              ...styles.statusBtn,
              backgroundColor:
                deliveryPartner.status === 'ONLINE'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
              borderColor:
                deliveryPartner.status === 'ONLINE' ? '#10b981' : '#ef4444',
              color:
                deliveryPartner.status === 'ONLINE' ? '#34d399' : '#f87171'
            }}
          >
            <Power size={18} />
            <span>YOU ARE {deliveryPartner.status}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>
        <div className="glass-card" style={styles.metricCard}>
          <IndianRupee size={24} color="#10b981" />
          <div>
            <div style={styles.metricLabel}>Total Payout / Earnings</div>
            <div style={styles.metricVal}>₹{deliveryPartner.totalEarnings.toFixed(2)}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <CheckCircle2 size={24} color="#3b82f6" />
          <div>
            <div style={styles.metricLabel}>Completed Trips</div>
            <div style={styles.metricVal}>{deliveryPartner.completedDeliveries} Trips</div>
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <Clock size={24} color="#f59e0b" />
          <div>
            <div style={styles.metricLabel}>Orders Ready for Pickup</div>
            <div style={styles.metricVal}>{readyOrders.length} Available</div>
          </div>
        </div>
      </div>

      {/* RIDER OFFLINE NOTICE */}
      {deliveryPartner.status === 'OFFLINE' && (
        <div className="glass-card" style={styles.offlineWarning}>
          <AlertCircle size={22} color="#f59e0b" />
          <div>
            <strong>You are currently Offline</strong>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Switch your status to <strong>ONLINE</strong> in the top right corner to start receiving food delivery requests.
            </p>
          </div>
        </div>
      )}

      {/* ACTIVE ONGOING DELIVERY SECTION (WITH MAP & OTP VERIFICATION) */}
      {activeDelivery && (
        <div className="glass-card" style={styles.activeDeliveryCard}>
          <div style={styles.activeCardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={20} color="#ff5238" />
              <h2 style={{ fontSize: '1.3rem' }}>
                Active Trip: Order #{activeDelivery.id}
              </h2>
            </div>
            <span className="badge badge-primary">On Route to Customer</span>
          </div>

          <div style={styles.deliveryFlowGrid}>
            {/* Interactive Route Map */}
            <div style={styles.mapContainer}>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                📍 GPS Route: {activeDelivery.restaurantName} ➔ {activeDelivery.deliveryAddress?.streetAddress}
              </div>
              <MapView
                restaurantCoords={[activeDelivery.restaurantLat || 12.9719, activeDelivery.restaurantLng || 77.6412]}
                customerCoords={[activeDelivery.deliveryAddress?.lat || 12.9784, activeDelivery.deliveryAddress?.lng || 77.6408]}
                riderCoords={[12.9750, 77.6410]}
                restaurantName={activeDelivery.restaurantName}
                customerAddress={activeDelivery.deliveryAddress?.streetAddress}
                height="320px"
                showRider={true}
              />
            </div>

            {/* OTP Handover & Address Info */}
            <div style={styles.handoffPanel}>
              {/* Drop-off details */}
              <div style={styles.addressSummary}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff7a65', fontSize: '0.85rem' }}>
                  <MapPin size={16} />
                  <strong>Customer Drop-off Address:</strong>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '0.25rem' }}>
                  {activeDelivery.customerName}
                </div>
                <div style={{ color: '#d1d5db', fontSize: '0.85rem' }}>
                  {activeDelivery.deliveryAddress?.streetAddress}
                </div>
                <a
                  href={`tel:${activeDelivery.customerPhone || '9876543210'}`}
                  style={styles.callCustomerBtn}
                >
                  <Phone size={14} /> Call Customer ({activeDelivery.customerPhone || '+91 98765 43210'})
                </a>
              </div>

              {/* CRITICAL: OTP INPUT & VERIFICATION FORM */}
              <div style={styles.otpVerifyBox}>
                <div style={styles.otpVerifyHeader}>
                  <KeyRound size={20} color="#10b981" />
                  <strong>Delivery Verification OTP</strong>
                </div>
                <p style={styles.otpExplain}>
                  Ask the customer for their 4-digit code shown on their tracking screen before handing over the food package.
                </p>

                <form onSubmit={handleVerifyOtp} style={styles.otpForm}>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-Digit OTP"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    style={styles.otpInput}
                  />

                  {otpError && (
                    <div style={styles.otpErrorText}>{otpError}</div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-emerald"
                    style={{ width: '100%', padding: '0.8rem' }}
                    disabled={isVerifying || enteredOtp.length !== 4}
                  >
                    <CheckCircle2 size={18} />
                    <span>{isVerifying ? 'Verifying Code...' : 'Verify OTP & Complete Delivery'}</span>
                  </button>
                </form>

                <div style={styles.hint}>
                  💡 Tip: The customer sees this code on their live tracking screen (e.g. <code>{activeDelivery.deliveryOtp}</code>).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AVAILABLE ORDERS FOR PICKUP (KITCHEN READY) */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
          Orders Ready for Pickup ({readyOrders.length})
        </h2>

        {readyOrders.length === 0 ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af' }}>
            <Bike size={36} color="#6b7280" style={{ margin: '0 auto 0.75rem auto' }} />
            <p>No orders are currently waiting for pickup.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              When the kitchen advances an order to "Ready for Pickup" in the Admin panel, it will instantly appear here for acceptance!
            </p>
          </div>
        ) : (
          <div style={styles.readyGrid}>
            {readyOrders.map((order) => (
              <div key={order.id} className="glass-card" style={styles.readyCard}>
                <div style={styles.readyCardHeader}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{order.restaurantName}</h3>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      {order.restaurantAddress}
                    </span>
                  </div>
                  <div style={styles.earningBadge}>
                    +₹{(order.deliveryFee + 15).toFixed(0)} Payout
                  </div>
                </div>

                <div style={styles.readyBody}>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong>Drop-off: </strong>
                    <span style={{ color: '#d1d5db' }}>
                      {order.deliveryAddress?.streetAddress}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    Package: {order.items.length} items (₹{order.totalAmount.toFixed(0)})
                  </div>
                </div>

                <button
                  className="btn btn-emerald"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => acceptDeliveryOrder(order.id)}
                  disabled={deliveryPartner.status === 'OFFLINE' || !!activeDelivery}
                >
                  <Navigation size={16} />
                  <span>
                    {activeDelivery ? 'Finish Active Trip First' : 'Accept Delivery & Start GPS'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMPLETED TRIPS RECENT LOG */}
      <section style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
          Recent Delivered Orders ({deliveredOrders.length})
        </h3>
        <div className="glass-card" style={{ padding: '1rem' }}>
          {deliveredOrders.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No orders delivered yet.</p>
          ) : (
            deliveredOrders.map((o) => (
              <div key={o.id} style={styles.deliveredRow}>
                <div>
                  <strong>Order #{o.id}</strong> — {o.restaurantName}
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Delivered to {o.deliveryAddress?.streetAddress} • OTP Verified ✓
                  </div>
                </div>
                <span className="badge badge-emerald">Delivered</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(0.85rem, 2.5vw, 1.5rem)',
    minHeight: '85vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  riderAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
  },
  riderName: {
    fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
    fontWeight: '800'
  },
  riderPhone: {
    color: '#9ca3af',
    fontSize: '0.85rem'
  },
  statusBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    borderRadius: '9999px',
    border: '1.5px solid',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem'
  },
  metricCard: {
    padding: '1.25rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  metricLabel: {
    fontSize: '0.78rem',
    color: '#9ca3af'
  },
  metricVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    color: '#f3f4f6'
  },
  offlineWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: '16px',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    marginBottom: '2rem'
  },
  activeDeliveryCard: {
    padding: '1.5rem',
    borderRadius: '24px',
    border: '2px solid #10b981',
    marginBottom: '2.5rem'
  },
  activeCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.75rem'
  },
  deliveryFlowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '1.5rem',
    alignItems: 'start'
  },
  mapContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  handoffPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  addressSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '14px',
    padding: '1.1rem',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  callCustomerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#60a5fa',
    padding: '0.45rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    marginTop: '0.75rem',
    textDecoration: 'none',
    fontWeight: '600'
  },
  otpVerifyBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1.5px solid #10b981',
    borderRadius: '16px',
    padding: '1.25rem'
  },
  otpVerifyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#34d399',
    fontSize: '1rem',
    marginBottom: '0.5rem'
  },
  otpExplain: {
    fontSize: '0.8rem',
    color: '#d1d5db',
    lineHeight: '1.4',
    marginBottom: '1rem'
  },
  otpForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  otpInput: {
    textAlign: 'center',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.75rem',
    fontWeight: '900',
    letterSpacing: '0.3em',
    padding: '0.65rem',
    borderRadius: '12px',
    border: '1.5px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: '#0a0e17',
    color: '#fff',
    outline: 'none'
  },
  otpErrorText: {
    color: '#f87171',
    fontSize: '0.8rem',
    textAlign: 'center',
    fontWeight: '600'
  },
  hint: {
    marginTop: '0.75rem',
    fontSize: '0.75rem',
    color: '#9ca3af',
    textAlign: 'center'
  },
  readyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem'
  },
  readyCard: {
    padding: '1.25rem',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  readyCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem'
  },
  earningBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '800',
    whiteSpace: 'nowrap'
  },
  readyBody: {
    marginTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '0.75rem'
  },
  deliveredRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.65rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    fontSize: '0.88rem'
  }
};
