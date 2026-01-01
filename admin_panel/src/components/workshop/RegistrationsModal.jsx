import React, { useEffect, useState } from "react";
import { X, Loader2, User, Mail, Phone, Ticket, Search } from "lucide-react";
import { getRegistrations } from "../../api/Workshop";

const RegistrationsModal = ({ workshopId, workshopTitle, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, [workshopId]);

  const fetchData = async () => {
    try {
      const { data } = await getRegistrations(workshopId);
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter functionality
  const filteredData = registrations.filter(
    (reg) =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Registrations</h2>
            <p className="text-sm text-gray-500">
              For: <span className="font-semibold text-blue-600">{workshopTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-gray-50 flex justify-between items-center border-b border-gray-100">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm font-bold text-gray-600">
            Total Tickets: {registrations.reduce((acc, curr) => acc + curr.tickets, 0)}
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto p-0">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p>Loading participants...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">Participant</th>
                  <th className="p-4 font-bold">Contact Info</th>
                  <th className="p-4 font-bold">Tickets</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredData.map((reg, index) => (
                  <tr key={reg._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-gray-400 font-mono">{index + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <User size={14} />
                        </div>
                        {reg.name}
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <Mail size={12} /> {reg.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <Phone size={12} /> {reg.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                        <Ticket size={12} /> {reg.tickets}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      ₹{reg.totalAmount}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <User size={48} className="mb-4 opacity-20" />
              <p>No registrations found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationsModal;