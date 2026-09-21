import React from 'react';
import { Flame, ShieldCheck, Zap, Sparkles, Heart, Users, Award, ChefHat } from 'lucide-react';

export const AboutView = () => {
  return (
    <div style={styles.container}>
      {/* Hero Header */}
      <section style={styles.heroSection}>
        <div className="badge badge-primary">
          <Flame size={14} /> Our Culinary Story
        </div>
        <h1 style={styles.heroTitle}>
          Revolutionizing how great food <br />
          <span style={{ color: '#ff5238' }}>meets hungry doorsteps.</span>
        </h1>
        <p style={styles.heroSub}>
          FeastHub was founded with a singular conviction: exceptional food shouldn't be reserved for dine-in evenings. We bridge the distance between top-tier artisanal kitchens and your dinner table with ultra-fast logistics and intelligent nutrition tracking.
        </p>
      </section>

      {/* 3 Pillars Grid */}
      <div style={styles.pillarsGrid}>
        <div className="glass-card" style={styles.pillarCard}>
          <div style={styles.pillarIconZap}>
            <Zap size={24} color="#ff5238" />
          </div>
          <h3 style={styles.pillarTitle}>Lightning 30-Min Delivery</h3>
          <p style={styles.pillarDesc}>
            Our dynamic GPS routing algorithms dispatch delivery partners the instant the kitchen packages your meal, ensuring piping hot delivery.
          </p>
        </div>

        <div className="glass-card" style={styles.pillarCard}>
          <div style={styles.pillarIconSparkle}>
            <Sparkles size={24} color="#8b5cf6" />
          </div>
          <h3 style={styles.pillarTitle}>AI Nutritional Intelligence</h3>
          <p style={styles.pillarDesc}>
            Every dish is analyzed with generative nutritional models to give you accurate calories, protein, carbs, and allergen advisories before you take a single bite.
          </p>
        </div>

        <div className="glass-card" style={styles.pillarCard}>
          <div style={styles.pillarIconShield}>
            <ShieldCheck size={24} color="#10b981" />
          </div>
          <h3 style={styles.pillarTitle}>Freshness & Quality Assured</h3>
          <p style={styles.pillarDesc}>
            Every dish is prepared in sanitized kitchens following rigorous culinary standards, ensuring gourmet quality with every meal.
          </p>
        </div>
      </div>

      {/* Community / Multi-Portal Impact */}
      <section className="glass-card" style={styles.impactCard}>
        <div style={styles.impactHeader}>
          <Users size={22} color="#ff5238" />
          <h2>A Connected Culinary Ecosystem</h2>
        </div>
        <p style={styles.impactText}>
          FeastHub operates on a balanced 3-portal architecture connecting Foodies, Restaurant Partners, and Delivery Riders in harmony:
        </p>
        <div style={styles.impactStatsGrid}>
          <div style={styles.impactStat}>
            <div style={styles.statNumber}>10,000+</div>
            <div style={styles.statLabel}>Meals Delivered</div>
          </div>
          <div style={styles.impactStat}>
            <div style={styles.statNumber}>99.4%</div>
            <div style={styles.statLabel}>On-Time Accuracy</div>
          </div>
          <div style={styles.impactStat}>
            <div style={styles.statNumber}>4.8 ★</div>
            <div style={styles.statLabel}>Customer Satisfaction</div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: 'clamp(1.5rem, 4vw, 3rem) clamp(0.85rem, 2.5vw, 1.5rem)',
    minHeight: '80vh'
  },
  heroSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '3.5rem'
  },
  heroTitle: {
    fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
    fontWeight: '900',
    lineHeight: '1.2'
  },
  heroSub: {
    color: '#9ca3af',
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    maxWidth: '680px',
    lineHeight: '1.6'
  },
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.75rem',
    marginBottom: '3.5rem'
  },
  pillarCard: {
    padding: '2rem',
    borderRadius: '22px'
  },
  pillarIconZap: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  pillarIconSparkle: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  pillarIconShield: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  pillarTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    marginBottom: '0.5rem'
  },
  pillarDesc: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  impactCard: {
    padding: '2.5rem',
    borderRadius: '24px'
  },
  impactHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  impactText: {
    color: '#9ca3af',
    fontSize: '0.95rem',
    maxWidth: '700px',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  impactStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
    gap: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '1.5rem'
  },
  impactStat: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)'
  },
  statLabel: {
    fontSize: '0.82rem',
    color: '#9ca3af',
    marginTop: '0.25rem'
  }
};
