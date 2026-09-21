import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Store,
  Bike,
  Clock,
  Star,
  Eye,
  EyeOff,
  Zap,
  MapPin,
  Utensils
} from 'lucide-react';

export const CustomerLandingView = () => {
  const navigate = useNavigate();
  const { login, register, resetPassword, restaurants, categories, showToast } = useApp();

  // Auth Mode: 'signin' | 'signup' | 'forgot'
  const [authTab, setAuthTab] = useState('signin');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1-Click Quick Demo Login (Connecting to Spring Boot MySQL backend)
  const handleQuickDemoLogin = async () => {
    setIsSubmitting(true);
    const res = await login('customer@feasthub.com', 'customer123', 'customer');
    setIsSubmitting(false);
    if (res && res.success) {
      navigate('/user');
    }
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      showToast('Please fill in both email and password', 'error');
      return;
    }
    setIsSubmitting(true);
    const res = await login(signInEmail.trim(), signInPassword, 'customer');
    setIsSubmitting(false);
    if (res && res.success) {
      navigate('/user');
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, password, confirmPassword } = signUpData;

    if (!fullName || !email || !phone || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await register(
      {
        fullName,
        email: email.trim(),
        phone,
        password
      },
      'customer'
    );
    setIsSubmitting(false);
    if (res && res.success) {
      navigate('/user');
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered email address', 'error');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = resetPassword(forgotEmail, newPassword);
      setIsSubmitting(false);
      if (res.success) {
        navigate('/user');
      }
    }, 400);
  };

  return (
    <div style={styles.page}>
      {/* HERO & AUTH SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroGlow1} />
        <div style={styles.heroGlow2} />

        <div style={styles.container}>
          <div style={styles.heroGrid}>
            {/* Left Content */}
            <div style={styles.heroLeft}>
              <div style={styles.badge}>
                <Flame size={16} color="#ff5238" />
                <span>India's Premier Culinary Cloud & Dining Platform</span>
              </div>

              <h1 style={styles.heroTitle}>
                Taste the Extraordinary, <br />
                <span style={styles.gradientText}>Delivered Fresh & Fast</span>
              </h1>

              <p style={styles.heroSubtitle}>
                Discover top-rated gourmet restaurants, artisan cloud kitchens, AI-calculated
                nutritional insights, and contactless OTP delivery in under 30 minutes.
              </p>

              {/* Highlights pills */}
              <div style={styles.featureHighlights}>
                <div style={styles.highlightItem}>
                  <div style={{ ...styles.iconCircle, background: 'rgba(255, 82, 56, 0.15)' }}>
                    <Zap size={18} color="#ff5238" />
                  </div>
                  <div>
                    <h4 style={styles.highlightTitle}>30-Min Fast Track</h4>
                    <p style={styles.highlightDesc}>Hot and fresh doorstep arrival</p>
                  </div>
                </div>

                <div style={styles.highlightItem}>
                  <div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.15)' }}>
                    <ShieldCheck size={18} color="#10b981" />
                  </div>
                  <div>
                    <h4 style={styles.highlightTitle}>4-Digit Secure OTP</h4>
                    <p style={styles.highlightDesc}>Guaranteed verified handoff</p>
                  </div>
                </div>

                <div style={styles.highlightItem}>
                  <div style={{ ...styles.iconCircle, background: 'rgba(139, 92, 246, 0.15)' }}>
                    <Sparkles size={18} color="#8b5cf6" />
                  </div>
                  <div>
                    <h4 style={styles.highlightTitle}>AI Calorie Insights</h4>
                    <p style={styles.highlightDesc}>Complete macros breakdown</p>
                  </div>
                </div>
              </div>

              {/* Trust stats */}
              <div style={styles.trustStats}>
                <div>
                  <div style={styles.statNum}>50,000+</div>
                  <div style={styles.statLabel}>Meals Delivered</div>
                </div>
                <div style={styles.statDivider} />
                <div>
                  <div style={styles.statNum}>4.9 ★</div>
                  <div style={styles.statLabel}>Average Rating</div>
                </div>
                <div style={styles.statDivider} />
                <div>
                  <div style={styles.statNum}>120+</div>
                  <div style={styles.statLabel}>Gourmet Outlets</div>
                </div>
              </div>
            </div>

            {/* Right Auth Box */}
            <div id="landing-auth-section" style={styles.heroRight}>
              <div style={styles.authCard}>
                {/* 3 Interactive Tabs */}
                <div style={styles.tabHeader}>
                  <button
                    type="button"
                    onClick={() => setAuthTab('signin')}
                    style={{
                      ...styles.tabBtn,
                      ...(authTab === 'signin' ? styles.activeTabBtn : {})
                    }}
                  >
                    <User size={15} />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthTab('signup')}
                    style={{
                      ...styles.tabBtn,
                      ...(authTab === 'signup' ? styles.activeTabBtn : {})
                    }}
                  >
                    <Sparkles size={15} />
                    <span>Create Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthTab('forgot')}
                    style={{
                      ...styles.tabBtn,
                      ...(authTab === 'forgot' ? styles.activeTabBtn : {})
                    }}
                  >
                    <KeyRound size={15} />
                    <span>Forgot Password</span>
                  </button>
                </div>

                <div style={styles.tabContent}>
                  {/* TAB 1: SIGN IN */}
                  {authTab === 'signin' && (
                    <form onSubmit={handleSignInSubmit} style={styles.form}>
                      <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Welcome Back</h2>
                        <p style={styles.formSubtitle}>
                          Sign in to access your saved addresses, cart, and live orders.
                        </p>
                      </div>

                      {/* Quick 1-Click Demo Login Button */}
                      <button
                        type="button"
                        onClick={handleQuickDemoLogin}
                        style={styles.quickDemoBtn}
                      >
                        <Zap size={16} color="#fbbf24" fill="#fbbf24" />
                        <span>⚡ 1-Click Demo Login (customer@feasthub.com)</span>
                      </button>

                      <div style={styles.orDivider}>
                        <span>or login with credentials</span>
                      </div>

                      {/* Email Field */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Email Address</label>
                        <div style={styles.inputWrapper}>
                          <Mail size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type="email"
                            required
                            placeholder="customer@feasthub.com"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div style={styles.inputGroup}>
                        <div style={styles.labelRow}>
                          <label style={styles.inputLabel}>Password</label>
                          <button
                            type="button"
                            onClick={() => setAuthTab('forgot')}
                            style={styles.forgotLink}
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div style={styles.inputWrapper}>
                          <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type={showSignInPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter your password"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            style={styles.textInput}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignInPassword((prev) => !prev)}
                            style={styles.eyeBtn}
                          >
                            {showSignInPassword ? (
                              <EyeOff size={16} color="#9ca3af" />
                            ) : (
                              <Eye size={16} color="#9ca3af" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={styles.submitBtn}
                      >
                        <span>{isSubmitting ? 'Verifying...' : 'Sign In & Explore Food'}</span>
                        <ArrowRight size={17} />
                      </button>

                      {/* Switch to Signup */}
                      <p style={styles.switchPrompt}>
                        Don't have an account yet?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthTab('signup')}
                          style={styles.inlineSwitchBtn}
                        >
                          Create an Account
                        </button>
                      </p>
                    </form>
                  )}

                  {/* TAB 2: CREATE ACCOUNT (SIGN UP) */}
                  {authTab === 'signup' && (
                    <form onSubmit={handleSignUpSubmit} style={styles.form}>
                      <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Create an Account</h2>
                        <p style={styles.formSubtitle}>
                          Register in 30 seconds and start enjoying fine dining delivered.
                        </p>
                      </div>

                      {/* Full Name */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Full Name</label>
                        <div style={styles.inputWrapper}>
                          <User size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dhiraj Sharma"
                            value={signUpData.fullName}
                            onChange={(e) =>
                              setSignUpData({ ...signUpData, fullName: e.target.value })
                            }
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Email Address</label>
                        <div style={styles.inputWrapper}>
                          <Mail size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type="email"
                            required
                            placeholder="e.g. dhiraj@example.com"
                            value={signUpData.email}
                            onChange={(e) =>
                              setSignUpData({ ...signUpData, email: e.target.value })
                            }
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Phone Number</label>
                        <div style={styles.inputWrapper}>
                          <Phone size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={signUpData.phone}
                            onChange={(e) =>
                              setSignUpData({ ...signUpData, phone: e.target.value })
                            }
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Password (Min 6 chars)</label>
                        <div style={styles.inputWrapper}>
                          <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type={showSignUpPassword ? 'text' : 'password'}
                            required
                            placeholder="Create a strong password"
                            value={signUpData.password}
                            onChange={(e) =>
                              setSignUpData({ ...signUpData, password: e.target.value })
                            }
                            style={styles.textInput}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignUpPassword((prev) => !prev)}
                            style={styles.eyeBtn}
                          >
                            {showSignUpPassword ? (
                              <EyeOff size={16} color="#9ca3af" />
                            ) : (
                              <Eye size={16} color="#9ca3af" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Confirm Password</label>
                        <div style={styles.inputWrapper}>
                          <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type={showSignUpPassword ? 'text' : 'password'}
                            required
                            placeholder="Re-enter password"
                            value={signUpData.confirmPassword}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                confirmPassword: e.target.value
                              })
                            }
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={styles.submitBtn}
                      >
                        <span>{isSubmitting ? 'Creating...' : 'Register & Start Ordering'}</span>
                        <ArrowRight size={17} />
                      </button>

                      {/* Switch to Signin */}
                      <p style={styles.switchPrompt}>
                        Already registered?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthTab('signin')}
                          style={styles.inlineSwitchBtn}
                        >
                          Sign In Here
                        </button>
                      </p>
                    </form>
                  )}

                  {/* TAB 3: FORGOT PASSWORD */}
                  {authTab === 'forgot' && (
                    <form onSubmit={handleForgotPasswordSubmit} style={styles.form}>
                      <div style={styles.formHeader}>
                        <div style={styles.forgotHeaderIcon}>
                          <KeyRound size={22} color="#ff5238" />
                        </div>
                        <h2 style={styles.formTitle}>Reset Your Password</h2>
                        <p style={styles.formSubtitle}>
                          Enter your account email and choose your new password. You will be logged in immediately.
                        </p>
                      </div>

                      {/* Email */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Registered Email Address</label>
                        <div style={styles.inputWrapper}>
                          <Mail size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type="email"
                            required
                            placeholder="e.g. dhiraj@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* New Password */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>New Password (Min 6 chars)</label>
                        <div style={styles.inputWrapper}>
                          <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type={showForgotNewPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.textInput}
                          />
                          <button
                            type="button"
                            onClick={() => setShowForgotNewPassword((prev) => !prev)}
                            style={styles.eyeBtn}
                          >
                            {showForgotNewPassword ? (
                              <EyeOff size={16} color="#9ca3af" />
                            ) : (
                              <Eye size={16} color="#9ca3af" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Confirm New Password</label>
                        <div style={styles.inputWrapper}>
                          <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
                          <input
                            type={showForgotNewPassword ? 'text' : 'password'}
                            required
                            placeholder="Re-enter new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            style={styles.textInput}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={styles.submitBtn}
                      >
                        <span>{isSubmitting ? 'Updating...' : 'Update Password & Sign In'}</span>
                        <ArrowRight size={17} />
                      </button>

                      {/* Switch to Signin */}
                      <p style={styles.switchPrompt}>
                        Remember your credentials?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthTab('signin')}
                          style={styles.inlineSwitchBtn}
                        >
                          Back to Sign In
                        </button>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED RESTAURANTS PREVIEW SECTION */}
      <section style={styles.previewSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionBadge}>
                <Utensils size={14} color="#ff5238" />
                <span>Culinary Showcase</span>
              </div>
              <h2 style={styles.sectionTitle}>Top Outlets Available on FeastHub</h2>
              <p style={styles.sectionSubtitle}>
                Sign in to view full detailed menus, AI nutritional macros, and place orders.
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('landing-auth-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={styles.exploreBtn}
            >
              <span>Get Started Now</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={styles.restaurantGrid}>
            {restaurants.slice(0, 4).map((restaurant) => (
              <div key={restaurant.id} style={styles.restaurantCard}>
                <div style={styles.imageWrap}>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    style={styles.restaurantImg}
                  />
                  <div style={styles.categoryBadge}>{restaurant.category}</div>
                  <div style={styles.ratingBadge}>
                    <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    <span>{restaurant.rating}</span>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                  <p style={styles.restaurantCuisine}>
                    {restaurant.cuisines?.join(' • ') || 'Gourmet specialties'}
                  </p>

                  <div style={styles.cardFooter}>
                    <div style={styles.cardMeta}>
                      <Clock size={13} color="#9ca3af" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div style={styles.cardMeta}>
                      <MapPin size={13} color="#9ca3af" />
                      <span>{restaurant.distance || '2.1 km'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const el = document.getElementById('landing-auth-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={styles.cardActionBtn}
                  >
                    <span>Sign In to Order</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US FOOTER STRIP */}
      <section style={styles.featuresStrip}>
        <div style={styles.container}>
          <div style={styles.featuresRow}>
            <div style={styles.featureCol}>
              <div style={styles.featureColIcon}>
                <Bike size={22} color="#ff5238" />
              </div>
              <h4 style={styles.featureColTitle}>Swift Doorstep Drop</h4>
              <p style={styles.featureColDesc}>
                Real-time tracking of your delivery partner with pinpoint map accuracy.
              </p>
            </div>

            <div style={styles.featureCol}>
              <div style={styles.featureColIcon}>
                <ShieldCheck size={22} color="#10b981" />
              </div>
              <h4 style={styles.featureColTitle}>4-Digit OTP Handoff</h4>
              <p style={styles.featureColDesc}>
                Orders are only marked delivered when you hand over your secret 4-digit code.
              </p>
            </div>

            <div style={styles.featureCol}>
              <div style={styles.featureColIcon}>
                <Sparkles size={22} color="#8b5cf6" />
              </div>
              <h4 style={styles.featureColTitle}>AI Nutrition Profiles</h4>
              <p style={styles.featureColDesc}>
                Know your calories, protein, carbs, and fats before every single bite.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#0a0d14',
    color: '#f3f4f6',
    minHeight: '100vh',
    overflowX: 'hidden'
  },
  heroSection: {
    position: 'relative',
    padding: 'clamp(2rem, 5vw, 4rem) 1.25rem clamp(2.5rem, 6vw, 5rem) 1.25rem',
    background: 'radial-gradient(circle at 50% 20%, #171d2b 0%, #0a0d14 70%)',
    overflow: 'hidden'
  },
  heroGlow1: {
    position: 'absolute',
    top: '-10%',
    left: '10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,82,56,0.12) 0%, transparent 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none'
  },
  heroGlow2: {
    position: 'absolute',
    bottom: '0%',
    right: '5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
    filter: 'blur(70px)',
    pointerEvents: 'none'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    gap: '2.5rem',
    alignItems: 'center'
  },
  heroLeft: {
    zIndex: 2
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.9rem',
    backgroundColor: 'rgba(255, 82, 56, 0.12)',
    border: '1px solid rgba(255, 82, 56, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#ff7a65',
    marginBottom: '1.25rem'
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5.5vw, 3rem)',
    lineHeight: '1.15',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    marginBottom: '1.25rem',
    color: '#ffffff'
  },
  gradientText: {
    background: 'linear-gradient(135deg, #ff5238 0%, #ff8a75 50%, #ffa34d 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    lineHeight: '1.6',
    color: '#9ca3af',
    marginBottom: '2rem',
    maxWidth: '520px'
  },
  featureHighlights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px'
  },
  iconCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  highlightTitle: {
    fontSize: '0.92rem',
    fontWeight: '600',
    color: '#f3f4f6',
    margin: 0
  },
  highlightDesc: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    margin: 0
  },
  trustStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  statNum: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.15rem'
  },
  statDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  heroRight: {
    zIndex: 2
  },
  authCard: {
    backgroundColor: 'rgba(21, 26, 38, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 82, 56, 0.1)'
  },
  tabHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 19, 29, 0.6)'
  },
  tabBtn: {
    padding: '0.9rem 0.35rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#9ca3af',
    fontSize: '0.78rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeTabBtn: {
    color: '#ff5238',
    backgroundColor: 'rgba(255, 82, 56, 0.08)',
    borderBottomColor: '#ff5238'
  },
  tabContent: {
    padding: 'clamp(1.25rem, 3.5vw, 2rem)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem'
  },
  formHeader: {
    marginBottom: '0.35rem'
  },
  formTitle: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  formSubtitle: {
    fontSize: '0.86rem',
    color: '#9ca3af',
    marginTop: '0.35rem',
    lineHeight: '1.4'
  },
  forgotHeaderIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.85rem'
  },
  quickDemoBtn: {
    width: '100%',
    padding: '0.85rem 1rem',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: '12px',
    color: '#fef08a',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  orDivider: {
    textAlign: 'center',
    position: 'relative',
    margin: '0.25rem 0',
    fontSize: '0.78rem',
    color: '#6b7280'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputLabel: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#d1d5db'
  },
  forgotLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff7a65',
    fontSize: '0.8rem',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    pointerEvents: 'none'
  },
  textInput: {
    width: '100%',
    padding: '0.85rem 2.8rem 0.85rem 2.8rem',
    backgroundColor: 'rgba(15, 19, 29, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.85rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem'
  },
  submitBtn: {
    width: '100%',
    padding: '0.95rem 1.25rem',
    background: 'linear-gradient(135deg, #ff5238 0%, #ff381e 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 8px 20px -4px rgba(255, 82, 56, 0.5)',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem'
  },
  switchPrompt: {
    textAlign: 'center',
    fontSize: '0.84rem',
    color: '#9ca3af',
    margin: '0.25rem 0 0 0'
  },
  inlineSwitchBtn: {
    background: 'none',
    border: 'none',
    color: '#ff5238',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline'
  },
  previewSection: {
    padding: '5rem 1.5rem',
    backgroundColor: '#0d111a',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#ff7a65',
    fontSize: '0.82rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  sectionTitle: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#9ca3af',
    marginTop: '0.35rem'
  },
  exploreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(255, 82, 56, 0.12)',
    border: '1px solid rgba(255, 82, 56, 0.3)',
    borderRadius: '12px',
    color: '#ff7a65',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  restaurantCard: {
    backgroundColor: 'rgba(21, 26, 38, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '18px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, border-color 0.2s ease'
  },
  imageWrap: {
    position: 'relative',
    height: '170px',
    overflow: 'hidden'
  },
  restaurantImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(15, 19, 29, 0.85)',
    backdropFilter: 'blur(8px)',
    padding: '0.25rem 0.65rem',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: '600',
    color: '#e5e7eb'
  },
  ratingBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(15, 19, 29, 0.9)',
    backdropFilter: 'blur(8px)',
    padding: '0.25rem 0.55rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  cardBody: {
    padding: '1.25rem'
  },
  restaurantName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.35rem 0'
  },
  restaurantCuisine: {
    fontSize: '0.82rem',
    color: '#9ca3af',
    margin: '0 0 1rem 0'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '1rem'
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.78rem',
    color: '#9ca3af'
  },
  cardActionBtn: {
    width: '100%',
    padding: '0.65rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '0.82rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    cursor: 'pointer'
  },
  featuresStrip: {
    padding: '4rem 1.5rem',
    backgroundColor: '#0a0d14',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  featuresRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem'
  },
  featureCol: {
    padding: '1.5rem',
    backgroundColor: 'rgba(21, 26, 38, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px'
  },
  featureColIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  featureColTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.4rem 0'
  },
  featureColDesc: {
    fontSize: '0.86rem',
    color: '#9ca3af',
    lineHeight: '1.5',
    margin: 0
  }
};
