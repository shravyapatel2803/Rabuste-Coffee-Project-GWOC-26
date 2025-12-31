import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { User, Phone, Mail, Calendar, Clock, Loader2, ArrowLeft } from "lucide-react"; 
import { fetchOrderById, updateOrderStatusApi } from "../api/Order";

// Components Imports
import StatusStepper from "../components/orderdetail/StatusStepper";
import OrderItemsTable from "../components/orderdetail/OrderItemsTable";
import UpdateStatusForm from "../components/orderdetail/UpdateStatusForm";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      const { data } = await fetchOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Order load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [id]);

  const handleOrderUpdate = async (orderId, updateData) => {
    try {
      await updateOrderStatusApi(orderId, updateData);
      await loadOrderData();
    } catch  {
      alert("Failed to update order");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  if (!order) return <div className="p-10 text-center text-gray-500">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      
      <div className="max-w-6xl mx-auto"> 
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <button 
              onClick={() => navigate('/pre-orders')} 
              className="text-gray-500 flex items-center gap-2 text-sm font-bold hover:text-blue-600 mb-3 transition-colors"
            >
              <ArrowLeft size={16}/> Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Created on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              <div className="border-b border-gray-100 p-6 bg-white">
                <StatusStepper currentStatus={order.orderStatus} />
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  {/* Customer Card */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Customer</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-gray-800">{order.name}</span>
                      </div>
                      <div className="flex items-center gap-3 pl-1">
                        <Phone size={14} className="text-gray-400" /> 
                        <span className="text-sm text-gray-600">{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 pl-1">
                        <Mail size={14} className="text-gray-400" /> 
                        <span className="text-sm text-gray-600">{order.email || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Card */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Pickup Schedule</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <Calendar size={16} className="text-gray-500" /> 
                         <span className="text-sm font-medium">{new Date(order.pickupDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Clock size={16} className="text-gray-500" /> 
                         <span className="text-sm font-medium">{order.pickupTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs uppercase text-gray-500 tracking-wider">
                    Order Items
                  </div>
                  <div className="flex-1 overflow-auto max-h-[300px]">
                    <OrderItemsTable items={order.items} />
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                     <span className="font-bold text-gray-600 text-sm">Total Amount</span>
                     <span className="text-xl font-bold text-gray-900">₹{order.totalAmount}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SECTION*/}
          <div className="lg:col-span-1">
            <UpdateStatusForm order={order} onUpdate={handleOrderUpdate} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;