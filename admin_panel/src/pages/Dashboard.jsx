import { useEffect, useState } from 'react';
import api from '../api/api';
import { Coffee, Palette, Calendar, Users, TrendingUp } from 'lucide-react';

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
  const [counts, setCounts] = useState({ menu: 0, art: 0, workshops: 0, franchise: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, artRes, workRes, franRes] = await Promise.allSettled([
          api.get('/admin/items'),
          api.get('/art'),
          api.get('/workshops'),
          api.get('/franchise')
        ]);
        setCounts({
          menu: menuRes.status === 'fulfilled' ? menuRes.value.data.length : 0,
          art: artRes.status === 'fulfilled' ? artRes.value.data.length : 0,
          workshops: workRes.status === 'fulfilled' ? workRes.value.data.length : 0,
          franchise: franRes.status === 'fulfilled' ? franRes.value.data.length : 0,
        });
      } catch (error) { console.error("Error fetching stats", error); }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-rabuste-text">Dashboard Overview</h1>
          <p className="text-rabuste-muted text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div className="bg-rabuste-surface px-4 py-2 rounded border border-rabuste-text/5 text-rabuste-text text-sm font-bold flex items-center gap-2">
          <TrendingUp size={16} className="text-green-500" /> System Active
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Menu Items" count={counts.menu} icon={Coffee} colorClass="text-rabuste-gold" />
        <StatCard title="Artworks" count={counts.art} icon={Palette} colorClass="text-purple-400" />
        <StatCard title="Workshops" count={counts.workshops} icon={Calendar} colorClass="text-blue-400" />
        <StatCard title="Enquiries" count={counts.franchise} icon={Users} colorClass="text-green-400" />
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="mt-8 bg-rabuste-surface border border-rabuste-text/5 rounded-lg p-6">
        <h3 className="text-lg font-bold text-rabuste-text mb-4">Quick Tips</h3>
        <p className="text-rabuste-muted text-sm">
          Use the sidebar to manage your content. Remember to keep the "Featured" items updated for the best customer experience.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;