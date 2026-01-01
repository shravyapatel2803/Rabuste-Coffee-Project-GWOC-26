// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom' 
import { AnimatePresence } from 'framer-motion' 
import { CartProvider } from './context/CartContext' 
import ScrollToTop from './components/common/ScrollToTop' 
import SmoothScroll from './components/common/SmoothScroll'
import ActiveOrderFloating from "./components/common/ActiveOrderFloating";
import AIFloatingButton from "./components/common/AIFloatingButton";

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
import BookTable from './pages/BookTable'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Workshops from './pages/Workshops' // Added Workshop Import
import WorkshopRegistration from './pages/WorkshopRegistration' // Added Registration Import
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from "./pages/TrackOrder";

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<FullGallery />} />
        <Route path="/art" element={<FullGallery />} />
        <Route path="/art/:slug" element={<ArtDetail />} />
        <Route path="/menu" element={<FullMenu />} />
        <Route path="/menu/:id" element={<ItemDetail />} />
        <Route path="/shop" element={<FullShop />} />
        <Route path="/shop/:slug" element={<ShopItemDetail />} />
        <Route path="/faqs" element={<FullFAQ />} />
        <Route path="/franchise" element={<FullFranchise />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />
        
        {/* New Routes */}
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/workshops/register/:id" element={<WorkshopRegistration />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
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
      <SmoothScroll>
        <ScrollToTop /> 
        <ActiveOrderFloating />
        <AIFloatingButton />
        <AnimatedRoutes />
      </SmoothScroll>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App