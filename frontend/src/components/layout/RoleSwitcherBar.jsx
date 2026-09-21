import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  ShieldCheck,
  Bike,
  ArrowRightLeft,
  Lock,
  Unlock,
  LogOut,
  User
} from 'lucide-react';

export const RoleSwitcherBar = () => {
  const {
    activePortal,
    requestSwitchPortal,
    cartCount,
    orders,
    deliveryPartner,
    customerSession,
    adminSession,
    deliverySession,
    logout,
    setAuthModal
  } = useApp();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'PLACED' || o.status === 'PREPARING'
  ).length;

  const readyForPickupCount = orders.filter(
    (o) => o.status === 'READY_FOR_PICKUP'
  ).length;

  // Active session for current view
  const currentSession =
    activePortal === 'admin'
      ? adminSession
      : activePortal === 'delivery'
      ? deliverySession
      : customerSession;

  return (
    <aside aria-label="Portal Switcher" style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.leftLabel}>
          <ArrowRightLeft size={15} color="#ff5238" />
          <span style={styles.modeText}>SECURE PORTAL SWITCHER:</span>
        </div>

        <div style={styles.tabsList}>
          {/* Customer Portal Button */}
          <button
            onClick={() => requestSwitchPortal('customer')}
            style={{
              ...styles.tabBtn,
              ...(activePortal === 'customer' ? styles.activeCustomer : styles.inactiveTab)
            }}
          >
            <ShoppingBag size={15} />
            <span>Customer View</span>
            {!customerSession && <Lock size={12} color="#9ca3af" />}
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>

          {/* Admin Dashboard Button (Password Protected) */}
          <button
            onClick={() => requestSwitchPortal('admin')}
            style={{
              ...styles.tabBtn,
              ...(activePortal === 'admin' ? styles.activeAdmin : styles.inactiveTab)
            }}
          >
            <ShieldCheck size={15} />
            <span>Admin Console</span>
            {!adminSession ? (
              <span style={styles.lockBadge}>
                <Lock size={11} /> Password Required
              </span>
            ) : (
              <Unlock size={12} color="#c084fc" />
            )}
            {pendingOrdersCount > 0 && (
              <span style={styles.adminBadge}>{pendingOrdersCount} new</span>
            )}
          </button>

          {/* Delivery Partner Panel Button (Password Protected) */}
          <button
            onClick={() => requestSwitchPortal('delivery')}
            style={{
              ...styles.tabBtn,
              ...(activePortal === 'delivery' ? styles.activeDelivery : styles.inactiveTab)
            }}
          >
            <Bike size={15} />
            <span>Delivery Partner</span>
            {!deliverySession ? (
              <span style={styles.lockBadge}>
                <Lock size={11} /> Password Required
              </span>
            ) : (
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: deliveryPartner.status === 'ONLINE' ? '#10b981' : '#6b7280'
                }}
              />
            )}
            {readyForPickupCount > 0 && (
              <span style={styles.deliveryBadge}>{readyForPickupCount} ready</span>
            )}
          </button>
        </div>

        {/* User Session Profile & Sign Out Widget */}
        <div style={styles.sessionWidget}>
          {currentSession ? (
            <div style={styles.userProfilePill}>
              <User size={13} color="#ff7a65" />
              <span style={{ color: '#fff', fontWeight: '600' }}>{currentSession.fullName}</span>
              <button
                onClick={() => logout(activePortal)}
                style={styles.signOutBtn}
                title="Sign Out"
              >
                <LogOut size={13} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal({ isOpen: true, targetPortal: activePortal })}
              style={styles.loginBtn}
            >
              <Lock size={13} />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

const styles = {
  container: {
    backgroundColor: '#05080e',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.45rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  wrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  leftLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    color: '#9ca3af',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.05em'
  },
  modeText: {
    color: '#d1d5db'
  },
  tabsList: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    border: '1px solid transparent',
    fontFamily: 'var(--font-heading)'
  },
  inactiveTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#9ca3af',
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  activeCustomer: {
    backgroundColor: 'rgba(255, 82, 56, 0.18)',
    color: '#ff7a65',
    borderColor: 'rgba(255, 82, 56, 0.4)',
    boxShadow: '0 0 12px rgba(255, 82, 56, 0.25)'
  },
  activeAdmin: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    color: '#c084fc',
    borderColor: 'rgba(139, 92, 246, 0.45)',
    boxShadow: '0 0 12px rgba(139, 92, 246, 0.25)'
  },
  activeDelivery: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    color: '#34d399',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)'
  },
  lockBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.65rem',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: '0.1rem 0.4rem',
    borderRadius: '6px',
    color: '#9ca3af'
  },
  cartBadge: {
    backgroundColor: '#ff5238',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.1rem 0.4rem',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  adminBadge: {
    backgroundColor: '#8b5cf6',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.1rem 0.45rem',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  deliveryBadge: {
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.1rem 0.45rem',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  sessionWidget: {
    display: 'flex',
    alignItems: 'center'
  },
  userProfilePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '9999px',
    padding: '0.25rem 0.65rem',
    fontSize: '0.78rem'
  },
  signOutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: 'rgba(239, 68, 68, 0.15)',
    border: 'none',
    color: '#f87171',
    padding: '0.2rem 0.45rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  loginBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    border: '1px solid rgba(255, 82, 56, 0.3)',
    color: '#ff7a65',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer'
  }
};
