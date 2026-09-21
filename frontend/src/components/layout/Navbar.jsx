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
  KeyRound,
  Menu,
  X,
  Home,
  Info,
  PhoneCall
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = location.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const isDeliveryPath = pathname.startsWith('/delivery_partner');

  const activeUser = isAdminPath ? adminSession : isDeliveryPath ? deliverySession : customerSession;
  const displayName = activeUser?.fullName?.split(' ')[0] || (isAdminPath ? 'Admin' : isDeliveryPath ? 'Rider' : 'Guest');

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          {/* Brand Logo */}
          <Link
            to="/"
            style={styles.brand}
            onClick={() => {
              setProfileDropdownOpen(false);
              setMobileMenuOpen(false);
            }}
          >
            <div style={styles.logoBadge}>
              <Flame size={20} color="#ffffff" />
            </div>
            <div>
              <div style={styles.brandTitle}>
                Feast<span style={{ color: '#ff5238' }}>Hub</span>
              </div>
              <div style={styles.brandSub}>
                {isAdminPath
                  ? 'Admin Operations'
                  : isDeliveryPath
                  ? 'Rider GPS Fleet'
                  : 'Gourmet Delivery'}
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS (HOME, MY ORDERS, ABOUT US, CONTACT US) */}
          {!isAdminPath && !isDeliveryPath && (
            <div className="nav-desktop-only" style={styles.navLinks}>
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
            <div className="nav-desktop-only" style={styles.portalIndicator}>
              <ShieldCheck size={16} color="#8b5cf6" />
              <span>Admin Console (<code>/admin</code>)</span>
            </div>
          )}

          {/* DELIVERY NAV CENTER */}
          {isDeliveryPath && (
            <div className="nav-desktop-only" style={styles.portalIndicator}>
              <Bike size={16} color="#10b981" />
              <span>Delivery Partner GPS</span>
            </div>
          )}

          {/* RIGHT ACTIONS */}
          <div style={styles.rightSection}>
            {/* CUSTOMER PORTAL SPECIFIC ACTIONS */}
            {!isAdminPath && !isDeliveryPath && (
              <>
                {/* Desktop Location Pill */}
                <div className="nav-desktop-only" style={styles.locationPill}>
                  <MapPin size={14} color="#ff5238" />
                  <span style={{ color: '#d1d5db' }}>Indiranagar, Bengaluru</span>
                </div>

                {/* Cart Button */}
                <Link to="/cart" style={styles.cartBtn} className="cart-nav-btn">
                  <div style={styles.cartIconWrap}>
                    <ShoppingBag size={17} color="#ffffff" />
                    {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                  </div>
                  <div style={styles.cartTextWrap} className="nav-desktop-only">
                    <span style={styles.cartSub}>
                      {cartCount > 0 ? `${cartCount} items` : 'Cart'}
                    </span>
                    <span style={styles.cartPrice}>₹{cartSubtotal.toFixed(0)}</span>
                  </div>
                </Link>
              </>
            )}

            {/* DELIVERY PARTNER STATUS TOGGLE */}
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
                <span className="nav-desktop-only">Status:</span>
                <span>{deliveryPartner.status}</span>
              </button>
            )}

            {/* USER ACCOUNT / PROFILE BUTTON (DESKTOP) */}
            {activeUser ? (
              <div className="nav-desktop-only" style={{ position: 'relative' }}>
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
                className="nav-desktop-only"
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
                <span>Sign In</span>
              </button>
            )}

            {/* MOBILE HAMBURGER TOGGLE BUTTON */}
            <button
              className="nav-mobile-only"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              style={styles.mobileHamburgerBtn}
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {mobileMenuOpen && (
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="mobile-drawer-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Drawer Header */}
                <div style={styles.drawerHeader}>
                  <div style={styles.brand}>
                    <div style={styles.logoBadge}>
                      <Flame size={20} color="#ffffff" />
                    </div>
                    <div>
                      <div style={styles.brandTitle}>
                        Feast<span style={{ color: '#ff5238' }}>Hub</span>
                      </div>
                      <div style={styles.brandSub}>
                        {isAdminPath ? 'Admin Console' : isDeliveryPath ? 'Rider GPS' : 'Gourmet Delivery'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={styles.drawerCloseBtn}
                  >
                    <X size={18} color="#fff" />
                  </button>
                </div>

                {/* Delivery Location Banner */}
                {!isAdminPath && !isDeliveryPath && (
                  <div style={styles.drawerLocationBox}>
                    <MapPin size={16} color="#ff5238" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Delivering to:</div>
                      <strong style={{ fontSize: '0.85rem', color: '#f3f4f6' }}>
                        Indiranagar, Bengaluru
                      </strong>
                    </div>
                  </div>
                )}

                {/* User Info Bar if logged in */}
                {activeUser && (
                  <div style={styles.drawerUserBox}>
                    {activeUser?.avatar ? (
                      <img
                        src={activeUser.avatar}
                        alt={displayName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #ff5238' }}
                      />
                    ) : (
                      <div style={{ ...styles.navAvatarPlaceholder, width: '40px', height: '40px' }}>
                        <User size={18} color="#ff7a65" />
                      </div>
                    )}
                    <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                        {activeUser.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activeUser.email}
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <div style={styles.drawerNavLinks}>
                  <div
                    onClick={() => handleNavClick('/')}
                    style={{
                      ...styles.drawerNavLink,
                      ...(pathname === '/' || pathname === '/user' ? styles.drawerNavLinkActive : {})
                    }}
                  >
                    <Home size={18} color={pathname === '/' ? '#ff5238' : '#9ca3af'} />
                    <span>Home</span>
                  </div>

                  <div
                    onClick={() => handleNavClick('/my-orders')}
                    style={{
                      ...styles.drawerNavLink,
                      ...(pathname === '/my-orders' ? styles.drawerNavLinkActive : {})
                    }}
                  >
                    <Package size={18} color={pathname === '/my-orders' ? '#ff5238' : '#9ca3af'} />
                    <span>My Orders</span>
                  </div>

                  <div
                    onClick={() => handleNavClick('/about')}
                    style={{
                      ...styles.drawerNavLink,
                      ...(pathname === '/about' ? styles.drawerNavLinkActive : {})
                    }}
                  >
                    <Info size={18} color={pathname === '/about' ? '#ff5238' : '#9ca3af'} />
                    <span>About FeastHub</span>
                  </div>

                  <div
                    onClick={() => handleNavClick('/contact')}
                    style={{
                      ...styles.drawerNavLink,
                      ...(pathname === '/contact' ? styles.drawerNavLinkActive : {})
                    }}
                  >
                    <PhoneCall size={18} color={pathname === '/contact' ? '#ff5238' : '#9ca3af'} />
                    <span>Contact Support</span>
                  </div>

                  {activeUser && (
                    <div
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      style={styles.drawerNavLink}
                    >
                      <User size={18} color="#ff5238" />
                      <span>Edit My Profile</span>
                    </div>
                  )}
                </div>

                {/* Portal Switcher for Quick Access */}
                <div style={styles.drawerPortalsSection}>
                  <div style={styles.drawerSectionTitle}>PORTALS & PLATFORMS</div>
                  <div
                    onClick={() => handleNavClick('/admin')}
                    style={{
                      ...styles.drawerPortalCard,
                      borderColor: isAdminPath ? '#8b5cf6' : 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <ShieldCheck size={18} color="#8b5cf6" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Admin Portal</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Kitchen & Order Flow</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleNavClick('/delivery_partner')}
                    style={{
                      ...styles.drawerPortalCard,
                      borderColor: isDeliveryPath ? '#10b981' : 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <Bike size={18} color="#10b981" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Delivery Fleet</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Rider Map & OTP Verify</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={styles.drawerFooter}>
                {activeUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout(isAdminPath ? 'admin' : isDeliveryPath ? 'delivery' : 'customer');
                      navigate('/user');
                    }}
                    style={styles.drawerLogoutBtn}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleNavClick('/user');
                    }}
                    style={styles.drawerSignInBtn}
                  >
                    <User size={16} />
                    <span>Sign In / Create Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Profile Modal */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on screens < 768px for customer flows) */}
      {!isAdminPath && !isDeliveryPath && (
        <div className="mobile-bottom-nav">
          <div className="mobile-bottom-nav-inner">
            <Link
              to="/"
              className={`mobile-bottom-tab ${pathname === '/' || pathname === '/user' ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              to="/my-orders"
              className={`mobile-bottom-tab ${pathname === '/my-orders' ? 'active' : ''}`}
            >
              <Package size={20} />
              <span>Orders</span>
            </Link>

            <Link
              to="/cart"
              className={`mobile-bottom-tab ${pathname === '/cart' ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="mobile-tab-badge">{cartCount}</span>}
              </div>
              <span>Cart</span>
            </Link>

            <button
              onClick={() => {
                if (customerSession) {
                  setIsProfileModalOpen(true);
                } else {
                  navigate('/user');
                }
              }}
              className={`mobile-bottom-tab ${isProfileModalOpen ? 'active' : ''}`}
            >
              <User size={20} />
              <span>{customerSession ? 'Profile' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </>
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
  },
  mobileHamburgerBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  drawerCloseBtn: {
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
  drawerLocationBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '0.65rem 0.85rem',
    marginTop: '1rem',
    marginBottom: '0.5rem'
  },
  drawerUserBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(255, 82, 56, 0.08)',
    border: '1px solid rgba(255, 82, 56, 0.2)',
    borderRadius: '14px',
    padding: '0.75rem 0.85rem',
    marginTop: '0.75rem',
    marginBottom: '1rem'
  },
  drawerNavLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginTop: '1rem'
  },
  drawerNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 0.85rem',
    borderRadius: '12px',
    color: '#d1d5db',
    fontSize: '0.92rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s ease'
  },
  drawerNavLinkActive: {
    backgroundColor: 'rgba(255, 82, 56, 0.12)',
    color: '#ff5238'
  },
  drawerPortalsSection: {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  drawerSectionTitle: {
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '0.06em',
    color: '#6b7280',
    marginBottom: '0.65rem'
  },
  drawerPortalCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '0.65rem 0.85rem',
    marginBottom: '0.65rem',
    cursor: 'pointer'
  },
  drawerFooter: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  drawerLogoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '0.75rem',
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  drawerSignInBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #ff5238 0%, #ff3b1f 100%)',
    border: 'none',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 82, 56, 0.4)'
  }
};
