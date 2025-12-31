import React, { useState } from "react";
import { Loader2, AlertCircle, Lock, Info } from "lucide-react";

const UpdateStatusForm = ({ order, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.orderStatus);
  
  const isLocked = order.orderStatus === "Completed" || order.orderStatus === "Cancelled";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return; 

    setLoading(true);

    let newPaymentStatus = order.paymentStatus; 

    if (order.paymentMethod === 'offline' && status === 'Completed') {
      newPaymentStatus = 'paid';
    }

    await onUpdate(order._id, { 
      status: status, 
      paymentStatus: newPaymentStatus 
    });
    
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-6">
      
      {/* Header with Lock Icon */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Update Status</h2>
        {isLocked && (
          <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
            <Lock size={12} /> LOCKED
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Order Status Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Order Status:</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLocked} 
            className={`w-full p-3 border rounded-md text-sm outline-none transition-colors ${
              isLocked ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 border-gray-300 focus:border-blue-500"
            }`}
          >
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Payment Status:</label>
          <div className={`p-3 rounded-md text-sm font-bold border flex justify-between items-center ${
            order.paymentStatus === 'paid' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}>
            <span className="uppercase">{order.paymentStatus}</span>
            <span className="text-xs font-normal text-gray-500">
              ({order.paymentMethod})
            </span>
          </div>
        </div>

        {!isLocked && status === "Cancelled" && order.paymentStatus === "paid" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
            <p className="font-bold flex items-center gap-1 mb-1">
              <AlertCircle size={14} /> Refund Required!
            </p>
            This will NOT refund money automatically. Please refund manually from Razorpay Dashboard.
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600 space-y-2">
           <div className="flex justify-between items-center">
             <span className="font-bold">Order ID:</span> 
             <span className="font-mono bg-white px-1 rounded border">
                {order.razorpayOrderId || "Not Generated"}
             </span>
           </div>
           
           <div className="pt-2 border-t border-gray-200">
             <span className="font-bold block mb-1">Special Request:</span> 
             <p className="italic text-gray-500">{order.specialRequest || "None"}</p>
           </div>
        </div>

        {/* Submit Button */}
        {!isLocked && (
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 size={18} className="animate-spin"/> : "Save Changes"}
          </button>
        )}
        
        {isLocked && (
          <div className="text-center text-xs text-gray-400 italic">
            This order is completed/cancelled and cannot be edited.
          </div>
        )}

      </form>
    </div>
  );
};

export default UpdateStatusForm;