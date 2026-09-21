import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import {
  X,
  Sparkles,
  Zap,
  Flame,
  ShieldAlert,
  Info,
  ShoppingBag,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailModal = ({ dish, onClose, restaurant }) => {
  const { cart, addToCart, updateQuantity } = useCart();

  if (!dish) return null;

  const inCart = cart.find((i) => i.id === dish.id);
  const nutrition = dish.nutrition || {
    calories: 520,
    protein: 24,
    carbs: 58,
    fat: 20,
    fiber: 4,
    allergens: 'Gluten, Dairy',
    aiSummary: 'Balanced macronutrients with slow-burning carbohydrates and essential amino acids.'
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div className="modal-responsive" style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={20} color="#fff" />
        </button>

        {/* Modal Image Header */}
        <div style={styles.imageContainer}>
          <img src={dish.image} alt={dish.name} style={styles.modalImage} />
          <div style={styles.dietBadgeWrapper}>
            <div className={dish.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>
              {dish.isVeg ? 'Pure Veg' : 'Non-Vegetarian'}
            </span>
          </div>
          {dish.popular && (
            <span style={styles.bestsellerPill}>
              <Sparkles size={12} /> Chef's Bestseller
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div style={styles.modalContent}>
          <div style={styles.titleRow}>
            <div>
              <h2 style={styles.dishTitle}>{dish.name}</h2>
              {restaurant && (
                <div style={styles.storeTag}>
                  Prepared by <strong>{restaurant.name}</strong>
                </div>
              )}
            </div>
            <div style={styles.dishPrice}>₹{dish.price}</div>
          </div>

          <p style={styles.dishDescription}>{dish.description}</p>

          {/* AI-GENERATED NUTRITION & CALORIE PROFILE */}
          <div style={styles.nutritionBox}>
            <div style={styles.nutritionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#8b5cf6" />
                <h3 style={styles.nutritionTitle}>AI-Generated Nutritional Breakdown</h3>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                Gemini Health AI
              </span>
            </div>

            <div style={styles.macroGrid}>
              <div style={styles.macroCard}>
                <div style={styles.macroIconFlame}>
                  <Flame size={16} color="#ff5238" />
                </div>
                <div style={styles.macroVal}>{nutrition.calories}</div>
                <div style={styles.macroLabel}>Calories (kcal)</div>
              </div>

              <div style={styles.macroCard}>
                <div style={styles.macroIconProtein}>🥩</div>
                <div style={styles.macroVal}>{nutrition.protein}g</div>
                <div style={styles.macroLabel}>Protein</div>
              </div>

              <div style={styles.macroCard}>
                <div style={styles.macroIconCarbs}>🍞</div>
                <div style={styles.macroVal}>{nutrition.carbs}g</div>
                <div style={styles.macroLabel}>Carbs</div>
              </div>

              <div style={styles.macroCard}>
                <div style={styles.macroIconFat}>🧈</div>
                <div style={styles.macroVal}>{nutrition.fat}g</div>
                <div style={styles.macroLabel}>Healthy Fats</div>
              </div>

              <div style={styles.macroCard}>
                <div style={styles.macroIconFiber}>🥗</div>
                <div style={styles.macroVal}>{nutrition.fiber}g</div>
                <div style={styles.macroLabel}>Fiber</div>
              </div>
            </div>

            {/* AI Summary Statement */}
            <div style={styles.aiInsightRow}>
              <Info size={16} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={styles.aiInsightText}>{nutrition.aiSummary}</p>
            </div>

            {/* Allergens Notice */}
            <div style={styles.allergensRow}>
              <ShieldAlert size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
              <span>
                <strong>Allergen Advisory:</strong> Contains {nutrition.allergens}
              </span>
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div style={styles.footer}>
            {!inCart ? (
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
                onClick={() => {
                  addToCart(dish, restaurant);
                }}
              >
                <ShoppingBag size={18} />
                <span>Add to cart • ₹{dish.price}</span>
              </button>
            ) : (
              <div style={styles.inCartActionRow}>
                <div style={styles.quantityPicker}>
                  <button
                    onClick={() => updateQuantity(dish.id, -1)}
                    style={styles.qtyBtn}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={styles.qtyNumber}>{inCart.quantity} in Cart</span>
                  <button
                    onClick={() => updateQuantity(dish.id, 1)}
                    style={styles.qtyBtn}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button className="btn btn-emerald" onClick={onClose} style={{ flexGrow: 1 }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
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
    maxWidth: '560px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10
  },
  imageContainer: {
    position: 'relative',
    height: 'clamp(180px, 25vw, 240px)',
    overflow: 'hidden'
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  dietBadgeWrapper: {
    position: 'absolute',
    bottom: '14px',
    left: '16px',
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    backdropFilter: 'blur(8px)',
    padding: '0.35rem 0.75rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem'
  },
  bestsellerPill: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: '#ff5238',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.25rem 0.65rem',
    fontSize: '0.72rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  modalContent: {
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  dishTitle: {
    fontSize: '1.45rem',
    fontWeight: '800',
    lineHeight: '1.2'
  },
  storeTag: {
    fontSize: '0.82rem',
    color: '#9ca3af',
    marginTop: '0.25rem'
  },
  dishPrice: {
    fontSize: '1.6rem',
    fontWeight: '900',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)'
  },
  dishDescription: {
    color: '#d1d5db',
    fontSize: '0.92rem',
    lineHeight: '1.5'
  },
  nutritionBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '18px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  nutritionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nutritionTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: '#c084fc'
  },
  macroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(58px, 1fr))',
    gap: '0.45rem',
    textAlign: 'center'
  },
  macroCard: {
    backgroundColor: 'rgba(11, 15, 25, 0.6)',
    borderRadius: '12px',
    padding: '0.65rem 0.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  macroIconFlame: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '0.2rem'
  },
  macroIconProtein: { fontSize: '1rem' },
  macroIconCarbs: { fontSize: '1rem' },
  macroIconFat: { fontSize: '1rem' },
  macroIconFiber: { fontSize: '1rem' },
  macroVal: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'var(--font-heading)'
  },
  macroLabel: {
    fontSize: '0.68rem',
    color: '#9ca3af',
    marginTop: '0.15rem'
  },
  aiInsightRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
    padding: '0.75rem'
  },
  aiInsightText: {
    fontSize: '0.82rem',
    color: '#e5e7eb',
    lineHeight: '1.4'
  },
  allergensRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#f59e0b'
  },
  footer: {
    marginTop: '0.5rem'
  },
  inCartActionRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  quantityPicker: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ff5238',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  qtyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '0.65rem 0.85rem',
    cursor: 'pointer'
  },
  qtyNumber: {
    color: '#fff',
    fontWeight: '800',
    fontSize: '0.9rem',
    padding: '0 0.5rem',
    fontFamily: 'var(--font-heading)'
  }
};
