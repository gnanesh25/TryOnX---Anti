import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Layout
import StorefrontLayout from '@/components/layout/StorefrontLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Pages — lazy loaded
const HomePage = lazy(() => import('@/pages/HomePage'))
const ShopPage = lazy(() => import('@/pages/ShopPage'))
const CollectionPage = lazy(() => import('@/pages/CollectionPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const TryOnPage = lazy(() => import('@/pages/TryOnPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'))
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const ShippingPolicyPage = lazy(() => import('@/pages/policies/ShippingPolicyPage'))
const ReturnsPolicyPage = lazy(() => import('@/pages/policies/ReturnsPolicyPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/policies/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/pages/policies/TermsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Admin pages
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminProductNew = lazy(() => import('@/pages/admin/AdminProductNew'))
const AdminProductEdit = lazy(() => import('@/pages/admin/AdminProductEdit'))
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminOrderDetail = lazy(() => import('@/pages/admin/AdminOrderDetail'))
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))

// Auth guard
import { AdminRoute } from '@/components/auth/AdminRoute'

// Loading fallback
import { PageSkeleton } from '@/components/ui/Skeletons'

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Customer storefront */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/try-on" element={<TryOnPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminProductNew />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
