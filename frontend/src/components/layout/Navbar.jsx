import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { ProfileModal } from '../profile/ProfileModal';
import {
  Flame,
  ShoppingBag,
  MapPin,
  Clock,
  User,
  Power,
  ShieldCheck,
  Bike,
  LogOut,
  ChevronDown,
  Layers,
  Package,
  KeyRound
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, cartSubtotal } = useCart();
  const {
    customerSession,
    adminSession,
    deliverySession,
    deliveryPartner,
    toggleDeliveryStatus,
    logout,
    setAuthModal
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const pathname = location.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const isDeliveryPath = pathname.startsWith('/delivery_partner');

  const activeUser = isAdminPath ? adminSession : isDeliveryPath ? deliverySession : customerSession;
  const displayName = activeUser?.fullName?.split(' ')[0] || (isAdminPath ? 'Admin' : isDeliveryPath ? 'Rider' : 'Guest');

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Brand Logo */}
        <Link to="/" style={styles.brand} onClick={() => setProfileDropdownOpen(false)}>
          <div style={styles.logoBadge}>
            <Flame size={22} color="#ffffff" />
          </div>
          <div>
            <div style={styles.brandTitle}>
              Feast<span style={{ color: '#ff5238' }}>Hub</span>
            </div>
            <div style={styles.brandSub}>
              {isAdminPath
                ? 'Admin Operations Console'
                : isDeliveryPath
                ? 'Delivery Partner Fleet'
                : 'Gourmet Delivery'}
            </div>
          </div>
        </Link>

        {/* CENTER NAVIGATION LINKS (HOME, MY ORDERS, ABOUT US, CONTACT US) */}
        {!isAdminPath && !isDeliveryPath && (
          <div style={styles.navLinks}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                ...(pathname === '/' || pathname === '/user' ? styles.activeNavLink : {})
              }}
            >
              Home
            </Link>
            <Link
              to="/my-orders"
              style={{
                ...styles.navLink,
                ...(pathname === '/my-orders' ? styles.activeNavLink : {})
              }}
            >
              My Orders
            </Link>
            <Link
              to="/about"
              style={{
                ...styles.navLink,
                ...(pathname === '/about' ? styles.activeNavLink : {})
              }}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              style={{
                ...styles.navLink,
                ...(pathname === '/contact' ? styles.activeNavLink : {})
              }}
            >
              Contact Us
            </Link>
          </div>
        )}

        {/* ADMIN NAV CENTER */}
        {isAdminPath && (
          <div style={styles.portalIndicator}>
            <ShieldCheck size={16} color="#8b5cf6" />
            <span>Admin Control Panel (URL: <code>/admin</code>)</span>
          </div>
        )}

        {/* DELIVERY NAV CENTER */}
        {isDeliveryPath && (
          <div style={styles.portalIndicator}>
            <Bike size={16} color="#10b981" />
            <span>Delivery Partner GPS (URL: <code>/delivery_partner</code>)</span>
          </div>
        )}

        {/* RIGHT ACTIONS */}
        <div style={styles.rightSection}>
          {/* CUSTOMER PORTAL SPECIFIC ACTIONS */}
          {!isAdminPath && !isDeliveryPath && (
            <>
              {/* Delivery Location */}
              <div style={styles.locationPill}>
                <MapPin size={15} color="#ff5238" />
                <span style={{ color: '#d1d5db' }}>Indiranagar, Bengaluru</span>
              </div>

              {/* Cart Button */}
              <Link to="/cart" style={styles.cartBtn} className="cart-nav-btn">
                <div style={styles.cartIconWrap}>
                  <ShoppingBag size={18} color="#ffffff" />
                  {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                </div>
                <div style={styles.cartTextWrap}>
                  <span style={styles.cartSub}>
                    {cartCount > 0 ? `${cartCount} items` : 'Cart'}
                  </span>
                  <span style={styles.cartPrice}>₹{cartSubtotal.toFixed(0)}</span>
                </div>
              </Link>
            </>
          )}

          {/* DELIVERY PARTNER ACTIONS */}
          {isDeliveryPath && (
            <button
              onClick={toggleDeliveryStatus}
              style={{
                ...styles.riderStatusBtn,
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
              <Power size={14} />
              <span>Status: {deliveryPartner.status}</span>
            </button>
          )}

          {/* USER ACCOUNT & PROFILE MENU */}
          {activeUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                style={styles.profileBtn}
              >
                {activeUser?.avatar ? (
                  <img
                    src={activeUser.avatar}
                    alt={displayName}
                    style={styles.navAvatarThumb}
                  />
                ) : (
                  <div style={styles.navAvatarPlaceholder}>
                    <User size={15} color="#ff7a65" />
                  </div>
                )}
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#f3f4f6' }}>
                  {displayName}
                </span>
                <ChevronDown size={14} color="#9ca3af" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div style={styles.dropdownMenu}>
                  {/* User Info Header */}
                  <div style={styles.dropdownHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {activeUser?.avatar ? (
                        <img
                          src={activeUser.avatar}
                          alt="Avatar"
                          style={styles.dropdownAvatarImg}
                        />
                      ) : (
                        <div style={styles.dropdownAvatarPlaceholder}>
                          <User size={18} color="#ff7a65" />
                        </div>
                      )}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={styles.dropdownUserName}>
                          {activeUser.fullName}
                        </div>
                        <div style={styles.dropdownUserEmail}>
                          {activeUser.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.dropdownDivider} />

                  {/* Profile Actions */}
                  <div style={{ padding: '0.4rem 0.5rem' }}>
                    <div
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      style={styles.dropdownItem}
                    >
                      <div style={styles.dropdownItemIconWrap}>
                        <User size={16} color="#ff5238" />
                      </div>
                      <div>
                        <div style={styles.dropdownItemTitle}>My Profile</div>
                        <div style={styles.dropdownItemDesc}>Name, email, avatar & password</div>
                      </div>
                    </div>

                    {!isAdminPath && !isDeliveryPath && (
                      <div
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/my-orders');
                        }}
                        style={styles.dropdownItem}
                      >
                        <div style={styles.dropdownItemIconWrap}>
                          <Package size={16} color="#10b981" />
                        </div>
                        <div>
                          <div style={styles.dropdownItemTitle}>My Orders</div>
                          <div style={styles.dropdownItemDesc}>Live delivery tracking & history</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.dropdownDivider} />

                  {/* Logout Button */}
                  <div style={{ padding: '0.4rem 0.5rem' }}>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout(isAdminPath ? 'admin' : isDeliveryPath ? 'delivery' : 'customer');
                        navigate('/user');
                      }}
                      style={styles.dropdownLogoutBtn}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigate('/user');
                setTimeout(() => {
                  const el = document.getElementById('landing-auth-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              style={styles.signInNavBtn}
            >
              <User size={15} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'rgba(11, 15, 25, 0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 900,
    padding: '0.75rem 1.5rem'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    userSelect: 'none',
    textDecoration: 'none',
    color: '#fff'
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ff5238 0%, #e63920 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(255, 82, 56, 0.4)'
  },
  brandTitle: {
    fontSize: '1.4rem',
    fontWeight: '900',
    letterSpacing: '-0.03em',
    fontFamily: 'var(--font-heading)'
  },
  brandSub: {
    fontSize: '0.72rem',
    color: '#9ca3af',
    fontWeight: '500'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  navLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.92rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    transition: 'color 0.2s',
    padding: '0.35rem 0.65rem',
    borderRadius: '8px'
  },
  activeNavLink: {
    color: '#ff5238',
    backgroundColor: 'rgba(255, 82, 56, 0.1)'
  },
  portalIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '9999px',
    padding: '0.35rem 0.85rem',
    fontSize: '0.82rem',
    color: '#d1d5db'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    flexWrap: 'wrap'
  },
  locationPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.45rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.82rem'
  },
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, #ff5238 0%, #ff6b4a 100%)',
    color: '#fff',
    textDecoration: 'none',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    borderRadius: '9999px',
    padding: '0.45rem 1.15rem',
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(255, 82, 56, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  cartIconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  cartBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-7px',
    backgroundColor: '#ffffff',
    color: '#ff5238',
    borderRadius: '9999px',
    padding: '0.08rem 0.4rem',
    fontSize: '0.68rem',
    fontWeight: '900',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)'
  },
  cartTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: '1.15'
  },
  cartSub: {
    fontSize: '0.68rem',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    fontWeight: '700',
    opacity: 0.92
  },
  cartPrice: {
    fontSize: '0.98rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '-0.01em'
  },
  riderStatusBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.45rem 0.85rem',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.35rem 0.85rem 0.35rem 0.45rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  navAvatarThumb: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid #ff5238'
  },
  navAvatarPlaceholder: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid rgba(255, 82, 56, 0.4)'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    backgroundColor: '#0f1624',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '18px',
    width: '280px',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.75)',
    zIndex: 999,
    overflow: 'hidden',
    animation: 'fadeIn 0.15s ease-out'
  },
  dropdownHeader: {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  dropdownAvatarImg: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ff5238',
    flexShrink: 0
  },
  dropdownAvatarPlaceholder: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 82, 56, 0.4)',
    flexShrink: 0
  },
  dropdownUserName: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#fff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  dropdownUserEmail: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: '2px'
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    marginBottom: '2px'
  },
  dropdownItemIconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  dropdownItemTitle: {
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#f3f4f6'
  },
  dropdownItemDesc: {
    fontSize: '0.72rem',
    color: '#9ca3af',
    marginTop: '1px'
  },
  dropdownLogoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#f87171',
    padding: '0.6rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.84rem',
    fontWeight: '700',
    justifyContent: 'center',
    transition: 'all 0.15s ease'
  },
  signInNavBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.55rem 1.1rem',
    background: 'linear-gradient(135deg, #ff5238 0%, #ff381e 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 82, 56, 0.4)',
    transition: 'all 0.2s ease'
  }
};
