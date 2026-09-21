import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { PortalAuthGate } from './components/auth/PortalAuthGate';

import { useApp } from './context/AppContext';

// Pages & Views
import { CustomerView } from './components/customer/CustomerView';
import { CustomerLandingView } from './components/landing/CustomerLandingView';
import { CartView } from './components/cart/CartView';
import { PlaceOrderView } from './components/checkout/PlaceOrderView';
import { MyOrdersView } from './components/orders/MyOrdersView';
import { AboutView } from './components/pages/AboutView';
import { ContactView } from './components/pages/ContactView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { DeliveryPartnerView } from './components/delivery/DeliveryPartnerView';

import { ScrollToTop } from './components/common/ScrollToTop';

// Route component gating between Guest Landing Page and Authenticated Customer Portal
const CustomerPortalRoute = () => {
  const { customerSession } = useApp();
  return customerSession ? <CustomerView /> : <CustomerLandingView />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <CartProvider>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Dynamic Navbar with Home, Orders, About, Contact, Cart, Profile */}
            <Navbar />

            {/* URL Routing */}
            <main style={{ minHeight: '80vh', flexGrow: 1 }}>
              <Routes>
                {/* 🛍️ Customer Portal Routes */}
                <Route path="/" element={<CustomerPortalRoute />} />
                <Route path="/user" element={<CustomerPortalRoute />} />
                <Route path="/cart" element={<CartView />} />
                <Route path="/checkout" element={<PlaceOrderView />} />
                <Route path="/my-orders" element={<MyOrdersView />} />

                {/* ℹ️ General Pages */}
                <Route path="/about" element={<AboutView />} />
                <Route path="/contact" element={<ContactView />} />

                {/* 🛠️ Admin Portal (URL: /admin, Password Protected) */}
                <Route
                  path="/admin"
                  element={
                    <PortalAuthGate portal="admin">
                      <AdminDashboardView />
                    </PortalAuthGate>
                  }
                />

                {/* 🛵 Delivery Partner Portal (URL: /delivery_partner, Password Protected) */}
                <Route
                  path="/delivery_partner"
                  element={
                    <PortalAuthGate portal="delivery">
                      <DeliveryPartnerView />
                    </PortalAuthGate>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Shared Footer */}
            <Footer />

            {/* Global Alerts & Auth Modal */}
            <Toast />
            <AuthModal />
          </div>
        </CartProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
