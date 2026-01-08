import { useEffect, useState } from 'react';
import { Coffee, Palette, Calendar, Users, ShoppingBag, Plus, UserPlus, X, Loader2, Settings, Lock } from 'lucide-react';

import { fetchAdminItems } from '../api/Items';
import { fetchAdminArts } from '../api/Arts';
import { getAllWorkshops } from '../api/Workshop';
import { getFranchiseEnquiries } from '../api/Franchise';
import { fetchAdminOrders } from '../api/Order';
import { getMe, createAdmin, changePasswordAPI } from '../api/auth'; 

const StatCard = ({ title, count, icon: Icon, colorClass }) => (
  <div className="bg-rabuste-surface border border-rabuste-text/5 p-6 rounded-lg shadow-sm hover:border-rabuste-gold/30 transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-rabuste-muted text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-rabuste-gold transition-colors">{title}</p>
        <h3 className="text-4xl font-serif text-rabuste-text">{count}</h3>
      </div>
      <div className={`p-3 rounded-full bg-rabuste-bg ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [counts, setCounts] = useState({ menu: 0, art: 0, workshops: 0, franchise: 0, orders: 0 });
  const [adminName, setAdminName] = useState("Admin");
  
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMe().then(res => {
        if(res.data?.success) setAdminName(res.data.data.name);
    }).catch(err => console.error("Failed to fetch admin info"));

    const fetchData = async () => {
      try {
        const [menuRes, artRes, workRes, franRes, orderRes] = await Promise.allSettled([
          fetchAdminItems(),
          fetchAdminArts(),
          getAllWorkshops(),
          getFranchiseEnquiries(),
          fetchAdminOrders()
        ]);
        
        const getCount = (res) => {
            if (res.status === 'fulfilled') {
              const data = res.value.data;

              if (Array.isArray(data)) return data.length;

              if (data?.data && Array.isArray(data.data)) return data.data.length;

              if (data?.items && Array.isArray(data.items)) return data.items.length;

              return 0;
            }
            return 0;
        };

        setCounts({
          menu: getCount(menuRes),
          art: getCount(artRes),
          workshops: getCount(workRes),
          franchise: getCount(franRes),
          orders: getCount(orderRes)
        });
      } catch (error) { console.error("Error fetching stats", error); }
    };
    fetchData();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await createAdmin(newAdmin);
        alert(`Admin ${newAdmin.name} created successfully!`);
        setShowAddAdminModal(false);
        setNewAdmin({ name: '', email: '', password: '' });
    } catch (error) {
        alert(error.response?.data?.message || "Failed to create admin");
    } finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert("New Password and Confirm Password do not match!");
      return;
    }
    setLoading(true);
    try {
      await changePasswordAPI({
        currentPassword: passData.current,
        newPassword: passData.new
      });
      alert("Password Changed Successfully! Please login again with new password.");
      setShowPasswordModal(false);
      setPassData({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-rabuste-text">Dashboard Overview</h1>
          <p className="text-rabuste-muted text-sm mt-1">
            Welcome back, <span className="text-rabuste-gold font-bold">{adminName}</span>
          </p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => setShowPasswordModal(true)}
                className="bg-rabuste-surface border border-rabuste-text/10 hover:border-rabuste-gold text-rabuste-text px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
            >
            <Settings size={16} /> Security
            </button>

            <button 
                onClick={() => setShowAddAdminModal(true)}
                className="bg-rabuste-gold text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:bg-rabuste-orange"
            >
            <UserPlus size={16} /> Add Admin
            </button>
        </div>
      </div>
      
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Orders" count={counts.orders} icon={ShoppingBag} colorClass="text-orange-500" />
        <StatCard title="Menu Items" count={counts.menu} icon={Coffee} colorClass="text-rabuste-gold" />
        <StatCard title="Artworks" count={counts.art} icon={Palette} colorClass="text-purple-400" />
        <StatCard title="Workshops" count={counts.workshops} icon={Calendar} colorClass="text-blue-400" />
        <StatCard title="Enquiries" count={counts.franchise} icon={Users} colorClass="text-green-400" />
      </div>

      <div className="mt-8 bg-rabuste-surface border border-rabuste-text/5 rounded-lg p-6">
        <h3 className="text-lg font-bold text-rabuste-text mb-4">Quick Tips</h3>
        <p className="text-rabuste-muted text-sm">
          Keep your password secure. Use the "Security" button to update your credentials periodically.
        </p>
      </div>

      {/* --- ADD ADMIN MODAL --- */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-rabuste-surface border border-rabuste-text/10 rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => setShowAddAdminModal(false)} className="absolute top-4 right-4 text-rabuste-muted hover:text-rabuste-text"><X size={20} /></button>
                <h2 className="text-xl font-serif font-bold text-rabuste-text mb-6 flex items-center gap-2"><UserPlus className="text-rabuste-gold" size={24} /> Add New Admin</h2>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-rabuste-muted block mb-1">Name</label>
                        <input required type="text" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 rounded text-rabuste-text focus:border-rabuste-gold outline-none" placeholder="Full Name" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-rabuste-muted block mb-1">Email</label>
                        <input required type="email" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 rounded text-rabuste-text focus:border-rabuste-gold outline-none" placeholder="admin@example.com" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-rabuste-muted block mb-1">Password</label>
                        <input required type="password" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 rounded text-rabuste-text focus:border-rabuste-gold outline-none" placeholder="••••••" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-rabuste-gold text-white font-bold py-3 rounded uppercase tracking-widest text-xs hover:bg-rabuste-orange transition-colors flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Admin"}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-rabuste-surface border border-rabuste-text/10 rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-rabuste-muted hover:text-rabuste-text"><X size={20} /></button>
                <h2 className="text-xl font-serif font-bold text-rabuste-text mb-6 flex items-center gap-2"><Lock className="text-rabuste-gold" size={24} /> Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-rabuste-muted block mb-1">Current Password</label>
                        <input required type="password" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 rounded text-rabuste-text focus:border-rabuste-gold outline-none" placeholder="Old Password" value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-rabuste-muted block mb-1">New Password</label>
                        <input required type="password" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 rounded text-rabuste-text focus:border-rabuste-gold outline-none" placeholder="New Password" value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold text-rabuste-muted block mb-1">Confirm New Password</label>
                        <input required type="password" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 rounded text-rabuste-text focus:border-rabuste-gold outline-none" placeholder="Retype New Password" value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-rabuste-gold text-white font-bold py-3 rounded uppercase tracking-widest text-xs hover:bg-rabuste-orange transition-colors flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;