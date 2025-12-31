import React from "react";
import { Check, XCircle } from "lucide-react";

const steps = ["Placed", "Confirmed", "Preparing", "Ready", "Completed"];

const StatusStepper = ({ currentStatus }) => {
  const currentIndex = steps.findIndex(
    (step) => step.toLowerCase() === (currentStatus || "").toLowerCase()
  );

  if (currentStatus?.toLowerCase() === "cancelled") {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full border border-red-200 font-bold text-sm">
        <XCircle size={18} />
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;

        return (
          <div key={step} className="flex items-center">
            {/* Step Pill */}
            <div 
              className={`
                px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 transition-colors duration-300
                ${isActive 
                  ? "bg-green-600 text-white border-green-600 shadow-sm" 
                  : "bg-white text-gray-400 border-gray-200"} // Inactive Style
              `}
            >
              {isActive && <Check size={12} strokeWidth={4} />}
              {step}
            </div>

            {index < steps.length - 1 && (
              <div 
                className={`w-4 h-0.5 mx-1 transition-colors duration-300 ${
                  isActive ? "bg-green-600" : "bg-gray-200"
                }`} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;