import React, { useState, useEffect, useLayoutEffect } from 'react' 
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom' 
import { AnimatePresence } from 'framer-motion' 
import { CartProvider } from './context/CartContext' 
import ScrollToTop from './components/common/ScrollToTop' 
import SmoothScroll from './components/common/SmoothScroll'
import ActiveOrderFloating from "./components/common/ActiveOrderFloating";
import AIFloatingButton from "./components/common/AIFloatingButton";
import Preloader from './components/common/Preloader'; 
import PageTransition from './components/common/PageTransition'; 

// Pages
import Home from './pages/Home'
import FullMenu from './pages/FullMenu'
import ItemDetail from './pages/ItemDetail'
import ArtDetail from './pages/ArtDetail'
import FullGallery from './pages/FullGallery'
import FullShop from './pages/FullShop'
import ShopItemDetail from './pages/ShopItemDetail'
import FullFAQ from './pages/FullFAQ'
import FullFranchise from './pages/FullFranchise'
import FranchiseEnquiry from './pages/FranchiseEnquiry'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Workshops from './pages/Workshops' 
import WorkshopRegistration from './pages/WorkshopRegistration' 
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from "./pages/TrackOrder";

// --- NEW COMPONENT: Handles Loading on Route Change ---
const NavigationLoader = ({ setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Trigger Loading
    setIsLoading(true);

    // 2. Wait and then hide loading (simulating page load)
    // You can adjust the time (e.g., 2000ms) to be faster or slower
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]); // Runs whenever path changes

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><FullGallery /></PageTransition>} />
        <Route path="/art" element={<PageTransition><FullGallery /></PageTransition>} />
        <Route path="/art/:slug" element={<PageTransition><ArtDetail /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><FullMenu /></PageTransition>} />
        <Route path="/menu/:id" element={<PageTransition><ItemDetail /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><FullShop /></PageTransition>} />
        <Route path="/shop/:slug" element={<PageTransition><ShopItemDetail /></PageTransition>} />
        <Route path="/faqs" element={<PageTransition><FullFAQ /></PageTransition>} />
        <Route path="/franchise" element={<PageTransition><FullFranchise /></PageTransition>} />
        <Route path="/franchise/enquiry" element={<PageTransition><FranchiseEnquiry /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><TrackOrder /></PageTransition>} />
        <Route path="/workshops" element={<PageTransition><Workshops /></PageTransition>} />
        <Route path="/workshops/register/:id" element={<PageTransition><WorkshopRegistration /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initial Setup (Theme, etc.)
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <CartProvider> 
      <BrowserRouter>
        {/* NavigationLoader sits here to listen to route changes */}
        <NavigationLoader setIsLoading={setIsLoading} />

        {/* LOGIC: 
           If isLoading is true, show Preloader.
           Otherwise, show the main App.
        */}
        {isLoading ? (
          <Preloader />
        ) : (
          <SmoothScroll>
            <ScrollToTop /> 
            <ActiveOrderFloating />
            <AIFloatingButton />
            <AnimatedRoutes />
          </SmoothScroll>
        )}
      </BrowserRouter>
    </CartProvider>
  )
}

export default App