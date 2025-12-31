import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Coffee, Palette, Calendar, Users, LogOut, X, ClipboardList } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    
    { path: '/pre-orders', label: 'Pre-Orders', icon: <ClipboardList size={20} /> },
    
    { path: '/menu', label: 'Menu Items', icon: <Coffee size={20} /> },
    { path: '/arts', label: 'Art Gallery', icon: <Palette size={20} /> },
    { path: '/workshops', label: 'Workshops', icon: <Calendar size={20} /> },
    { path: '/franchise', label: 'Enquiries', icon: <Users size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-30 w-64 bg-rabuste-surface border-r border-rabuste-text/5 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 border-b border-rabuste-text/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-rabuste-gold tracking-widest uppercase">
              Rabuste
            </h2>
            <p className="text-xs text-rabuste-muted mt-1 tracking-widest uppercase">Admin Portal</p>
          </div>
          {/* Close Button for Mobile */}
          <button onClick={toggleSidebar} className="md:hidden text-rabuste-text">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 768 && toggleSidebar()} // Close on click (mobile)
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 group ${
                  isActive 
                    ? 'bg-rabuste-orange text-white shadow-lg shadow-orange-900/20' 
                    : 'text-rabuste-muted hover:bg-rabuste-bg hover:text-rabuste-gold'
                }`}
              >
                <span className={isActive ? 'text-white' : 'group-hover:text-rabuste-gold'}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-rabuste-text/5">
          <button 
            onClick={logout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-rabuste-muted hover:text-red-500 hover:bg-red-500/5 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold tracking-wide uppercase">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;