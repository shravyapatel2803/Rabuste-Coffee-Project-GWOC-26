import { useState, useEffect } from 'react';
import api from '../api/api';
import { Mail, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

const Franchise = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/franchise');
      setEnquiries(res.data);
    } catch(e) { 
      console.error("Error fetching enquiries"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const markContacted = async (id) => {
    try {
      await api.put(`/franchise/${id}`, { status: 'Contacted' });
      fetchEnquiries();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-rabuste-text mb-8">Franchise Enquiries</h1>
      
      <div className="bg-rabuste-surface border border-rabuste-text/5 rounded-lg shadow-sm overflow-hidden">
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-rabuste-bg border-b border-rabuste-text/5">
              <tr>
                <th className="p-4 text-xs font-bold text-rabuste-muted uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-rabuste-muted uppercase tracking-wider">Contact Info</th>
                <th className="p-4 text-xs font-bold text-rabuste-muted uppercase tracking-wider">City</th>
                <th className="p-4 text-xs font-bold text-rabuste-muted uppercase tracking-wider w-1/3">Message</th>
                <th className="p-4 text-xs font-bold text-rabuste-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-rabuste-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rabuste-text/5">
              {enquiries.map(enq => (
                <tr key={enq._id} className="hover:bg-rabuste-bg/50 transition-colors">
                  <td className="p-4 text-rabuste-text font-bold whitespace-nowrap">{enq.name}</td>
                  <td className="p-4 text-rabuste-text text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={14} className="text-rabuste-muted" /> {enq.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-rabuste-muted" /> {enq.phone}
                    </div>
                  </td>
                  <td className="p-4 text-rabuste-text text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-rabuste-muted" /> {enq.city}
                    </div>
                  </td>
                  <td className="p-4 text-rabuste-muted text-sm">
                    <p className="line-clamp-2" title={enq.message}>{enq.message}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border ${
                      enq.status === 'Contacted' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {enq.status === 'Contacted' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {enq.status === 'Pending' && (
                      <button 
                        onClick={() => markContacted(enq._id)}
                        className="text-xs bg-rabuste-gold hover:bg-rabuste-orange text-white px-3 py-1.5 rounded transition-colors whitespace-nowrap shadow-sm"
                      >
                        Mark Contacted
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && enquiries.length === 0 && (
          <div className="p-12 text-center text-rabuste-muted">
            <p>No enquiries received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Franchise;