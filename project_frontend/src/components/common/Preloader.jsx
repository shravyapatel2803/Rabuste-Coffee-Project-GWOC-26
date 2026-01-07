import React from 'react';
import Lottie from 'lottie-react';
import coffeeAnimation from '../../assets/coffee-loader.json'; // Adjust path if needed

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rabuste-bg">
      <div className="w-64 h-64 md:w-80 md:h-80">
        <Lottie 
          animationData={coffeeAnimation} 
          loop={true} 
          autoplay={true} 
        />
        {/* Optional Text */}
        <p className="text-center text-rabuste-text font-bold tracking-widest mt-4 animate-pulse">
          BREWING...
        </p>
      </div>
    </div>
  );
};

export default Preloader;