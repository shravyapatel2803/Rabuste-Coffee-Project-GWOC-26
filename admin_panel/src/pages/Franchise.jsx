import { useState, useEffect } from 'react';
import { getFranchiseEnquiries, updateFranchiseStatus } from '../api/Franchise'; 
import { Mail, Phone, MapPin, CheckCircle, Clock, Loader2 } from 'lucide-react';

const Franchise = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await getFranchiseEnquiries();
      setEnquiries(res.data);
    } catch(e) { 
      console.error("Error fetching enquiries", e); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateFranchiseStatus(id, newStatus);
      setEnquiries(prev => prev.map(enq => 
        enq._id === id ? { ...enq, status: newStatus } : enq
      ));
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Franchise Enquiries</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Business Profile</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Message</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.map(enq => (
                <tr key={enq._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Personal Info */}
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{enq.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Mail size={12} /> {enq.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Phone size={12} /> {enq.phone}
                    </div>
                  </td>

                  {/* Business/Location Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={14} className="text-gray-400" /> 
                      {enq.city}, {enq.state}
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="block text-gray-500">Budget: <span className="font-medium text-gray-800">{enq.investmentRange}</span></span>
                      <span className="block text-gray-500">Exp: <span className="font-medium text-gray-800">{enq.experienceInBusiness ? 'Yes' : 'No'}</span></span>
                    </div>
                  </td>

                  {/* Message */}
                  <td className="p-4 text-gray-600 text-sm">
                    <p className="line-clamp-3" title={enq.message}>{enq.message}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                      enq.status === 'contacted' || enq.status === 'closed'
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {enq.status === 'contacted' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      <span className="uppercase">{enq.status}</span>
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="p-4">
                    {enq.status === 'new' && (
                      <button 
                        onClick={() => handleStatusUpdate(enq._id, 'contacted')}
                        className="text-xs bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors whitespace-nowrap shadow-sm font-medium"
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
        
        {enquiries.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <p>No new franchise enquiries.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Franchise;