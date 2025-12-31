import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { fetchOrderById } from "../../api/order.api"; 

const ActiveOrderFloating = () => {
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState(null);
 
  const orderId = localStorage.getItem("lastOrderId");

  useEffect(() => {
    if (!orderId) return;

    checkStatus();

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const checkStatus = async () => {
    try {
      const { data } = await fetchOrderById(orderId);
      
      const status = data.orderStatus;

      if (status === "Completed" || status === "Cancelled") {
        setActiveOrder(null);
        localStorage.removeItem("lastOrderId"); 
      } else {
        setActiveOrder(data);
      }

    } catch (error) {
      console.error("Floating Status Error", error);
      
      if (error.response && error.response.status === 404) {
        localStorage.removeItem("lastOrderId");
        setActiveOrder(null);
      }
    }
  };

  if (!activeOrder) return null;

  return (
    <div 
      onClick={() => navigate("/track-order", { state: { orderId: activeOrder._id } })}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 cursor-pointer"
    >
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-700 flex items-center justify-between hover:scale-105 transition-transform">
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute top-0 right-0"></div>
            <Loader2 className="animate-spin text-green-400" size={24} />
          </div>
          
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Order</p>
            <p className="font-bold text-sm flex items-center gap-2">
              Status: <span className="text-green-400">{activeOrder.orderStatus}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg">
          Track <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default ActiveOrderFloating;