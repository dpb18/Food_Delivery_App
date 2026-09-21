import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapView } from '../common/MapView';
import {
  CheckCircle2,
  Clock,
  Bike,
  ShieldCheck,
  Phone,
  Store,
  ChevronLeft,
  KeyRound,
  Sparkles
} from 'lucide-react';

export const OrderTrackingView = () => {
  const { orders, selectedOrderId, setCurrentView } = useApp();

  const currentOrder =
    orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>No Active Orders Found</h2>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentView('home')}
          style={{ marginTop: '1rem' }}
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  // Milestone Stages
  const stages = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received by kitchen' },
    { key: 'PREPARING', label: 'Kitchen Preparing', desc: 'Cooking your fresh meal' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Packaged & waiting for rider' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider is on the way' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered with OTP verification' }
  ];

  const getStageIndex = (status) => {
    const idx = stages.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = getStageIndex(currentOrder.status);
  const isDelivered = currentOrder.status === 'DELIVERED';

  return (
    <div style={styles.container}>
      <button
        onClick={() => setCurrentView('home')}
        style={styles.backBtn}
      >
        <ChevronLeft size={16} />
        <span>Back to Ordering</span>
      </button>

      {/* Header Info */}
      <div style={styles.header}>
        <div>
          <div style={styles.orderNumberRow}>
            <h1 style={styles.title}>Live Order Tracking</h1>
            <span className="badge badge-amber">#{currentOrder.id}</span>
          </div>
          <p style={styles.subtitle}>
            From <strong>{currentOrder.restaurantName}</strong> • Placed on{' '}
            {new Date(currentOrder.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div style={styles.etaBox}>
          <Clock size={20} color="#ff5238" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>ESTIMATED TIME</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ff7a65' }}>
              {isDelivered ? 'Delivered' : currentOrder.estimatedDeliveryTime || '25-30 mins'}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left Column: Milestones & Map */}
        <div style={styles.leftCol}>
          {/* Milestone Progress Bar */}
          <div className="glass-card" style={styles.progressCard}>
            <div style={styles.stagesRow}>
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} style={styles.stageItem}>
                    <div style={styles.iconCircleWrapper}>
                      <div
                        style={{
                          ...styles.stageCircle,
                          backgroundColor: isPassed
                            ? isCurrent
                              ? '#ff5238'
                              : '#10b981'
                            : 'rgba(255, 255, 255, 0.08)',
                          borderColor: isCurrent ? '#ff7a65' : 'transparent',
                          boxShadow: isCurrent ? '0 0 16px rgba(255, 82, 56, 0.6)' : 'none'
                        }}
                      >
                        {isPassed && !isCurrent && <CheckCircle2 size={15} color="#fff" />}
                        {isCurrent && <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>●</span>}
                      </div>
                      {idx < stages.length - 1 && (
                        <div
                          style={{
                            ...styles.connectorLine,
                            backgroundColor: idx < currentStageIndex ? '#10b981' : 'rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      )}
                    </div>
                    <div style={styles.stageLabel}>{stage.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Leaflet Route Map */}
          <div className="glass-card" style={styles.mapCard}>
            <div style={styles.mapCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bike size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.05rem' }}>Live Delivery Route</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                {isDelivered ? 'Trip completed' : 'Simulating live GPS navigation'}
              </span>
            </div>

            <MapView
              restaurantCoords={[currentOrder.restaurantLat || 12.9719, currentOrder.restaurantLng || 77.6412]}
              customerCoords={[currentOrder.deliveryAddress?.lat || 12.9784, currentOrder.deliveryAddress?.lng || 77.6408]}
              riderCoords={[12.9750, 77.6410]}
              restaurantName={currentOrder.restaurantName}
              customerAddress={currentOrder.deliveryAddress?.streetAddress}
              height="340px"
              showRider={!isDelivered}
            />
          </div>
        </div>

        {/* Right Column: OTP Banner, Rider Info, Order Summary */}
        <div style={styles.rightCol}>
          {/* CRITICAL FEATURE: DELIVERY OTP VERIFICATION CARD */}
          <div
            className="glass-card"
            style={{
              ...styles.otpCard,
              borderColor: isDelivered ? '#10b981' : '#ff5238'
            }}
          >
            <div style={styles.otpHeader}>
              <KeyRound size={22} color={isDelivered ? '#10b981' : '#ff5238'} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                  Delivery Verification Code
                </div>
                <h3 style={{ fontSize: '1.15rem' }}>
                  {isDelivered ? 'OTP Successfully Verified' : 'Share with Delivery Partner'}
                </h3>
              </div>
            </div>

            {!isDelivered ? (
              <>
                <div style={styles.otpDisplayBox}>
                  <div style={styles.otpDigits}>{currentOrder.deliveryOtp}</div>
                  <div style={styles.otpInstruction}>
                    Provide this 4-digit code to the delivery partner upon arrival to receive your package.
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.otpSuccessBox}>
                <CheckCircle2 size={32} color="#10b981" />
                <div>
                  <strong>Order Delivered Successfully</strong>
                  <div style={{ fontSize: '0.82rem', color: '#d1d5db' }}>
                    Verified by rider. Bon appétit!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Partner Details Card */}
          {currentOrder.deliveryPartnerName && (
            <div className="glass-card" style={styles.riderCard}>
              <div style={styles.riderHeader}>
                <div style={styles.riderAvatar}>
                  <Bike size={22} color="#ffffff" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                    {currentOrder.deliveryPartnerName}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    {currentOrder.deliveryPartnerVehicle || 'Delivery Partner'}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${currentOrder.deliveryPartnerPhone || '9811122334'}`}
                style={styles.callRiderBtn}
              >
                <Phone size={15} />
                <span>Call Rider ({currentOrder.deliveryPartnerPhone || '+91 98111 22334'})</span>
              </a>
            </div>
          )}

          {/* Itemized Receipt */}
          <div className="glass-card" style={styles.receiptCard}>
            <h4 style={styles.receiptTitle}>Order Details</h4>
            <div style={styles.receiptList}>
              {currentOrder.items.map((item, idx) => (
                <div key={idx} style={styles.receiptItem}>
                  <div>
                    <span style={{ fontWeight: '700' }}>{item.quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <span>₹{item.subtotal || item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={styles.receiptTotalRow}>
              <span>Total Paid ({currentOrder.paymentMethod})</span>
              <span style={{ color: '#ff7a65', fontWeight: '800' }}>
                ₹{currentOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '85vh'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#d1d5db',
    padding: '0.45rem 0.85rem',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '1.25rem',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  orderNumberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '800'
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    marginTop: '0.25rem'
  },
  etaBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(255, 82, 56, 0.1)',
    border: '1px solid rgba(255, 82, 56, 0.25)',
    borderRadius: '14px',
    padding: '0.65rem 1.25rem'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.75rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  progressCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  stagesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  stageItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    flex: 1
  },
  iconCircleWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'center'
  },
  stageCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    border: '2px solid'
  },
  connectorLine: {
    position: 'absolute',
    left: '50%',
    width: '100%',
    height: '3px',
    top: '15px',
    zIndex: 1
  },
  stageLabel: {
    fontSize: '0.72rem',
    textAlign: 'center',
    marginTop: '0.5rem',
    fontWeight: '600',
    color: '#d1d5db',
    lineHeight: '1.2'
  },
  mapCard: {
    padding: '1.25rem',
    borderRadius: '20px'
  },
  mapCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  otpCard: {
    padding: '1.5rem',
    borderRadius: '20px',
    border: '1.5px solid',
    backgroundColor: 'rgba(18, 25, 40, 0.9)'
  },
  otpHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  otpDisplayBox: {
    backgroundColor: 'rgba(255, 82, 56, 0.1)',
    border: '1px dashed #ff5238',
    borderRadius: '14px',
    padding: '1.25rem',
    textAlign: 'center'
  },
  otpDigits: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '0.35em',
    color: '#ff7a65',
    textShadow: '0 0 20px rgba(255, 82, 56, 0.5)'
  },
  otpInstruction: {
    fontSize: '0.8rem',
    color: '#d1d5db',
    marginTop: '0.5rem',
    lineHeight: '1.4'
  },
  otpSuccessBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '12px',
    border: '1px solid #10b981'
  },
  riderCard: {
    padding: '1.25rem',
    borderRadius: '18px'
  },
  riderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '0.85rem'
  },
  riderAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  callRiderBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    padding: '0.65rem',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)'
  },
  receiptCard: {
    padding: '1.25rem',
    borderRadius: '18px'
  },
  receiptTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '0.85rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.5rem'
  },
  receiptList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#d1d5db'
  },
  receiptItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  receiptTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.75rem',
    marginTop: '0.75rem',
    fontSize: '0.95rem',
    fontWeight: '700'
  }
};
