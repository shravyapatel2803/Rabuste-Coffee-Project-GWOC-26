import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu as MenuIcon, Loader2 } from 'lucide-react'; // Loader icon added

import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuPage from './pages/Menu'; 
import Arts from './pages/Arts';
import Workshops from './pages/Workshops';
import Franchise from './pages/Franchise';
import PreOrders from './pages/PreOrders';
import OrderDetails from './pages/OrderDetails';
import AIManagement from './pages/AIManagement';

// --- LAYOUT COMPONENT ---
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-rabuste-bg text-rabuste-text font-sans">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-rabuste-surface border-b border-rabuste-text/5 p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-rabuste-text">
            <MenuIcon size={24} />
          </button>
          <span className="font-serif font-bold text-lg text-rabuste-gold tracking-widest uppercase">Rabuste Admin</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, layout = true }) => {
  // 🔴 CHANGE 1: 'isAdmin' ki jagah 'admin' use karein (jo context me hai)
  const { admin, loading } = useAuth();
  
  // 🔴 CHANGE 2: Loading ke waqt blank screen ki jagah spinner dikhayein
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-rabuste-bg">
        <Loader2 className="animate-spin text-rabuste-gold" size={40} />
      </div>
    );
  }
  
  // Agar admin login nahi hai, to Login page par bhejein
  if (!admin) return <Navigate to="/login" replace />;

  return layout ? <Layout>{children}</Layout> : children;
};

// --- PUBLIC ROUTE (Prevent Login access if already logged in) ---
const PublicRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) return null; // Login page par loading dikhane ki zarurat nahi usually

  // Agar admin pehle se login hai, to Dashboard par bhejein
  if (admin) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* Public Route: Login */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
 
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pre-orders" element={<ProtectedRoute><PreOrders /></ProtectedRoute>} />

          {/* Note: Order Details me Layout=false hai. Agar sidebar chahiye to ise true kar dein */}
          <Route 
            path="/orders/:id" 
            element={
              <ProtectedRoute layout={false}> 
                <OrderDetails />
              </ProtectedRoute>
            } 
          />

          {/* OTHER PAGES (With Sidebar) */}
          <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
          <Route path="/arts" element={<ProtectedRoute><Arts /></ProtectedRoute>} />
          <Route path="/workshops" element={<ProtectedRoute><Workshops /></ProtectedRoute>} />
          <Route path="/franchise" element={<ProtectedRoute><Franchise /></ProtectedRoute>} />
          
          <Route path="/ai-control" element={<ProtectedRoute><AIManagement /></ProtectedRoute>} />
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;