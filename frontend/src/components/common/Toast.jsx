import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        ...styles.toastContainer,
        borderColor: isSuccess ? '#10b981' : isError ? '#ef4444' : '#3b82f6',
        backgroundColor: isSuccess
          ? 'rgba(6, 78, 59, 0.92)'
          : isError
          ? 'rgba(127, 29, 29, 0.92)'
          : 'rgba(30, 58, 138, 0.92)'
      }}
    >
      {isSuccess && <CheckCircle2 size={18} color="#34d399" />}
      {isError && <AlertCircle size={18} color="#f87171" />}
      {!isSuccess && !isError && <Info size={18} color="#60a5fa" />}
      <span style={styles.messageText}>{toast.message}</span>
    </div>
  );
};

const styles = {
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid',
    color: '#ffffff',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(12px)',
    zIndex: 9999,
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem',
    fontWeight: '600',
    animation: 'slideIn 0.3s ease-out'
  },
  messageText: {
    letterSpacing: '-0.01em'
  }
};
