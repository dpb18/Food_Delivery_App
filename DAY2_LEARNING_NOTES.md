# 🎓 Day 2 Learning Guide: React Architecture, Hooks, and Context API

Welcome to **Day 2**! Today we brought our full-stack food delivery architecture to life on the frontend using **React (Vite)**, **React Hooks**, the **Context API**, and **Leaflet Map Routing**.

---

## 1. What We Built Today
1. **Scaffolded React with Vite**: Ultra-fast hot module reloading (HMR) and optimized ES build.
2. **Modern Dark-Mode Design System (`index.css`)**:
   - Custom CSS variables (`--primary`, `--bg-card`, `--accent-emerald`, etc.).
   - Modern typography using Google's **Outfit** (headings) & **Plus Jakarta Sans** (body).
   - Glassmorphism surfaces (`backdrop-filter: blur(16px)`), customized scrollbars, and dietary indicators.
3. **Multi-Portal Role Switcher Bar (`RoleSwitcherBar.jsx`)**:
   - Allows 1-click toggling between:
     - 🛍️ **Customer View** (Search, menus, cart, checkout, live tracking)
     - 🛠️ **Admin Console** (Live kitchen orders, in-stock dish toggles)
     - 🛵 **Delivery Partner** (Online/offline toggle, GPS route map, OTP verification)
4. **Global Context State (`AppContext.jsx`)**:
   - Unified reactive state sharing data seamlessly between all three roles.
5. **Interactive Map Integration (`MapView.jsx`)**:
   - Zero-cost, zero-API-key map routing using **Leaflet** and **OpenStreetMap**.
   - Custom SVG map pins for Restaurant (Pickup), Customer (Drop-off), and Delivery Rider (live route).
6. **4-Digit Delivery OTP Handoff Flow**:
   - Generated on checkout, displayed on customer tracking, verified in rider panel before completing trip.

---

## 2. React Concepts Learned

### A. The Context API (`createContext` + Provider Pattern)
**The Problem (Prop Drilling)**:
Without Context, if the `Navbar` needs to show `cartCount` and `CheckoutView` needs to show `cartTotal`, we would have to pass state down through 5 levels of components (`App` $\to$ `Layout` $\to$ `Navbar` $\to$ ...).

**The Solution**:
```jsx
// 1. Create Context
const AppContext = createContext();

// 2. Wrap app with Provider and provide values
export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (item) => { ... };

  return (
    <AppContext.Provider value={{ cart, addToCart }}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
export const useApp = () => useContext(AppContext);
```
Now *any* component in our app can simply do:
```jsx
const { cart, addToCart } = useApp();
```

---

### B. `useMemo` for Filtering & Sorting
In `CustomerView.jsx`, we filter restaurants by category, search text, and sorting criteria:
```jsx
const filteredRestaurants = useMemo(() => {
  return restaurants.filter(r => ...).sort(...);
}, [restaurants, searchQuery, selectedCategory, sortBy]);
```
**Why `useMemo`?**
Without `useMemo`, this filtering logic would run on *every single re-render* (e.g. when typing in another unrelated input). `useMemo` caches the result and only recomputes when one of its dependencies changes!

---

### C. The 3-Portal Multi-Role State Coordination
Look at how actions in one panel instantly update another:
1. In **Customer View**: You place an order $\to$ an order is created with status `PLACED` and a random 4-digit OTP (e.g. `7421`).
2. Switch to **Admin Console**: You see the incoming order! Click **"Accept & Cook"** $\to$ status moves to `PREPARING`. Then click **"Ready for Pickup"**.
3. Switch to **Delivery Partner**: The order appears under **"Orders Ready for Pickup"**! Click **"Accept Delivery & Start GPS"**.
4. The **Interactive Leaflet Route Map** loads showing the route to the customer!
5. In **Delivery Partner**, enter the OTP (`7421`) and click **"Verify OTP & Complete Delivery"**:
   - The rider's earnings increase!
   - Switch back to **Customer View** $\to$ Tracking page says: *"OTP Successfully Verified! Bon Appétit!"*

---

## 3. How to Run & View Locally
The Vite dev server is running live at:
👉 **`http://localhost:5173/`**

Open this link in your browser to test all three portals!
