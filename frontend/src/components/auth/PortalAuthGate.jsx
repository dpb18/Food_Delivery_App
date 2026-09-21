import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bike,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortalAuthGate = ({ portal = 'admin', children }) => {
  const { adminSession, deliverySession, login } = useApp();
  const [email, setEmail] = useState(
    portal === 'admin' ? 'admin@feasthub.com' : 'vikram@feasthub.com'
  );
  const [password, setPassword] = useState(
    portal === 'admin' ? 'admin123' : 'rider123'
  );
  const [error, setError] = useState('');

  const isAuthenticated = portal === 'admin' ? !!adminSession : !!deliverySession;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const isAdmin = portal === 'admin';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password, portal);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.gateCard}>
        <div style={styles.header}>
          <div
            style={{
              ...styles.iconCircle,
              backgroundColor: isAdmin ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'
            }}
          >
            {isAdmin ? (
              <ShieldCheck size={32} color="#8b5cf6" />
            ) : (
              <Bike size={32} color="#10b981" />
            )}
          </div>
          <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-emerald'}`}>
            {isAdmin ? 'Admin Console Security' : 'Delivery Partner Portal'}
          </span>
          <h1 style={styles.title}>
            {isAdmin ? 'Administrative Access Gate' : 'Delivery Partner Login'}
          </h1>
          <p style={styles.subtitle}>
            {isAdmin
              ? 'This portal requires verified administrator credentials to view orders, revenue, and inventory.'
              : 'Sign in to access your active GPS navigation route and live delivery requests.'}
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div style={styles.demoBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff7a65', fontSize: '0.8rem', fontWeight: '700' }}>
            <Sparkles size={14} /> DEMO LOGIN CREDENTIALS
          </div>
          <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '0.35rem' }}>
            Email: <code>{isAdmin ? 'admin@feasthub.com' : 'vikram@feasthub.com'}</code>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
            Password: <code>{isAdmin ? 'admin123' : 'rider123'}</code>
          </div>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div>
            <label style={styles.label}>Registered Email Address</label>
            <div style={styles.inputWrap}>
              <Mail size={16} color="#9ca3af" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <Lock size={16} color="#9ca3af" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {error && <div style={styles.errorText}>⚠️ {error}</div>}

          <button
            type="submit"
            className={isAdmin ? 'btn btn-primary' : 'btn btn-emerald'}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            <span>Authenticate & Enter</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={styles.returnLink}>
            <ArrowLeft size={14} /> Return to Customer App
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem'
  },
  gateCard: {
    maxWidth: '460px',
    width: '100%',
    padding: '2.5rem 2rem',
    borderRadius: '24px'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.75rem'
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.25rem'
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '800'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    lineHeight: '1.5',
    maxWidth: '380px'
  },
  demoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '0.85rem 1rem',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#d1d5db',
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
  input: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)'
  },
  errorText: {
    color: '#f87171',
    fontSize: '0.82rem',
    textAlign: 'center',
    fontWeight: '600'
  },
  returnLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.85rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem'
  }
};
