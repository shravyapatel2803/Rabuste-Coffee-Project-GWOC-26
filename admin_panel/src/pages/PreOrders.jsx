import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { ClipboardList, IndianRupee, CheckCircle2, Filter, Loader2, CheckSquare } from "lucide-react"; 
import StatCard from "../components/preorder/StatCard";
import Filters from "../components/preorder/Filters";
import { fetchAdminOrders } from "../api/Order"; 

const PreOrders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]); 
  
  const initialFilters = {
    timeFilter: "Today",
    status: "All",
    paymentStatus: "All",
    date: "",
    search: ""
  };

  const [filters, setFilters] = useState(initialFilters);

  const loadOrders = async () => {
    setLoading(true);
    try { 
      const { data } = await fetchAdminOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300); 
    return () => clearTimeout(timer);
  }, [filters]); 

  const handleClear = () => {
    setFilters(initialFilters);
  };
  
  // Stats Calculation
  const stats = {
    total: orders.length,
    revenue: orders.reduce((sum, o) => {
      if (o.paymentStatus === "paid" && o.orderStatus === "Completed") {
        return sum + o.totalAmount;
      }
      return sum;
    }, 0),
    ready: orders.filter(o => o.orderStatus === "Ready").length,
    completed: orders.filter(o => o.orderStatus === "Completed").length,
  };
 
  const getPaymentBadge = (status) => {
    const isPaid = status === 'paid';
    const style = isPaid 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
    return <span className={`px-3 py-1 rounded-md text-xs font-bold border ${style}`}>{isPaid ? "PAID" : "PENDING"}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Pre-Orders Management</h1>
        
        {/* Time Filter */}
        <div className="relative">
          <select
            value={filters.timeFilter}
            onChange={(e) => setFilters(prev => ({ ...prev, timeFilter: e.target.value }))}
            className="appearance-none bg-white border border-gray-300 text-gray-700 font-bold py-2.5 pl-4 pr-10 rounded-lg shadow-sm cursor-pointer hover:border-blue-500 transition-colors"
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last Week">Last Week</option>
            <option value="Total">Total (All Time)</option>
          </select>
          <Filter className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ClipboardList} label="Total Orders" value={stats.total} colorClass="bg-blue-600" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats.revenue}`} colorClass="bg-emerald-500" />
        <StatCard icon={CheckCircle2} label="Ready to Pickup" value={stats.ready} colorClass="bg-orange-500" />
        <StatCard icon={CheckSquare} label="Completed" value={stats.completed} colorClass="bg-purple-600" />
      </div>
 
      {/* Filters */}
      <Filters 
        filters={filters} 
        setFilters={setFilters} 
        onClear={handleClear} 
      />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center flex justify-center text-gray-500 gap-2 items-center">
            <Loader2 className="animate-spin" /> Fetching Orders...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Pickup Time</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Payment</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr 
                      key={order._id} 
                      className={`hover:bg-gray-50 transition-colors ${!order.isViewed ? "bg-blue-50/50" : ""}`}
                    >
                      {/* Order ID Column */}
                      <td className="p-4 relative">
                        {!order.isViewed && (
                          <span className="absolute top-2 left-4 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                            NEW
                          </span>
                        )}
                        
                        <span className="font-bold text-blue-600">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4 font-medium">
                        {order.name}
                        <div className="text-xs text-gray-400 font-normal">{order.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{order.pickupTime}</div>
                        <span className="text-xs text-gray-400">{new Date(order.pickupDate).toLocaleDateString()}</span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                      <td className="p-4">{getPaymentBadge(order.paymentStatus)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                          ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700' : 
                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-50 text-blue-700'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => navigate(`/orders/${order._id}`)} 
                          className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-black hover:text-white transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ClipboardList size={40} className="mb-2 opacity-50"/>
                        <p>No orders found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreOrders;