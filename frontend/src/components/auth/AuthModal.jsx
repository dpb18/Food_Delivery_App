import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Bike,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal = () => {
  const { authModal, setAuthModal, login, register } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('BIKE');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');

  if (!authModal.isOpen) return null;

  const target = authModal.targetPortal; // 'customer' | 'admin' | 'delivery'

  const getPortalInfo = () => {
    switch (target) {
      case 'admin':
        return {
          title: 'Admin Console Login',
          sub: 'Restricted to store managers & administrators.',
          icon: <ShieldCheck size={26} color="#8b5cf6" />,
          badgeClass: 'badge-purple',
          badgeText: 'Admin Security',
          demoEmail: 'admin@feasthub.com',
          demoPass: 'admin123'
        };
      case 'delivery':
        return {
          title: 'Delivery Partner Access',
          sub: 'Log in to accept orders and start GPS delivery routing.',
          icon: <Bike size={26} color="#10b981" />,
          badgeClass: 'badge-emerald',
          badgeText: 'Rider Portal',
          demoEmail: 'vikram@feasthub.com',
          demoPass: 'rider123'
        };
      default:
        return {
          title: 'Customer Account',
          sub: 'Log in to order delicious food and track live deliveries.',
          icon: <ShoppingBag size={26} color="#ff5238" />,
          badgeClass: 'badge-primary',
          badgeText: 'Customer Portal',
          demoEmail: 'dhiraj@example.com',
          demoPass: 'customer123'
        };
    }
  };

  const portalInfo = getPortalInfo();

  const handleFillDemo = () => {
    setEmail(portalInfo.demoEmail);
    setPassword(portalInfo.demoPass);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please provide both email and password');
        return;
      }
      const res = login(email, password, target);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!fullName || !email || !phone || !password) {
        setError('All fields are mandatory for registration');
        return;
      }
      if (target === 'delivery' && !vehicleNumber) {
        setError('Vehicle registration number is required for delivery riders');
        return;
      }

      const res = register(
        { fullName, email, phone, password, vehicleType, vehicleNumber },
        target
      );
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  return (
    <div
      style={styles.backdrop}
      onClick={() => setAuthModal({ isOpen: false, targetPortal: target })}
    >
      <div className="modal-responsive" style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          style={styles.closeBtn}
          onClick={() => setAuthModal({ isOpen: false, targetPortal: target })}
        >
          <X size={18} color="#9ca3af" />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>{portalInfo.icon}</div>
          <span className={`badge ${portalInfo.badgeClass}`} style={{ marginTop: '0.5rem' }}>
            {portalInfo.badgeText}
          </span>
          <h2 style={styles.title}>{portalInfo.title}</h2>
          <p style={styles.subtitle}>{portalInfo.sub}</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            style={{
              ...styles.tabBtn,
              ...(mode === 'login' ? styles.tabBtnActive : {})
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            style={{
              ...styles.tabBtn,
              ...(mode === 'signup' ? styles.tabBtnActive : {})
            }}
          >
            Register Account
          </button>
        </div>

        {/* 1-Click Demo Credentials Pill */}
        {mode === 'login' && (
          <div style={styles.demoCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#d1d5db' }}>
                <strong>Demo Credentials:</strong> <code>{portalInfo.demoEmail}</code> / <code>{portalInfo.demoPass}</code>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                style={styles.autoFillBtn}
              >
                Auto-Fill
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <>
              <div>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={16} color="#9ca3af" />
                  <input
                    type="text"
                    placeholder="e.g. Dhiraj Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Phone Number</label>
                <div style={styles.inputWrapper}>
                  <Phone size={16} color="#9ca3af" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {target === 'delivery' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={styles.label}>Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      style={styles.selectInput}
                    >
                      <option value="BIKE">Motorbike</option>
                      <option value="SCOOTER">Scooter</option>
                      <option value="ELECTRIC_VEHICLE">EV Bike</option>
                      <option value="CAR">Car</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Vehicle Number</label>
                    <input
                      type="text"
                      placeholder="KA 03 EZ 9821"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      style={{ ...styles.input, padding: '0.75rem' }}
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} color="#9ca3af" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} color="#9ca3af" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {error && <div style={styles.errorText}>⚠️ {error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <span>{mode === 'login' ? 'Unlock & Enter Portal' : 'Create Verified Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 14, 0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: '#0f1624',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '24px',
    maxWidth: '460px',
    width: '100%',
    padding: '2rem',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    marginBottom: '1.5rem'
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: '800',
    marginTop: '0.25rem'
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.82rem',
    maxWidth: '320px',
    lineHeight: '1.4'
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    padding: '0.25rem',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  tabBtn: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '0.55rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    transition: 'all 0.2s'
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255, 82, 56, 0.2)',
    color: '#ff7a65'
  },
  demoCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    borderRadius: '12px',
    padding: '0.65rem 0.85rem',
    marginBottom: '1.25rem'
  },
  autoFillBtn: {
    background: 'rgba(59, 130, 246, 0.25)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    color: '#93c5fd',
    borderRadius: '6px',
    padding: '0.25rem 0.55rem',
    fontSize: '0.72rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: '0.35rem'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.65rem 0.85rem'
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-body)'
  },
  selectInput: {
    width: '100%',
    background: '#0b0f19',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.65rem 0.85rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.85rem'
  },
  errorText: {
    color: '#f87171',
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center'
  }
};
