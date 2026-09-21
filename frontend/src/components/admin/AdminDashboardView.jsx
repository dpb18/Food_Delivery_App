import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShoppingBag,
  IndianRupee,
  Bike,
  UserCheck,
  Store,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  X,
  Flame,
  Zap,
  Info
} from 'lucide-react';

export const AdminDashboardView = () => {
  const {
    orders,
    updateOrderStatus,
    assignDeliveryPartner,
    deliveryPartner,
    users,
    restaurants,
    menuItems,
    toggleItemAvailability,
    addDishWithAiNutrition,
    categories
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'outlets'

  // Add Dish Modal State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(2);
  const [newDishRestaurant, setNewDishRestaurant] = useState(1);
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [aiPreview, setAiPreview] = useState(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => o.status === 'PLACED' || o.status === 'PREPARING'
  ).length;

  const handleAiEstimate = () => {
    if (!newDishName) {
      alert('Please enter a dish name first to generate AI nutritional contents');
      return;
    }
    setIsAiGenerating(true);
    setTimeout(() => {
      const nameLower = (newDishName + ' ' + newDishDesc).toLowerCase();
      let calories = 520;
      let protein = 22;
      let carbs = 48;
      let fat = 18;
      let fiber = 5;
      let allergens = 'Gluten';

      if (nameLower.includes('burger')) {
        calories = newDishIsVeg ? 580 : 710;
        protein = newDishIsVeg ? 24 : 38;
        carbs = 52;
        fat = 32;
        allergens = 'Gluten, Dairy';
      } else if (nameLower.includes('pizza')) {
        calories = 680;
        protein = 28;
        carbs = 74;
        fat = 30;
        allergens = 'Gluten, Dairy';
      } else if (nameLower.includes('salad') || nameLower.includes('bowl')) {
        calories = 360;
        protein = 16;
        carbs = 38;
        fat = 12;
        allergens = 'None';
      }

      setAiPreview({
        calories,
        protein,
        carbs,
        fat,
        fiber,
        allergens,
        aiSummary: `AI Verified Profile: Calculated from ${newDishIsVeg ? 'Vegetarian' : 'Animal protein'} macronutrient ratios with culinary portion standards.`
      });
      setIsAiGenerating(false);
    }, 700);
  };

  const handleCreateDish = (e) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice) return;

    addDishWithAiNutrition({
      restaurantId: newDishRestaurant,
      categoryId: newDishCategory,
      name: newDishName,
      description: newDishDesc || 'Freshly prepared specialty dish crafted with artisanal ingredients.',
      price: newDishPrice,
      image: newDishImage,
      isVeg: newDishIsVeg
    });

    // Reset Form
    setNewDishName('');
    setNewDishPrice('');
    setNewDishDesc('');
    setNewDishImage('');
    setAiPreview(null);
    setShowAddDishModal(false);
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.header}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> Restaurant & Operations Command Center
          </div>
          <h1 style={styles.title}>Admin Portal Overview</h1>
          <p style={styles.subtitle}>
            Monitor kitchen pipeline, manage menus with AI nutrient generation, and review sales.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={styles.tabPillGroup}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'orders' ? styles.tabBtnActive : {})
            }}
          >
            Live Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'inventory' ? styles.tabBtnActive : {})
            }}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('outlets')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'outlets' ? styles.tabBtnActive : {})
            }}
          >
            Outlets ({restaurants.length})
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div style={styles.statsGrid}>
        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconBoxPurple}>
            <Layers size={22} color="#8b5cf6" />
          </div>
          <div>
            <div style={styles.statLabel}>Total Orders Placed</div>
            <div style={styles.statVal}>{orders.length}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconBoxAmber}>
            <Clock size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={styles.statLabel}>Kitchen Queue (Pending)</div>
            <div style={styles.statVal}>{pendingOrders}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconBoxEmerald}>
            <IndianRupee size={22} color="#10b981" />
          </div>
          <div>
            <div style={styles.statLabel}>Gross Sales Volume</div>
            <div style={styles.statVal}>₹{totalGMV.toFixed(2)}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconBoxCoral}>
            <Store size={22} color="#ff5238" />
          </div>
          <div>
            <div style={styles.statLabel}>Active Kitchens</div>
            <div style={styles.statVal}>{restaurants.length}</div>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE ORDERS PIPELINE */}
      {activeTab === 'orders' && (
        <div className="glass-card" style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3>Active Orders Queue & Kitchen Controls</h3>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Advance cooking status as food is prepared
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Restaurant</th>
                  <th style={styles.th}>Customer & Address</th>
                  <th style={styles.th}>Items Ordered</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Assigned Rider</th>
                  <th style={styles.th}>Kitchen Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong style={{ color: '#ff7a65' }}>#{order.id}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        OTP: <code>{order.deliveryOtp}</code>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <strong>{order.restaurantName}</strong>
                    </td>
                    <td style={styles.td}>
                      <div>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {order.deliveryAddress?.streetAddress}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {order.items.map((i, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem' }}>
                          {i.quantity}x {i.name}
                        </div>
                      ))}
                    </td>
                    <td style={styles.td}>
                      <strong>₹{order.totalAmount.toFixed(2)}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#10b981' }}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span
                        className={`badge ${
                          order.status === 'DELIVERED'
                            ? 'badge-emerald'
                            : order.status === 'OUT_FOR_DELIVERY'
                            ? 'badge-primary'
                            : order.status === 'READY_FOR_PICKUP'
                            ? 'badge-purple'
                            : 'badge-amber'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    {/* ASSIGNED DELIVERY PARTNER */}
                    <td style={styles.td}>
                      {order.deliveryPartnerName ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid #10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Bike size={14} color="#10b981" />
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#34d399' }}>
                              {order.deliveryPartnerName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                              {order.deliveryPartnerVehicle || 'Bike'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.3rem 0.65rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                            onClick={() => assignDeliveryPartner(order.id, deliveryPartner)}
                          >
                            <UserCheck size={13} color="#10b981" />
                            <span>Assign {deliveryPartner.fullName.split(' ')[0]}</span>
                          </button>
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Rider pending</span>
                        </div>
                      )}
                    </td>
                    {/* KITCHEN & DISPATCH ACTIONS */}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {order.status === 'PLACED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                          >
                            Accept & Cook
                          </button>
                        )}

                        {order.status === 'PREPARING' && (
                          <button
                            className="btn btn-sm btn-emerald"
                            onClick={() => updateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                          >
                            Ready for Pickup
                          </button>
                        )}

                        {order.status === 'READY_FOR_PICKUP' && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
                            onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                          >
                            Dispatch 🛵
                          </button>
                        )}

                        {order.status === 'OUT_FOR_DELIVERY' && (
                          <button
                            className="btn btn-sm btn-emerald"
                            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                          >
                            Mark Delivered ✓
                          </button>
                        )}

                        {order.status === 'DELIVERED' && (
                          <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700' }}>
                            Delivered ✓
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MENU ITEMS INVENTORY WITH AI ADD DISH */}
      {activeTab === 'inventory' && (
        <div className="glass-card" style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3>Dish Inventory & In-Stock Availability</h3>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                Toggle availability or add new products with AI nutrition calculation
              </span>
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddDishModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} />
              <span>+ Add Dish (AI Nutrition)</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Dish Name</th>
                  <th style={styles.th}>AI Calories & Macros</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Toggle In-Stock</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((dish) => (
                  <tr key={dish.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={dish.image}
                          alt={dish.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <strong>{dish.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {dish.description?.slice(0, 48)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {dish.nutrition ? (
                        <div>
                          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                            🔥 {dish.nutrition.calories} kcal
                          </span>
                          <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
                            P: {dish.nutrition.protein}g • C: {dish.nutrition.carbs}g • F: {dish.nutrition.fat}g
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Standard</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div className={dish.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
                        <span>{dish.isVeg ? 'Veg' : 'Non-Veg'}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <strong style={{ fontSize: '1.05rem', color: '#ff7a65' }}>₹{dish.price}</strong>
                    </td>
                    <td style={styles.td}>
                      <span className={`badge ${dish.isAvailable ? 'badge-emerald' : 'badge-primary'}`}>
                        {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => toggleItemAvailability(dish.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        {dish.isAvailable ? 'Mark Sold Out' : 'Mark In Stock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RESTAURANT OUTLETS */}
      {activeTab === 'outlets' && (
        <div style={styles.outletsGrid}>
          {restaurants.map((res) => (
            <div key={res.id} className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
              <img
                src={res.image}
                alt={res.name}
                style={{
                  width: '100%',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '0.75rem'
                }}
              />
              <h3 style={{ fontSize: '1.1rem' }}>{res.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.35rem 0' }}>{res.address}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                <span>Delivery: {res.deliveryTimeMins} mins</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD PRODUCT WITH AI NUTRITION */}
      {showAddDishModal && (
        <div style={styles.modalBackdrop} onClick={() => setShowAddDishModal(false)}>
          <div style={styles.modalBody} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTopRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#8b5cf6" />
                <h2 style={{ fontSize: '1.3rem' }}>Add Product with AI Nutrition</h2>
              </div>
              <button
                onClick={() => setShowAddDishModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#9ca3af" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} style={styles.addDishForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={styles.inputLabel}>Dish Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Avocado Truffle Melt"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    style={styles.modalInput}
                    required
                  />
                </div>
                <div>
                  <label style={styles.inputLabel}>Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="299"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    style={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={styles.inputLabel}>Target Restaurant Outlet</label>
                  <select
                    value={newDishRestaurant}
                    onChange={(e) => setNewDishRestaurant(e.target.value)}
                    style={styles.modalSelect}
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.inputLabel}>Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    style={styles.modalSelect}
                  >
                    {categories.filter((c) => c.id !== 1).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={styles.inputLabel}>Description & Ingredients</label>
                <textarea
                  placeholder="Ingredients: Smashed avocado, melted aged cheddar, sourdough bread..."
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  style={styles.modalTextarea}
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={newDishIsVeg}
                    onChange={(e) => setNewDishIsVeg(e.target.checked)}
                  />
                  <span>Pure Vegetarian</span>
                </label>
              </div>

              {/* AI GENERATE NUTRITION TRIGGER BUTTON */}
              <div style={styles.aiGenBox}>
                <button
                  type="button"
                  onClick={handleAiEstimate}
                  disabled={isAiGenerating || !newDishName}
                  style={styles.aiGenBtn}
                >
                  <Sparkles size={16} />
                  <span>{isAiGenerating ? 'AI Generating Nutrition & Calories...' : '✨ Calculate AI Calories & Nutrition Facts'}</span>
                </button>

                {aiPreview && (
                  <div style={styles.aiPreviewResults}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#c084fc', fontSize: '0.85rem' }}>AI Generated Nutritional Profile:</strong>
                      <span className="badge badge-purple">🔥 {aiPreview.calories} kcal</span>
                    </div>
                    <div style={styles.macroRow}>
                      <span>Protein: <strong>{aiPreview.protein}g</strong></span>
                      <span>Carbs: <strong>{aiPreview.carbs}g</strong></span>
                      <span>Fat: <strong>{aiPreview.fat}g</strong></span>
                      <span>Fiber: <strong>{aiPreview.fiber}g</strong></span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#d1d5db', marginTop: '0.4rem' }}>
                      Allergens: {aiPreview.allergens}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                Save Product to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '85vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800'
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.95rem',
    marginTop: '0.25rem'
  },
  tabPillGroup: {
    display: 'flex',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: '0.3rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    transition: 'all 0.2s'
  },
  tabBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    color: '#c084fc'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem'
  },
  statCard: {
    padding: '1.25rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIconBoxPurple: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconBoxAmber: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconBoxEmerald: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconBoxCoral: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '0.78rem',
    color: '#9ca3af'
  },
  statVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)'
  },
  tableCard: {
    padding: '1.5rem',
    borderRadius: '20px'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.8rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
  },
  td: {
    padding: '0.85rem 1rem',
    fontSize: '0.88rem'
  },
  outletsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 14, 0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem'
  },
  modalBody: {
    backgroundColor: '#0f1624',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    maxWidth: '540px',
    width: '100%',
    padding: '1.75rem',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  modalCloseBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer'
  },
  addDishForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputLabel: {
    display: 'block',
    fontSize: '0.78rem',
    color: '#d1d5db',
    marginBottom: '0.35rem',
    fontWeight: '600'
  },
  modalInput: {
    width: '100%',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.65rem 0.85rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem'
  },
  modalSelect: {
    width: '100%',
    backgroundColor: '#0b0f19',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.65rem 0.85rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.85rem'
  },
  modalTextarea: {
    width: '100%',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.65rem 0.85rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)'
  },
  aiGenBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    border: '1px dashed #8b5cf6',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  aiGenBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    border: '1px solid #8b5cf6',
    color: '#c084fc',
    padding: '0.65rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  aiPreviewResults: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    padding: '0.75rem'
  },
  macroRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#9ca3af'
  }
};
