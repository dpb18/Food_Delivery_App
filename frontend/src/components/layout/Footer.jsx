import React from 'react';
import { Flame, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Top Grid */}
        <div style={styles.topGrid}>
          {/* Brand Column */}
          <div style={styles.brandCol}>
            <div style={styles.brandRow}>
              <div style={styles.logoBadge}>
                <Flame size={20} color="#ffffff" />
              </div>
              <span style={styles.brandTitle}>
                Feast<span style={{ color: '#ff5238' }}>Hub</span>
              </span>
            </div>
            <p style={styles.brandTagline}>
              Delivering freshly prepared culinary excellence from your city's finest restaurants directly to your doorstep.
            </p>
            <div style={styles.verifiedBadge}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Fast & Fresh Delivery Guarantee</span>
            </div>
          </div>

          {/* Links Columns */}
          <div style={styles.linksCol}>
            <h4 style={styles.linksHeader}>Discover</h4>
            <span style={styles.linkItem}>Top Restaurants</span>
            <span style={styles.linkItem}>Popular Cuisines</span>
            <span style={styles.linkItem}>Exclusive Deals</span>
            <span style={styles.linkItem}>Gourmet Dining</span>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.linksHeader}>Partner With Us</h4>
            <span style={styles.linkItem}>Add Your Restaurant</span>
            <span style={styles.linkItem}>Sign Up as Delivery Partner</span>
            <span style={styles.linkItem}>Enterprise Solutions</span>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.linksHeader}>Help & Legal</h4>
            <span style={styles.linkItem}>24/7 Support</span>
            <span style={styles.linkItem}>Live Order FAQs</span>
            <span style={styles.linkItem}>Privacy Policy</span>
            <span style={styles.linkItem}>Terms of Service</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div>© {new Date().getFullYear()} FeastHub Technologies Inc. All rights reserved.</div>
          <div style={styles.bottomStatus}>
            <span style={styles.pulseDot} /> All delivery systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#05080e',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '3.5rem 1.5rem 2rem 1.5rem',
    marginTop: '4rem',
    color: '#9ca3af',
    fontSize: '0.85rem'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem'
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2.5rem',
    alignItems: 'start'
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '340px'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem'
  },
  logoBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: '#ff5238',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255, 82, 56, 0.35)'
  },
  brandTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
  },
  brandTagline: {
    color: '#9ca3af',
    fontSize: '0.88rem',
    lineHeight: '1.5'
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#34d399',
    padding: '0.35rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.78rem',
    fontWeight: '600',
    width: 'fit-content'
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  linksHeader: {
    color: '#f3f4f6',
    fontSize: '0.95rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    marginBottom: '0.25rem'
  },
  linkItem: {
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'color 0.2s'
  },
  bottomBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  bottomStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#9ca3af'
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'inline-block',
    boxShadow: '0 0 8px #10b981'
  }
};
