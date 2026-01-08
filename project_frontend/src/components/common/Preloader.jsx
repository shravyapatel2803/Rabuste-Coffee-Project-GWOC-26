import React from 'react';
import Lottie from 'lottie-react';
import coffeeAnimation from '../../assets/coffee-loader.json'; 

const Preloader = ({ inline = false }) => {

  const containerClasses = inline 
    ? "flex flex-col items-center justify-center w-full py-10 bg-transparent" 
    : "fixed inset-0 z-50 flex flex-col items-center justify-center bg-rabuste-bg";

  const sizeClasses = inline 
    ? "w-32 h-32 md:w-40 md:h-40" 
    : "w-64 h-64 md:w-80 md:h-80"; 

  return (
    <div className={containerClasses}>
      <div className={sizeClasses}>
        <Lottie 
          animationData={coffeeAnimation} 
          loop={true} 
          autoplay={true} 
        />
      </div>
      <p className="text-center text-rabuste-text font-bold tracking-widest mt-2 animate-pulse text-xs md:text-sm">
        BREWING...
      </p>
    </div>
  );
};

export default Preloader;