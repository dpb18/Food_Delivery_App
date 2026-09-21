import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { MapView } from '../common/MapView';
import {
  Package,
  Clock,
  CheckCircle2,
  Bike,
  KeyRound,
  Store,
  ChevronRight,
  ArrowRight,
  MapPin,
  X,
  Phone,
  Sparkles
} from 'lucide-react';

export const MyOrdersView = () => {
  const navigate = useNavigate();
  const { orders, customerSession } = useApp();
  const { addToCart } = useCart();

  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-emerald">Delivered ✓</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="badge badge-primary">Out for Delivery 🛵</span>;
      case 'READY_FOR_PICKUP':
        return <span className="badge badge-amber">Ready for Pickup 📦</span>;
      case 'PREPARING':
        return <span className="badge badge-amber">Kitchen Preparing 🍳</span>;
      default:
        return <span className="badge badge-purple">Order Received ⚡</span>;
    }
  };

  if (!customerSession) {
    return (
      <div style={styles.container}>
        <div className="glass-card" style={styles.emptyCard}>
          <Package size={52} color="#ff5238" style={{ margin: '0 auto 1rem auto' }} />
          <h2>Sign In to View Your Orders</h2>
          <p style={{ color: '#9ca3af', maxWidth: '460px', margin: '0.5rem auto 1.5rem auto', lineHeight: '1.5' }}>
            Please log in with your customer account to track live deliveries, access your secret 4-digit OTP handoff codes, and view past order receipts.
          </p>
          <Link to="/user" className="btn btn-primary">
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Orders History</h1>
          <p style={styles.subtitle}>
            Track active deliveries in real-time or re-order past culinary favorites.
          </p>
        </div>
        <Link to="/" className="btn btn-secondary btn-sm">
          + Place New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card" style={styles.emptyCard}>
          <Package size={48} color="#9ca3af" style={{ margin: '0 auto 1rem auto' }} />
          <h2>No orders placed yet</h2>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            When you order dishes, your receipts, live tracking, and OTP verification codes will appear here!
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => {
            const isCompleted = order.status === 'DELIVERED';

            return (
              <div key={order.id} className="glass-card" style={styles.orderCard}>
                {/* Order Top Bar */}
                <div style={styles.orderTopBar}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={styles.orderIconWrap}>
                      <Package size={20} color="#ff5238" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={styles.orderId}>Order #{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div style={styles.orderDate}>
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={styles.orderTotalBox}>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>TOTAL PAID</div>
                    <div style={styles.orderTotalVal}>₹{order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>

                {/* Restaurant & Destination Row */}
                <div style={styles.detailsRow}>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#fff' }}>
                      {order.restaurantName}
                    </strong>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                      {order.restaurantAddress}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                      <strong>Deliver to: </strong>
                      {order.deliveryAddress?.streetAddress || 'Home'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                      Payment: {order.paymentMethod} • {order.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* CRITICAL: OTP VERIFICATION DISPLAY FOR ACTIVE ORDERS */}
                {!isCompleted && (
                  <div style={styles.activeOtpCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <KeyRound size={20} color="#ff5238" />
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#ff7a65', textTransform: 'uppercase', fontWeight: '800' }}>
                          Delivery Verification Code
                        </span>
                        <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                          Share this PIN with delivery partner when your meal arrives:
                        </div>
                      </div>
                    </div>
                    <div style={styles.otpPill}>{order.deliveryOtp}</div>
                  </div>
                )}

                {/* Ordered Dishes List */}
                <div style={styles.dishesSummary}>
                  {order.items.map((item, idx) => (
                    <span key={idx} style={styles.dishTag}>
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>

                {/* Order Actions */}
                <div style={styles.orderFooter}>
                  {!isCompleted ? (
                    <button
                      onClick={() => setActiveTrackingOrder(order)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.5rem 1.25rem' }}
                    >
                      <Bike size={15} />
                      <span>Track Live on Map</span>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} />
                      <span>Handed Over & Verified Safely</span>
                    </div>
                  )}

                  <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    {order.items.length} items total
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIVE MAP TRACKING MODAL */}
      {activeTrackingOrder && (
        <div style={styles.modalBackdrop} onClick={() => setActiveTrackingOrder(null)}>
          <div className="modal-responsive" style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>
                  Live Delivery Route: #{activeTrackingOrder.id}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  {activeTrackingOrder.restaurantName} ➔ Your Doorstep
                </span>
              </div>
              <button
                onClick={() => setActiveTrackingOrder(null)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#fff" />
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <div style={{ margin: '1rem 0' }}>
              <MapView
                restaurantCoords={[
                  activeTrackingOrder.restaurantLat || 12.9719,
                  activeTrackingOrder.restaurantLng || 77.6412
                ]}
                customerCoords={[
                  activeTrackingOrder.deliveryAddress?.lat || 12.9784,
                  activeTrackingOrder.deliveryAddress?.lng || 77.6408
                ]}
                riderCoords={[12.9750, 77.6410]}
                restaurantName={activeTrackingOrder.restaurantName}
                customerAddress={activeTrackingOrder.deliveryAddress?.streetAddress}
                height="clamp(220px, 45vw, 320px)"
                showRider={activeTrackingOrder.status !== 'DELIVERED'}
              />
            </div>

            {/* OTP Reminder inside modal */}
            <div style={styles.modalOtpCard}>
              <KeyRound size={20} color="#ff5238" />
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>DELIVERY OTP PIN</div>
                <strong style={{ fontSize: '1.3rem', color: '#ff7a65', letterSpacing: '0.15em' }}>
                  {activeTrackingOrder.deliveryOtp}
                </strong>
              </div>
              <span className="badge badge-primary">Provide to Rider</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(0.85rem, 2.5vw, 1.5rem)',
    minHeight: '80vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
    fontWeight: '800'
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.92rem',
    marginTop: '0.25rem'
  },
  emptyCard: {
    textAlign: 'center',
    padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
    borderRadius: '24px'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  orderCard: {
    padding: 'clamp(1rem, 3vw, 1.75rem)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem'
  },
  orderTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  orderIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderId: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: '800'
  },
  orderDate: {
    fontSize: '0.78rem',
    color: '#9ca3af',
    marginTop: '2px'
  },
  orderTotalBox: {
    textAlign: 'right'
  },
  orderTotalVal: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)'
  },
  detailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  activeOtpCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 56, 0.1)',
    border: '1.5px dashed #ff5238',
    borderRadius: '14px',
    padding: '0.85rem 1.25rem',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  otpPill: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.6rem',
    fontWeight: '900',
    letterSpacing: '0.25em',
    color: '#ff7a65',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '0.2rem 0.85rem',
    borderRadius: '10px'
  },
  dishesSummary: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  dishTag: {
    fontSize: '0.78rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.25rem 0.65rem',
    borderRadius: '8px',
    color: '#d1d5db'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '0.85rem'
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 14, 0.88)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '1rem'
  },
  modalCard: {
    backgroundColor: '#0f1624',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '24px',
    maxWidth: '600px',
    width: '100%',
    padding: '1.5rem',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalCloseBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  modalOtpCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'rgba(255, 82, 56, 0.1)',
    border: '1px solid rgba(255, 82, 56, 0.3)',
    borderRadius: '14px',
    padding: '0.85rem 1.25rem'
  }
};
