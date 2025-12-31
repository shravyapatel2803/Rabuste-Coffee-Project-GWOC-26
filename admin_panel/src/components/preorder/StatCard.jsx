import React from "react";

const StatCard = ({ icon: Icon, label, value, colorClass }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">
      
      <div className={`absolute -right-4 -top-4 opacity-10 ${colorClass.replace('bg-', 'text-')} transform rotate-12`}>
        <Icon size={80} />
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">{value}</h2>
        
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</p>
      </div>

      <div className={`mt-4 w-10 h-10 rounded-full flex items-center justify-center ${colorClass} text-white shadow-sm self-start`}>
         <Icon size={20} />
      </div>

    </div>
  );
};

export default StatCard;