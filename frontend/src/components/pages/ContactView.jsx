import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  HelpCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const ContactView = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitted(true);
    showToast('📨 Your message has been sent to FeastHub Support!', 'success');
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div className="badge badge-primary">
          <MessageSquare size={14} /> 24/7 Customer Care
        </div>
        <h1 style={styles.title}>We'd Love to Hear From You</h1>
        <p style={styles.subtitle}>
          Have a question about an order, restaurant partnership, or technical feedback? Our dedicated support team is available around the clock.
        </p>
      </div>

      <div style={styles.contentGrid}>
        {/* Left: Contact Form */}
        <div className="glass-card" style={styles.formCard}>
          <h3 style={styles.formTitle}>Send Us a Message</h3>

          {submitted ? (
            <div style={styles.submittedBox}>
              <CheckCircle2 size={36} color="#10b981" />
              <h4 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Thank You for Reaching Out!</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                A FeastHub support specialist will review your inquiry and respond within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div>
                  <label style={styles.label}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    placeholder="e.g. Dhiraj Sharma"
                  />
                </div>
                <div>
                  <label style={styles.label}>Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={styles.input}
                  placeholder="Order Inquiry, Delivery Feedback, or Business Query"
                />
              </div>

              <div>
                <label style={styles.label}>Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={styles.textarea}
                  placeholder="Describe your question or feedback..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                <Send size={16} />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Contact Information & FAQs */}
        <div style={styles.rightCol}>
          {/* Info Card */}
          <div className="glass-card" style={styles.infoCard}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Direct Channels</h3>

            <div style={styles.infoItems}>
              <div style={styles.infoItem}>
                <div style={styles.infoIconBox}>
                  <Phone size={18} color="#ff5238" />
                </div>
                <div>
                  <div style={styles.infoLabel}>Toll-Free Support Hotline</div>
                  <strong style={{ color: '#fff' }}>1800-FEAST-HUB (1800-332-7848)</strong>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>24 Hours • 7 Days a Week</div>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIconBox}>
                  <Mail size={18} color="#3b82f6" />
                </div>
                <div>
                  <div style={styles.infoLabel}>General Support Email</div>
                  <strong style={{ color: '#fff' }}>care@feasthub.com</strong>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Fast response under 15 mins</div>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIconBox}>
                  <MapPin size={18} color="#10b981" />
                </div>
                <div>
                  <div style={styles.infoLabel}>Headquarters</div>
                  <strong style={{ color: '#fff' }}>FeastHub Tech Hub</strong>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Indiranagar 100ft Road, Bengaluru, KA 560038
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini FAQ */}
          <div className="glass-card" style={styles.faqCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <HelpCircle size={18} color="#f59e0b" />
              <h4>Frequently Asked Questions</h4>
            </div>
            <div style={styles.faqList}>
              <div>
                <strong>How do I track my delivery in real-time?</strong>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                  Every active order features live GPS tracking on our interactive Leaflet map with real-time ETA and status updates.
                </p>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.5rem' }}>
                <strong>Can I cancel or modify an order?</strong>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                  Orders can be cancelled before the kitchen begins food preparation. Check live status in your orders history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    minHeight: '80vh'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '900'
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '1rem',
    maxWidth: '640px',
    lineHeight: '1.5'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2rem',
    alignItems: 'start'
  },
  formCard: {
    padding: '2rem',
    borderRadius: '24px'
  },
  formTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    marginBottom: '1.5rem'
  },
  submittedBox: {
    padding: '3rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    color: '#d1d5db',
    fontWeight: '600',
    marginBottom: '0.35rem'
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.75rem 0.95rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)'
  },
  textarea: {
    width: '100%',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.75rem 0.95rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    resize: 'vertical'
  },
  submitBtn: {
    padding: '0.85rem',
    fontSize: '0.95rem',
    marginTop: '0.5rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  infoCard: {
    padding: '1.75rem',
    borderRadius: '22px'
  },
  infoItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem'
  },
  infoIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  faqCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: '0.85rem'
  }
};
