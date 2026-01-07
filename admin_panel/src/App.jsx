import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu as MenuIcon } from 'lucide-react';

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
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, layout = true }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return null;
  
  if (!isAdmin) return <Navigate to="/login" />;

  return layout ? <Layout>{children}</Layout> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
 
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pre-orders" element={<ProtectedRoute><PreOrders /></ProtectedRoute>} />

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
          
          {/* FIXED: Wrapped in ProtectedRoute to show Sidebar */}
          <Route path="/ai-control" element={<ProtectedRoute><AIManagement /></ProtectedRoute>} />
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;