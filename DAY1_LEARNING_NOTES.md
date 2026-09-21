# 🎓 Day 1 Learning Guide: System Architecture & Database Design

Welcome to **Day 1** of building our Full-Stack Food Delivery Platform! Before writing frontend or backend code, understanding the **system architecture and data model** is the most crucial skill in software engineering.

---

## 1. Why start with Database Schema Design?
In full-stack engineering, **data is the foundation**:
- Your **React frontend** displays data shaped by this schema (e.g. restaurant cards, menu items, cart items, order status).
- Your **Spring Boot backend** enforces business logic around this schema (e.g. only delivery partners can accept an order, OTP verification checks).
- If the schema is flawed or missing critical fields (like coordinates for maps or an OTP field), refactoring code later becomes painful and messy.

---

## 2. The 3 Portals & Database Entity Mapping

Our platform serves three distinct user personas:

| Portal | Persona | Primary Database Interactions |
|---|---|---|
| 🛍️ **Customer Portal** | Shopper / Foodie | Reads `restaurants` & `menu_items`; Creates `orders` & `order_items`; Reads `orders` tracking info and sees `delivery_otp`. |
| 🛠️ **Admin Dashboard** | Platform Manager / Store Owner | Full CRUD on `restaurants`, `categories`, and `menu_items`; Monitors all `orders`; Advances cooking status to `PREPARING` or `READY_FOR_PICKUP`. |
| 🛵 **Delivery Partner Panel** | Delivery Rider | Toggles `delivery_partners.status` (ONLINE/OFFLINE); Reads orders where `status = 'READY_FOR_PICKUP'`; Takes orders; Enters `delivery_otp` to complete delivery. |

---

## 3. Deep Dive into Key Engineering Decisions

### A. Why do we have `order_items.unit_price` when `menu_items` already has `price`?
**The "Price Snapshot" Problem**:
Imagine a Burger costs **$5.00** today. A customer orders 2 burgers ($10.00 total). Next week, the restaurant increases the burger price to **$7.00**.
- If we didn't store `unit_price` inside `order_items`, calculating past order receipts would dynamically change past orders from $10 to $14!
- **Rule of Thumb**: Historical order records must be immutable snapshots of what was purchased and at what price at that exact second.

### B. The Delivery OTP Lifecycle
1. **Creation**: When a customer places an order, the backend (or client mock) generates a random 4-digit numeric code (e.g., `Math.floor(1000 + Math.random() * 9000)` $\to$ `"6842"`).
2. **Storage**: Saved in `orders.delivery_otp`. `otp_verified` is initially `false`.
3. **Display**: Displayed prominently to the **Customer** on their tracking screen with a safety badge.
4. **Verification**: When the **Delivery Partner** reaches the customer's address, the partner asks for the code, types it into the Delivery Panel, and submits.
5. **Completion**: The backend checks: `if (inputOtp === order.delivery_otp)`:
   - `order.status = 'DELIVERED'`
   - `order.otp_verified = true`
   - Delivery partner's `total_earnings` increases!

### C. Geospatial Coordinates for Map Routing
Both `restaurants` and `addresses` have `latitude` and `longitude`:
- In Day 5 & Day 7, we will feed these coordinates directly into **Leaflet** (`[lat, lng]`).
- Leaflet will draw custom map pins:
  - 🏬 **Restaurant Icon** at `[restaurant.latitude, restaurant.longitude]`
  - 🏠 **Customer Home Icon** at `[address.latitude, address.longitude]`
  - 🛵 **Delivery Rider Icon** moving smoothly along the route line!

---

## 4. The Order State Machine

An order moves strictly through these states:

```
[PLACED] ────────► [PREPARING] ────────► [READY_FOR_PICKUP] ────────► [OUT_FOR_DELIVERY] ────────► [DELIVERED]
 (Customer         (Admin / Kitchen         (Admin / Kitchen           (Delivery Partner            (Delivery Partner
  Checkouts)        Accepts Order)           Packages Food)             Picks Up Order)              Verifies OTP)
```

- If an order is cancelled before kitchen starts: `[CANCELLED]`.

---

## 5. What's Next? (Day 2 Preview)

Tomorrow in **Day 2**, we will:
1. Set up the **React project using Vite** in our workspace.
2. Build our modern CSS design tokens (typography, color palettes, sleek dark/glassmorphic accents, responsive grid).
3. Set up the **Navigation Bar** with a smooth **Role Switcher** at the top so you can toggle between the **Customer App**, **Admin Dashboard**, and **Delivery Partner Panel** with a single click!
