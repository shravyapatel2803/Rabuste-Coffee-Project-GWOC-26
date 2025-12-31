import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, ChefHat, Coffee, XCircle, ArrowLeft, Home } from "lucide-react";
import { fetchOrderById } from "../api/order.api"; 

const TrackOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId || localStorage.getItem("lastOrderId");
  
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Placed");

  useEffect(() => {
    if (!orderId) {
      navigate("/"); 
      return;
    }
    fetchStatus();
    
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval); 
  }, [orderId]);

  const fetchStatus = async () => {
    try {
      const { data } = await fetchOrderById(orderId);
      
      setOrder(data);
      setStatus(data.orderStatus);
    } catch (error) {
      console.error("Tracking Error", error);
    }
  };

  const steps = [
    { label: "Placed", icon: Clock },
    { label: "Confirmed", icon: CheckCircle },
    { label: "Preparing", icon: ChefHat },
    { label: "Ready", icon: Coffee },
    { label: "Completed", icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    if (status === "Cancelled") return -1;
    return steps.findIndex((s) => s.label === status);
  };

  const activeIndex = getCurrentStepIndex();

  if (!order) return <div className="h-screen flex items-center justify-center"><span className="animate-pulse">Loading Order...</span></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
      
      {/* TOP BAR WITH BACK BUTTON */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 pt-4">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button 
           onClick={() => navigate("/")}
           className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-200"
        >
          <Home size={18} />
        </button>
      </div>

      {/*  Header Card */}
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg border border-gray-100 text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Status</h1>
        <p className="text-gray-500 text-sm">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
        
        <div className={`mt-4 inline-block px-4 py-1 rounded-full font-bold text-sm uppercase ${status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
          {status}
        </div>
      </div>

      {/* LIVE TRACKER */}
      <div className="w-full max-w-md space-y-6 mb-20">
        
        {status === "Cancelled" ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center text-red-700">
            <XCircle size={48} className="mx-auto mb-2"/>
            <h2 className="text-xl font-bold">Order Cancelled</h2>
            <p className="text-sm mt-2">Please contact counter for refund.</p>
          </div>
        ) : (
          steps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const Icon = step.icon;

            return (
              <div key={step.label} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${isCurrent ? "bg-white shadow-md border-l-4 border-green-500 scale-105" : "opacity-60 grayscale"}`}>
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}>
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className={`font-bold text-lg ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                    {step.label}
                  </h3>
                  {isCurrent && <p className="text-xs text-green-600 animate-pulse font-medium">Processing...</p>}
                </div>

                {isCompleted && index < activeIndex && (
                  <CheckCircle size={20} className="ml-auto text-green-500" />
                )}
              </div>
            );
          })
        )}
      </div>

      {status === "Ready" && (
        <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-50">
           <div className="bg-green-600 text-white p-4 rounded-xl shadow-2xl w-full max-w-md text-center animate-bounce flex items-center justify-center gap-3">
             <Coffee size={24} />
             <div>
                <h3 className="font-bold text-lg">Order Ready!</h3>
                <p className="text-xs opacity-90">Please pickup from counter.</p>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default TrackOrder;