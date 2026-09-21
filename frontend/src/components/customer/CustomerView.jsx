import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Search,
  Star,
  Clock,
  Bike,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowLeft,
  Zap,
  MapPin,
  Award,
  Filter,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';

export const CustomerView = () => {
  const navigate = useNavigate();
  const {
    currentView,
    setCurrentView,
    restaurants,
    categories,
    menuItems,
    selectedRestaurantId,
    setSelectedRestaurantId,
    activeDishModal,
    setActiveDishModal
  } = useApp();

  const { addToCart, cart, updateQuantity, cartCount, cartTotal, cartRestaurant } = useCart();

  // Search and Filter local states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'deliveryTime'

  // Restaurant Detail Internal Filter states
  const [restaurantMenuCategory, setRestaurantMenuCategory] = useState('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [dishSortBy, setDishSortBy] = useState('popular'); // 'popular' | 'priceAsc' | 'priceDesc'

  // Filtered restaurants for Home
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        const cat = r.category || '';
        const name = r.name || '';
        const desc = r.description || '';
        const q = searchQuery.toLowerCase();
        const matchesCategory =
          selectedCategory === 'All' || cat === selectedCategory;
        const matchesSearch =
          name.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'deliveryTime') return (a.deliveryTimeMins || 0) - (b.deliveryTimeMins || 0);
        return 0;
      });
  }, [restaurants, searchQuery, selectedCategory, sortBy]);

  // Popular dishes across all restaurants
  const popularDishes = useMemo(() => {
    return menuItems.filter((item) => item.popular && item.isAvailable);
  }, [menuItems]);

  // If currently viewing a restaurant's menu
  const activeRestaurant = restaurants.find((r) => r.id === selectedRestaurantId);

  // Categories available within this specific restaurant
  const restaurantCategories = useMemo(() => {
    if (!activeRestaurant) return [];
    const storeDishes = menuItems.filter((i) => i.restaurantId === activeRestaurant.id);
    const catIds = [...new Set(storeDishes.map((d) => d.categoryId))];
    const matchingCats = categories.filter((c) => catIds.includes(c.id));
    return [{ id: 0, name: 'All Dishes', icon: '🍽️' }, ...matchingCats];
  }, [activeRestaurant, menuItems, categories]);

  // Filtered dishes inside restaurant
  const restaurantDishes = useMemo(() => {
    if (!activeRestaurant) return [];
    return menuItems
      .filter((item) => {
        const belongsToStore = item.restaurantId === selectedRestaurantId;
        const matchesVeg = vegOnlyFilter ? item.isVeg : true;
        const matchesCat =
          restaurantMenuCategory === 'All' ||
          restaurantMenuCategory === 'All Dishes' ||
          categories.find((c) => c.id === item.categoryId)?.name === restaurantMenuCategory;
        const matchesSearch =
          !menuSearchQuery ||
          item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
        return belongsToStore && matchesVeg && matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (dishSortBy === 'priceAsc') return a.price - b.price;
        if (dishSortBy === 'priceDesc') return b.price - a.price;
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [
    activeRestaurant,
    menuItems,
    selectedRestaurantId,
    vegOnlyFilter,
    restaurantMenuCategory,
    menuSearchQuery,
    dishSortBy,
    categories
  ]);

  // RESTAURANT MENU DETAIL VIEW (WITH LEFT-SIDE MENU & FILTER SIDEBAR)
  if (currentView === 'restaurant' && activeRestaurant) {
    return (
      <div style={styles.container}>
        {/* Back navigation button */}
        <button onClick={() => setCurrentView('home')} style={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to Restaurants</span>
        </button>

        {/* Restaurant Hero Banner */}
        <div style={styles.restaurantHero}>
          <img
            src={activeRestaurant.image || activeRestaurant.imageUrl}
            alt={activeRestaurant.name}
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay}>
            <div style={styles.heroBadgeRow}>
              <span className="badge badge-primary">{activeRestaurant.category || 'Gourmet'}</span>
              <div style={styles.heroRating}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <strong>{activeRestaurant.rating}</strong>
                <span style={{ color: '#d1d5db', fontSize: '0.78rem' }}>
                  ({activeRestaurant.reviewsCount || 200}+ ratings)
                </span>
              </div>
            </div>
            <h1 style={styles.heroTitle}>{activeRestaurant.name}</h1>
            <p style={styles.heroDesc}>{activeRestaurant.description}</p>
            <div style={styles.heroMetaRow}>
              <div style={styles.metaItem}>
                <Clock size={16} color="#ff5238" />
                <span>{activeRestaurant.deliveryTimeMins} mins delivery</span>
              </div>
              <div style={styles.metaItem}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Top Hygiene & Quality Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: LEFT SIDEBAR MENU & RIGHT DISHES LIST */}
        <div className="restaurant-layout-responsive">
          {/* LEFT-HAND SIDEBAR MENU & FILTER */}
          <aside style={styles.sidebar}>
            <div className="glass-card" style={styles.sidebarCard}>
              <div style={styles.sidebarHeader}>
                <Filter size={18} color="#ff5238" />
                <h3>Menu & Filters</h3>
              </div>

              {/* In-Menu Search */}
              <div style={styles.menuSearchWrapper}>
                <Search size={15} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search in menu..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  style={styles.menuSearchInput}
                />
              </div>

              {/* Pure Veg Toggle */}
              <div style={styles.filterSection}>
                <div style={styles.filterSectionTitle}>Dietary Preference</div>
                <button
                  onClick={() => setVegOnlyFilter((prev) => !prev)}
                  style={{
                    ...styles.vegToggleBtn,
                    backgroundColor: vegOnlyFilter
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.04)',
                    borderColor: vegOnlyFilter ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    color: vegOnlyFilter ? '#34d399' : '#9ca3af'
                  }}
                >
                  <div className="veg-indicator" />
                  <span>Pure Veg Only</span>
                </button>
              </div>

              {/* Categories Navigation */}
              <div style={styles.filterSection}>
                <div style={styles.filterSectionTitle}>Cuisines & Sections</div>
                <div style={styles.sideCategoriesList}>
                  {restaurantCategories.map((cat) => {
                    const isSelected = restaurantMenuCategory === cat.name;
                    const count = menuItems.filter(
                      (item) =>
                        item.restaurantId === activeRestaurant.id &&
                        (cat.name === 'All Dishes' ||
                          categories.find((c) => c.id === item.categoryId)?.name === cat.name)
                    ).length;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setRestaurantMenuCategory(cat.name)}
                        style={{
                          ...styles.sideCategoryItem,
                          backgroundColor: isSelected
                            ? 'rgba(255, 82, 56, 0.15)'
                            : 'transparent',
                          color: isSelected ? '#ff7a65' : '#d1d5db',
                          fontWeight: isSelected ? '700' : '500'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{cat.icon || '🍴'}</span>
                          <span>{cat.name}</span>
                        </div>
                        <span style={styles.catCountBadge}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sort by Price */}
              <div style={styles.filterSection}>
                <div style={styles.filterSectionTitle}>Sort Dishes</div>
                <select
                  value={dishSortBy}
                  onChange={(e) => setDishSortBy(e.target.value)}
                  style={styles.sideSelect}
                >
                  <option value="popular">Most Popular</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>

              {/* AI Health Notice */}
              <div style={styles.aiHealthCard}>
                <Sparkles size={16} color="#8b5cf6" />
                <div style={{ fontSize: '0.78rem', color: '#c084fc' }}>
                  <strong>AI Nutrition Enabled:</strong> Click any dish to view calorie and macronutrient breakdown!
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT-HAND DISHES GRID */}
          <main style={styles.dishesMain}>
            <div style={styles.menuHeaderBar}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  {restaurantMenuCategory} ({restaurantDishes.length})
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                  Click on any food item to inspect AI calorie & nutrition breakdown
                </span>
              </div>
            </div>

            {restaurantDishes.length === 0 ? (
              <div
                className="glass-card"
                style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}
              >
                <p>No dishes match your selected filter.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setVegOnlyFilter(false);
                    setRestaurantMenuCategory('All Dishes');
                    setMenuSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={styles.dishesGrid}>
                {restaurantDishes.map((dish) => {
                  const inCart = cart.find((i) => i.id === dish.id);

                  return (
                    <div
                      key={dish.id}
                      className="glass-card"
                      style={styles.dishCard}
                      onClick={() => setActiveDishModal(dish)}
                    >
                      <div style={styles.dishImageWrapper}>
                        <img src={dish.image} alt={dish.name} style={styles.dishImage} />
                        <div style={styles.dishDietBadge}>
                          <div className={dish.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
                        </div>
                        {dish.popular && (
                          <span style={styles.bestsellerBadge}>
                            <Sparkles size={11} /> Bestseller
                          </span>
                        )}
                        {dish.nutrition && (
                          <span style={styles.caloriePill}>
                            🔥 {dish.nutrition.calories} kcal
                          </span>
                        )}
                      </div>

                      <div style={styles.dishContent}>
                        <div style={styles.dishHeader}>
                          <h3 style={styles.dishTitle}>{dish.name}</h3>
                          <div style={styles.dishPrice}>₹{dish.price}</div>
                        </div>

                        <p style={styles.dishDesc}>{dish.description}</p>

                        <div
                          style={styles.aiNutrientPreview}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDishModal(dish);
                          }}
                        >
                          <Sparkles size={13} color="#8b5cf6" />
                          <span>View AI Calorie & Nutrition Details ➔</span>
                        </div>

                        <div style={styles.dishFooter} onClick={(e) => e.stopPropagation()}>
                          {!inCart ? (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ width: '100%', padding: '0.65rem' }}
                              disabled={!dish.isAvailable}
                              onClick={() => addToCart(dish, activeRestaurant)}
                            >
                              {dish.isAvailable ? '+ Add to Cart' : 'Sold Out'}
                            </button>
                          ) : (
                            <div style={styles.quantityControl}>
                              <button
                                onClick={() => updateQuantity(dish.id, -1)}
                                style={styles.qtyBtn}
                              >
                                -
                              </button>
                              <span style={styles.qtyValue}>{inCart.quantity}</span>
                              <button
                                onClick={() => updateQuantity(dish.id, 1)}
                                style={styles.qtyBtn}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* Product Detail Modal */}
        <ProductDetailModal
          dish={activeDishModal}
          onClose={() => setActiveDishModal(null)}
          restaurant={activeRestaurant}
        />
      </div>
    );
  }

  // HOMEPAGE RESTAURANT BROWSING VIEW
  return (
    <div style={styles.container}>
      {/* Hero Welcome Banner */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div className="badge badge-primary">
            <Flame size={13} /> 50% OFF YOUR FIRST ORDER
          </div>
          <h1 style={styles.mainHeading}>
            Savor exceptional food, <br />
            <span style={{ color: '#ff5238' }}>delivered straight</span> to your door.
          </h1>
          <p style={styles.heroSub}>
            Discover top-rated restaurants, handcrafted kitchens, and fresh local favorites in your city.
          </p>

          {/* Search Bar Input */}
          <div style={styles.searchBarWrapper}>
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search for restaurants, burgers, sushi, biryani..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Horizontal Carousel */}
      <section style={styles.categoriesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={{ fontSize: '1.25rem' }}>Popular Categories</h2>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Click to filter</span>
        </div>
        <div className="no-scrollbar" style={styles.categoryPills}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  ...styles.categoryPill,
                  backgroundColor: isSelected
                    ? 'rgba(255, 82, 56, 0.2)'
                    : 'rgba(255, 255, 255, 0.04)',
                  borderColor: isSelected ? '#ff5238' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ff7a65' : '#d1d5db'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                <span style={{ fontWeight: '600' }}>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter and Sort Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>
          Available Outlets ({filteredRestaurants.length})
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.selectInput}
          >
            <option value="rating">Highest Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
          </select>
        </div>
      </div>

      {/* Restaurant Cards Grid (No fee text shown) */}
      <div style={styles.restaurantsGrid}>
        {filteredRestaurants.map((res) => (
          <div
            key={res.id}
            className="glass-card"
            style={styles.restaurantCard}
            onClick={() => {
              setSelectedRestaurantId(res.id);
              setCurrentView('restaurant');
            }}
          >
            <div style={styles.cardImageWrapper}>
              <img src={res.image || res.imageUrl} alt={res.name} style={styles.cardImage} />
              <div style={styles.cardRatingBadge}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{res.rating}</span>
              </div>
              <div style={styles.cardDeliveryPill}>
                <Clock size={13} />
                <span>{res.deliveryTimeMins} mins</span>
              </div>
            </div>

            <div style={styles.cardBody}>
              <div style={styles.cardTopRow}>
                <h3 style={styles.cardTitle}>{res.name}</h3>
              </div>

              <p style={styles.cardTagline}>{res.tagline || res.description}</p>

              <div style={styles.tagsRow}>
                {(res.tags || ['Top Rated', 'Trending']).map((tag, idx) => (
                  <span key={idx} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.cuisineText}>{res.category || 'Multi-Cuisine'}</span>
                <span style={styles.viewMenuLink}>
                  Explore Menu & AI Nutrition <ChevronRight size={15} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VALUE PROPOSITION / HIGHLIGHTS BAR */}
      <section style={styles.perksSection}>
        <div className="glass-card" style={styles.perksCard}>
          <div style={styles.perkItem}>
            <div style={styles.perkIconZap}>
              <Zap size={22} color="#ff5238" />
            </div>
            <div>
              <h4 style={styles.perkTitle}>Lightning 30-Min Delivery</h4>
              <p style={styles.perkDesc}>Freshly cooked, packed, and dispatched in record time.</p>
            </div>
          </div>

          <div style={styles.perkItem}>
            <div style={styles.perkIconShield}>
              <ShieldCheck size={22} color="#10b981" />
            </div>
            <div>
              <h4 style={styles.perkTitle}>Premium Quality Assured</h4>
              <p style={styles.perkDesc}>Top hygienic kitchens, fresh ingredients, and gourmet standards.</p>
            </div>
          </div>

          <div style={styles.perkItem}>
            <div style={styles.perkIconMap}>
              <MapPin size={22} color="#3b82f6" />
            </div>
            <div>
              <h4 style={styles.perkTitle}>Live GPS Route Tracking</h4>
              <p style={styles.perkDesc}>Watch your rider navigate directly on the interactive map.</p>
            </div>
          </div>

          <div style={styles.perkItem}>
            <div style={styles.perkIconAward}>
              <Award size={22} color="#f59e0b" />
            </div>
            <div>
              <h4 style={styles.perkTitle}>AI Calorie Intelligence</h4>
              <p style={styles.perkDesc}>Check full nutrient breakdowns and macro profiles before ordering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING & POPULAR DISHES (CLICK TO OPEN AI NUTRITION MODAL) */}
      <section style={styles.popularSection}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
              🔥 Trending & Popular Dishes
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Top rated favorites • Click any dish to inspect AI nutritional details
            </p>
          </div>
          <span className="badge badge-primary">Customer Favorites</span>
        </div>

        <div style={styles.popularDishesGrid}>
          {popularDishes.map((dish) => {
            const inCart = cart.find((i) => i.id === dish.id);
            const parentStore = restaurants.find((r) => r.id === dish.restaurantId);

            return (
              <div
                key={dish.id}
                className="glass-card"
                style={styles.popularDishCard}
                onClick={() => setActiveDishModal(dish)}
              >
                <div style={styles.popularImageWrap}>
                  <img src={dish.image} alt={dish.name} style={styles.popularImage} />
                  <div style={styles.dishDietBadge}>
                    <div className={dish.isVeg ? 'veg-indicator' : 'non-veg-indicator'} />
                  </div>
                  <span style={styles.bestsellerBadge}>
                    <Sparkles size={11} /> Bestseller
                  </span>
                  {dish.nutrition && (
                    <span style={styles.caloriePill}>
                      🔥 {dish.nutrition.calories} kcal
                    </span>
                  )}
                </div>

                <div style={styles.popularCardContent}>
                  <div style={styles.popularDishTitle}>{dish.name}</div>

                  {parentStore && (
                    <div
                      style={styles.popularStoreTag}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRestaurantId(parentStore.id);
                        setCurrentView('restaurant');
                      }}
                    >
                      by <span>{parentStore.name}</span>
                    </div>
                  )}

                  <p style={styles.popularDishDesc}>{dish.description}</p>

                  <div style={styles.popularCardFooter} onClick={(e) => e.stopPropagation()}>
                    {/* LARGER & PROMINENT FOOD PRICE */}
                    <div style={styles.largePrice}>₹{dish.price}</div>

                    <div>
                      {!inCart ? (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
                          onClick={() => addToCart(dish, parentStore)}
                        >
                          + Add
                        </button>
                      ) : (
                        <div style={styles.miniQtyWrapper}>
                          <button
                            onClick={() => updateQuantity(dish.id, -1)}
                            style={styles.miniQtyBtn}
                          >
                            -
                          </button>
                          <span style={styles.miniQtyValue}>{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(dish.id, 1)}
                            style={styles.miniQtyBtn}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        dish={activeDishModal}
        onClose={() => setActiveDishModal(null)}
        restaurant={restaurants.find((r) => r.id === activeDishModal?.restaurantId)}
      />

      {/* Floating Bottom Cart Bar when cart has items */}
      {cartCount > 0 && (
        <div
          className="floating-cart-bar"
          onClick={() => navigate('/cart')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 82, 56, 0.2)',
                border: '1.5px solid #ff5238',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShoppingBag size={20} color="#ff5238" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>
                {cartCount} {cartCount === 1 ? 'dish' : 'dishes'} in your cart
              </div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                From {cartRestaurant?.name || 'Restaurant'} • Total:{' '}
                <strong style={{ color: '#ff5238' }}>₹{cartTotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.55rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '10px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/cart');
            }}
          >
            <span>View Cart</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(0.85rem, 2.5vw, 1.5rem)',
    minHeight: '80vh'
  },
  heroSection: {
    padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(255, 82, 56, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '2.5rem',
    position: 'relative',
    overflow: 'hidden'
  },
  heroContent: {
    maxWidth: '680px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mainHeading: {
    fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
    fontWeight: '900',
    lineHeight: '1.2'
  },
  heroSub: {
    color: '#9ca3af',
    fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
    lineHeight: '1.5'
  },
  searchBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#0a0e18',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '0.65rem 1.25rem',
    maxWidth: '520px',
    width: '100%',
    marginTop: '0.5rem',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-body)'
  },
  clearSearchBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  categoriesSection: {
    marginBottom: '2.5rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  categoryPills: {
    display: 'flex',
    gap: '0.75rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem'
  },
  categoryPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.1rem',
    borderRadius: '9999px',
    border: '1px solid',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  selectInput: {
    background: '#121928',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    padding: '0.45rem 0.85rem',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem'
  },
  restaurantsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: '1.75rem',
    marginBottom: '3.5rem'
  },
  restaurantCard: {
    overflow: 'hidden',
    cursor: 'pointer',
    borderRadius: '20px'
  },
  cardImageWrapper: {
    position: 'relative',
    height: '190px',
    overflow: 'hidden'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  cardRatingBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.25rem 0.6rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  cardDeliveryPill: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    backdropFilter: 'blur(8px)',
    color: '#d1d5db',
    borderRadius: '9999px',
    padding: '0.25rem 0.65rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.78rem'
  },
  cardBody: {
    padding: '1.25rem'
  },
  cardTopRow: {
    marginBottom: '0.35rem'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '800'
  },
  cardTagline: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    marginBottom: '0.75rem',
    lineHeight: '1.4'
  },
  tagsRow: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '0.75rem'
  },
  cuisineText: {
    fontSize: '0.82rem',
    color: '#9ca3af',
    fontWeight: '600'
  },
  viewMenuLink: {
    fontSize: '0.85rem',
    color: '#ff5238',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem'
  },

  /* VALUE PROPOSITION PERKS SECTION */
  perksSection: {
    marginBottom: '3.5rem'
  },
  perksCard: {
    padding: '2rem',
    borderRadius: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem'
  },
  perkItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  perkIconZap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 82, 56, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  perkIconShield: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  perkIconMap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  perkIconAward: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  perkTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  },
  perkDesc: {
    color: '#9ca3af',
    fontSize: '0.82rem',
    lineHeight: '1.4'
  },

  /* TRENDING & POPULAR DISHES SECTION */
  popularSection: {
    marginBottom: '3rem'
  },
  popularDishesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
    gap: '1.5rem'
  },
  popularDishCard: {
    borderRadius: '18px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  popularImageWrap: {
    position: 'relative',
    height: '170px'
  },
  popularImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  popularCardContent: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  popularDishTitle: {
    fontSize: '1.1rem',
    fontWeight: '800'
  },
  popularStoreTag: {
    fontSize: '0.78rem',
    color: '#9ca3af',
    margin: '0.3rem 0 0.6rem 0',
    cursor: 'pointer'
  },
  popularDishDesc: {
    color: '#9ca3af',
    fontSize: '0.82rem',
    lineHeight: '1.4',
    marginBottom: '1rem',
    flexGrow: 1
  },
  popularCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '0.85rem'
  },
  largePrice: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '-0.02em'
  },
  caloriePill: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    backdropFilter: 'blur(8px)',
    color: '#ff7a65',
    padding: '0.2rem 0.55rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: '800'
  },
  miniQtyWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ff5238',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  miniQtyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '0.3rem 0.65rem',
    fontSize: '0.95rem',
    fontWeight: '800',
    cursor: 'pointer'
  },
  miniQtyValue: {
    color: '#fff',
    fontWeight: '800',
    fontSize: '0.85rem',
    padding: '0 0.3rem'
  },

  /* RESTAURANT 2-COLUMN LAYOUT & SIDEBAR */
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#d1d5db',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem'
  },
  restaurantHero: {
    position: 'relative',
    height: '280px',
    borderRadius: '24px',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.2) 0%, rgba(8, 12, 20, 0.95) 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '0.5rem'
  },
  heroBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  heroRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.9rem',
    color: '#fff'
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: '900'
  },
  heroDesc: {
    color: '#d1d5db',
    fontSize: '0.95rem',
    maxWidth: '700px'
  },
  heroMetaRow: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.85rem',
    marginTop: '0.25rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#d1d5db'
  },

  /* 2-Column Restaurant Container */
  restaurantLayout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  sidebar: {
    position: 'sticky',
    top: '110px'
  },
  sidebarCard: {
    padding: '1.25rem',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: '800',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.75rem'
  },
  menuSearchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.5rem 0.75rem'
  },
  menuSearchInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%'
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  filterSectionTitle: {
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#9ca3af',
    fontWeight: '700'
  },
  vegToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '10px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-heading)',
    transition: 'all 0.2s',
    width: '100%'
  },
  sideCategoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  sideCategoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.55rem 0.75rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    transition: 'all 0.15s'
  },
  catCountBadge: {
    fontSize: '0.72rem',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '0.1rem 0.45rem',
    borderRadius: '9999px',
    color: '#9ca3af'
  },
  sideSelect: {
    width: '100%',
    background: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.55rem 0.75rem',
    color: '#fff',
    outline: 'none',
    fontSize: '0.85rem'
  },
  aiHealthCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '12px',
    padding: '0.75rem',
    lineHeight: '1.4'
  },

  /* Dishes Main */
  dishesMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  menuHeaderBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dishesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
    gap: '1.5rem'
  },
  dishCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  dishImageWrapper: {
    position: 'relative',
    height: '160px'
  },
  dishImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  dishDietBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    borderRadius: '6px',
    padding: '4px'
  },
  bestsellerBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ff5238',
    color: '#fff',
    borderRadius: '9999px',
    padding: '0.2rem 0.55rem',
    fontSize: '0.68rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  dishContent: {
    padding: '1.1rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  dishHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.35rem'
  },
  dishTitle: {
    fontSize: '1.05rem',
    fontWeight: '700'
  },
  dishPrice: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ff7a65',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '-0.02em'
  },
  dishDesc: {
    color: '#9ca3af',
    fontSize: '0.82rem',
    lineHeight: '1.4',
    marginBottom: '0.75rem',
    flexGrow: 1
  },
  aiNutrientPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    color: '#c084fc',
    fontWeight: '600',
    marginBottom: '0.85rem',
    cursor: 'pointer'
  },
  dishFooter: {
    marginTop: 'auto'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ff5238',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  qtyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '0.45rem 1rem',
    fontSize: '1.1rem',
    fontWeight: '800',
    cursor: 'pointer'
  },
  qtyValue: {
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'var(--font-heading)'
  }
};
