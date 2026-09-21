import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  CheckCircle2,
  MapPin,
  LogOut,
  Save,
  KeyRound
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

export const ProfileModal = ({ isOpen, onClose }) => {
  const { customerSession, adminSession, deliverySession, updateProfile, logout, showToast } = useApp();

  const currentSession = customerSession || adminSession || deliverySession;
  const currentRole = customerSession ? 'customer' : adminSession ? 'admin' : 'delivery';

  const [fullName, setFullName] = useState(currentSession?.fullName || 'Dhiraj Sharma');
  const [phone, setPhone] = useState(currentSession?.phone || '+91 98765 43210');
  const [avatar, setAvatar] = useState(
    currentSession?.avatar || AVATAR_PRESETS[1]
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      if (currentSession) {
        setFullName(currentSession.fullName || 'Dhiraj Sharma');
        setPhone(currentSession.phone || '+91 98765 43210');
        setAvatar(currentSession.avatar || AVATAR_PRESETS[1]);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, currentSession]);

  if (!isOpen || !currentSession) return null;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      avatar,
      role: currentRole
    });
    showToast('Profile information updated successfully!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (currentPassword !== currentSession.password) {
      setPasswordError('Current password does not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    updateProfile({
      password: newPassword,
      role: currentRole
    });

    setPasswordSuccess('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('🔒 Security password updated successfully!', 'success');
  };

  return createPortal(
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn} title="Close">
          <X size={18} color="#9ca3af" />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          {/* Profile Photo Avatar with Edit Option */}
          <div style={styles.avatarWrap}>
            <img src={avatar} alt={fullName} style={styles.avatarImg} />
            <button
              type="button"
              onClick={() => setShowAvatarPicker((prev) => !prev)}
              style={styles.avatarEditBtn}
              title="Change Profile Photo"
            >
              <Camera size={14} color="#fff" />
            </button>
          </div>

          <h2 style={styles.nameTitle}>{fullName}</h2>
          <span className="badge badge-primary">{currentSession.email}</span>
        </div>

        {/* Avatar Presets Picker */}
        {showAvatarPicker && (
          <div style={styles.avatarPickerBox}>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
              CHOOSE A PROFILE AVATAR:
            </div>
            <div style={styles.avatarsRow}>
              {AVATAR_PRESETS.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Avatar ${idx}`}
                  onClick={() => {
                    setAvatar(src);
                    setShowAvatarPicker(false);
                  }}
                  style={{
                    ...styles.presetImg,
                    border: avatar === src ? '2px solid #ff5238' : '2px solid transparent'
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.45rem' }}>
              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                style={{ ...styles.input, fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customAvatarUrl.trim()) {
                    setAvatar(customAvatarUrl.trim());
                    setShowAvatarPicker(false);
                  }
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Personal Details Form */}
        <form onSubmit={handleUpdateProfile} style={styles.sectionCard}>
          <h3 style={styles.sectionHeader}>Personal Information</h3>

          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrap}>
                <User size={15} color="#9ca3af" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrap}>
                <Phone size={15} color="#9ca3af" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Email Address (Read-only)</label>
              <div style={styles.inputWrap}>
                <Mail size={15} color="#6b7280" />
                <input
                  type="email"
                  value={currentSession.email}
                  disabled
                  style={{ ...styles.input, color: '#9ca3af', cursor: 'not-allowed' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.85rem', alignSelf: 'flex-start' }}
          >
            <Save size={14} />
            <span>Save Profile Details</span>
          </button>
        </form>

        {/* Section 2: Change Password */}
        <form onSubmit={handleChangePassword} style={styles.sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
            <KeyRound size={16} color="#ff5238" />
            <h3 style={styles.sectionHeader}>Security & Password</h3>
          </div>

          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Current Password</label>
              <div style={styles.inputWrap}>
                <Lock size={15} color="#9ca3af" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                />
              </div>
            </div>

            <div>
              <label style={styles.label}>New Password</label>
              <div style={styles.inputWrap}>
                <Lock size={15} color="#9ca3af" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Confirm New Password</label>
              <div style={styles.inputWrap}>
                <Lock size={15} color="#9ca3af" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {passwordError && (
            <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              ⚠️ {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              ✓ {passwordSuccess}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.85rem', alignSelf: 'flex-start' }}
          >
            <span>Update Password</span>
          </button>
        </form>

        {/* Section 3: Logout Action */}
        <div style={styles.footerRow}>
          <button
            onClick={() => {
              onClose();
              logout(currentRole);
            }}
            style={styles.logoutBtn}
          >
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(5, 8, 14, 0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
    padding: '1.5rem',
    overflowY: 'auto'
  },
  modal: {
    backgroundColor: '#0f1624',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '24px',
    maxWidth: '540px',
    width: '100%',
    padding: '2rem 2.25rem',
    position: 'relative',
    maxHeight: '88vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9)',
    margin: 'auto'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 20
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.45rem',
    marginBottom: '1.5rem'
  },
  avatarWrap: {
    position: 'relative',
    width: '84px',
    height: '84px'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #ff5238',
    boxShadow: '0 0 20px rgba(255, 82, 56, 0.35)'
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff5238',
    border: '2px solid #0f1624',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  nameTitle: {
    fontSize: '1.45rem',
    fontWeight: '800',
    marginTop: '0.25rem'
  },
  avatarPickerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '0.85rem',
    marginBottom: '1.25rem'
  },
  avatarsRow: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  presetImg: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    transition: 'transform 0.15s'
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '1.25rem',
    marginBottom: '1.25rem',
    display: 'flex',
    flexDirection: 'column'
  },
  sectionHeader: {
    fontSize: '0.98rem',
    fontWeight: '700',
    marginBottom: '0.85rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.85rem'
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginBottom: '0.3rem',
    fontWeight: '600'
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.55rem 0.75rem'
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)'
  },
  footerRow: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '1.25rem',
    display: 'flex',
    justifyContent: 'center'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '0.65rem 1.25rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-heading)'
  }
};
