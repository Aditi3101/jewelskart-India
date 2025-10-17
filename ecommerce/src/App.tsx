import "./App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopNavBar from "./components/TopNavBar";
import Banner from "./components/Banner";
import HomeCarousel from "./components/HomeCarousel";
import Footer from "./components/Footer";
import ByCollection from "./components/ByCollection";
import ByCategory from "./components/ByCategory";
// import Bags from "./components/Bags";
import Contact from "./components/Contact";
import Offers from "./components/Offers";
import WishList from "./components/WishList";
import Cart from "./components/Cart";
import ProductPage from "./components/ProductPage";
import ProductsByType from "./components/ProductsByType";

import SearchResults from "./components/SearchResults";
import OrderSummary from "./components/OrderSummary";
import UserAccount from "./components/UserAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartWishlistProvider } from "./contexts/CartWishlistContext";
import ResponsiveNavBarWrapper from "./components/esponsiveNavBarWrapper";
import OrderPlaced from "./components/OrderPlaced";
import OrderHistory from "./components/OrderHistory";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import HeroSection from "./components/HeroSection";
import ReviewSection from "./components/ReviewSection";
import OurStory from "./components/OurStory";

import SEOTypeWrapper from "./components/SEOTypeWrapper";
import SEOCategoryWrapper from "./components/SEOCategoryWrapper";
import SEOProductWrapper from "./components/SEOProductWrapper";
import SEOTest from "./components/SEOTest";
import CategoryDebug from "./components/CategoryDebug";
import ProductDebug from "./components/ProductDebug";

const HomePage: React.FC = () => {
  return (
    <>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      <HeroSection />
      <Banner />
      <HomeCarousel />
      <ReviewSection />
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <CartWishlistProvider>
      <Router>
        <Routes>
          {/* Homepage layout route */}
          <Route path="/" element={<HomePage />} />

          {/* Other routes */}
          <Route path="/by-collection" element={<ByCollection />} />
          <Route path="/by-category" element={<ByCategory />} />
          {/* <Route path="/bags" element={<Bags />} /> */}
          <Route path="/reachus" element={<Contact />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<OurStory />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/cart" element={<Cart />} />
          {/* SEO-friendly routes (more specific, should come first) */}
          <Route path="/type/:nameOrId" element={<SEOTypeWrapper />} />
          <Route path="/products/category/:nameOrId" element={<SEOCategoryWrapper />} />
          <Route path="/product/:nameOrId" element={<SEOProductWrapper />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/products/:category" element={<ProductPage />} />
          <Route path="/products/type/:typeId" element={<ProductsByType />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/search/:searchTerm" element={<SearchResults />} />
          <Route path="/ordersummary" element={<OrderSummary />} />
          <Route path="/order-placed" element={<OrderPlaced />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserAccount />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/seo-test" element={<SEOTest />} />
          <Route path="/category-debug" element={<CategoryDebug />} />
          <Route path="/product-debug" element={<ProductDebug />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={2000} />
      </Router>
    </CartWishlistProvider>
  );
};

export default App;
